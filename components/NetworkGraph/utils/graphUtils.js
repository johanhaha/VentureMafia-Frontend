import * as d3 from "d3";

// Support function to get the ID of the source element of a link
export const getSourceId = (link) => {
  return typeof link.source === "object" ? link.source.id : link.source;
};

// Support function to get the ID of the target element of a link
export const getTargetId = (link) => {
  return typeof link.target === "object" ? link.target.id : link.target;
};

// Helper function to calculate the number of connections
export const calculateNodeDegree = (nodes, links) => {
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

// Helper function to sort nodes based on number of connections
export const sortNodesByDegree = (nodes, degreeMap) => {
  return nodes.sort((a, b) => degreeMap[b.id] - degreeMap[a.id]);
};

// Evenly distribute the nodes in the list based on degree
export const reorderNodes = (nodes, numBins) => {
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
};

// Helper function to calculate the center
export const initialiseCenter = (d3Container) => {
  let center = {
    x: d3Container.current.parentNode.clientWidth / 2,
    y: d3Container.current.parentNode.clientHeight / 2,
  };
  return center;
};

// Calculate a scaling factor based on the number of nodes. I.e fewer nodes --> Larger
const getNodeCountScale = (nodeCount) => {
  const minNodes = 20;
  const maxNodes = 300;

  const nodeCountScale = d3
    .scaleLinear()
    // .exponent(194) // Tune this for good secondary node sizes
    .domain([minNodes, maxNodes])
    .range([2, 1]) // Tune this for good secondary node sizes
    .clamp(true);

  return nodeCountScale(nodeCount);
};

// Helper function to get the node radius
export const getNodeRadius = (
  totalFundingUsd,
  nodes,
  networkGraphDimensions,
  secondaryNodeRadiusFlex,
  secondaryNodeRadiusMax
) => {
  const fundingValues = nodes.map((d) => d.totalFundingUsd);
  const fundingExtent = d3.extent(fundingValues); // [min, max] of funding
  const scalingFactor = getNodeCountScale(nodes.length); // * getVarianceScale(fundingValues);

  // Scale the node size according to the funding extent
  const sizeScale = d3
    .scalePow()
    .exponent(0.45) // Tune this for good secondary node sizes
    .domain(fundingExtent)
    .range([
      3.5 * scalingFactor,
      Math.min(
        (networkGraphDimensions.width * secondaryNodeRadiusFlex) / 100,
        secondaryNodeRadiusMax
      ) * scalingFactor,
    ])
    .clamp(true); // Dynamically setting maximum secondary node radius

  // Adjust the node size based on total node size and number of nodes
  const maxTotalNodeSize =
    (nodes.length * (networkGraphDimensions.width * secondaryNodeRadiusFlex)) /
    230;
  const initialNodeSizes = nodes.map((node) => sizeScale(node.totalFundingUsd));
  const totalNodeSize = d3.sum(initialNodeSizes);
  const adjustmentFactor =
    totalNodeSize > maxTotalNodeSize ? maxTotalNodeSize / totalNodeSize : 1;
  const adjustedNodeSize = sizeScale(totalFundingUsd) * adjustmentFactor;

  return adjustedNodeSize;
};

// Helper function to check if two nodes are linked
export const isConnected = (linkedByIndex, a, b) => {
  return (
    linkedByIndex[`${a.id},${b.id}`] ||
    linkedByIndex[`${b.id},${a.id}`] ||
    a.id === b.id
  );
};

// Helper function to ge tthe N most funded organisations
export const getMostFundedOrgs = (subsequentOrgsInfo, orgsCount) => {
  return subsequentOrgsInfo
    .sort((a, b) => b.totalFundingUsd - a.totalFundingUsd)
    .slice(0, orgsCount)
    .map((org) => org.orgName);
};

// Helper function to ge tthe N most connected alumni
export const getMostConnectedAlumni = (
  alumniInfo,
  relations,
  alumniCount
) => {
  const personCount = relations.reduce((acc, { personUuid }) => {
    acc[personUuid] = (acc[personUuid] || 0) + 1; // Count occurrences
    return acc;
  }, {});

  const topPersonUuids = Object.entries(personCount)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, alumniCount)
    .map(([personUuid]) => personUuid);
    
  return topPersonUuids.map((personUuid) => {
    const person = alumniInfo.find(
      (person) => person.personUuid === personUuid
    );
    return person ? person.personName : null; // Return personName if found
  });
};

// Handler for selecting new node
export const handleNodeSelect = (nodeData) => {
  console.log("New node selected", nodeData)
  // router.push(`/${selection.label}`);

  // logEvent(analytics, "dropdown_item_select", {
  //   item_id: selection.value,
  //   item_name: selection.label,
  //   dropdown_name: "target_org_selector",
  // }); // Log which item was selected
};