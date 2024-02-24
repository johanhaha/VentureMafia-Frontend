import React from "react";
import * as d3 from "d3";

import logo from "./logo.svg";
import "./App.css";

import {
  Organisation,
  Person,
  SubsequentOrgsInfo,
  AlumniNetwork,
} from "./interfaces";
import {
  OrgRegion,
  OrgCity,
  NetworkDiagramProps,
  RelationType,
  OrgCountryCode,
} from "./interfaces";

import alumniNetworkRaw from "./data/alumni_network.json";

import targetOrg from "./data/targetOrg.json";
import alumniInfo from "./data/alumniInfo.json";
import subsequentOrgsInfo from "./data/subsequentOrgsInfo.json";

// Function to get data for a target organisation
function getData(target_org: string): AlumniNetwork[] {
  console.log(target_org);

  // Map the imported JSON to the AlumniNetwork type, converting enum strings to actual enums
  return alumniNetworkRaw.map((entry) => ({
    ...entry,
    relationType: RelationType[entry.relationType as keyof typeof RelationType],
    orgCountryCode: Object.values(OrgCountryCode).find(
      (type) => type === entry.orgCountryCode
    ) as OrgCountryCode,
    foundedOn: entry.foundedOn.toString(),
  }));
}

function getTargetOrg(targetOrgName: string): Organisation[] {
  console.log(targetOrgName);
  return targetOrg.map((entry) => ({
    ...entry,
    orgCountryCode: Object.values(OrgCountryCode).find(
      (type) => type === entry.orgCountryCode
    ) as OrgCountryCode,
    orgRegion: Object.values(OrgRegion).find(
      (type) => type === entry.orgRegion
    ) as OrgRegion,
    orgCity: Object.values(OrgCity).find(
      (type) => type === entry.orgCity
    ) as OrgCity,
    foundedOn: entry.foundedOn.toString(),
  }));
}

function getAlumniInfo(targetOrgName: string): Person[] {
  console.log(targetOrgName);
  return alumniInfo.map((entry) => ({
    ...entry,
    jobType: Object.values(RelationType).find(
      (type) => type === entry.jobType
    ) as RelationType,
    startedOn: entry.startedOn.toString(),
    endedOn: entry.endedOn?.toString() ?? "NaT",
  }));
}

function getSubsequentOrgsInfo(targetOrgName: string): SubsequentOrgsInfo[] {
  console.log(targetOrgName);
  return subsequentOrgsInfo.map((entry) => ({
    ...entry,
    relationType: Object.values(RelationType).find(
      (type) => type === entry.relationType
    ) as RelationType,
    orgCountryCode: Object.values(OrgCountryCode).find(
      (type) => type === entry.orgCountryCode
    ) as OrgCountryCode,
    foundedOn: entry.foundedOn?.toString() ?? "NaT",
  }));
}

console.log(getSubsequentOrgsInfo("PayPal"));


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
