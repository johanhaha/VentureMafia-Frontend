import { ReactComponent as VMlogo } from "../VMlogo.svg";

import targetOrg from "../data/targetOrg.json";

// Helper function to format as USD
function formatToUSD(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0, // No decimal points
    maximumFractionDigits: 0, // No decimal points
  }).format(value);
}

// Helper function to format epoch to date
function epochToDate(epoch) {
  return new Date(epoch).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function Sidebar() {
  return (
    <div
      style={{
        gridArea: "1 / 1 / 2 / 2",
        display: "flex",
        flexDirection: "column", // Adjusted to stack the logo and text vertically
        justifyContent: "flex-start",
        alignItems: "flex-start",
        padding: "30px 50px 30px 50px",
      }}
    >
      <VMlogo style={{ width: "60%", height: "auto" }} />
      <div>
        <h1>{targetOrg.orgName}</h1>
        <p>{targetOrg.shortDescription}</p>
        <ul>
          <li>
            HQ: {targetOrg.orgCity}, {targetOrg.orgCountryCode}
          </li>
          <li>Total funding: {formatToUSD(targetOrg.totalFundingUsd)}</li>
          <li>Founded: {epochToDate(targetOrg.foundedOn)}</li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
