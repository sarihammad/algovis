import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Node, Edge } from '../services/api';

interface GraphVisualizerProps {
  nodes: Node[];
  edges: Edge[];
  width?: number;
  height?: number;
}

const GraphVisualizer = ({
  nodes,
  edges,
  width = 800,
  height = 600,
}: GraphVisualizerProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !nodes.length) return;

    // Clear previous visualization
    d3.select(svgRef.current).selectAll('*').remove();

    // Create SVG container
    const svg = d3.select(svgRef.current);
    const g = svg.append('g');

    // Add zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Create force simulation
    const simulation = d3
      .forceSimulation<Node>(nodes)
      .force(
        'link',
        d3
          .forceLink<Node, Edge>(edges)
          .id((d) => d.id)
          .distance(100)
      )
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2));

    // Create arrow marker
    svg
      .append('defs')
      .append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 20)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .append('path')
      .attr('d', 'M 0,-5 L 10,0 L 0,5')
      .attr('fill', '#999');

    // Draw edges
    const link = g
      .append('g')
      .selectAll('line')
      .data(edges)
      .join('line')
      .attr('stroke', (d) => (d.state === 'path' ? '#ff4081' : '#999'))
      .attr('stroke-width', (d) => (d.state === 'path' ? 3 : 1))
      .attr('marker-end', 'url(#arrowhead)');

    // Draw nodes
    const node = g
      .append('g')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', 20)
      .attr('fill', (d) => {
        switch (d.state) {
          case 'visited':
            return '#4caf50';
          case 'current':
            return '#2196f3';
          case 'next':
            return '#ff9800';
          case 'path':
            return '#ff4081';
          default:
            return '#fff';
        }
      })
      .attr('stroke', '#666')
      .attr('stroke-width', 2)
      .call(
        d3
          .drag<SVGCircleElement, Node>()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended)
      );

    // Add node labels
    const labels = g
      .append('g')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .text((d) => d.id)
      .attr('font-size', '12px')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em');

    // Add edge weights/capacities
    const edgeLabels = g
      .append('g')
      .selectAll('text')
      .data(edges)
      .join('text')
      .text((d) => {
        if (d.capacity !== undefined) {
          return `${d.flow || 0}/${d.capacity}`;
        }
        return d.weight?.toString() || '';
      })
      .attr('font-size', '10px')
      .attr('text-anchor', 'middle');

    // Update positions on each tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d) => (d.source as Node).x!)
        .attr('y1', (d) => (d.source as Node).y!)
        .attr('x2', (d) => (d.target as Node).x!)
        .attr('y2', (d) => (d.target as Node).y!);

      node.attr('cx', (d) => d.x!).attr('cy', (d) => d.y!);

      labels.attr('x', (d) => d.x!).attr('y', (d) => d.y!);

      edgeLabels
        .attr('x', (d) => ((d.source as Node).x! + (d.target as Node).x!) / 2)
        .attr('y', (d) => ((d.source as Node).y! + (d.target as Node).y!) / 2);
    });

    // Drag functions
    function dragstarted(event: d3.D3DragEvent<SVGCircleElement, Node, Node>) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: d3.D3DragEvent<SVGCircleElement, Node, Node>) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGCircleElement, Node, Node>) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [nodes, edges, width, height]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      style={{
        border: '1px solid #ccc',
        borderRadius: '4px',
      }}
    />
  );
};

export default GraphVisualizer;
