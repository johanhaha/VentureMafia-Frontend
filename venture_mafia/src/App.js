import React, { useEffect, useRef } from "react";
import "./App.css";
import * as d3 from "d3";

import primaryNodes from "./data/primary_nodes.json";
import secondaryNodes from "./data/secondary_nodes.json";
import links from "./data/links.json";

/*
import alumniNetworkRaw from "./data/alumni_network.json";
import targetOrg from "./data/targetOrg.json";
import alumniInfo from "./data/alumniInfo.json";
import subsequentOrgsInfo from "./data/subsequentOrgsInfo.json";
*/

const combineAndProcessData = (primaryNodes, secondaryNodes) => {
  // Assuming both primary and secondary are arrays of node objects
  const combinedNodes = [...primaryNodes.map(node => ({ ...node, type: 'primary' })), ...secondaryNodes.map(node => ({ ...node, type: 'secondary' }))];
  const combinedLinks = [...links]; // Define how you combine or create links

  const data = {
    "nodes": combinedNodes,
    "links": combinedLinks
  }

  return data
};

const data = combineAndProcessData(primaryNodes, secondaryNodes);

console.log(data);

const D3NetworkGraph = () => {
  const d3Container = useRef(null);
  const width = 2000,
    height = 1500,
    nodeRadius = 30, // Node radius
    mafiaRadius = 400,
    center = { x: width / 2, y: height / 2 },
    pullStrength = 0.1, // Increase to make the pull towards the center stronger
    minDistance = 150; // Minimum desired distance between secondary nodes

  const primaryNodes = data.nodes.filter((d) => d.type === "primary");
  const angleStep = (2 * Math.PI) / primaryNodes.length;

  useEffect(() => {
    if (!d3Container.current) return;

    d3.select(d3Container.current).selectAll("*").remove(); // Clear before rendeting to avoid multiple graphs

    const nodeMap = new Map(data.nodes.map(node => [node.id, node])); // Map with all nodes
    let secondaryToPrimaryMap = new Map(); // Mapping between secondary and primary nodes to calculate number of common nodes
    let commonConnectionsScore = new Map(); // Map of the number of common secondary nodes between primary nodes

    // Go through each link to count connections for primary nodes
    data.links.forEach(link => {
      const sourceId = typeof link.source === "object" ? link.source.id : link.source;
      const targetId = typeof link.target === "object" ? link.target.id : link.target;
    
      let sourceNode = nodeMap.get(sourceId);
      let targetNode = nodeMap.get(targetId);
    
      // Since primary nodes can't connect to other primary nodes, only one check is needed
      if (sourceNode.type === "primary" && targetNode.type === "secondary") {
        if (!secondaryToPrimaryMap.has(targetId)) {
          secondaryToPrimaryMap.set(targetId, new Set());
        }
        secondaryToPrimaryMap.get(targetId).add(sourceId);
      }
    });

    // Initialise score map
    primaryNodes.forEach(node => commonConnectionsScore.set(node.id, 0));

    // Calculate the score based on common secondary connections
    primaryNodes.forEach((nodeA, indexA) => {
      primaryNodes.forEach((nodeB, indexB) => {
        if (indexA !== indexB) {
          let sharedConnections = 0;
          secondaryToPrimaryMap.forEach((primaryIds, secondaryId) => {
            if (primaryIds.has(nodeA.id) && primaryIds.has(nodeB.id)) {
              sharedConnections += 1; // Increment if both primary nodes are connected to the same secondary node
            }
          });
          commonConnectionsScore.set(nodeA.id, commonConnectionsScore.get(nodeA.id) + sharedConnections);
        }
      });
    });

    // Sort nodes based on number of common connections
    primaryNodes.sort((a, b) => {
      return commonConnectionsScore.get(b.id) - commonConnectionsScore.get(a.id);
    });

    primaryNodes.forEach((d, i) => {
      d.fx = center.x + mafiaRadius * Math.cos(i * angleStep);
      d.fy = center.y + mafiaRadius * Math.sin(i * angleStep);
    });
    
    function forceSecondaryNodes(alpha) {
      const k = alpha * pullStrength;
      data.nodes.forEach((a, i) => {
        data.nodes.forEach((b, j) => {
          if (i !== j && a.type === "secondary" && b.type === "secondary") {
            let dx = a.x - b.x;
            let dy = a.y - b.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < minDistance) {
              let strength = (minDistance - distance) / distance * k;
              a.vx += dx * strength;
              a.vy += dy * strength;
              b.vx -= dx * strength;
              b.vy -= dy * strength;
            }
          }
        });
      });
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
      .force("charge", d3.forceManyBody())
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

    // Update configurations
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
