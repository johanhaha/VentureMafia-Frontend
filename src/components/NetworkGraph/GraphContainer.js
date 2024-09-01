import { useEffect, useRef } from "react";
import * as d3 from "d3";

const GraphContainer = ({ width, height, d3Container, children }) => {
  const containerRef = useRef();  // Ref to the container div

  useEffect(() => {
    if (!containerRef.current) return;  // Check if the container div is available

    // Select or create the SVG inside the container
    let svg = d3.select(containerRef.current).select("svg");

    if (svg.empty()) {
      // Create the SVG container if it doesn't exist
      svg = d3
        .select(containerRef.current)
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("role", "img") // For SEO
        .attr("aria-label", "Network graph of successful startup alumni networks")
        .attr(
          "desc",
          "This network graph illustrates the founders and early executives of successful startups and the companies they have subsequently started, worked at, invested in, advised, or served on the board of. It includes the PayPal Mafia, Skype Mafia, eBay Mafia, and LinkedIn Mafia with people such as Elon Musk, Peter Thiel, Reid Hoffman, and Niklas Zennström."
        ); // For SEO

      // Assign the created SVG element to the d3Container ref for D3 manipulations
      d3Container.current = svg.node();
    }

    // Cleanup on component unmount
    return () => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
      d3.select(containerRef.current).selectAll("*").remove();
    };
  }, [width, height, d3Container]);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      {children}
    </div>
  );
};

export default GraphContainer;
