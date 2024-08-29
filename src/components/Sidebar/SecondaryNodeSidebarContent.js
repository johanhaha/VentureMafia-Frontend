import LogoImage from "./LogoImage.js";
import SecondaryNodeSidebarInfo from "./SecondaryNodeSidebarInfo.js";

function SecondaryNodeSidebarContent({
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
      <SecondaryNodeSidebarInfo
        selectedNodeData={selectedNodeData}
        epochToDate={epochToDate}
        formatToUSD={formatToUSD}
      />
    </div>
  );
}
export default SecondaryNodeSidebarContent;
