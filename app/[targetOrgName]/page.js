// src/app/[targetOrgName]/page.js
import Head from "next/head";
import { loadAvailableOrgs } from "../components/Sidebar/utils";
import { loadData } from "../components/Sidebar/utils";

const targetOrgName = "PayPal";



export default async function Test() {
  const availableOrgs = await loadAvailableOrgs(); // Server-side fetch

  const [targetOrg, alumniInfo, subsequentOrgsInfo, relations] = await loadData(
    availableOrgs.find((org) => org.label === targetOrgName).value
  ); // Server-side fetch
  console.log("targetOrg", targetOrg);

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
        <div
          style={{
            padding: "20px",
          }}
        >
          <h2>Sidebar</h2>
          <ul>
            <li>ExampleOrg</li>
            <li>AnotherOrg</li>
            {availableOrgs.map((org) => (
              <li key={org.value}>{org.label}</li>
            ))}
          </ul>
        </div>

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
