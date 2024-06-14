import React from "react";
import { colours, text } from "../styling.js";
import Select from "react-select";
import { FontAwesomeIcon } from "../fontAwesome";

import { ReactComponent as VMlogo } from "../VMlogo.svg";

const options = [
  { value: "96ab87ca-00b5-2ebc-f218-86262954e320", label: "PayPal" },
  { value: "a367b036-5952-5435-7541-ad7ee8869e24", label: "Tesla" },
  { value: "df662812-7f97-0b43-9d3e-12f64f504fbb", label: "Meta" },
  { value: "022417b5-4980-6c54-0f3c-6736bbbb1a5e", label: "Spotify" },
  { value: "2cc3a5de-2303-aa00-cd1a-50bd96420392", label: "Klarna" },
  { value: "34035c51-8f16-4836-8f02-103392479a92", label: "Northvolt" },
  { value: "76e0d11a-3e6b-12b4-7b0b-b4a5a34fba35", label: "Tink" },
  { value: "7b74b50c-4468-b7ec-2ff9-bf3286a399c9", label: "Kry" },
  { value: "fc4f7ed5-f7c8-34ef-3a8c-42e5d90b4ffb", label: "Einride" },
  { value: "f7ffcd56-1ca4-42af-848f-be1f72814ec8", label: "Voi" },
  { value: "439d3478-40fa-e6bc-9b71-f1bfa8296f52", label: "Epidemic Sound" },
  { value: "294302fb-089f-42eb-624a-8ed32494c6b6", label: "Sinch" },
  { value: "617ac9c3-1c6b-d675-e545-dc2ae4771e44", label: "Stillfront Group" },
  { value: "71c346d0-0889-486f-aae6-d4463772c13a", label: "Embracer Group" },
  { value: "ff4c39cb-f45b-5cdc-36a6-d9111767c351", label: "Lendify" },
  { value: "6093de34-5382-f34c-a207-efa92470048b", label: "iZettle" },
  { value: "9a6c8417-c918-40fb-aa7e-bdfd7b4c2273", label: "Volta Trucks" },
  { value: "bb6d18e9-fb01-c5d2-d11f-bb24f7eae221", label: "Storytel" },
  { value: "496cfef9-15f4-d1d7-ea21-b98ce7cdb26c", label: "Budbee" },
  { value: "c2c4c27f-f185-49a1-b418-26e258d158db", label: "Instabox" },
  { value: "6f8f114c-8df6-49de-a301-62242a78efa1", label: "Anyfin" },
];

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

function Sidebar({ selectedNodeData, targetOrg, onTargetOrgSelect }) {
  // Callback function to set tartget organisation
  function setTargetOrg(newTargetOrgUuid) {
    onTargetOrgSelect(newTargetOrgUuid);
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
          marginBottom: "2vw",
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
              style={{ ...text.header, display: "flex", alignItems: "center" }}
            >
              <span>The</span>
              <Select
                options={options}
                isSearchable={true}
                value={options.find(
                  (option) => option.value === targetOrg.orgUuid
                )}
                onChange={(selection) => setTargetOrg(selection.value)}
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
                    minHeight: "initial", // Ensure it matches the line-height of the surrounding text
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
                  borderRadius: "50%",
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
                  marginRight: "40px",
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
