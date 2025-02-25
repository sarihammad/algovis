import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface OptimizationVisualizerProps {
  data: {
    point: number[];
    objective_value: number;
    gradient?: number[];
    iteration: number;
    improvement?: number;
  };
  width?: number;
  height?: number;
  showGradient?: boolean;
}

const OptimizationVisualizer = ({
  data,
  width = 600,
  height = 400,
  showGradient = true,
}: OptimizationVisualizerProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    // Clear previous visualization
    d3.select(svgRef.current).selectAll('*').remove();

    const margin = { top: 40, right: 40, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create SVG container
    const svg = d3.select(svgRef.current);
    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const xScale = d3
      .scaleLinear()
      .domain([d3.min(data.point) || 0 - 1, d3.max(data.point) || 1 + 1])
      .range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([0, data.objective_value * 1.2])
      .range([innerHeight, 0]);

    // Add axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale));

    g.append('g').call(d3.axisLeft(yScale));

    // Add axis labels
    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 40)
      .attr('text-anchor', 'middle')
      .text('Parameter Value');

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -40)
      .attr('text-anchor', 'middle')
      .text('Objective Value');

    // Plot current point
    g.append('circle')
      .attr('cx', xScale(data.point[0]))
      .attr('cy', yScale(data.objective_value))
      .attr('r', 5)
      .attr('fill', '#2196f3');

    // Add gradient vector if available and requested
    if (showGradient && data.gradient) {
      const gradientScale = 0.1; // Scale factor for gradient visualization
      g.append('line')
        .attr('x1', xScale(data.point[0]))
        .attr('y1', yScale(data.objective_value))
        .attr('x2', xScale(data.point[0] - gradientScale * data.gradient[0]))
        .attr(
          'y2',
          yScale(data.objective_value - gradientScale * data.gradient[1])
        )
        .attr('stroke', '#ff4081')
        .attr('stroke-width', 2)
        .attr('marker-end', 'url(#arrowhead)');

      // Add arrowhead marker
      svg
        .append('defs')
        .append('marker')
        .attr('id', 'arrowhead')
        .attr('viewBox', '-0 -5 10 10')
        .attr('refX', 5)
        .attr('refY', 0)
        .attr('orient', 'auto')
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .append('path')
        .attr('d', 'M 0,-5 L 10,0 L 0,5')
        .attr('fill', '#ff4081');
    }

    // Add iteration information
    g.append('text')
      .attr('x', innerWidth - 100)
      .attr('y', 20)
      .attr('text-anchor', 'end')
      .text(`Iteration: ${data.iteration}`);

    if (data.improvement !== undefined) {
      g.append('text')
        .attr('x', innerWidth - 100)
        .attr('y', 40)
        .attr('text-anchor', 'end')
        .text(`Improvement: ${data.improvement.toFixed(6)}`);
    }
  }, [data, width, height, showGradient]);

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

export default OptimizationVisualizer;
