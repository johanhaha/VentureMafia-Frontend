import React, { useState } from "react";
import "./App.css";
import NetworkGraph from "./components/NetworkGraph.js";
import Sidebar from "./components/Sidebar.js";
import Footer from "./components/Footer.js";

function App() {
  const [selectedNode, setSelectedNode] = useState(null);

  const handleNodeSelect = (nodeData) => {
    setSelectedNode(nodeData);
  };

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 3fr",
          height: "calc(100vh - 50px)", // Adjust height to account for footer
          width: "100vw",
        }}
      >
        {/* Left panel */}
        <div style={{ backgroundColor: "#f0f0f0" }}>
          <Sidebar selectedNodeData={selectedNode} />
        </div>
        {/* NetworkGraph */}
        <div>
          <NetworkGraph onNodeSelect={handleNodeSelect} />
        </div>
      </div>
      {/* Footer */}
      <div style={{ width: "100vw", height: "50px", overflow: "hidden" }}>
        Johan Torssell
        <div style={{ width: "75%", float: "right", height: "100%" }}>
          <Footer selectedNodeData={selectedNode} />
        </div>
      </div>
    </div>
  );
}

export default App;
