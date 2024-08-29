import LogoImage from "./LogoImage.js";
import TitleTargetOrg from "./TitleTargetOrg.js";
import TargetOrgSidebarInfo from "./TargetOrgSidebarInfo.js";

function TargetOrgSidebarContent({
  targetOrg,
  availableOrgs,
  onTargetOrgSelect,
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
        <LogoImage logoUrl={targetOrg.orgLogoUrl} name={targetOrg.orgName} />
        <TitleTargetOrg
          availableOrgs={availableOrgs}
          targetOrg={targetOrg}
          onTargetOrgSelect={onTargetOrgSelect}
        />
      </div>
      <TargetOrgSidebarInfo
        targetOrg={targetOrg}
        epochToDate={epochToDate}
        formatToUSD={formatToUSD}
      />
    </div>
  );
}
export default TargetOrgSidebarContent;
