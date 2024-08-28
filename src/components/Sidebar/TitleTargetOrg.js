import React, { useState } from "react";
import DropdownTargetOrg from "./DropdownTargetOrg.js";
import Tooltip from "./Tooltip.js";
import { analytics, logEvent } from "../../firebase.js";
import { text } from "../../styling.js";

function TitleTargetOrg({ availableOrgs, targetOrg, onTargetOrgSelect }) {
  const [tooltipDefaultOpen, setTooltipDefaultOpen] = useState(true); // Used for only showing the tooltip if the user hasn't picked a company

  // Callback function to set tartget organisation
  function handleTargetOrgSelection(selection) {
    onTargetOrgSelect(selection.value);
    setTooltipDefaultOpen(false); // Default have tooltip closed after user selection

    logEvent(analytics, "dropdown_item_select", {
      item_id: selection.value,
      item_name: selection.label,
      dropdown_name: "target_org_selector",
    }); // Log which item was selected
  }

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
      <DropdownTargetOrg
        availableOrgs={availableOrgs}
        targetOrg={targetOrg}
        handleTargetOrgSelection={handleTargetOrgSelection}
      />
      <Tooltip tooltipDefaultOpen={tooltipDefaultOpen} />
      <span>Mafia</span>
    </h1>
  );
}

export default TitleTargetOrg;
