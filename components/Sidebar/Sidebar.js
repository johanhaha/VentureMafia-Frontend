import TargetOrgContent from "./TargetOrgContent.js";
// import PrimaryNodeContent from "./PrimaryNodeContent.js";
// import SecondaryNodeContent from "./SecondaryNodeContent.js";
import { epochToDate, formatToUSD } from "./utils.js";
import { colours } from "../../app/styling.js";
import Image from 'next/image';
import VMlogo from "../../public/logos/VMlogo.svg";

function Sidebar({
  availableOrgs,
  targetOrg,
  selectedNodeData,
}) {
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
      <Image
        src={VMlogo}
        style={{
          stroke: colours.main.primary1,
          width: "70%",
          height: "auto",
          marginBottom: "3vw",
        }}
        alt="Venture Mafia logo"
      />

      {!selectedNodeData && (
        <TargetOrgContent
          targetOrg={targetOrg}
          availableOrgs={availableOrgs}
          epochToDate={epochToDate}
          formatToUSD={formatToUSD}
        />
      )}
      {/* Displaying information about selected primary nodes */}
      {/* {selectedNodeData && selectedNodeData.type === "primary" && (
        <PrimaryNodeContent
          targetOrg={targetOrg}
          selectedNodeData={selectedNodeData}
          epochToDate={epochToDate}
        />
      )} */}
      {/* Displaying information about selected secondary nodes */}
      {/* {selectedNodeData && selectedNodeData.type === "secondary" && (
        <SecondaryNodeContent
          selectedNodeData={selectedNodeData}
          epochToDate={epochToDate}
          formatToUSD={formatToUSD}
        />
      )} */}
    </div>
  );
}

export default Sidebar;
