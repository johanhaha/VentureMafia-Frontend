import Head from "next/head";
import PrimaryNodeContent from "../../../../components/Sidebar/PrimaryNodeContent.js";

export default async function Page({ params }) {
  console.log("paramsHÄÄ", params);
  const { targetOrgName, personName } = params;

  return (
    <>
      <Head>
        <title>Org Alumni Network</title>
        <meta
          name="description"
          content="A simple test page for displaying an organization's alumni network."
        />
      </Head>
      <PrimaryNodeContent targetOrgName={targetOrgName} personName = {personName} />
    </>
  );
}
