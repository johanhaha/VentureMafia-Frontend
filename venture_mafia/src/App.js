import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import { colours, text } from "./styling.js";
import NetworkGraph from "./components/NetworkGraph.js";
import Sidebar from "./components/Sidebar.js";
import Footer from "./components/Footer.js";

var targetOrgUuid = "f7a3ff7d-5a7c-71c7-383d-6883b355f8b0"; // Set the default target uuid
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

function App() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [networkGraphDimensions, setNetworkGraphDimensions] = useState(null); // Used for passing down container dimensions for flex
  const containerRef = useRef(null);
  const [availableOrgs, setAvailableOrgs] = useState("");
  const [targetOrg, setTargetOrg] = useState("");
  const [alumniInfo, setAlumniInfo] = useState("");
  const [subsequentOrgsInfo, setSubsequentOrgsInfo] = useState("");
  const [relations, setRelations] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Helper fucntion to import data
  async function loadData(targetOrgUuid) {
    try {
      var [availableOrgsRaw, targetOrgRaw, alumniInfoRaw, subsequentOrgsInfoRaw, relationsRaw] =
        await Promise.all([
          fetch(`${BASE_URL}/available_orgs`).then((res) =>
            res.json()
          ),
          fetch(`${BASE_URL}/target_org/${targetOrgUuid}`).then((res) =>
            res.json()
          ),
          fetch(`${BASE_URL}/alumni_info/${targetOrgUuid}`).then((res) =>
            res.json()
          ),
          fetch(`${BASE_URL}/subsequent_orgs_info/${targetOrgUuid}`).then(
            (res) => res.json()
          ),
          fetch(`${BASE_URL}/relations/${targetOrgUuid}`).then((res) =>
            res.json()
          ),
        ]);
      setAvailableOrgs(availableOrgsRaw.data);
      setTargetOrg(targetOrgRaw.data);
      setAlumniInfo(alumniInfoRaw.data);
      setSubsequentOrgsInfo(subsequentOrgsInfoRaw.data);
      setRelations(relationsRaw.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError(true);
    }
  }

  useEffect(() => {
    loadData(targetOrgUuid);

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
    loadData(newTargetOrgUuid);

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
            availableOrgs={availableOrgs}
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
          <a
            href="https://www.linkedin.com/in/johan-torssell/"
            target="_blank"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            &copy;Johan Torssell
          </a>
        </p>
        <div style={{ height: "100%" }}>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;
