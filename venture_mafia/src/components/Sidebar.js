import React, { useEffect } from "react";
import { ReactComponent as VMlogo } from "../VMlogo.svg";
import targetOrg from "../data/targetOrg.json";

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
      <VMlogo style={{ width: "60%", height: "auto" }} />
      <div>
        <h1>{targetOrg.orgName}</h1>
        <p>{targetOrg.shortDescription}</p>
        <ul>
          <li>
            HQ: {targetOrg.orgCity}, {targetOrg.orgCountryCode}
          </li>
          <li>Total funding: {formatToUSD(targetOrg.totalFundingUsd)}</li>
          <li>Founded: {epochToDate(targetOrg.foundedOn)}</li>
        </ul>
      </div>
      {/* Displaying information about selected primary nodes */}
      {selectedNodeData && selectedNodeData.type === "primary" && (
        <div>
          <h1>{selectedNodeData.name}</h1>
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
          <h1>{selectedNodeData.name}</h1>
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
