import { text } from "../../styling.js";

function PrimaryNodeInfo({ orgName, selectedNodeData, epochToDate }) {
  return (
    <div>
      <h2 style={text.subHeader}>Role at {orgName}</h2>
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
