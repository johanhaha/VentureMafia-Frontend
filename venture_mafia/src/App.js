import React, { useState } from "react";
import "./App.css";
import NetworkGraph from "./components/NetworkGraph.js";
import Sidebar from "./components/Sidebar.js";

function App() {
  const [selectedNode, setSelectedNode] = useState(null);

  const handleNodeSelect = (nodeData) => {
    setSelectedNode(nodeData);
  };
  
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 3fr", // ratio between left panel and NetworkGraph
        height: "100vh",
        width: "100vw",
      }}
    >
      {/* Left panel */}
      <div
        style={{
          backgroundColor: "#f0f0f0",
        }}
      >
        <Sidebar selectedNodeData={selectedNode} />
      </div>
      {/* NetworkGraph */}
      <div>
        <NetworkGraph onNodeSelect={handleNodeSelect} />
      </div>
    </div>
  );
}

export default App;
