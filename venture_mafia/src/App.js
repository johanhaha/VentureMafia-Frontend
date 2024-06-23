import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import { colours, text } from "./styling.js";
import NetworkGraph from "./components/NetworkGraph.js";
import Sidebar from "./components/Sidebar.js";
import Footer from "./components/Footer.js";

var targetOrgUuid = "96ab87ca-00b5-2ebc-f218-86262954e320"; // Set the default target uuid

// Helper fucntion to import data
function loadData(targetOrgUuid) {
  return Promise.all([
    fetch("/data/targetOrg_" + targetOrgUuid + ".json").then((res) =>
      res.json()
    ),
    fetch("/data/alumniInfo_" + targetOrgUuid + ".json").then((res) =>
      res.json()
    ),
    fetch("/data/subsequentOrgsInfo_" + targetOrgUuid + ".json").then((res) =>
      res.json()
    ),
    fetch("/data/relations_" + targetOrgUuid + ".json").then((res) =>
      res.json()
    ),
  ]);
}

function App() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [networkGraphDimensions, setNetworkGraphDimensions] = useState(null); // Used for passing down container dimensions for flex
  const containerRef = useRef(null);
  const [targetOrg, setTargetOrg] = useState("");
  const [alumniInfo, setAlumniInfo] = useState("");
  const [subsequentOrgsInfo, setSubsequentOrgsInfo] = useState("");
  const [relations, setRelations] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadData(targetOrgUuid)
      .then(([targetOrg, alumniInfo, subsequentOrgsInfo, relations]) => {
        setTargetOrg(targetOrg[0]);
        setAlumniInfo(alumniInfo);
        setSubsequentOrgsInfo(subsequentOrgsInfo);
        setRelations(relations); // Update state with content from data2.json
        setLoading(false); // Set loading to false once data is loaded
      })
      .catch((err) => {
        console.error("Failed to fetch data:", err);
        setError(true);
        setLoading(false);
      });

    if (containerRef.current) {
      setNetworkGraphDimensions({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      });
    }
  }, []); // Empty dependency array to ensure this runs only once

  if (loading) console.log("Waiting for data...");
  if (error) console.error("Error processing data (App):", error);

  // Handler for selecting new node
  const handleNodeSelect = (nodeData) => {
    setSelectedNode(nodeData);
  };

  // Handler for setting new target organisation
  const handleTargetOrgSelect = (newTargetOrgUuid) => {
    loadData(newTargetOrgUuid)
      .then(([targetOrg, alumniInfo, subsequentOrgsInfo, relations]) => {
        setTargetOrg(targetOrg[0]);
        setAlumniInfo(alumniInfo);
        setSubsequentOrgsInfo(subsequentOrgsInfo);
        setRelations(relations);
        setLoading(false); // Set loading to false once data is loaded
      })
      .catch((err) => {
        console.error("Failed to fetch data:", err);
        setError(true);
        setLoading(false);
      });

    if (containerRef.current) {
      setNetworkGraphDimensions({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      });
    }
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
            targetOrg={targetOrg}
            onTargetOrgSelect={handleTargetOrgSelect}
            selectedNodeData={selectedNode}
          />
        </div>
        {/* NetworkGraph */}
        <div ref={containerRef}>
          {networkGraphDimensions ? ( // Checks if networkGraphDimensions has been set to ensure proper size of graph
            <NetworkGraph
              targetOrg={targetOrg}
              alumniInfo={alumniInfo}
              subsequentOrgsInfo={subsequentOrgsInfo}
              relations={relations}
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
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;
