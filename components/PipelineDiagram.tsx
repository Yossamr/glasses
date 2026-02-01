
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface PipelineDiagramProps {
    nodes: { id: string; label: string }[];
    lang: 'en' | 'ar';
}

const PipelineDiagram: React.FC<PipelineDiagramProps> = ({ nodes: dataNodes, lang }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    
    const width = 800;

    // Base positions (LTR)
    let nodes = [
      { id: 'Collection', label: dataNodes[0].label, x: 80, y: 150 },
      { id: 'Training', label: dataNodes[1].label, x: 280, y: 150 },
      { id: 'Quantization', label: dataNodes[2].label, x: 480, y: 150 },
      { id: 'Validation', label: dataNodes[3].label, x: 680, y: 150 },
      { id: 'Deployment', label: dataNodes[4].label, x: 480, y: 280 },
    ];

    // Mirror X for RTL
    if (lang === 'ar') {
        nodes = nodes.map(n => ({
            ...n,
            x: width - n.x
        }));
    }

    const links = [
      { source: 'Collection', target: 'Training', color: '#6366f1' },
      { source: 'Training', target: 'Quantization', color: '#6366f1' },
      { source: 'Quantization', target: 'Validation', color: '#6366f1' },
      { source: 'Validation', target: 'Deployment', color: '#10b981' },
      { source: 'Deployment', target: 'Collection', color: '#334155', dash: '4,4' }
    ];

    // Markers
    svg.append("defs").append("marker")
      .attr("id", "arrowhead-p")
      .attr("viewBox", "-0 -5 10 10")
      .attr("refX", lang === 'ar' ? -32 : 32)
      .attr("refY", 0)
      .attr("orient", lang === 'ar' ? "auto-start-reverse" : "auto")
      .attr("markerWidth", 5)
      .attr("markerHeight", 5)
      .append("path")
      .attr("d", "M 0,-5 L 10 ,0 L 0,5")
      .attr("fill", "#64748b");

    // Draw Links
    svg.selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("x1", d => nodes.find(n => n.id === d.source)!.x)
      .attr("y1", d => nodes.find(n => n.id === d.source)!.y)
      .attr("x2", d => nodes.find(n => n.id === d.target)!.x)
      .attr("y2", d => nodes.find(n => n.id === d.target)!.y)
      .attr("stroke", d => d.color)
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", d => d.dash || "0")
      .attr("marker-end", "url(#arrowhead-p)");

    // Draw Nodes
    const g = svg.selectAll("g.node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("transform", d => `translate(${d.x},${d.y})`);

    g.append("rect")
      .attr("x", -60)
      .attr("y", -25)
      .attr("width", 120)
      .attr("height", 50)
      .attr("rx", 8)
      .attr("fill", "#0f172a")
      .attr("stroke", "#334155")
      .attr("stroke-width", 1);

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .attr("fill", "#f8fafc")
      .style("font-size", "10px")
      .style("font-weight", "600")
      .text(d => d.label);

  }, [dataNodes, lang]);

  return (
    <div className="w-full bg-slate-900/40 rounded-3xl p-6 border border-slate-800">
      <h3 className="text-sm font-bold text-slate-500 uppercase mb-6 tracking-widest text-center">
        {lang === 'en' ? 'AI Lifecycle & Feedback Loop' : 'دورة حياة الذكاء الاصطناعي والتغذية الراجعة'}
      </h3>
      <svg ref={svgRef} viewBox="0 0 800 350" className="w-full h-auto"></svg>
    </div>
  );
};

export default PipelineDiagram;
