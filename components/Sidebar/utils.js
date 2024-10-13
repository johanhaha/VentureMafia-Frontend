const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3000";

// Helper fucntion to import available organisations
export async function loadAvailableOrgs() {
  try {
    const response = await fetch(`${BASE_URL}/available_orgs`);
    const availableOrgsRaw = await response.json();
    return availableOrgsRaw.data;
  } catch (err) {
    console.error("Failed to fetch data:", err);
    return [];
  }
}

// Helper function to import data
export async function loadData(targetOrgUuid) {
  try {
    const [targetOrgRaw, alumniInfoRaw, subsequentOrgsInfoRaw, relationsRaw] =
      await Promise.all([
        fetch(`${BASE_URL}/target_org/${targetOrgUuid}`).then((res) =>
          res.json()
        ),
        fetch(`${BASE_URL}/alumni_info/${targetOrgUuid}`).then((res) =>
          res.json()
        ),
        fetch(`${BASE_URL}/subsequent_orgs_info/${targetOrgUuid}`).then((res) =>
          res.json()
        ),
        fetch(`${BASE_URL}/relations/${targetOrgUuid}`).then((res) =>
          res.json()
        ),
      ]);
    return [
      targetOrgRaw.data,
      alumniInfoRaw.data,
      subsequentOrgsInfoRaw.data,
      relationsRaw.data,
    ];
  } catch (err) {
    console.error("Failed to fetch data:", err);
    throw new Error("Failed to fetch data");
  }
}

// Helper function to format as USD and abbreviate
export const formatToUSD = (value) => {
  let prefix = "$";
  let suffix = "";
  let abbreviatedNumber = value;
  if (value >= 1e9) {
    suffix = "bn";
    abbreviatedNumber = value / 1e9;
  } else if (value >= 1e6) {
    suffix = "m";
    abbreviatedNumber = value / 1e6;
  } else if (value >= 1e3) {
    suffix = "k";
    abbreviatedNumber = value / 1e3;
  }

  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: abbreviatedNumber < 10 ? 1 : 0,
  });

  return prefix + formatter.format(abbreviatedNumber) + suffix;
};

// Helper function to format epoch to date
export const epochToDate = (epoch) => {
  return new Date(epoch).toLocaleDateString("en-US", {
    year: "numeric",
    // month: "long",
  });
};
