import dynamic from 'next/dynamic';
import Tooltip from "./Tooltip.js";
import { text } from "../../styling.js";

// Dynamically import DropdownTargetOrg without SSR
const DropdownTargetOrg = dynamic(() => import("./DropdownTargetOrg"), {
  ssr: false, // Disable server-side rendering for this component
});

function TitleTargetOrg({ availableOrgs, targetOrg }) {
  const tooltipDefaultOpen = true;

  return (
    <h1
      style={{
        ...text.header,
        display: "flex",
        alignItems: "center",
      }}
      alt={`The ${targetOrg.orgName} Mafia`}
      aria-label={`The ${targetOrg.orgName} Mafia`}
    >
      <span>The</span>
      <DropdownTargetOrg availableOrgs={availableOrgs} targetOrg={targetOrg} />
      <Tooltip tooltipDefaultOpen={tooltipDefaultOpen} />
      <span>Mafia</span>
    </h1>
  );
}

export default TitleTargetOrg;
