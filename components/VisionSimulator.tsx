
import React, { useEffect, useState, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

const LOG_TYPES = {
  WIFI: { color: 'text-blue-400', label: 'WIFI_P2P' },
  CAM: { color: 'text-yellow-400', label: 'CAM2_API' },
  AI: { color: 'text-purple-400', label: 'TFLITE_INF' },
  BLE: { color: 'text-emerald-400', label: 'BLE_GATT' },
  SYS: { color: 'text-slate-400', label: 'SYS_CORE' }
};

interface LogEntry {
  id: number;
  type: keyof typeof LOG_TYPES;
  msg: string;
  time: string;
}

interface VisionSimulatorProps {
    content: {
        sourceLocal: string;
        sourceGlasses: string;
        btnConnect: string;
        btnDisconnect: string;
        resolution: string;
        latency: string;
        telemetry: string;
        socket: string;
        waiting: string;
    };
    lang: 'en' | 'ar';
}

const VisionSimulator: React.FC<VisionSimulatorProps> = ({ content, lang }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [sourceMode, setSourceMode] = useState<'PHONE' | 'GLASSES'>('PHONE');
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);
  const [isLoadingModel, setIsLoadingModel] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isRunningRef = useRef<boolean>(false);
  
  // Real AI State
  const [detectedObject, setDetectedObject] = useState<{name: string, score: string, x: number, y: number, w: number, h: number} | null>(null);

  // Helper to add logs
  const addLog = (type: keyof typeof LOG_TYPES, msg: string) => {
    const now = new Date().toISOString().split('T')[1].slice(0, 8);
    setLogs(prev => [{ id: Date.now(), type, msg, time: now }, ...prev].slice(0, 15));
  };

  // 1. Load TensorFlow Model & Initialize Backend
  useEffect(() => {
    let isMounted = true;
    const loadModel = async () => {
      try {
        if(!isMounted) return;
        addLog('SYS', 'Init: Config TFLite Backend...');
        
        // Use production mode to suppress warnings and slightly improve perf
        tf.enableProdMode();
        
        try {
            // Force WebGL backend for GPU acceleration
            await tf.setBackend('webgl');
            await tf.ready();
            if(isMounted) addLog('SYS', `Backend Active: ${tf.getBackend().toUpperCase()} (GPU)`);
        } catch (e) {
            console.warn("WebGL failed, falling back", e);
            if(isMounted) addLog('SYS', 'WARN: GPU Init Failed. Using CPU.');
        }

        if(!isMounted) return;
        addLog('SYS', 'Loading Model (SSD-MobileNet)...');
        const loadedModel = await cocoSsd.load({ base: 'lite_mobilenet_v2' });
        
        if(isMounted) {
            setModel(loadedModel);
            setIsLoadingModel(false);
            addLog('AI', 'Model Ready: Object Detection Online');
        }
      } catch (err) {
        console.error("Failed to load model", err);
        if(isMounted) {
            addLog('SYS', 'ERR: Model Load Failed');
            setIsLoadingModel(false);
        }
      }
    };
    loadModel();
    return () => { isMounted = false; };
  }, []);

  // 2. Handle Real Camera Access & Detection Loop
  useEffect(() => {
    let stream: MediaStream | null = null;
    let timeoutId: any;

    const startCamera = async () => {
      try {
        if (videoRef.current && videoRef.current.srcObject) {
           const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
           tracks.forEach(track => track.stop());
        }

        // Request specifically 640x480 to match the model and reduce memory pressure
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                width: { ideal: 640 }, 
                height: { ideal: 480 },
                facingMode: "environment"
            } 
        });
        
        if (videoRef.current && isRunningRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
             if (videoRef.current && isRunningRef.current) {
                 videoRef.current.play().catch(e => console.error("Play error:", e));
                 addLog('CAM', `BufferQueueProducer: Surface Connected`);
                 detectFrame();
             }
          };
        }
      } catch (err) {
        console.error("Camera access denied or missing", err);
        addLog('SYS', 'ERR: Local Camera Access Denied.');
      }
    };

    const detectFrame = async () => {
        if (!isRunningRef.current) return;

        const video = videoRef.current;
        
        try {
            if (video && video.readyState === 4 && model && sourceMode === 'PHONE') {
                // Ensure the video has dimensions to avoid TensorFlow errors
                if (video.videoWidth > 0 && video.videoHeight > 0) {
                     // Limit to top 3 objects, min confidence 50%
                    const predictions = await model.detect(video, 3, 0.5);
                    
                    if (predictions.length > 0) {
                        const best = predictions[0];
                        const videoWidth = video.videoWidth;
                        const videoHeight = video.videoHeight;
                        
                        setDetectedObject({
                            name: best.class,
                            score: Math.round(best.score * 100) + '%',
                            x: (best.bbox[0] / videoWidth) * 100,
                            y: (best.bbox[1] / videoHeight) * 100,
                            w: (best.bbox[2] / videoWidth) * 100,
                            h: (best.bbox[3] / videoHeight) * 100
                        });

                        if (Math.random() > 0.8) {
                            addLog('AI', `INF: ${best.class.toUpperCase()} (${Math.round(best.score * 100)}%)`);
                        }
                    } else {
                         setDetectedObject(null);
                    }
                }
            }
        } catch (e) {
            console.warn("Detection error (Skipping Frame):", e);
            // Don't crash the app, just log and continue
        } finally {
            // CRITICAL FIX: Schedule next frame regardless of success or failure
            // This ensures the loop never "stops" or freezes permanently
            if (isRunningRef.current) {
                timeoutId = setTimeout(() => {
                     requestAnimationFrame(detectFrame);
                }, 1000); 
            }
        }
    };

    if (sourceMode === 'PHONE') {
        isRunningRef.current = true;
        startCamera();
    } else {
        isRunningRef.current = false;
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setDetectedObject(null);
    }

    return () => {
        isRunningRef.current = false;
        clearTimeout(timeoutId);
        if (stream) stream.getTracks().forEach(track => track.stop());
        if (videoRef.current) videoRef.current.srcObject = null;
    };
  }, [sourceMode, model]);


  // 3. System Loop (Telemetry Heartbeat)
  useEffect(() => {
    const interval = setInterval(() => {
      const rand = Math.random();
      
      if (sourceMode === 'GLASSES') {
          if (rand > 0.7) {
            const size = Math.floor(Math.random() * (45 - 30) + 30);
            addLog('WIFI', `RX_FRAME: Seq=${Math.floor(Math.random()*999)} Len=${size}KB`);
          }
      } else {
          if (rand > 0.95) {
             addLog('SYS', `Thermal: ${34 + Math.floor(Math.random() * 3)}°C | Freq: 1.8GHz`);
          }
      }

      if (detectedObject && rand < 0.1) {
        const motor = detectedObject.x < 50 ? 'L_VIB' : 'R_VIB';
        const hex = Math.floor(Math.random() * 255).toString(16).toUpperCase().padStart(2, '0');
        addLog('BLE', `TX_CHAR: ${motor} >> 0x${hex}`);
      }

    }, 1500); 

    return () => clearInterval(interval);
  }, [sourceMode, detectedObject]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-1 bg-slate-900/50 rounded-3xl border border-slate-800">
      
      {/* Left: The "Eye" */}
      <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-slate-700 shadow-2xl group">
        
        {/* Loading State */}
        {isLoadingModel && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-sm">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <div className="text-emerald-400 font-mono text-xs animate-pulse">INITIALIZING GPU...</div>
            </div>
        )}

        {/* A. Real Video Layer */}
        {sourceMode === 'PHONE' && (
            <video 
                ref={videoRef} 
                playsInline 
                muted
                width="640"
                height="480"
                className="absolute inset-0 w-full h-full object-cover opacity-90"
            />
        )}

        {/* B. Simulated Glasses Stream Layer */}
        {sourceMode === 'GLASSES' && (
            <div className="absolute inset-0" 
                style={{ 
                backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', 
                backgroundSize: '40px 40px',
                animation: 'moveGrid 20s linear infinite'
                }}>
            </div>
        )}
        <style>{`
          @keyframes moveGrid { from { transform: translateY(0); } to { transform: translateY(40px); } }
          @keyframes scanline { 0% { top: 0%; opacity: 0; } 50% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
        `}</style>
        
        <div className="absolute inset-0 bg-noise opacity-[0.05] pointer-events-none"></div>
        <div className="absolute w-full h-[2px] bg-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.5)] z-10"
             style={{ animation: 'scanline 3s linear infinite' }}></div>
        
        {/* HUD Overlay */}
        <div className={`absolute top-4 ${lang === 'ar' ? 'right-4 text-right' : 'left-4 text-left'} flex flex-col gap-1 z-20`}>
            <div className={`flex items-center gap-2 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-2 h-2 rounded-full animate-pulse ${sourceMode === 'PHONE' ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
                <span className={`text-xs font-mono font-bold ${sourceMode === 'PHONE' ? 'text-yellow-500' : 'text-blue-500'}`}>
                    {sourceMode === 'PHONE' ? content.sourceLocal : content.sourceGlasses}
                </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-black/50 px-1 rounded">{content.resolution}</span>
            <span className="text-[10px] font-mono text-slate-400 bg-black/50 px-1 rounded">{content.latency}</span>
        </div>

        {/* AI Bounding Boxes (Real Data) */}
        {detectedObject && sourceMode === 'PHONE' && (
            <div 
                className="absolute border-2 border-emerald-400/90 transition-all duration-300 ease-in-out z-10"
                style={{
                    left: `${detectedObject.x}%`,
                    top: `${detectedObject.y}%`,
                    width: `${detectedObject.w}%`,
                    height: `${detectedObject.h}%`,
                    boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)'
                }}
            >
                {/* Tech Corners */}
                <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-emerald-400"></div>
                <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-emerald-400"></div>
                <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-emerald-400"></div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-emerald-400"></div>

                <div className="bg-emerald-500 text-black text-[10px] font-bold px-1.5 py-0.5 uppercase absolute -top-5 left-0">
                    {detectedObject.name} {detectedObject.score}
                </div>
            </div>
        )}

        {/* Center Crosshair */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 opacity-40 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-white"></div>
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-[1px] bg-white"></div>
        </div>
      </div>

      {/* Right: The "Brain" (Telemetry) */}
      <div className="flex flex-col bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden h-full min-h-[350px]">
        <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex justify-between items-center">
            <span className="text-xs font-mono font-bold text-slate-400">{content.telemetry}</span>
            
            <button 
                onClick={() => {
                    const newMode = sourceMode === 'PHONE' ? 'GLASSES' : 'PHONE';
                    setSourceMode(newMode);
                    addLog('SYS', newMode === 'GLASSES' ? 'Init Wi-Fi P2P Discovery...' : 'Terminating P2P. Switching to Camera2...');
                }}
                className={`text-[10px] px-3 py-1.5 rounded-md font-bold transition-all border flex items-center gap-2 ${
                    sourceMode === 'GLASSES' 
                    ? 'bg-blue-600/20 text-blue-400 border-blue-500/50 hover:bg-blue-600/30' 
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                }`}
            >
                <div className={`w-1.5 h-1.5 rounded-full ${sourceMode === 'GLASSES' ? 'bg-blue-400 animate-pulse' : 'bg-slate-500'}`}></div>
                {sourceMode === 'PHONE' ? content.btnConnect : content.btnDisconnect}
            </button>
        </div>
        
        <div className="flex-1 p-4 font-mono text-[11px] overflow-y-auto custom-scrollbar flex flex-col-reverse ltr bg-slate-950" dir="ltr" ref={scrollRef}>
            {logs.map((log) => (
                <div key={log.id} className="mb-1 border-l-2 border-slate-800 pl-2 hover:bg-white/5 transition-colors py-0.5">
                    <span className="text-slate-600 mr-2 opacity-50">{log.time}</span>
                    <span className={`font-bold ${LOG_TYPES[log.type].color} w-20 inline-block`}>
                        {LOG_TYPES[log.type].label}
                    </span>
                    <span className="text-slate-300">{log.msg}</span>
                </div>
            ))}
            {logs.length === 0 && <div className="text-slate-600 italic">{content.waiting}</div>}
        </div>

        <div className="bg-slate-900 border-t border-slate-800 px-3 py-2 flex justify-between text-[10px] font-mono text-slate-500" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <span className={sourceMode === 'GLASSES' ? 'text-blue-400' : 'text-yellow-500'}>
                {sourceMode === 'GLASSES' ? 'WIFI: P2P_GROUP_OWNER_ACTIVE' : 'CAM: ACTIVE_HARDWARE_BUFFER'}
            </span>
            <span dir="ltr">CPU: 12% | MEM: {isLoadingModel ? 'INIT' : '82MB'}</span>
        </div>
      </div>
    </div>
  );
};

export default VisionSimulator;