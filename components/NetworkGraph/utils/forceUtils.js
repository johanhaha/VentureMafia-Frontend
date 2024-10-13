import * as d3 from "d3";

let pullStrength = 1; // Increase to make forces stronger

// Force nodes to center
const forceTowardsCenter = (center) => {
  // Return a function that modifies nodes based on alpha
  return (alpha) => {
    d3.selectAll("circle").each(function (d) {
      if (d.type === "secondary") {
        d.vx += (center.x - d.x) * alpha * pullStrength;
        d.vy += (center.y - d.y) * alpha * pullStrength;
      }
    });
  };
};

// Initialises and applies all forces
export const initialiseForces = (data, center) => {
  const simulation = d3
    .forceSimulation(data.nodes)
    .force(
      "link",
      d3.forceLink(data.links).id((d) => d.id)
    )
    .force("forceTowardsCenter", forceTowardsCenter(center))
    .force("charge", d3.forceManyBody().strength(-20))
    .force(
      "collision",
      d3.forceCollide().radius((d) => d.radius * 1.8)
    )
    .alphaDecay(0.09)
    .alphaTarget(0.001)
    .alpha(0.1)
    .velocityDecay(0.4)
    .alphaMin(0.0010001);

  return simulation;
};
