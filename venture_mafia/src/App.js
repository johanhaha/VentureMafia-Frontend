import React, { useEffect, useRef } from "react";
import "./App.css";
import * as d3 from "d3";

//import targetOrg from "./data/targetOrg.json";
import alumniInfo from "./data/alumniInfo.json";
import subsequentOrgsInfo from "./data/subsequentOrgsInfo.json";
import relations from "./data/relations.json";

// Combining datasets and mapping them to the correct attribute names
const combineAndProcessData = (primaryNodes, secondaryNodes, links) => {
  const combinedNodes = [
    ...primaryNodes.map(({ personUuid: id, personName: name, ...rest }) => ({
      type: "primary",
      id,
      name,
      ...rest,
    })),
    ...secondaryNodes.map(({ orgUuid: id, orgName: name, ...rest }) => ({
      type: "secondary",
      id,
      name,
      ...rest,
    })),
  ];
  const combinedLinks = links.map(
    ({ personUuid: source, orgUuid: target, ...rest }) => ({
      source,
      target,
      ...rest,
    })
  );

  const data = {
    nodes: combinedNodes,
    links: combinedLinks,
  };

  return data;
};

const data = combineAndProcessData(alumniInfo, subsequentOrgsInfo, relations);

console.log(data);

// Normalise data for secondary node sizes
const fundingValues = data.nodes
  .filter((d) => d.type === "secondary")
  .map((d) => d.totalFundingUsd);

const fundingExtent = d3.extent(fundingValues); // [min, max] of funding

// Scaling function
const sizeScale = d3
  .scalePow()
  .exponent(0.45) // Tune this for good secondary node sizes
  .domain(fundingExtent)
  .range([3, 60]);

// Support function to get the ID of the source element of a link
const getSourceId = (link) => {
  return typeof link.source === "object" ? link.source.id : link.source;
};

// Support function to get the ID of the target element of a link
const getTargetId = (link) => {
  return typeof link.target === "object" ? link.target.id : link.target;
};

