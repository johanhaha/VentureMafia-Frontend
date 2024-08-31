import LogoImage from "./LogoImage.js";
import SecondaryNodeInfo from "./SecondaryNodeInfo.js";

function SecondaryNodeContent({
  selectedNodeData,
  epochToDate,
  formatToUSD,
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
        <LogoImage
          logoUrl={selectedNodeData.orgLogoUrl}
          name={selectedNodeData.Name}
        />
      </div>
      <SecondaryNodeInfo
        selectedNodeData={selectedNodeData}
        epochToDate={epochToDate}
        formatToUSD={formatToUSD}
      />
    </div>
  );
}
export default SecondaryNodeContent;
