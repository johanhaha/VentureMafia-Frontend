import ProfileImage from "./ProfileImage.js";
import PrimaryNodeInfo from "./PrimaryNodeInfo.js";
import { text } from "../../styling.js";

function PrimaryNodeContent({
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
      <PrimaryNodeInfo
        orgName={targetOrg.orgName}
        selectedNodeData={selectedNodeData}
        epochToDate={epochToDate}
      />
    </div>
  );
}
export default PrimaryNodeContent;
