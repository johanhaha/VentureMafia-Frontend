import React, { useEffect, useRef } from 'react';
import './App.css';
import * as d3 from 'd3';

import data from './data.json';

/*
import alumniNetworkRaw from "./data/alumni_network.json";
import targetOrg from "./data/targetOrg.json";
import alumniInfo from "./data/alumniInfo.json";
import subsequentOrgsInfo from "./data/subsequentOrgsInfo.json";
*/

/*
// set the dimensions and margins of the graph
const margin = {top: 10, right: 30, bottom: 30, left: 40},
  width = 400 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#my_dataviz")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        `translate(${margin.left}, ${margin.top})`);

// Initialize the links
const link = svg
  .selectAll("line")
  .data(data.links)
  .join("line")
    .style("stroke", "#aaa")

// Initialize the nodes
const node = svg
  .selectAll("circle")
  .data(data.nodes)
  .join("circle")
    .attr("r", 20)
    .style("fill", "#69b3a2")

// Let's list the force we wanna apply on the network
const simulation = d3.forceSimulation(data.nodes)                 // Force algorithm is applied to data.nodes
    .force("link", d3.forceLink()                               // This force provides links between nodes
          .id(function(d) { return d.id; })                     // This provide  the id of a node
          .links(data.links)                                    // and this the list of links
    )
    .force("charge", d3.forceManyBody().strength(-400))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
    .force("center", d3.forceCenter(width / 2, height / 2))     // This force attracts nodes to the center of the svg area
    .on("end", ticked);

// This function is run at each iteration of the force algorithm, updating the nodes position.
function ticked() {
  link
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  node
        .attr("cx", function (d) { return d.x+6; })
        .attr("cy", function(d) { return d.y-6; });
}
*/

// ----------------

const D3NetworkGraph = () => {
  const d3Container = useRef(null);
  const width = 1000, height = 1000;

  useEffect(() => {
    if (!d3Container.current) return;

    d3.select(d3Container.current).selectAll("*").remove(); // Clear before rendeting to avoid multiple graphs

    const svg = d3.select(d3Container.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // Simulation setup with all forces
    const simulation = d3.forceSimulation(data.nodes)
      .force("link", d3.forceLink(data.links)
        .id(d => d.id)
        .distance(400))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2));

    // Draw lines for the links
    const link = svg.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(data.links)
      .join("line")
      .attr("stroke-width", d => Math.sqrt(d.value));

    // Draw circles for the nodes
    const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(data.nodes)
      .join("circle")
      .attr("r", 30)
      .attr("fill", color)

    node.append("title")
      .text(d => d.id);

    // Update and drag configurations
    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
    });

    function color() {
      return "#000000";
    }
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
