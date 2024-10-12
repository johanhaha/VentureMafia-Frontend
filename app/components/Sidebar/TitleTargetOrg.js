import DropdownTargetOrg from './DropdownTargetOrg';
import Tooltip from "./Tooltip.js";
import { text } from "../../styling.js";

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
