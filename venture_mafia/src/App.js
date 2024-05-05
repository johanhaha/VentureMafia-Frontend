import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import { colours, text } from "./styling.js";
import NetworkGraph from "./components/NetworkGraph.js";
import Sidebar from "./components/Sidebar.js";
import Footer from "./components/Footer.js";

function App() {
  const [targetOrgUuid, setTargetOrgUuid] = useState(
    "96ab87ca-00b5-2ebc-f218-86262954e320"
  );
  const [selectedNode, setSelectedNode] = useState(null);
  const [networkGraphDimensions, setNetworkGraphDimensions] = useState(null); // Used for passing down container dimensions for flex
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      setNetworkGraphDimensions({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      });
    }
  }, []); // Empty dependency array to ensure this runs only once

  // Handler for selecting new node
  const handleNodeSelect = (nodeData) => {
    setSelectedNode(nodeData);
  };

  // Handler for setting new target organisation
  const handleTargetOrgSelect = (newTargetOrgUuid) => {
    setTargetOrgUuid(newTargetOrgUuid);
  };

  return (
    <div style={{ backgroundColor: colours.neutrals.background }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 3fr",
          height: "calc(100vh - 50px)", // Adjust height to account for footer
          width: "100vw",
        }}
      >
        {/* Left panel */}
        <div>
          <Sidebar
            targetOrgUuid={targetOrgUuid}
            onTargetOrgSelect={handleTargetOrgSelect}
            selectedNodeData={selectedNode}
          />
        </div>
        {/* NetworkGraph */}
        <div ref={containerRef}>
          {networkGraphDimensions ? ( // Checks if networkGraphDimensions has been set to ensure proper size of graph
            <NetworkGraph
              targetOrgUuid={targetOrgUuid}
              onNodeSelect={handleNodeSelect}
              networkGraphDimensions={networkGraphDimensions}
            />
          ) : (
            <div> Loading graph... </div>
          )}
        </div>
      </div>
      {/* Footer */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 3fr",
          width: "100vw",
          height: "50px",
          overflow: "hidden",
        }}
      >
        <p
          style={{
            ...text.contentFocus,
            paddingLeft: "20px",
            fontSize: "20px",
          }}
        >
          &copy;Johan Torssell
        </p>
        <div style={{ height: "100%" }}>
          <Footer selectedNodeData={selectedNode} />
        </div>
      </div>
    </div>
  );
}

export default App;
