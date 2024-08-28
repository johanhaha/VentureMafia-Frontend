import React from "react";
import Select from "react-select";
import { colours } from "../styling.js";
import { analytics, logEvent } from "../firebase.js";

function DropdownTargetOrg({ availableOrgs, targetOrg, handleTargetOrgSelection }) {
  return (
    <Select
      options={availableOrgs}
      classNamePrefix="react-select"
      isSearchable={true}
      value={availableOrgs.find((option) => option.value === targetOrg.orgUuid)}
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
  );
}
export default DropdownTargetOrg;
