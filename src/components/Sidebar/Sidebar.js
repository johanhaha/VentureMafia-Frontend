import React, { useState, useEffect } from "react";
import TitleTargetOrg from "./TitleTargetOrg.js";
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
        <div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "left",
            }}
          >
            <img
              src={targetOrg.orgLogoUrl}
              alt={`${targetOrg.orgName} logo`}
              style={{
                width: "90px",
                height: "90px",
                objectFit: "contain",
                borderRadius: "45px",
                marginRight: "20px",
              }}
            />
            <TitleTargetOrg
              availableOrgs={availableOrgs}
              targetOrg={targetOrg}
              onTargetOrgSelect={onTargetOrgSelect}
            />
          </div>
          <p style={text.contentFocus}>{targetOrg.shortDescription}</p>
          <ul style={text.content}>
            <li>
              HQ: {targetOrg.orgCity}, {targetOrg.orgCountryCode}
            </li>
            <li>Total funding: {formatToUSD(targetOrg.totalFundingUsd)}</li>
            <li>Founded: {epochToDate(targetOrg.foundedOn)}</li>
          </ul>
          {/* Display IPO info */}
          {targetOrg.exitType === "ipo" && targetOrg.exitDate && (
            <div style={text.content}>
              {targetOrg.orgName} went public {epochToDate(targetOrg.exitDate)}
              {targetOrg.exitValuation &&
                " at a value of " + formatToUSD(targetOrg.exitValuation)}
            </div>
          )}
          {/* Display acquisition info */}
          {targetOrg.exitType === "acquisition" && targetOrg.exitDate && (
            <div style={text.content}>
              {targetOrg.orgName} was acquired {epochToDate(targetOrg.exitDate)}{" "}
              by {targetOrg.acquirerName}
              {targetOrg.exitValuation &&
                " for " + formatToUSD(targetOrg.exitValuation)}
            </div>
          )}
        </div>
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
