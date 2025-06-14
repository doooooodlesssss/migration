import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';

const SankeyChart = ({ data, width = 800, height = 500 }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Clear previous render
    d3.select(svgRef.current).selectAll("*").remove();

    // Set up the SVG container
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Format the data for D3 Sankey
    const nodes = [];
    const links = data;

    // Extract unique nodes
    const nodeNames = new Set();
    data.forEach(link => {
      nodeNames.add(link.source);
      nodeNames.add(link.target);
    });

    // Create nodes array
    Array.from(nodeNames).forEach((name, i) => {
      nodes.push({ name, id: i });
    });

    // Map links to use node indices
    const mappedLinks = links.map(link => ({
      source: Array.from(nodeNames).indexOf(link.source),
      target: Array.from(nodeNames).indexOf(link.target),
      value: link.value
    }));

    // Set up the Sankey generator
    const sankeyGenerator = sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .extent([[1, 1], [width - 1, height - 1]]);

    // Compute the node and link positions
    const { nodes: sankeyNodes, links: sankeyLinks } = sankeyGenerator({
      nodes: nodes.map(d => ({ ...d })),
      links: mappedLinks.map(d => ({ ...d }))
    });

    // Create color scales
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Draw the nodes
    svg.append("g")
      .selectAll("rect")
      .data(sankeyNodes)
      .join("rect")
      .attr("x", d => d.x0)
      .attr("y", d => d.y0)
      .attr("height", d => d.y1 - d.y0)
      .attr("width", d => d.x1 - d.x0)
      .attr("fill", d => color(d.name))
      .attr("stroke", "#000");

    // Add node labels
    svg.append("g")
      .selectAll("text")
      .data(sankeyNodes)
      .join("text")
      .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
      .attr("y", d => (d.y1 + d.y0) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
      .text(d => d.name)
      .style("font-size", "12px");

    // Draw the links
    const linkGenerator = sankeyLinkHorizontal();
    
    svg.append("g")
      .attr("fill", "none")
      .selectAll("path")
      .data(sankeyLinks)
      .join("path")
      .attr("d", linkGenerator)
      .attr("stroke", d => d3.interpolateRgb(color(d.source.name), color(d.target.name))(0.5))
      .attr("stroke-width", d => Math.max(1, d.width))
      .attr("opacity", 0.7);

  }, [data, width, height]);

  return <svg ref={svgRef} style={{ width: '100%', height: '100%' }} />;
};

export default SankeyChart;