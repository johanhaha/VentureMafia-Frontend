import ProfileImage from "./ProfileImage.js";
import PrimaryNodeSidebarInfo from "./PrimaryNodeSidebarInfo.js";
import { text } from "../../styling.js";

function PrimaryNodeSidebarContent({
  targetOrg,
  selectedNodeData,
  epochToDate,
}) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "left",
        }}
      >
        <ProfileImage
          personLogoUrl={selectedNodeData.personLogoUrl}
          name={selectedNodeData.name}
        />
        <h1 style={{ ...text.header }}>{selectedNodeData.name}</h1>
      </div>
      <PrimaryNodeSidebarInfo
        orgName={targetOrg.orgName}
        selectedNodeData={selectedNodeData}
        epochToDate={epochToDate}
      />
    </div>
  );
}
export default PrimaryNodeSidebarContent;
