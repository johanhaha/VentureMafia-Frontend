import Head from "next/head";
import Sidebar from "../../components/Sidebar/Sidebar";
import NetworkGraph from "../../components/NetworkGraph/NetworkGraph";
import Footer from "../../components/Footer/Footer";
import { loadAvailableOrgs } from "../../components/Sidebar/utils";
import { loadData } from "../../components/Sidebar/utils";
import { colours } from "../styling";

export default async function RootLayout({ params, children }) {
  const { targetOrgName } = params;
  console.log("targetOrgName", targetOrgName);
  const selectedNode = null;

  const availableOrgs = await loadAvailableOrgs(); // Server-side fetch

  const [alumniInfo, subsequentOrgsInfo, relations] = await loadData(
    availableOrgs.find((org) => org.label === targetOrgName).value
  ); // Server-side fetch
  return (
    <html lang="en">
      <Head>
        <title>Org Alumni Network</title>
        <meta
          name="description"
          content="A simple test page for displaying an organization's alumni network."
        />
      </Head>
      <body style={{ margin: 0, backgroundColor: colours.neutrals.background }}>
        {/* Main Content */}
        <main
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 3fr",
            height: "calc(100vh - 50px)", // Adjust height to account for footer
            width: "100vw",
          }}
        >
          {/* Static Sidebar area */}
          <Sidebar
            availableOrgs={availableOrgs}
            selectedNodeData={selectedNode}
          >
            {children}
          </Sidebar>
          {/* Static NetworkGraph Area */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <NetworkGraph
              targetOrgName={targetOrgName}
              alumniInfo={alumniInfo}
              subsequentOrgsInfo={subsequentOrgsInfo}
              relations={relations}
            />
          </div>
        </main>
        <Footer />
      </body>
    </html>
  );
}
