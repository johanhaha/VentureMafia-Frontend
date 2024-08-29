import { FontAwesomeIcon } from "../../fontAwesome.js";
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
        {selectedNodeData.personLogoUrl && (
          <img
            src={selectedNodeData.personLogoUrl}
            alt={`${selectedNodeData.name} profile picture`}
            style={{
              width: "90px",
              height: "90px",
              objectFit: "cover",
              borderRadius: "45px",
              marginRight: "20px",
            }}
          />
        )}
        {!selectedNodeData.personLogoUrl && (
          <FontAwesomeIcon
            icon={["far", "user"]}
            style={{
              width: "70px",
              height: "70px",
              marginLeft: "10px",
              marginRight: "30px",
              marginTop: "10px",
              marginBottom: "10px",
            }}
          />
        )}
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
