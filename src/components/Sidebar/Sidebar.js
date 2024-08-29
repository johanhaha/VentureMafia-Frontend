import React, { useState, useEffect } from "react";
import TargetOrgSidebarContent from "./TargetOrgSidebarContent.js";
import PrimaryNodeSidebarContent from "./PrimaryNodeSidebarContent.js";
import SecondaryNodeSidebarContent from "./SecondaryNodeSidebarContent.js";
import { colours, text } from "../../styling.js";
import { ReactComponent as VMlogo } from "../../assets/VMlogo.svg";

// Helper function to format as USD and abbreviate
function formatToUSD(value) {
  let prefix = "$";
  let suffix = "";
  let abbreviatedNumber = value;
  if (value >= 1e9) {
    suffix = "bn";
    abbreviatedNumber = value / 1e9;
  } else if (value >= 1e6) {
    suffix = "m";
    abbreviatedNumber = value / 1e6;
  } else if (value >= 1e3) {
    suffix = "k";
    abbreviatedNumber = value / 1e3;
  }

  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: abbreviatedNumber < 10 ? 1 : 0,
  });

  return prefix + formatter.format(abbreviatedNumber) + suffix;
}

// Helper function to format epoch to date
function epochToDate(epoch) {
  return new Date(epoch).toLocaleDateString("en-US", {
    year: "numeric",
    // month: "long",
  });
}

function Sidebar({
  availableOrgs,
  targetOrg,
  onTargetOrgSelect,
  selectedNodeData,
}) {
  const [isOrgsLoaded, setIsOrgsLoaded] = useState(false);

  useEffect(() => {
    if (availableOrgs && availableOrgs.length > 0) {
      setIsOrgsLoaded(true);
    }
  }, [availableOrgs, setIsOrgsLoaded]);

  if (!isOrgsLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        gridArea: "1 / 1 / 2 / 2",
        display: "flex",
        flexDirection: "column", // Adjusted to stack the logo and text vertically
        justifyContent: "flex-start",
        alignItems: "flex-start",
        padding: "2vw",
      }}
    >
      <VMlogo
        style={{
          stroke: colours.main.primary1,
          width: "70%",
          height: "auto",
          marginBottom: "3vw",
        }}
        alt="Venture Mafia logo"
      />

      {!selectedNodeData && (
        <TargetOrgSidebarContent
          targetOrg={targetOrg}
          availableOrgs={availableOrgs}
          onTargetOrgSelect={onTargetOrgSelect}
          epochToDate={epochToDate}
          formatToUSD={epochToDate}
        />
      )}
      {/* Displaying information about selected primary nodes */}
      {selectedNodeData && selectedNodeData.type === "primary" && (
        <PrimaryNodeSidebarContent
          targetOrg={targetOrg}
          selectedNodeData={selectedNodeData}
          epochToDate={epochToDate}
        />
      )}
      {/* Displaying information about selected secondary nodes */}
      {selectedNodeData && selectedNodeData.type === "secondary" && (
        <SecondaryNodeSidebarContent
          selectedNodeData={selectedNodeData}
          epochToDate={epochToDate}
          formatToUSD={formatToUSD}
        />
      )}
    </div>
  );
}

export default Sidebar;