const D3NetworkGraph = () => {
  const d3Container = useRef(null);
  const width = 3000,
    height = 1700,
    primaryNodeRadius = 50,
    secondaryNodeRadius = 10,
    mafiaRadius = 800,
    center = { x: width / 2, y: height / 2 },
    pullStrength = 0.3, // Increase to make forces stronger
    baseDistance = 200, // Base distance between primary and secondary nodes
    minDistance = 150; // Minimum desired distance between secondary nodes

  const primaryNodes = data.nodes.filter((d) => d.type === "primary");
  const angleStep = (2 * Math.PI) / primaryNodes.length;

  useEffect(() => {
    if (!d3Container.current) return;

    d3.select(d3Container.current).selectAll("*").remove(); // Clear before rendeting to avoid multiple graphs

    const nodeMap = new Map(data.nodes.map((node) => [node.id, node])); // Map with all nodes
    let secondaryToPrimaryMap = new Map(); // Mapping between secondary and primary nodes to calculate number of common nodes
    let commonConnectionsScore = new Map(); // Map of the number of common secondary nodes between primary nodes

    // Go through each link to count connections for primary nodes
    data.links.forEach((link) => {
      let sourceId = getSourceId(link);
      let targetId = getTargetId(link);
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
    primaryNodes.forEach((node) => commonConnectionsScore.set(node.id, 0));

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
          commonConnectionsScore.set(
            nodeA.id,
            commonConnectionsScore.get(nodeA.id) + sharedConnections
          );
        }
      });
    });

    // Sort nodes based on number of common connections
    primaryNodes.sort((a, b) => {
      return (
        commonConnectionsScore.get(b.id) - commonConnectionsScore.get(a.id)
      );
    });

    primaryNodes.forEach((d, i) => {
      d.fx = center.x + mafiaRadius * Math.cos(i * angleStep);
      d.fy = center.y + mafiaRadius * Math.sin(i * angleStep);
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

    // Helper function to check if two nodes are linked
    function isConnected(a, b) {
      return (
        linkedByIndex[`${a.id},${b.id}`] ||
        linkedByIndex[`${b.id},${a.id}`] ||
        a.id === b.id
      );
    }

    function forceSecondaryNodes(alpha) {
      const k = alpha * pullStrength;
      data.nodes.forEach((a, i) => {
        data.nodes.forEach((b, j) => {
          if (i !== j && a.type === "secondary" && b.type === "secondary") {
            // Adjust minDistance based on node sizes
            const adjustedMinDistance =
              minDistance +
              sizeScale(a.totalFundingUsd) +
              sizeScale(b.totalFundingUsd);
            let dx = a.x - b.x;
            let dy = a.y - b.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < adjustedMinDistance) {
              let strength = ((adjustedMinDistance - distance) / distance) * k;
              a.vx += dx * strength;
              a.vy += dy * strength;
              b.vx -= dx * strength;
              b.vy -= dy * strength;
            }
          }
        });
      });
    }

    function forceTowardsCenter(alpha) {
      data.nodes.forEach((node) => {
        if (node.type === "secondary") {
          node.vx += (center.x - node.x) * alpha * pullStrength;
          node.vy += (center.y - node.y) * alpha * pullStrength;
        }
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
          .distance((link) => {
            // Determine the distance based on the relationType
            switch (link.relationType) {
              case "executive":
                return baseDistance * 1; // Closest distance for executives

              case "board_member":
                return baseDistance * 2; // Farthest for board members

              case "advisor":
                return baseDistance * 3; // Slightly farther for advisors

              case "investor":
                return baseDistance * 4; // Farther for investors

              default:
                return baseDistance * 3; // Default distance if relationType is unknown
            }
          })
      )
      .force("secondaryNodes", forceSecondaryNodes)
      .force("forceTowardsCenter", forceTowardsCenter);

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
      .append("image")
      .attr("height", 1)
      .attr("width", 1)
      .attr("preserveAspectRatio", "xMidYMid slice")
      .attr("xlink:href", (d) => d.personLogoUrl);

    // Draw lines for the links
    const linkElements = svg
      .append("g")
      .attr("stroke", "#737373")
      .attr("stroke-opacity", 0.3)
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
      // Adjust the opacity to emphasise/de-emphasise nodes
      nodeElements.style("opacity", (node) => {
        return isConnected(clickedNode, node) ? 1.0 : 0.1;
      });
      // Adjust the opacity to emphasise/de-emphasise nodes
      linkElements.style("stroke-opacity", (link) => {
        return isConnected(clickedNode, link.target) ? 1.0 : 0.02;
      });
      // Adjust the stroke colour for directly connected nodes
      linkElements.style("stroke", (link) => {
        return link.source === clickedNode || link.target === clickedNode
          ? "red"
          : "#737373";
      });
      event.stopPropagation();
    }

    // Event listener and handler for deselecting nodes. Resets styling
    d3.select(document).on("click", function () {
      nodeElements.style("opacity", 1);
      linkElements.style("stroke", "#737373");
      linkElements.style("stroke-opacity", 0.3);
    });

    // Append circles to the 'g' elements and set the node size
    nodeElements
      .append("circle")
      .attr("r", (d) => {
        // Set node size
        if (d.type === "primary") {
          return primaryNodeRadius;
        } else if (d.type === "secondary" && d.totalFundingUsd != null) {
          return sizeScale(d.totalFundingUsd); // Dynamic size for secondary nodes based on funding amount
        } else {
          return 10; // Default size secondary nodes without funding info
        }
      })
      .attr("fill", (d) =>
        d.type === "primary" ? `url(#node-image-${d.id})` : "#ffab00"
      ) // Use pattern for primary nodes to populate profile pictures
      .on("click", clickNode);

    // Append text to the 'g' elements, positioning it next to the circles
    nodeElements
      .append("text")
      .text((d) => d.name)
      .attr("dx", (d) =>
        d.type === "primary" ? primaryNodeRadius + 5 : secondaryNodeRadius + 5
      ) // Offset on the x-axis from the circle center
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .style("fill", "#000000");

    // Update configurations
    simulation.on("tick", () => {
      linkElements
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      nodeElements.attr("transform", (d) => `translate(${d.x}, ${d.y})`);
    });
  }); // Ensures effect is only run on mount and unmount

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
