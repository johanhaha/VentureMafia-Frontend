import LogoImage from "./LogoImage.js";
import TitleTargetOrg from "./TitleTargetOrg.js";
import TargetOrgInfo from "./TargetOrgInfo.js";
import {
  loadAvailableOrgs,
  loadTargetOrgData,
} from "../../components/Sidebar/utils";
import { epochToDate, formatToUSD } from "./utils.js";

async function TargetOrgContent({ targetOrgName }) {
  const availableOrgs = await loadAvailableOrgs(); // Server-side fetch

  const [targetOrg] = await loadTargetOrgData(
    availableOrgs.find((org) => org.label === targetOrgName).value
  ); // Server-side fetch

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
        <TitleTargetOrg availableOrgs={availableOrgs} targetOrg={targetOrg} />
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
