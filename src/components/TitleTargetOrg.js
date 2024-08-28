import React, { useState } from "react";
import { colours, text } from "../styling.js";
import Select from "react-select";
import { Tooltip } from "react-tooltip";
import { logEvent } from "../firebase.js";

function TitleTargetOrg({
  availableOrgs,
  targetOrg,
  onTargetOrgSelect,
  analytics,
}) {
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
      <Select
        options={availableOrgs}
        classNamePrefix="react-select"
        isSearchable={true}
        value={availableOrgs.find(
          (option) => option.value === targetOrg.orgUuid
        )}
        onChange={(selection) => {
          handleTargetOrgSelection(selection);
        }}
        onMenuOpen={() => {
          logEvent(analytics, "dropdown_press", {
            dropdown_name: "target_org_selector",
          }); // Log that the dropdown was pressed
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
        aria-label={`Venture Mafia selector, options include ${availableOrgs
          .map((org) => org.label)
          .join(", ")}`}
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
  );
}

export default TitleTargetOrg;
