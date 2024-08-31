import React, { useState, useEffect } from "react";
import TargetOrgContent from "./TargetOrgContent.js";
import PrimaryNodeContent from "./PrimaryNodeContent.js";
import SecondaryNodeContent from "./SecondaryNodeContent.js";
import { epochToDate, formatToUSD} from "./utils.js";
import { colours } from "../../styling.js";
import { ReactComponent as VMlogo } from "../../assets/VMlogo.svg";

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
        <TargetOrgContent
          targetOrg={targetOrg}
          availableOrgs={availableOrgs}
          onTargetOrgSelect={onTargetOrgSelect}
          epochToDate={epochToDate}
          formatToUSD={formatToUSD}
        />
      )}
      {/* Displaying information about selected primary nodes */}
      {selectedNodeData && selectedNodeData.type === "primary" && (
        <PrimaryNodeContent
          targetOrg={targetOrg}
          selectedNodeData={selectedNodeData}
          epochToDate={epochToDate}
        />
      )}
      {/* Displaying information about selected secondary nodes */}
      {selectedNodeData && selectedNodeData.type === "secondary" && (
        <SecondaryNodeContent
          selectedNodeData={selectedNodeData}
          epochToDate={epochToDate}
          formatToUSD={formatToUSD}
        />
      )}
    </div>
  );
}

export default Sidebar;
