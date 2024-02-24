import React, { useEffect, useRef } from "react";
import "./App.css";
import * as d3 from "d3";

import data from "./data_typed.json";

/*
import alumniNetworkRaw from "./data/alumni_network.json";
import targetOrg from "./data/targetOrg.json";
import alumniInfo from "./data/alumniInfo.json";
import subsequentOrgsInfo from "./data/subsequentOrgsInfo.json";
*/

// ----------------

const D3NetworkGraph = () => {
  const d3Container = useRef(null);
  const width = 2000,
    height = 1500,
    nodeRadius = 50, // Node radius
    mafiaRadius = 400,
    center = { x: width / 2, y: height / 2 };

  const primaryNodes = data.nodes.filter((d) => d.type === "primary");
  const angleStep = (2 * Math.PI) / primaryNodes.length;

  primaryNodes.forEach((d, i) => {
    d.fx = center.x + mafiaRadius * Math.cos(i * angleStep);
    d.fy = center.y + mafiaRadius * Math.sin(i * angleStep);
  });

  useEffect(() => {
    if (!d3Container.current) return;

    d3.select(d3Container.current).selectAll("*").remove(); // Clear before rendeting to avoid multiple graphs

    function forceSecondaryNodes(alpha) {
      data.nodes.forEach((d) => {
        if (d.type === "secondary") {
          // Force calculation to secondary nodes towayds center
          const primaryNode = findPrimaryNodeForSecondary(d);
          if (primaryNode) {
            const pullStrength = 0.1; // Increase to make the pull towards the center stronger
            const towardsCenterX = (center.x - d.x) * pullStrength;
            const towardsCenterY = (center.y - d.y) * pullStrength;

            d.x += (towardsCenterX - d.x) * alpha;
            d.y += (towardsCenterY - d.y) * alpha;
          }
        }
      });
    }

    function findPrimaryNodeForSecondary(node) {
      // Find the connected primary node for a given secondary node
      const link = data.links.find(
        (link) =>
          link.target.id === node.id &&
          data.nodes[link.source.index].type === "primary"
      );
      return link ? data.nodes[link.source.index] : null;
    }

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
          .distance(100)
      )
      .force("charge", d3.forceManyBody().strength(-50))
      .force("center", d3.forceCenter(center.x, center.y))
      .force("secondaryNodes", forceSecondaryNodes);

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
      .attr("r", nodeRadius)
      .style("fill", (d) => (d.type === "primary" ? "#69b3a2" : "#ffab00")); // Primary nodes in green, secondary in orange

    // Append text to the `g` elements, positioning it next to the circles
    nodeElements
      .append("text")
      .text((d) => d.name)
      .attr("dx", nodeRadius + 5) // Offset on the x-axis from the circle center
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
