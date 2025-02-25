import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';

interface PerformanceData {
  input_sizes: number[];
  execution_times: number[];
  memory_usage: number[];
  estimated_complexity: string;
}

interface PerformanceVisualizerProps {
  data: PerformanceData;
  width?: number;
  height?: number;
}

const PerformanceVisualizer = ({
  data,
  width = 800,
  height = 400,
}: PerformanceVisualizerProps) => {
  const timeChartRef = useRef<SVGSVGElement>(null);
  const memoryChartRef = useRef<SVGSVGElement>(null);
  const theme = useTheme();

  const createChart = (
    element: SVGSVGElement | null,
    values: number[],
    label: string,
    color: string
  ) => {
    if (!element) return;

    // Clear previous visualization
    d3.select(element).selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create SVG container
    const svg = d3.select(element);
    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(data.input_sizes) || 0])
      .range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(values) || 0])
      .range([innerHeight, 0]);

    // Add axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(5))
      .append('text')
      .attr('x', innerWidth / 2)
      .attr('y', 35)
      .attr('fill', 'currentColor')
      .attr('text-anchor', 'middle')
      .text('Input Size');

    g.append('g')
      .call(d3.axisLeft(yScale))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -45)
      .attr('x', -innerHeight / 2)
      .attr('fill', 'currentColor')
      .attr('text-anchor', 'middle')
      .text(label);

    // Create line generator
    const line = d3
      .line<number>()
      .x((_, i) => xScale(data.input_sizes[i]))
      .y((d) => yScale(d));

    // Add line path
    g.append('path')
      .datum(values)
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', 2)
      .attr('d', line);

    // Add points
    g.selectAll('circle')
      .data(values)
      .join('circle')
      .attr('cx', (_, i) => xScale(data.input_sizes[i]))
      .attr('cy', (d) => yScale(d))
      .attr('r', 4)
      .attr('fill', color);
  };

  useEffect(() => {
    createChart(
      timeChartRef.current,
      data.execution_times,
      'Execution Time (s)',
      theme.palette.primary.main
    );
    createChart(
      memoryChartRef.current,
      data.memory_usage,
      'Memory Usage (bytes)',
      theme.palette.secondary.main
    );
  }, [data, width, height, theme]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Performance Analysis
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Estimated Complexity: {data.estimated_complexity}
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Execution Time
          </Typography>
          <svg
            ref={timeChartRef}
            width={width}
            height={height}
            style={{ marginBottom: 20 }}
          />

          <Typography variant="subtitle1" gutterBottom>
            Memory Usage
          </Typography>
          <svg ref={memoryChartRef} width={width} height={height} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default PerformanceVisualizer;
