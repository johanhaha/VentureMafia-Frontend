import LogoImage from "./LogoImage.js";
import TitleTargetOrg from "./TitleTargetOrg.js";
import TargetOrgInfo from "./TargetOrgInfo.js";

function TargetOrgContent({
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
      <TargetOrgInfo
        targetOrg={targetOrg}
        epochToDate={epochToDate}
        formatToUSD={formatToUSD}
      />
    </div>
  );
}
export default TargetOrgContent;
