// src/app/[targetOrgName]/page.js
import Head from "next/head";
import { loadAvailableOrgs } from "../components/Sidebar/utils";
import { loadData } from "../components/Sidebar/utils";
import Sidebar from "../components/Sidebar/Sidebar";

export default async function Page({ params }) {
  const { targetOrgName } = params;
  console.log("targetOrgName", targetOrgName);
  //   const [selectedNode, setSelectedNode] = useState(null);
  const selectedNode = null;

  const availableOrgs = await loadAvailableOrgs(); // Server-side fetch

  const [targetOrg, alumniInfo, subsequentOrgsInfo, relations] = await loadData(
    availableOrgs.find((org) => org.label === targetOrgName).value
  ); // Server-side fetch

  return (
    <>
      <Head>
        <title>Org Alumni Network</title>
        <meta
          name="description"
          content="A simple test page for displaying an organization's alumni network."
        />
      </Head>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 3fr",
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* Static Sidebar */}
        <Sidebar
          availableOrgs={availableOrgs}
          targetOrg={targetOrg}
          selectedNodeData={selectedNode}
        />

        {/* Static NetworkGraph Area */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p>Network Graph will be displayed here.</p>
        </div>
      </div>
    </>
  );
}
