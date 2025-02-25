import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface MatrixVisualizerProps {
  data: number[][];
  highlightCells?: { row: number; col: number }[];
  rowLabels?: string[];
  colLabels?: string[];
  width?: number;
  height?: number;
}

const MatrixVisualizer = ({
  data,
  highlightCells = [],
  rowLabels,
  colLabels,
  width = 600,
  height = 400,
}: MatrixVisualizerProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    // Clear previous visualization
    d3.select(svgRef.current).selectAll('*').remove();

    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const numRows = data.length;
    const numCols = data[0].length;

    const cellWidth = innerWidth / numCols;
    const cellHeight = innerHeight / numRows;

    // Create SVG container
    const svg = d3.select(svgRef.current);
    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Create color scale
    const values = data.flat();
    const colorScale = d3
      .scaleSequential()
      .domain([Math.min(...values), Math.max(...values)])
      .interpolator(d3.interpolateBlues);

    // Draw cells
    const rows = g
      .selectAll('.row')
      .data(data)
      .join('g')
      .attr('class', 'row')
      .attr('transform', (_, i) => `translate(0,${i * cellHeight})`);

    rows
      .selectAll('rect')
      .data((d) => d)
      .join('rect')
      .attr('x', (_, i) => i * cellWidth)
      .attr('width', cellWidth)
      .attr('height', cellHeight)
      .attr('fill', (d) => colorScale(d))
      .attr('stroke', '#ccc');

    // Add cell values
    rows
      .selectAll('text')
      .data((d) => d)
      .join('text')
      .attr('x', (_, i) => i * cellWidth + cellWidth / 2)
      .attr('y', cellHeight / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .attr('fill', (d) => (d3.lab(colorScale(d)).l < 50 ? '#fff' : '#000'))
      .text((d) => d.toString());

    // Highlight cells
    highlightCells.forEach(({ row, col }) => {
      g.append('rect')
        .attr('x', col * cellWidth)
        .attr('y', row * cellHeight)
        .attr('width', cellWidth)
        .attr('height', cellHeight)
        .attr('fill', 'none')
        .attr('stroke', '#ff4081')
        .attr('stroke-width', 2);
    });

    // Add row labels
    if (rowLabels) {
      g.selectAll('.row-label')
        .data(rowLabels)
        .join('text')
        .attr('class', 'row-label')
        .attr('x', -10)
        .attr('y', (_, i) => i * cellHeight + cellHeight / 2)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'end')
        .text((d) => d);
    }

    // Add column labels
    if (colLabels) {
      g.selectAll('.col-label')
        .data(colLabels)
        .join('text')
        .attr('class', 'col-label')
        .attr('x', (_, i) => i * cellWidth + cellWidth / 2)
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .text((d) => d);
    }
  }, [data, highlightCells, rowLabels, colLabels, width, height]);

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

export default MatrixVisualizer;
