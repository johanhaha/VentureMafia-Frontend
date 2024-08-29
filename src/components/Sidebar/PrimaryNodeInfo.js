import ProfileImage from "./ProfileImage.js";
import { text } from "../../styling.js";

function PrimaryNodeInfo({ targetOrg, selectedNodeData, epochToDate }) {
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
  );
}
export default PrimaryNodeInfo;
