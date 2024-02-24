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

export const data = {
  nodes: [
    { id: "Myriel", group: "team1" },
    { id: "Anne", group: "team1" },
  ],
  links: [
    { source: "Anne", target: "Myriel", value: 1 },
    { source: "Napoleon", target: "Myriel", value: 1 },
  ],
};

console.log(data.nodes)

var nodes = data.nodes;

d3.forceSimulation(nodes) // apply the simulation to our array of nodes

  // Force #1: links between nodes
  .force(
    "link",
    d3.forceLink(data.links).id((d: any) => d.id)
  )

  // Force #2: avoid node overlaps
  .force("collide", d3.forceCollide().radius(5))

  // Force #3: attraction or repulsion between nodes
  .force("charge", d3.forceManyBody())

  // Force #4: nodes are attracted by the center of the chart area
  .force("center", d3.forceCenter(5 / 2, 5 / 2));

export const NetworkDiagram = ({
  width,
  height,
  data,
}: NetworkDiagramProps) => {
  // read the data
  // compute the nodes position using a d3-force
  // build the links
  // build the nodes

  return (
    <div>
      <svg width={width} height={height}>
        // render all the lines and circles
      </svg>
    </div>
  );
};

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
