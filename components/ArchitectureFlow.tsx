
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface Step {
    id: string;
    title: string;
    desc: string;
    latency: string;
}

interface ArchitectureFlowProps {
    steps: Step[];
    lang: 'en' | 'ar';
}

const ArchitectureFlow: React.FC<ArchitectureFlowProps> = ({ steps, lang }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [activeStep, setActiveStep] = useState<string | null>(null);

  // Helper to get label from current step data
  const getLabel = (id: string) => {
      const step = steps.find(s => s.id === id);
      return step ? step.title.split(' ').slice(1).join(' ').substring(0, 10) + '...' : id;
  }

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 400;

    // Define nodes with basic positions
    const nodes = [
      { id: 'ingestion', label: lang === 'en' ? 'Glasses Cam' : 'كاميرا', x: 80, y: height / 2, color: '#38bdf8' },
      { id: 'processing', label: lang === 'en' ? 'Decode/Crop' : 'معالجة', x: 240, y: height / 2, color: '#6366f1' },
      { id: 'inference', label: lang === 'en' ? 'GPU AI' : 'ذكاء اصطناعي', x: 400, y: height / 2, color: '#a855f7' },
      { id: 'decision', label: lang === 'en' ? 'Logic Eng' : 'منطق', x: 560, y: height / 2, color: '#f43f5e' },
      { id: 'feedback', label: lang === 'en' ? 'Haptic/TTS' : 'تنبيه', x: 720, y: height / 2, color: '#10b981' }
    ];

    // Flip X coordinates if Arabic for RTL flow
    if (lang === 'ar') {
        nodes.forEach(n => {
            n.x = width - n.x;
        });
    }

    const links = [
      { source: 'ingestion', target: 'processing', color: '#38bdf8' },
      { source: 'processing', target: 'inference', color: '#6366f1' },
      { source: 'inference', target: 'decision', color: '#a855f7' },
      { source: 'decision', target: 'feedback', color: '#f43f5e' }
    ];

    // Background Grid
    svg.append("defs").append("pattern")
      .attr("id", "grid")
      .attr("width", 20)
      .attr("height", 20)
      .attr("patternUnits", "userSpaceOnUse")
      .append("circle")
      .attr("cx", 1)
      .attr("cy", 1)
      .attr("r", 1)
      .attr("fill", "#1e293b");

    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "url(#grid)");

    // Define Arrowhead
    svg.append("defs").append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", lang === 'ar' ? -22 : 32) // Adjust for RTL
      .attr("refY", 0)
      .attr("orient", lang === 'ar' ? "auto-start-reverse" : "auto")
      .attr("markerWidth", 4)
      .attr("markerHeight", 4)
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#475569");

    // Draw Links
    svg.selectAll(".link")
      .data(links)
      .enter()
      .append("line")
      .attr("x1", d => nodes.find(n => n.id === d.source)!.x)
      .attr("y1", d => nodes.find(n => n.id === d.source)!.y)
      .attr("x2", d => nodes.find(n => n.id === d.target)!.x)
      .attr("y2", d => nodes.find(n => n.id === d.target)!.y)
      .attr("stroke", d => d.color)
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "4,4")
      .attr("marker-end", "url(#arrow)");

    // Animated Pulses
    const pulse = () => {
        svg.selectAll(".pulse-circle").remove();
        svg.selectAll(".pulse-path")
           .data(links)
           .enter()
           .append("circle")
           .attr("class", "pulse-circle")
           .attr("r", 4)
           .attr("fill", d => d.color)
           .attr("cx", d => nodes.find(n => n.id === d.source)!.x)
           .attr("cy", d => nodes.find(n => n.id === d.source)!.y)
           .transition()
           .duration(2000)
           .ease(d3.easeLinear)
           .attr("cx", d => nodes.find(n => n.id === d.target)!.x)
           .attr("cy", d => nodes.find(n => n.id === d.target)!.y)
           .style("opacity", 0)
           .on("end", pulse);
    };
    pulse();

    // Draw Nodes
    const nodeGroup = svg.selectAll(".node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.x},${d.y})`)
      .style("cursor", "pointer")
      .on("mouseover", function(_, d) {
        d3.select(this).select("rect").attr("stroke-width", 4).attr("stroke", d.color);
        setActiveStep(d.id);
      })
      .on("mouseout", function(_, d) {
        d3.select(this).select("rect").attr("stroke-width", 1).attr("stroke", "#334155");
      });

    nodeGroup.append("rect")
      .attr("x", -45)
      .attr("y", -25)
      .attr("width", 90)
      .attr("height", 50)
      .attr("rx", 6)
      .attr("fill", "#0f172a")
      .attr("stroke", "#334155")
      .attr("stroke-width", 1);

    nodeGroup.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .attr("fill", "#f8fafc")
      .style("font-size", "10px")
      .style("font-weight", "700")
      .text(d => d.label);

    nodeGroup.append("circle")
        .attr("r", 3)
        .attr("cy", 35)
        .attr("fill", d => d.color);

  }, [steps, lang]); // Re-render when language changes

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
      <div className="lg:col-span-2 relative">
        <h3 className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
            Real-time Pipeline Visualization
        </h3>
        <svg ref={svgRef} viewBox="0 0 800 400" className="w-full h-auto bg-slate-950/50 rounded-xl border border-slate-800/50 shadow-inner"></svg>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Signal Path Explorer</h3>
        <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
            {steps.map((step) => (
                <div 
                    key={step.id}
                    className={`p-4 rounded-xl border transition-all duration-300 ${activeStep === step.id ? 'bg-slate-800 border-blue-500 scale-[1.02]' : 'bg-slate-950/40 border-slate-800'}`}
                >
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-blue-400 uppercase">{step.title}</span>
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">LAT: {step.latency}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        {step.desc}
                    </p>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ArchitectureFlow;
