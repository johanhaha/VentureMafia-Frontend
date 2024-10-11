// src/app/[targetOrgName]/page.js
import Head from 'next/head';

export default function OrgAlumniContent() {
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
          display: 'grid',
          gridTemplateColumns: '1fr 3fr',
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {/* Static Sidebar */}
        <div
          style={{
            padding: '20px',
          }}
        >
          <h2>Sidebar</h2>
          <ul>
            <li>ExampleOrg</li>
            <li>AnotherOrg</li>
          </ul>
        </div>

        {/* Static NetworkGraph Area */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <p>Network Graph will be displayed here.</p>
        </div>
      </div>
    </>
  );
}
