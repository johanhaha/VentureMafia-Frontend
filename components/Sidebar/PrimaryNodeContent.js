import ProfileImage from "./ProfileImage.js";
import PrimaryNodeInfo from "./PrimaryNodeInfo.js";
import { epochToDate } from "./utils.js";
import { text } from "../../app/styling.js";

function PrimaryNodeContent({
  targetOrgName,
  personName,
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
        {personName}
        {/* <ProfileImage
          personLogoUrl={selectedNodeData.personLogoUrl}
          name={selectedNodeData.name}
        />
        <h1 style={{ ...text.header }}>{selectedNodeData.name}</h1> */}
      </div>
      {/* <PrimaryNodeInfo
        orgName={targetOrgName}
        selectedNodeData={selectedNodeData}
        epochToDate={epochToDate}
      /> */}
    </div>
  );
}
export default PrimaryNodeContent;
