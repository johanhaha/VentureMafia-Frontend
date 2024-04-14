import React, { useEffect } from "react";
import { colours } from "../styling.js";
import targetOrg from "../data/targetOrg.json";
import { ReactComponent as VMlogo } from "../VMlogo.svg";

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
    month: "long",
  });
}

function Sidebar({ selectedNodeData }) {
  useEffect(() => {
    // Update sidebar based on nodeData
    console.log("Node Data Updated:", selectedNodeData);
  }, [selectedNodeData]);

  return (
    <div
      style={{
        gridArea: "1 / 1 / 2 / 2",
        display: "flex",
        flexDirection: "column", // Adjusted to stack the logo and text vertically
        justifyContent: "flex-start",
        alignItems: "flex-start",
        padding: "30px 50px 30px 50px",
      }}
    >
      <VMlogo
        style={{
          stroke: colours.main.primary1,
          width: "60%",
          height: "auto",
          marginBottom: "100px",
        }}
      />
      {!selectedNodeData && (
        <div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={targetOrg.orgLogoUrl}
              alt={targetOrg.orgName + " logo"}
              style={{
                width: "90px",
                height: "90px",
                objectFit: "cover",
                borderRadius: "45px",
              }}
            />
            <h1 style={{ marginLeft: "20px" }}>
              The {targetOrg.orgName} Mafia
            </h1>
          </div>
          <p>{targetOrg.shortDescription}</p>
          <ul>
            <li>
              HQ: {targetOrg.orgCity}, {targetOrg.orgCountryCode}
            </li>
            <li>Total funding: {formatToUSD(targetOrg.totalFundingUsd)}</li>
            <li>Founded: {epochToDate(targetOrg.foundedOn)}</li>
          </ul>
        </div>
      )}
      {/* Displaying information about selected primary nodes */}
      {selectedNodeData && selectedNodeData.type === "primary" && (
        <div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={selectedNodeData.personLogoUrl}
              alt={selectedNodeData.name + " logo"}
              style={{
                width: "90px",
                height: "90px",
                objectFit: "cover",
                borderRadius: "45px",
              }}
            />
            <h1 style={{ marginLeft: "20px" }}>{selectedNodeData.name}</h1>
          </div>
          <h2>Role at {targetOrg.orgName}</h2>
          {selectedNodeData.jobTitle}, {epochToDate(selectedNodeData.startedOn)}{" "}
          to {epochToDate(selectedNodeData.endedOn)}
        </div>
      )}
      {/* Displaying information about selected secondary nodes */}
      {selectedNodeData && selectedNodeData.type === "secondary" && (
        <div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={selectedNodeData.orgLogoUrl}
              alt={selectedNodeData.name + " logo"}
              style={{ width: "auto", height: "90px", borderRadius: "45px" }}
            />
            <h1 style={{ marginLeft: "20px" }}>{selectedNodeData.name}</h1>
          </div>

          <p>{selectedNodeData.shortDescription}</p>
          <ul>
            <li>
              HQ: {selectedNodeData.orgCity}, {selectedNodeData.orgCountryCode}
            </li>
            <li>
              Total funding: {formatToUSD(selectedNodeData.totalFundingUsd)}
            </li>
            <li>Founded: {epochToDate(selectedNodeData.foundedOn)}</li>
          </ul>
          {selectedNodeData &&
            selectedNodeData.type === "secondary" &&
            selectedNodeData.exitType === "ipo" && (
              <div>
                {selectedNodeData.name} went public{" "}
                {epochToDate(selectedNodeData.exitDate)}
                {selectedNodeData.exitValuation &&
                  " at a value of " +
                    formatToUSD(selectedNodeData.exitValuation)}
              </div>
            )}
          {selectedNodeData &&
            selectedNodeData.type === "secondary" &&
            selectedNodeData.exitType === "acquisition" && (
              <div>
                {selectedNodeData.name} was acquired on{" "}
                {epochToDate(selectedNodeData.exitDate)} by{" "}
                {selectedNodeData.acquirerName} for{" "}
                {formatToUSD(selectedNodeData.exitValuation)}
              </div>
            )}
        </div>
      )}
    </div>
  );
}

export default Sidebar;
