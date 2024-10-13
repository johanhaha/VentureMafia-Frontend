import Head from "next/head";
import TargetOrgContent from "../../components/Sidebar/TargetOrgContent.js";

export default async function Page({ params }) {
  const { targetOrgName } = params;

  return (
    <>
      <Head>
        <title>Org Alumni Network</title>
        <meta
          name="description"
          content="A simple test page for displaying an organization's alumni network."
        />
      </Head>
      <TargetOrgContent targetOrgName={targetOrgName} />
    </>
  );
}
