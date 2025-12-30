
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface KnowledgeGraphProps {
  nodes: any[];
  links: any[];
  height?: number;
}

const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({ nodes, links, height = 500 }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    const width = svgRef.current.clientWidth;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('stroke', '#e2e8f0')
      .attr('stroke-width', 1.5);

    const node = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .enter().append('g')
      .call(d3.drag<any, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any);

    node.append('circle')
      .attr('r', 18)
      .attr('fill', (d) => {
        if (d.type === 'Person') return '#6366f1';
        if (d.type === 'Claim') return '#f59e0b';
        if (d.type === 'Diagnosis') return '#ef4444';
        if (d.type === 'Hospital') return '#8b5cf6';
        return '#10b981';
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    node.append('text')
      .text(d => d.label)
      .attr('x', 22)
      .attr('y', 4)
      .style('font-size', '10px')
      .style('font-weight', '600')
      .style('fill', '#64748b');

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }
  }, [nodes, links, height]);

  return (
    <div className="w-full h-full bg-gray-50/50 rounded-xl relative overflow-hidden">
      <svg ref={svgRef} width="100%" height={height} className="cursor-move"></svg>
      <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur px-3 py-2 rounded-lg text-[10px] text-gray-500 border border-gray-100 flex flex-col gap-1">
         <div className="flex items-center gap-2"><div className="w-2 h-2 bg-indigo-500 rounded-full"></div> 个人</div>
         <div className="flex items-center gap-2"><div className="w-2 h-2 bg-amber-500 rounded-full"></div> 案件</div>
         <div className="flex items-center gap-2"><div className="w-2 h-2 bg-red-500 rounded-full"></div> 疾病</div>
         <div className="flex items-center gap-2"><div className="w-2 h-2 bg-purple-500 rounded-full"></div> 医院</div>
      </div>
    </div>
  );
};

export default KnowledgeGraph;
