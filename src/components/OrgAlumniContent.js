import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Layout from "./Layout.js";
import NetworkGraph from "./NetworkGraph/NetworkGraph.js";
import Sidebar from "./Sidebar/Sidebar.js";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3000";

function OrgAlumniContent({ defaultTargetOrgName }) {
  const { targetOrgName } = useParams();
  const navigate = useNavigate();

  const [selectedNode, setSelectedNode] = useState(null);
  const [networkGraphDimensions, setNetworkGraphDimensions] = useState(null); // Used for passing down container dimensions for flex
  const containerRef = useRef(null);
  const [availableOrgs, setAvailableOrgs] = useState("");
  const [targetOrg, setTargetOrg] = useState("");
  const [alumniInfo, setAlumniInfo] = useState("");
  const [subsequentOrgsInfo, setSubsequentOrgsInfo] = useState("");
  const [relations, setRelations] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingAvailableOrgs, setLoadingAvailableOrgs] = useState(true);
  const [error, setError] = useState(false);

  // Helper fucntion to import available organisations
  async function loadAvailableOrgs() {
    try {
      var [availableOrgsRaw] = await Promise.all([
        fetch(`${BASE_URL}/available_orgs`).then((res) => res.json()),
      ]);
      setAvailableOrgs(availableOrgsRaw.data);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError(true);
    }
  }

  // Helper fucntion to import data
  async function loadData(targetOrgUuid) {
    try {
      var [targetOrgRaw, alumniInfoRaw, subsequentOrgsInfoRaw, relationsRaw] =
        await Promise.all([
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

  // Loads availableOrgs before everything else to enable routing
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingAvailableOrgs(true);
        await loadAvailableOrgs();
        setLoadingAvailableOrgs(false);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError(true);
      }
    };
    fetchData();
  }, []); // Empty dependency array to ensure this runs only once

  useEffect(() => {
    if (!loadingAvailableOrgs && !error) {
      if (containerRef.current) {
        setNetworkGraphDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }

      // Go to default organisation if none is selected
      if (
        !targetOrgName |
        !availableOrgs.some((org) => org.label === targetOrgName)
      ) {
        navigate(`/${defaultTargetOrgName}`);
      } else {
        loadData(
          availableOrgs.find((org) => org.label === targetOrgName).value
        );
      }
    }
  }, [
    loading,
    error,
    targetOrgName,
    defaultTargetOrgName,
    navigate,
    availableOrgs,
    loadingAvailableOrgs,
  ]);

  if (loading) console.log("Waiting for data...");
  if (error) console.error("Error processing data (App):", error);

  // Handler for selecting new node
  const handleNodeSelect = (nodeData) => {
    setSelectedNode(nodeData);
  };

  // Handler for setting new target organisation
  const handleTargetOrgSelect = (selection) => {
    // Update the URL to reflect the selected organisation
    navigate(`/${selection.label}`);

    // Set network graph dimensions based on the container's size
    if (containerRef.current) {
      setNetworkGraphDimensions({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      });
    }
  };

  return (
    <Layout>
      <Helmet>
        {availableOrgs && availableOrgs.length > 0 && (
          <meta
            name="keywords"
            content={`venture mafia, startup mafia, founder factory, startup founders, startup networks, startup alumni, venture capital, ${availableOrgs
              .map((org) => org.label)
              .join(" Mafia, ")}`}
          />
        )}
      </Helmet>
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
    </Layout>
  );
}

export default OrgAlumniContent;
