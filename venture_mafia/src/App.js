import React, { useEffect, useRef } from "react";
import "./App.css";
import * as d3 from "d3";

import data from "./data.json";

/*
import alumniNetworkRaw from "./data/alumni_network.json";
import targetOrg from "./data/targetOrg.json";
import alumniInfo from "./data/alumniInfo.json";
import subsequentOrgsInfo from "./data/subsequentOrgsInfo.json";
*/

// ----------------

const D3NetworkGraph = () => {
  const d3Container = useRef(null);
  const width = 1000,
    height = 1000,
    radius = 50; // Circle radius

  useEffect(() => {
    if (!d3Container.current) return;

    d3.select(d3Container.current).selectAll("*").remove(); // Clear before rendeting to avoid multiple graphs

    const svg = d3
      .select(d3Container.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // Simulation setup with all forces
    const simulation = d3
      .forceSimulation(data.nodes)
      .force(
        "link",
        d3
          .forceLink(data.links)
          .id((d) => d.id)
          .distance(400)
      )
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2));

    // Draw lines for the links
    const link = svg
      .append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(data.links)
      .join("line")
      .attr("stroke-width", (d) => Math.sqrt(d.value));

    // Create a `g` element for each node that will contain the circle and the text
    const nodeElements = svg
      .append("g")
      .selectAll("g")
      .data(data.nodes)
      .enter()
      .append("g");

    // Append circles to those `g` elements
    nodeElements
      .append("circle")
      .attr("r", radius)
      .style("fill", "#69b3a2");

    // Append text to the `g` elements, positioning it next to the circles
    nodeElements
      .append("text")
      .text((d) => d.name)
      .attr("dx", radius + 5) // Offset on the x-axis from the circle center
      .attr("dy", ".35em") // Vertically center the text relative to the circle's center
      .style("text-anchor", "start") // Anchor the text starting from its current position
      .style("fill", "#000000"); // Text color

    // Update and drag configurations
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      nodeElements.attr("transform", (d) => `translate(${d.x}, ${d.y})`);
    });
  }, []); // Ensures effect is only run on mount and unmount

  return <div ref={d3Container}></div>;
};

function App() {
  return (
    <div>
      <D3NetworkGraph />
    </div>
  );
}

export default App;
