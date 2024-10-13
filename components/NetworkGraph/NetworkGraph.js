"use client";

import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
import * as d3 from "d3";
import { Helmet } from "react-helmet";
import { analytics, logEvent } from "../../app/firebase.js";
import GraphContainer from "./GraphContainer.js";
import { combineAndProcessData } from "./utils/dataUtils.js";
import {
  primaryNodeTextWrapping,
  secondaryNodeTextWrapping,
} from "./utils/textUtils.js";
import {
  getSourceId,
  getTargetId,
  calculateNodeDegree,
  sortNodesByDegree,
  reorderNodes,
  initialiseCenter,
  getNodeRadius,
  isConnected,
  getMostFundedOrgs,
  getMostConnectedAlumni,
  handleNodeSelect,
} from "./utils/graphUtils.js";
import { initialiseForces } from "./utils/forceUtils.js";
import { colours, opacity, text } from "../../app/styling.js";
import farUserIcon from "../../public/farUserIcon.svg";

const secondaryNodeRadiusFlex = 2.3, // Stated in vw
  secondaryNodeRadiusMax = 50;

function NetworkGraph({
  targetOrg,
  alumniInfo,
  subsequentOrgsInfo,
  relations,
}) {
  const [networkGraphDimensions, setNetworkGraphDimensions] = useState(null);
  const d3Container = useRef(null);
  const simulationRef = useRef(null);
  const containerRef = useRef(null);

  var data = null;

  useEffect(() => {
    if (containerRef.current) {
      setNetworkGraphDimensions({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      });
    }
  }, []);

  try {
    data = combineAndProcessData(alumniInfo, subsequentOrgsInfo, relations);
    console.log("Data processed network graph");
  } catch (error) {
    console.error("Error processing data (NetworkGraph):", error);
    var error = true;
  }

  useEffect(() => {
    if (!d3Container.current || !data || data.nodes.length === 0) {
      d3.select(d3Container.current).selectAll("*").remove(); // Clear graph
      return;
    }
    d3.select(d3Container.current).selectAll("*").remove(); // Clear before rendeting to avoid multiple graphs

    // Stop simulation when reloading
    if (simulationRef.current) {
      simulationRef.current.stop();
    }

    let primaryNodeRadius = "min(2vw, 50px)",
      mafiaRadius =
        networkGraphDimensions.height <= networkGraphDimensions.width
          ? (networkGraphDimensions.height * 0.8) / 2
          : (networkGraphDimensions.width * 0.8) / 2, // Radius based on parent container dimensions
      primaryNodes = data.nodes.filter((d) => d.type === "primary"),
      angleStep = (2 * Math.PI) / primaryNodes.length,
      center = initialiseCenter(d3Container);

    // Evenly distribute the nodes in the list based on degree
    const degreeMap = calculateNodeDegree(primaryNodes, data.links);
    const sortedNodes = sortNodesByDegree(primaryNodes, degreeMap);
    primaryNodes = reorderNodes(
      sortedNodes,
      Math.ceil(primaryNodes.length / 6)
    );

    primaryNodes.forEach((d, i) => {
      d.fx = center.x + mafiaRadius * Math.cos(i * angleStep);
      d.fy = center.y + mafiaRadius * Math.sin(i * angleStep);
    });

    // Make secondary nodes start in the center for a nice entry simulation
    data.nodes.forEach((node) => {
      if (node.type === "secondary") {
        node.x = center.x;
        node.y = center.y;
      }
    });

    let linkedByIndex = {};

    // Create lookup structure to map connected nodes (for highlighting)
    data.links.forEach((link) => {
      // Required to check type as the link is a string prior to simulation and an object afterwards
      let sourceId = getSourceId(link);
      let targetId = getTargetId(link);

      // If there is a link, add entry with the source and target id and true
      linkedByIndex[`${sourceId},${targetId}`] = true;
      linkedByIndex[`${targetId},${sourceId}`] = true; // Ensure the connection is bidirectional
    });

    const svg = d3.select(d3Container.current);

    const defs = svg.append("defs");

    // Creating a pattern for profile pictures
    defs
      .selectAll(".node-pattern")
      .data(data.nodes.filter((d) => d.type === "primary"))
      .enter()
      .append("pattern")
      .attr("class", "node-pattern")
      .attr("id", (d) => `node-image-${d.id}`)
      .attr("height", "100%")
      .attr("width", "100%")
      .attr("patternContentUnits", "objectBoundingBox")
      .each(function (d) {
        if (d.personLogoUrl) {
          d3.select(this)
            .append("image")
            .attr("height", 1)
            .attr("width", 1)
            .attr("preserveAspectRatio", "xMidYMid slice")
            .attr("xlink:href", d.personLogoUrl);
        } else {
          // Adding user icon if no logo is available
          d3.select(this)
            .append("rect")
            .attr("width", 1)
            .attr("height", 1)
            .attr("fill", colours.neutrals.background);

          d3.select(this)
            .append("image")
            .attr("height", 0.7)
            .attr("width", 0.7)
            .attr("x", 0.15)
            .attr("y", 0.15)
            .attr("preserveAspectRatio", "xMidYMid slice")
            .attr("xlink:href", farUserIcon);
        }
      });

    // Draw lines for the links
    const linkElements = svg
      .append("g")
      .attr("stroke", colours.main.secondary1)
      .selectAll("line")
      .data(data.links)
      .join("line")
      .attr("stroke-width", 1);

    // Create a 'g' element for each node that will contain the circle and the text
    const nodeElements = svg
      .append("g")
      .selectAll("g")
      .data(data.nodes)
      .enter()
      .append("g");

    // Event handler for selecting nodes
    function clickNode(event, clickedNode) {
      handleNodeSelect(clickedNode);
      // Adjust the opacity to emphasise/de-emphasise nodes
      nodeElements.style("opacity", (node) => {
        return isConnected(linkedByIndex, clickedNode, node)
          ? 1
          : opacity.deselectNode;
      });

      linkElements
        // Adjust the opacity to emphasise/de-emphasise nodes
        .style("stroke-opacity", (link) =>
          isConnected(linkedByIndex, clickedNode, link.target)
            ? 1
            : opacity.deselectLink
        )
        // Adjust the stroke weight to emphasise/de-emphasise nodes
        .style("stroke-width", (link) =>
          isConnected(linkedByIndex, clickedNode, link.target) ? "2px" : "1px"
        )
        // Adjust the stroke colour for directly connected nodes
        .style("stroke", (link) =>
          link.source === clickedNode || link.target === clickedNode
            ? colours.relations[link.relationType]
            : colours.main.secondary2
        );

      // Secondary nodes colouring logic
      nodeElements.selectAll("circle").style("fill", (node) => {
        if (
          clickedNode.type === "primary" &&
          node.type === "secondary" &&
          isConnected(linkedByIndex, clickedNode, node)
        ) {
          // Find if there's a direct link between the clickedNode and this secondary node
          const directLink = data.links.find(
            (link) => link.source === clickedNode && link.target === node
          );
          // Use the relationType from the direct link to determine the fill color
          return colours.relations[directLink.relationType];
        }
      });

      // Primary nodes colouring logic
      nodeElements.selectAll("circle").each(function (node) {
        if (
          clickedNode.type === "secondary" &&
          node.type === "primary" &&
          isConnected(linkedByIndex, clickedNode, node)
        ) {
          const link = data.links.find(
            (link) =>
              link.target.id === clickedNode.id && link.source.id === node.id
          );
          if (link) {
            d3.select(this).style(
              "stroke",
              colours.relations[link.relationType]
            );
            d3.select(this).style("stroke-width", "4px");
          }
        } else {
          d3.select(this).style("stroke", "none");
        }
      });
      event.stopPropagation();

      logEvent(analytics, "node_select", {
        item_id: clickedNode.id,
        item_name: clickedNode.name,
        item_variant: clickedNode.type,
      }); // Log selected nodes
    }

    // Event listener and handler for deselecting nodes. Resets styling
    d3.select(document).on("click", function () {
      handleNodeSelect(null);
      nodeElements.style("opacity", 1);
      nodeElements.selectAll("circle").style("stroke", "none");
      nodeElements.selectAll("circle").style("fill", (node) => {
        return node.type === "secondary" && colours.main.primary1;
      });
      linkElements.style("stroke", colours.main.secondary1);
      linkElements.style("stroke-opacity", 1);
    });

    // Append circles to the 'g' elements and set the node size
    nodeElements
      .append("circle")
      .attr("r", (d) => {
        // Set node size
        if (d.type === "primary") {
          d.radius = primaryNodeRadius;
        } else if (d.type === "secondary" && d.totalFundingUsd != null) {
          d.radius = getNodeRadius(
            d.totalFundingUsd,
            data.nodes.filter(
              (d) => d.type === "secondary" && d.totalFundingUsd != null
            ),
            networkGraphDimensions,
            secondaryNodeRadiusFlex,
            secondaryNodeRadiusMax
          ); // Dynamic size for secondary nodes based on funding amount
        } else {
          d.radius = 3; // Default size secondary nodes without funding info
        }
        return d.radius;
      })
      .attr("fill", (d) =>
        d.type === "primary"
          ? `url(#node-image-${d.id})`
          : colours.main.primary1
      ) // Use pattern for primary nodes to populate profile pictures
      .on("click", clickNode);

    // Simulation setup with all forces
    simulationRef.current = initialiseForces(data, center); // Store the simulation reference to stop simulation when needed

    // Append text to nodes and add general styling
    nodeElements
      .filter(
        (d) =>
          (d.type === "primary") | (d.type === "secondary" && d.radius > 10)
      ) // Only show text for primary nodes and secondary nodes with larger than a certain size
      .append("text")
      .text((d) => d.name);

    nodeElements
      .filter((d) => d.type === "primary")
      .style("font-family", text.contentFocus.fontFamily)
      .style("font-size", text.contentFocus.fontSize)
      .style("font-weight", text.contentFocus.fontWeight)
      .style("fill", text.contentFocus.color)
      .style("pointer-events", "all")
      .on("click", clickNode); // Enable click on text

    nodeElements
      .filter((d) => d.type === "secondary")
      .style("font-family", text.content.fontFamily)
      .style("font-size", text.content.fontSize)
      .style("font-weight", text.content.fontWeight)
      .style("fill", text.content.color);

    primaryNodeTextWrapping(nodeElements, center, targetOrg.orgName);

    // Update secondary node text styling
    nodeElements
      .filter((d) => d.type === "secondary")
      .select("text")
      .each(function (d) {
        const nodeRadius = d.radius; // Calculate radius dynamically
        const maxWidth = nodeRadius * 2 - 5; // Subtract some padding
        secondaryNodeTextWrapping(d3, d3.select(this), maxWidth);
      })
      .style("text-anchor", "middle")
      .style("user-select", "none") // Disable click on text
      .style("pointer-events", "none");

    // Add secondary node aria-label for SEO
    nodeElements
      .filter((d) => d.type === "secondary")
      .attr("aria-label", (d) => d.name);

    d3.selectAll("text")
      .style("-webkit-user-select", "none")
      .style("-moz-user-select", "none")
      .style("-ms-user-select", "none");

    // Update configurations
    simulationRef.current.on("tick", () => {
      nodeElements.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
      linkElements
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      nodeElements.attr("transform", (d) => `translate(${d.x}, ${d.y})`);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d3Container, data]); // Ensures effect is only run on mount and unmount

  if (error) {
    return <div>Error processing data</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  const title = `The ${targetOrg.orgName} Mafia - Alumni Network of Top Startups`;

  const description = `Explore the alumni network of ${
    targetOrg.orgName
  }. Including founders and early executives including ${getMostConnectedAlumni(
    alumniInfo,
    relations,
    5
  ).join(
    ", "
  )}, working at, investing in, and advising companies like ${getMostFundedOrgs(
    subsequentOrgsInfo,
    5
  ).join(", ")}`;

  return (
    <>
      {/* Helmet for dynamic meta tags */}
      <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="twitter:description" content={description} />
        </Helmet>
        {networkGraphDimensions ? ( // Checks if networkGraphDimensions has been set to ensure proper size of graph
          <GraphContainer
            d3Container={d3Container}
            width={networkGraphDimensions.width}
            height={networkGraphDimensions.height}
          />
        ) : (
          <div> Loading graph... </div>
        )}
      </div>
    </>
  );
}

export default NetworkGraph;
