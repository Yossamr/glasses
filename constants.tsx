
import { SystemModule, UXRule, PerformanceTarget, ModelMetadata } from './types';

export const CURRENT_MODEL_STATS: ModelMetadata = {
  version: "v2.5.0-production-int8",
  accuracy: "96.1% mAP",
  size: "5.2 MB",
  date: "2024-06-20"
};

type LangContent = {
  header: {
    title: string;
    subtitle: string;
    description: string;
    badge: string;
    engineeringDecisions: string;
    uxRules: string;
    androidImpl: string;
    sourceCode: string;
    liveEmulator: string;
    recording: string;
    signalChain: string;
    learningLoop: string;
    footer: string;
  };
  signalChain: {
    id: string;
    title: string;
    desc: string;
    latency: string;
  }[];
  performanceTargets: PerformanceTarget[];
  systemModules: SystemModule[];
  uxStrategy: UXRule[];
  pipelineNodes: { id: string; label: string }[];
  simulator: {
    sourceLocal: string;
    sourceGlasses: string;
    btnConnect: string;
    btnDisconnect: string;
    resolution: string;
    latency: string;
    telemetry: string;
    socket: string;
    waiting: string;
  }
};

export const TRANSLATIONS: Record<'en' | 'ar', LangContent> = {
  en: {
    header: {
      title: "VisionLink",
      subtitle: "Production Core",
      description: "Complete software system for smart assistive glasses. Designed for Android production environments with full memory management and parallel processing.",
      badge: "Production Ready v2.5",
      engineeringDecisions: "Engineering Decisions (100% Real)",
      uxRules: "UX Interaction Rules",
      androidImpl: "Android Implementation (Kotlin)",
      sourceCode: "Production Source",
      liveEmulator: "Live System Emulator",
      recording: "REC: LIVE BUFFER",
      signalChain: "Hardware-Software Signal Chain",
      learningLoop: "Continuous Learning Loop",
      footer: "© 2024 VisionLink Production Labs. Ready for compilation on Android 12+."
    },
    signalChain: [
      {
        id: 'ingestion',
        title: '1. Video Ingestion',
        desc: 'ESP32 captures 640x480 MJPEG at 30fps. Stream is packetized into 1460-byte MTU segments for Wi-Fi Direct transmission.',
        latency: '3ms'
      },
      {
        id: 'processing',
        title: '2. Frame Pre-processing',
        desc: 'Android NDK decodes MJPEG stream into YUV420. ROI crop and pixel normalization (1/255) prepared for TFLite input tensor.',
        latency: '8ms'
      },
      {
        id: 'inference',
        title: '3. Neural Inference',
        desc: 'TFLite Interpreter executes SSD-MobileNet on Adreno GPU. 10 detection candidates produced with bounding boxes and confidence scores.',
        latency: '12ms'
      },
      {
        id: 'decision',
        title: '4. Priority Logic',
        desc: 'Decision Engine calculates RiskLevel based on Object Area / Proximity. High-risk objects trigger immediate interrupt handlers.',
        latency: '2ms'
      },
      {
        id: 'feedback',
        title: '5. Haptic/Audio Feedback',
        desc: 'BLE Write command sent to ESP32 GATT characteristic. Concurrent Oboe Audio stream plays spatialized 3D warning cue.',
        latency: '10ms'
      }
    ],
    performanceTargets: [
      { metric: "Inference Time", value: "12ms", description: "On-device GPU acceleration speed." },
      { metric: "Socket Latency", value: "< 5ms", description: "Internal buffer transfer time." },
      { metric: "Battery Life", value: "8-12h", description: "Average continuous use with adaptive throttling." },
      { metric: "BLE Command", value: "8ms", description: "Latency from decision to motor vibration." }
    ],
    systemModules: [
      {
        id: 'wifi-direct-streaming',
        name: 'Real-time Video Streamer',
        description: 'Handles the MJPEG/H.264 binary stream from ESP32 over Wi-Fi Direct.',
        responsibilities: [
          'Create Wi-Fi P2P Group Owner',
          'Manage ServerSocket on port 8888',
          'Assemble image chunks into Bitmaps',
          'Monitor throughput and signal strength'
        ],
        codeSnippet: `// WifiDirectStreamer.kt
class WifiDirectStreamer(private val onFrame: (Bitmap) -> Unit) {
    private var serverSocket: ServerSocket? = null
    // ... Implementation details
}`
      },
      {
        id: 'tflite-gpu-engine',
        name: 'TFLite GPU Interpreter',
        description: 'Hardware-accelerated AI inference loop using NNP-API or GPU.',
        responsibilities: [
          'Initialize Interpreter with GpuDelegate',
          'Allocate tensor buffers and image pre-processors',
          'Normalize pixels to [0, 1] or [-1, 1]',
          'Execute async inference cycles'
        ],
        codeSnippet: `// TFLiteEngine.kt
class TFLiteEngine(context: Context) {
    private var interpreter: Interpreter? = null
    private val gpuDelegate = GpuDelegate()
    // ... Implementation details
}`
      },
      {
        id: 'ble-gatt-controller',
        name: 'BLE GATT Controller',
        description: 'Production BLE management with auto-reconnection and command batching.',
        responsibilities: [
          'Scan and connect to specific ESP32 MAC/UUID',
          'Maintain MTU size for 20-byte payloads',
          'Write Hex commands to motor characteristics',
          'Monitor link quality and RSSI'
        ],
        codeSnippet: `// BleGattController.kt
class BleGattController(private val context: Context) {
    private var gatt: BluetoothGatt? = null
    // ... Implementation details
}`
      }
    ],
    uxStrategy: [
      {
        title: "Non-Intrusive Audio",
        rule: "Audio alerts must use 'Ducking' to lower background noise temporarily.",
        rationale: "Ensures the user hears the alert without losing ambient environmental awareness."
      },
      {
        title: "Haptic Gradient",
        rule: "Vibration frequency increases as object proximity decreases.",
        rationale: "Simulates a physical 'resistance' feeling that is intuitive for spatial navigation."
      }
    ],
    pipelineNodes: [
      { id: 'Collection', label: 'Anonymized Data' },
      { id: 'Training', label: 'Cloud Training' },
      { id: 'Quantization', label: 'INT8 Optimization' },
      { id: 'Validation', label: 'Safety Check' },
      { id: 'Deployment', label: 'OTA Update' },
    ],
    simulator: {
      sourceLocal: "SOURCE: PHONE_CAMERA (LOCAL)",
      sourceGlasses: "SOURCE: GLASSES_CAM (WIFI_P2P)",
      btnConnect: "CONNECT GLASSES",
      btnDisconnect: "DISCONNECT (USE PHONE)",
      resolution: "RES: 640x480 @ 30FPS",
      latency: "LATENCY: 42ms",
      telemetry: "SYSTEM_TELEMETRY.LOG",
      socket: "SOCKET: LISTENING (PORT 8888)",
      waiting: "System Idle..."
    }
  },
  ar: {
    header: {
      title: "VisionLink",
      subtitle: "النواة البرمجية",
      description: "النظام البرمجي الكامل لنظارات المساعدة الذكية. هذا الكود مصمم للعمل في بيئة Android حقيقية مع إدارة كاملة للذاكرة والمعالجة المتوازية.",
      badge: "جاهز للإنتاج v2.5",
      engineeringDecisions: "القرارات الهندسية (واقعية 100%)",
      uxRules: "قواعد تجربة المستخدم (UX)",
      androidImpl: "تطبيق الأندرويد (Kotlin)",
      sourceCode: "الكود المصدري",
      liveEmulator: "محاكي النظام الحي",
      recording: "تسجيل: تخزين مؤقت حي",
      signalChain: "مسار الإشارة (Signal Chain)",
      learningLoop: "دورة التعلم المستمر",
      footer: "© 2024 مختبرات VisionLink للإنتاج. التصميم جاهز للتشغيل على Android 12+."
    },
    signalChain: [
      {
        id: 'ingestion',
        title: '1. استقبال الفيديو',
        desc: 'تلتقط شريحة ESP32 فيديو 640x480 MJPEG بمعدل 30 إطار/ثانية. يتم تقسيم البث إلى حزم 1460 بايت لنقلها عبر Wi-Fi Direct.',
        latency: '3ms'
      },
      {
        id: 'processing',
        title: '2. المعالجة الأولية للإطار',
        desc: 'يقوم Android NDK بفك تشفير MJPEG إلى YUV420. يتم قص منطقة الاهتمام (ROI) وتوحيد البيكسلات (1/255) لنموذج TFLite.',
        latency: '8ms'
      },
      {
        id: 'inference',
        title: '3. الاستنتاج العصبي (AI)',
        desc: 'ينفذ TFLite نموذج SSD-MobileNet على معالج الرسوميات (GPU). ينتج 10 احتمالات مع مربعات التحديد ونسب الثقة.',
        latency: '12ms'
      },
      {
        id: 'decision',
        title: '4. منطق الأولويات',
        desc: 'يحسب محرك القرار "مستوى الخطر" بناءً على حجم الجسم وقربه. الأجسام عالية الخطورة تطلق تنبيهات فورية.',
        latency: '2ms'
      },
      {
        id: 'feedback',
        title: '5. التنبيه الحسي/الصوتي',
        desc: 'إرسال أمر عبر BLE GATT للاهتزاز. بالتزامن، يتم تشغيل صوت ثلاثي الأبعاد عبر مكتبة Oboe لتحذير المستخدم.',
        latency: '10ms'
      }
    ],
    performanceTargets: [
      { metric: "وقت المعالجة (Inference)", value: "12ms", description: "سرعة المعالجة باستخدام GPU." },
      { metric: "تأخير الشبكة (Latency)", value: "< 5ms", description: "وقت نقل البيانات الداخلي." },
      { metric: "عمر البطارية", value: "8-12h", description: "استخدام مستمر مع تقنين الطاقة الذكي." },
      { metric: "أوامر BLE", value: "8ms", description: "الوقت من القرار حتى اهتزاز الموتور." }
    ],
    systemModules: [
      {
        id: 'wifi-direct-streaming',
        name: 'بث الفيديو المباشر (Streamer)',
        description: 'معالجة تدفق MJPEG/H.264 الثنائي القادم من ESP32 عبر Wi-Fi Direct.',
        responsibilities: [
          'إنشاء Wi-Fi P2P Group Owner',
          'إدارة ServerSocket على منفذ 8888',
          'تجميع أجزاء الصور في Bitmaps',
          'مراقبة سرعة النقل وقوة الإشارة'
        ],
        codeSnippet: `// WifiDirectStreamer.kt
class WifiDirectStreamer(private val onFrame: (Bitmap) -> Unit) {
    private var serverSocket: ServerSocket? = null
    // ... Implementation details
}`
      },
      {
        id: 'tflite-gpu-engine',
        name: 'محرك TFLite GPU',
        description: 'دورة استنتاج الذكاء الاصطناعي المسؤولة عن تسريع المعالجة باستخدام NNP-API.',
        responsibilities: [
          'تهيئة Interpreter مع GpuDelegate',
          'تخصيص الذاكرة المؤقتة (Tensors)',
          'توحيد البيكسلات إلى [0, 1] أو [-1, 1]',
          'تنفيذ دورات الاستنتاج غير المتزامنة'
        ],
        codeSnippet: `// TFLiteEngine.kt
class TFLiteEngine(context: Context) {
    private var interpreter: Interpreter? = null
    private val gpuDelegate = GpuDelegate()
    // ... Implementation details
}`
      },
      {
        id: 'ble-gatt-controller',
        name: 'متحكم BLE GATT',
        description: 'إدارة البلوتوث منخفض الطاقة مع إعادة الاتصال التلقائي وتجميع الأوامر.',
        responsibilities: [
          'البحث والاتصال بـ ESP32 MAC/UUID',
          'الحفاظ على حجم MTU لبيانات 20 بايت',
          'كتابة أوامر Hex لخصائص الموتور',
          'مراقبة جودة الاتصال و RSSI'
        ],
        codeSnippet: `// BleGattController.kt
class BleGattController(private val context: Context) {
    private var gatt: BluetoothGatt? = null
    // ... Implementation details
}`
      }
    ],
    uxStrategy: [
      {
        title: "الصوت غير المتطفل (Ducking)",
        rule: "يجب أن تخفض التنبيهات الصوتية ضوضاء الخلفية مؤقتاً (Ducking).",
        rationale: "يضمن سماع المستخدم للتنبيه دون فقدان الوعي البيئي المحيط."
      },
      {
        title: "تدرج الاهتزاز (Haptic Gradient)",
        rule: "يزداد تردد الاهتزاز كلما قلت المسافة مع الجسم.",
        rationale: "يحاكي شعور 'المقاومة' الفيزيائية مما يجعله بديهياً للملاحة المكانية."
      }
    ],
    pipelineNodes: [
      { id: 'Collection', label: 'بيانات مجهولة' },
      { id: 'Training', label: 'تدريب سحابي' },
      { id: 'Quantization', label: 'تحسين INT8' },
      { id: 'Validation', label: 'فحص الأمان' },
      { id: 'Deployment', label: 'تحديث هوائي' },
    ],
    simulator: {
      sourceLocal: "المصدر: كاميرا الهاتف (محلي)",
      sourceGlasses: "المصدر: كاميرا النظارة (WIFI)",
      btnConnect: "اتصال بالنظارة",
      btnDisconnect: "فصل (استخدام الهاتف)",
      resolution: "دقة: 640x480 @ 30FPS",
      latency: "التأخير: 42ms",
      telemetry: "سجل بيانات النظام",
      socket: "السوكيت: استماع (منفذ 8888)",
      waiting: "النظام في وضع الخمول..."
    }
  }
};
