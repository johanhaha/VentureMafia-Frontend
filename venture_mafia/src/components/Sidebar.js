import React, { useEffect } from "react";
import { colours, opacity } from "../styling.js";
import targetOrg from "../data/targetOrg.json";
import { ReactComponent as VMlogo } from "../VMlogo.svg";

// Helper function to format as USD
function formatToUSD(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0, // No decimal points
    maximumFractionDigits: 0, // No decimal points
  }).format(value);
}

// Helper function to format epoch to date
function epochToDate(epoch) {
  return new Date(epoch).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
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
      <VMlogo style={{ stroke: colours.main.primary1, width: "60%", height: "auto", marginBottom: "100px" }} />
      {!selectedNodeData && (
        <div>
            <div style={{ display: "flex", alignItems: "center" }}>
                <img
                src={targetOrg.orgLogoUrl}
                alt={targetOrg.orgName + " logo"}
                style={{ width: "90px", height: "90px", objectFit: "cover", borderRadius: "45px" }}
                />
                <h1 style={{ marginLeft: "20px" }}>{"The " + targetOrg.orgName + " Mafia"}</h1>
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
              style={{ width: "90px", height: "90px", objectFit: "cover", borderRadius: "45px" }}
            />
            <h1 style={{ marginLeft: "20px" }}>{selectedNodeData.name}</h1>
          </div>
          <ul>
            <li>Job title: {selectedNodeData.jobTitle}</li>
            <li>Start date: {epochToDate(selectedNodeData.startedOn)}</li>
            <li>End date: {epochToDate(selectedNodeData.endedOn)}</li>
          </ul>
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
          <li>Total funding: {formatToUSD(selectedNodeData.totalFundingUsd)}</li>
          <li>Founded: {epochToDate(selectedNodeData.foundedOn)}</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
