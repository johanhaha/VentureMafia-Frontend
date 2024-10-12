import { text } from "../../app/styling.js";

function TargetOrgInfo({
  targetOrg,
  epochToDate,
  formatToUSD,
}) {
  return (
    <div>
      <p style={text.contentFocus}>{targetOrg.shortDescription}</p>
      <ul style={text.content}>
        <li>
          HQ: {targetOrg.orgCity}, {targetOrg.orgCountryCode}
        </li>
        <li>Total funding: {formatToUSD(targetOrg.totalFundingUsd)}</li>
        <li>Founded: {epochToDate(targetOrg.foundedOn)}</li>
      </ul>
      {/* Display IPO info */}
      {targetOrg.exitType === "ipo" && targetOrg.exitDate && (
        <div style={text.content}>
          {targetOrg.orgName} went public {epochToDate(targetOrg.exitDate)}
          {targetOrg.exitValuation &&
            " at a value of " + formatToUSD(targetOrg.exitValuation)}
        </div>
      )}
      {/* Display acquisition info */}
      {targetOrg.exitType === "acquisition" && targetOrg.exitDate && (
        <div style={text.content}>
          {targetOrg.orgName} was acquired {epochToDate(targetOrg.exitDate)} by{" "}
          {targetOrg.acquirerName}
          {targetOrg.exitValuation &&
            " for " + formatToUSD(targetOrg.exitValuation)}
        </div>
      )}
    </div>
  );
}
export default TargetOrgInfo;
