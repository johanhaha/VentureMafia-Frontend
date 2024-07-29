import React, { useState, useEffect } from "react";
import { colours, text } from "../styling.js";
import Select from "react-select";
import { FontAwesomeIcon } from "../fontAwesome";
import { Tooltip } from "react-tooltip";

import { ReactComponent as VMlogo } from "../assets/VMlogo.svg";

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

function Sidebar({
  availableOrgs,
  targetOrg,
  onTargetOrgSelect,
  selectedNodeData,
}) {
  const [isOrgsLoaded, setIsOrgsLoaded] = useState(false);
  const [tooltipDefaultOpen, setTooltipDefaultOpen] = useState(true); // Used for only showing the tooltip if the user hasn't picked a company

  useEffect(() => {
    if (availableOrgs && availableOrgs.length > 0) {
      setIsOrgsLoaded(true);
    }
  }, [availableOrgs]);

  // Callback function to set tartget organisation
  function setTargetOrg(newTargetOrgUuid) {
    onTargetOrgSelect(newTargetOrgUuid);
  }

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
          width: "60%",
          height: "auto",
          marginBottom: "3vw",
        }}
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
              alt={targetOrg.orgName + " logo"}
              style={{
                width: "90px",
                height: "90px",
                objectFit: "cover",
                borderRadius: "45px",
                marginRight: "20px",
              }}
            />
            <h1
              style={{
                ...text.header,
                display: "flex",
                alignItems: "center",
              }}
            >
              <span>The</span>
              <Select
                options={availableOrgs}
                classNamePrefix="react-select"
                isSearchable={true}
                value={availableOrgs.find(
                  (option) => option.value === targetOrg.orgUuid
                )}
                onChange={(selection) => {
                  setTargetOrg(selection.value);
                  setTooltipDefaultOpen(false); // Default have tooltip closed after user selection
                }}
                components={{
                  IndicatorsContainer: () => null,
                }}
                noOptionsMessage={() => "Unavailable"}
                styles={{
                  container: (base) => ({
                    ...base,
                    flex: "1 0 auto",
                    margin: "0 10px",
                  }),
                  control: (base) => ({
                    ...base,
                    borderColor: colours.main.primary1,
                    borderRadius: "10px",
                    boxShadow: "none",
                    backgroundColor: "none",
                    "&:hover": { borderColor: colours.main.primary1 },
                    minHeight: "initial",
                  }),
                  option: (base) => ({
                    ...base,
                    fontSize: 12,
                  }),
                  noOptionsMessage: (base) => ({
                    ...base,
                    fontSize: 12,
                  }),
                  menu: (base) => ({
                    ...base,
                    backgroundColor: colours.neutrals.background,
                    borderRadius: "10px",
                    padding: 0,
                  }),
                  menuList: (base) => ({
                    ...base,
                    borderRadius: "10px",
                    margin: 0,
                    paddingTop: 0,
                    paddingBottom: 0,
                  }),
                }}
                theme={(theme) => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary: colours.main.primary1,
                    primary25: colours.main.secondary1,
                    primary50: colours.main.secondary1,
                  },
                })}
              />
              <Tooltip
                anchorSelect=".react-select__control"
                content="Select company here!"
                border="1px solid grey"
                defaultIsOpen={tooltipDefaultOpen}
                style={{
                  padding: "7px",
                  backgroundColor: "transparent",
                  borderRadius: "10px",
                  ...text.contentUnfocus,
                }}
              />
              <span>Mafia</span>
            </h1>
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
              {targetOrg.orgName} was acquired on{" "}
              {epochToDate(targetOrg.exitDate)} by {targetOrg.acquirerName}
              {targetOrg.exitValuation &&
                " for " + formatToUSD(targetOrg.exitValuation)}
            </div>
          )}
        </div>
      )}
      {/* Displaying information about selected primary nodes */}
      {selectedNodeData && selectedNodeData.type === "primary" && (
        <div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "left",
            }}
          >
            {selectedNodeData.personLogoUrl && (
              <img
                src={selectedNodeData.personLogoUrl}
                alt={selectedNodeData.name + " logo"}
                style={{
                  width: "90px",
                  height: "90px",
                  objectFit: "cover",
                  borderRadius: "45px",
                  marginRight: "20px",
                }}
              />
            )}
            {!selectedNodeData.personLogoUrl && (
              <FontAwesomeIcon
                icon={["far", "user"]}
                style={{
                  width: "70px",
                  height: "70px",
                  marginLeft: "10px",
                  marginRight: "30px",
                  marginTop: "10px",
                  marginBottom: "10px",
                }}
              />
            )}
            <h1 style={{ ...text.header }}>{selectedNodeData.name}</h1>
          </div>
          <h2 style={text.subHeader}>Role at {targetOrg.orgName}</h2>
          <p style={text.contentFocus}>
            {selectedNodeData.jobTitle}
            {/* If both start and end dates exist */}
            {selectedNodeData.startedOn &&
              selectedNodeData.endedOn &&
              ", " +
                epochToDate(selectedNodeData.startedOn) +
                " to " +
                epochToDate(selectedNodeData.endedOn)}
            {/* If only start date exist */}
            {selectedNodeData.startedOn &&
              !selectedNodeData.endedOn &&
              ", since " + epochToDate(selectedNodeData.startedOn)}
            {/* If only end date exist */}
            {!selectedNodeData.startedOn &&
              selectedNodeData.endedOn &&
              ", until " + epochToDate(selectedNodeData.endedOn)}
          </p>
        </div>
      )}
      {/* Displaying information about selected secondary nodes */}
      {selectedNodeData && selectedNodeData.type === "secondary" && (
        <div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "left",
            }}
          >
            {selectedNodeData.orgLogoUrl && (
              <img
                src={selectedNodeData.orgLogoUrl}
                alt={selectedNodeData.name + " logo"}
                style={{
                  maxWidth: "12vw",
                  maxHeight: "90px",
                  width: "auto",
                  height: "auto",
                  objectFit: "contain",
                  borderRadius: "45px",
                  marginRight: "20px",
                }}
              />
            )}
            {!selectedNodeData.orgLogoUrl && (
              <FontAwesomeIcon
                icon={["far", "building"]}
                style={{
                  maxWidth: "12vw",
                  maxHeight: "90px",
                  width: "auto",
                  height: "auto",
                  marginLeft: "10px",
                  marginRight: "20px",
                }}
              />
            )}
            <h1 style={{ ...text.header }}>{selectedNodeData.name}</h1>
          </div>

          <p style={text.contentFocus}>{selectedNodeData.shortDescription}</p>
          <ul style={text.content}>
            <li>
              HQ: {selectedNodeData.orgCity}, {selectedNodeData.orgCountryCode}
            </li>
            <li>
              Total funding: {formatToUSD(selectedNodeData.totalFundingUsd)}
            </li>
            <li>Founded: {epochToDate(selectedNodeData.foundedOn)}</li>
          </ul>
          {/* Displaying IPO info */}
          {selectedNodeData &&
            selectedNodeData.type === "secondary" &&
            selectedNodeData.exitType === "ipo" && (
              <div style={text.content}>
                {selectedNodeData.name} went public{" "}
                {epochToDate(selectedNodeData.exitDate)}
                {selectedNodeData.exitValuation &&
                  " at a value of " +
                    formatToUSD(selectedNodeData.exitValuation)}
              </div>
            )}
          {/* Displaying acquisition info */}
          {selectedNodeData &&
            selectedNodeData.type === "secondary" &&
            selectedNodeData.exitType === "acquisition" && (
              <div style={text.content}>
                {selectedNodeData.name} was acquired on{" "}
                {epochToDate(selectedNodeData.exitDate)} by{" "}
                {selectedNodeData.acquirerName}
                {selectedNodeData.exitValuation &&
                  " for " + formatToUSD(selectedNodeData.exitValuation)}
              </div>
            )}
        </div>
      )}
    </div>
  );
}

export default Sidebar;
