import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { colours, opacity, text } from "../styling.js";
import farUserIcon from "../assets/farUserIcon.svg";

const secondaryNodeRadiusFlex = 4, // Stated in vw
  secondaryNodeRadiusMax = 50;

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

// Support function to get the ID of the source element of a link
const getSourceId = (link) => {
  return typeof link.source === "object" ? link.source.id : link.source;
};

// Support function to get the ID of the target element of a link
const getTargetId = (link) => {
  return typeof link.target === "object" ? link.target.id : link.target;
};

function NetworkGraph({
  alumniInfo,
  subsequentOrgsInfo,
  relations,
  onNodeSelect,
  networkGraphDimensions,
}) {
  const d3Container = useRef(null);

  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState(false);
  const simulationRef = useRef(null);

  useEffect(() => {
    if (!alumniInfo || !subsequentOrgsInfo || !relations) {
      console.log("Waiting for data...");
      return; // Early return if data is not available
    }

    try {
      const processedData = combineAndProcessData(
        alumniInfo,
        subsequentOrgsInfo,
        relations
      );
      setData(processedData);
      console.log("Data processed network graph");
    } catch (error) {
      console.error("Error processing data (NetworkGraph):", error);
      setError(true);
    }
  }, [alumniInfo, subsequentOrgsInfo, relations]); // Depend on these data pieces

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

    var primaryNodeRadius = "min(2vw, 50px)",
      mafiaRadius =
        networkGraphDimensions.height <= networkGraphDimensions.width
          ? (networkGraphDimensions.height * 0.8) / 2
          : (networkGraphDimensions.width * 0.8) / 2, // Radius based on parent container dimensions
      pullStrength = 0.1, // Increase to make forces stronger
      baseDistance = (networkGraphDimensions.width * 5) / 100, // Base distance between primary and secondary nodes
      minDistance = Math.min(
        (networkGraphDimensions.width * secondaryNodeRadiusFlex) / 100
      ), // Minimum desired distance between secondary nodes
      primaryNodes = data.nodes.filter((d) => d.type === "primary"),
      angleStep = (2 * Math.PI) / primaryNodes.length,
      center = { x: 0, y: 0 }; // Placeholder value

    const calculateNodeDegree = (nodes, links) => {
      const degreeMap = {};
      nodes.forEach((node) => {
        degreeMap[node.id] = 0;
      });
      links.forEach((link) => {
        degreeMap[link.source] = (degreeMap[link.source] || 0) + 1;
        degreeMap[link.target] = (degreeMap[link.target] || 0) + 1;
      });
      return degreeMap;
    };

    const sortNodesByDegree = (nodes, degreeMap) => {
      return nodes.sort((a, b) => degreeMap[b.id] - degreeMap[a.id]);
    };

    // Evenly distribute the nodes in the list based on degree
    function reorderNodes(nodes, numBins) {
      // Calculate the size of each bin
      const binSize = Math.ceil(nodes.length / numBins);
      let bins = Array.from({ length: numBins }, (_, index) =>
        nodes.slice(index * binSize, (index + 1) * binSize)
      );

      // Create a new array by alternating between the bins
      let reorderedArray = [];
      for (let i = 0; i < binSize; i++) {
        for (let j = 0; j < numBins; j++) {
          if (j % 2 === 0 && i < bins[j].length) {
            reorderedArray.push(bins[j][i]);
          } else if (j % 2 !== 0 && i < bins[j].length) {
            reorderedArray.push(bins[j][bins[j].length - 1 - i]);
          }
        }
      }

      return reorderedArray;
    }

    // Evenly distribute the nodes in the list based on degree
    const degreeMap = calculateNodeDegree(primaryNodes, data.links);
    const sortedNodes = sortNodesByDegree(primaryNodes, degreeMap);
    primaryNodes = reorderNodes(
      sortedNodes,
      Math.ceil(primaryNodes.length / 6)
    );

    const fundingExtent = d3.extent(
      data.nodes
        .filter((d) => d.type === "secondary")
        .map((d) => d.totalFundingUsd)
    ); // [min, max] of funding

    // Scaling function
    const sizeScale = d3
      .scalePow()
      .exponent(0.45) // Tune this for good secondary node sizes
      .domain(fundingExtent)
      .range([
        3,
        Math.min(
          (networkGraphDimensions.width * secondaryNodeRadiusFlex) / 100,
          secondaryNodeRadiusMax
        ),
      ]); // Dynamically setting maximum secondary node radius

    // Helper function to calculate the center
    function resize() {
      center = {
        x: d3Container.current.parentNode.clientWidth / 2,
        y: d3Container.current.parentNode.clientHeight / 2,
      };
    }

    // Initialise the center value
    resize();

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

    // Helper function for text wrapping
    function wrapText(selection, width) {
      selection.each(function () {
        const text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          dy = parseFloat(text.attr("dy") || 0.35);

        text.text(null); // Clear the text once and manage via tspans

        if (words.length === 1) {
          let word = words[0];
          text
            .append("tspan")
            .attr("x", 0)
            .attr("y", 0)
            .attr("dy", `${dy}em`)
            .text(word);
        } else {
          let word,
            line = [],
            tspan = text
              .append("tspan")
              .attr("x", 0)
              .attr("y", 0)
              .attr("dy", `${dy}em`);

          while (words.length > 0) {
            word = words.pop();
            line.push(word);
            tspan.text(line.join(" ")); // Update text in the existing tspan

            if (
              tspan.node().getComputedTextLength() > width &&
              line.length > 1
            ) {
              line.pop(); // Remove last word that caused overflow
              tspan.text(line.join(" ")); // Set text to previous valid line
              line = [word]; // Start new line with last word
              tspan = text.append("tspan").attr("x", 0).attr("y", 0).text(word); // Append new tspan for the new line
            }
          }
        }

        // Recalculate dy for each tspan to vertically center them
        let tspans = text.selectAll("tspan");
        let lineCount = tspans.size();
        let lineNumber = 0;
        tspans.each(function () {
          d3.select(this).attr(
            "dy",
            `${(lineNumber - lineCount / 2 + 0.5) * 1.1 + dy}em`
          );
          lineNumber++;
        });
      });
    }

    // Helper function to get node radius
    function getNodeRadius(node) {
      return sizeScale(node.totalFundingUsd);
    }

    function forceSecondaryNodes(alpha) {
      const k = alpha * pullStrength;
      data.nodes.forEach((a, i) => {
        data.nodes.forEach((b, j) => {
          if (i !== j && a.type === "secondary" && b.type === "secondary") {
            // Adjust minDistance based on node sizes
            const adjustedMinDistance =
              minDistance + (getNodeRadius(a) + getNodeRadius(b)) * 1.3;
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
          node.vx += (center.x - node.x) * alpha * pullStrength * 2;
          node.vy += (center.y - node.y) * alpha * pullStrength * 2;
        }
      });
    }

    const svg = d3
      .select(d3Container.current)
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%");

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
                return baseDistance * 4; // Default distance if relationType is unknown
            }
          })
      )
      .force("secondaryNodes", forceSecondaryNodes)
      .force("forceTowardsCenter", forceTowardsCenter)
      .force('collision', d3.forceCollide().radius(d => getNodeRadius(d) * 1.1));

    simulationRef.current = simulation; // Store the simulation reference to stop simulation when needed

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
      onNodeSelect(clickedNode);
      // Adjust the opacity to emphasise/de-emphasise nodes
      nodeElements.style("opacity", (node) => {
        return isConnected(clickedNode, node) ? 1 : opacity.deselectNode;
      });

      linkElements
        // Adjust the opacity to emphasise/de-emphasise nodes
        .style("stroke-opacity", (link) =>
          isConnected(clickedNode, link.target) ? 1 : opacity.deselectLink
        )
        // Adjust the stroke weight to emphasise/de-emphasise nodes
        .style("stroke-width", (link) =>
          isConnected(clickedNode, link.target) ? "2px" : "1px"
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
          isConnected(clickedNode, node)
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
          isConnected(clickedNode, node)
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
    }

    // Event listener and handler for deselecting nodes. Resets styling
    d3.select(document).on("click", function () {
      onNodeSelect(null);
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
          return primaryNodeRadius;
        } else if (d.type === "secondary" && d.totalFundingUsd != null) {
          return getNodeRadius(d); // Dynamic size for secondary nodes based on funding amount
        } else {
          return 10; // Default size secondary nodes without funding info
        }
      })
      .attr("fill", (d) =>
        d.type === "primary"
          ? `url(#node-image-${d.id})`
          : colours.main.primary1
      ) // Use pattern for primary nodes to populate profile pictures
      .on("click", clickNode);

    // Append text to nodes and add general styling
    nodeElements
      .filter(
        (d) =>
          (d.type === "primary") |
          (d.type === "secondary" && getNodeRadius(d) >= 10)
      ) // Only show text for primary nodes and secondary nodes with larger than a certain size
      .append("text")
      .text((d) => d.name);

    nodeElements
      .filter((d) => d.type === "primary")
      .style("font-family", text.contentFocus.fontFamily)
      .style("font-size", text.contentFocus.fontSize)
      .style("font-weight", text.contentFocus.fontWeight)
      .style("fill", text.contentFocus.color);

    nodeElements
      .filter((d) => d.type === "secondary")
      .style("font-family", text.content.fontFamily)
      .style("font-size", text.content.fontSize)
      .style("font-weight", text.content.fontWeight)
      .style("fill", text.content.color);

    // Update primary node text styling, including splitting names into multiple lines
    nodeElements
      .filter((d) => d.type === "primary")
      .select("text")
      .each(function () {
        const text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          dy = parseFloat(text.attr("dy") || 0.35);

        text.text(null); // Clear the text once and manage via tspans

        if (words.length === 1) {
          let word = words[0];
          text
            .append("tspan")
            .attr("x", 0)
            .attr("y", 0)
            .attr("dy", `${dy}em`)
            .text(word);
        } else {
          let word,
            line = [],
            vw = window.innerWidth,
            scaleWidth = { x: vw * 0.02 + 65, y: vw * 0.02 + 24 },
            tspan = text
              .append("tspan")
              .attr("x", (d) => {
                const angle = Math.atan2(d.y - center.y, d.x - center.x);
                return Math.cos(angle) * scaleWidth.x;
              })
              .attr("y", (d) => {
                const angle = Math.atan2(d.y - center.y, d.x - center.x);
                return Math.sin(angle) * scaleWidth.y;
              })
              .style("text-anchor", "middle")
              .attr("dy", `${dy}em`);

          while (words.length > 0) {
            word = words.pop();
            line.push(word);
            tspan.text(line.join(" ")); // Update text in the existing tspan

            // Append new tspan for the new line
            if (tspan.node().getComputedTextLength() > 100 && line.length > 1) {
              line.pop(); // Remove last word that caused overflow
              tspan.text(line.join(" ")); // Set text to previous valid line
              line = [word]; // Start new line with last word
              tspan = text
                .append("tspan")
                .attr("x", (d) => {
                  const angle = Math.atan2(d.y - center.y, d.x - center.x);
                  return Math.cos(angle) * scaleWidth.x;
                })
                .attr("y", (d) => {
                  const angle = Math.atan2(d.y - center.y, d.x - center.x);
                  return Math.sin(angle) * scaleWidth.y;
                })
                .style("text-anchor", "middle")
                .text(word);
            }
          }
        }

        // Recalculate dy for each tspan to vertically center them
        let tspans = text.selectAll("tspan");
        let lineCount = tspans.size();
        let lineNumber = 0;
        tspans.each(function () {
          d3.select(this).attr(
            "dy",
            `${(lineNumber - lineCount / 2 + 0.5) * 1.1 + dy}em`
          );
          lineNumber++;
        });
      });

    // Update secondary node text styling
    nodeElements
      .filter((d) => d.type === "secondary")
      .select("text")
      .each(function (d) {
        const nodeRadius = getNodeRadius(d); // Calculate radius dynamically
        const maxWidth = nodeRadius * 2 - 5; // Subtract some padding
        wrapText(d3.select(this), maxWidth);
      })
      .style("text-anchor", "middle");

    d3.selectAll("text")
      .style("user-select", "none")
      .style("-webkit-user-select", "none")
      .style("-moz-user-select", "none")
      .style("-ms-user-select", "none")
      .style("pointer-events", "none");

    // Update configurations
    simulation.on("tick", () => {
      linkElements
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      nodeElements.attr("transform", (d) => `translate(${d.x}, ${d.y})`);
    });

    // Updates SVG size based on window size
    window.addEventListener("resize", resize);
  }, [data, networkGraphDimensions]); // Ensures effect is only run on mount and unmount

  if (error) {
    return <div>Error processing data</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div ref={d3Container} style={{ height: "100%", width: "100%" }}></div>
  );
}

export default NetworkGraph;
