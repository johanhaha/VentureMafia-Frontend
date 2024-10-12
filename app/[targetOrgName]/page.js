// src/app/[targetOrgName]/page.js
import Head from "next/head";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3000";

// Helper fucntion to import available organisations
async function loadAvailableOrgs() {
  try {
    const response = await fetch(`${BASE_URL}/available_orgs`);
    const availableOrgsRaw = await response.json();
    console.log(availableOrgsRaw.data);
    return availableOrgsRaw.data;
  } catch (err) {
    console.error("Failed to fetch data:", err);
    return [];
  }
}

export default async function Test() {
  const availableOrgs = await loadAvailableOrgs(); // Server-side fetch

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
