import React from "react";
import "./App.css";
import NetworkGraph from "./components/NetworkGraph.js";
import Sidebar from "./components/Sidebar.js";

function App() {
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
        <Sidebar />
      </div>
      {/* NetworkGraph */}
      <div>
        <NetworkGraph />
      </div>
    </div>
  );
}

export default App;
