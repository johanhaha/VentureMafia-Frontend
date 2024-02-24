
// ------------------------------ enums ------------------------------
export enum RelationType {
  Executive = "executive",
  Employee = "employee",
  BoardMember = "board_member",
  Investor = "investor",
  Advisor = "advisor",
}

export enum OrgCountryCode {
  USA = "USA",
  CAN = "CAN",
  CYM = "CYM",
  DEU = "DEU",
  NDL = "NLD",
  PAN = "PAN",
  GBR = "GBR",
}

export enum OrgRegion {
  California = "California",
}

export enum OrgCity {
  SanJose = "San Jose",
}

/* // Assuming CategoryList has predefined categories, define them in this enum
enum CategoryList {
  Category1 = "category1",
  Category2 = "category2",
  // Add more categories as needed
} */

// ------------------------------ types ------------------------------

export type NetworkDiagramProps = {
  width: number;
  height: number;
  data: number[];
};

// ------------------------------ interfaces ------------------------------

// Organisation includes all information about a particular organisation
export interface Organisation {
    orgUuid: string;
    orgName: string;
    orgCountryCode: OrgCountryCode;
    orgRegion: OrgRegion;
    orgCity: OrgCity;
    // categoryList: CategoryList;
    totalFundingUsd: number;
    foundedOn: string;
}

// Person includes all information about a particular person in the target organisation
export interface Person {
    personUuid: string;
    personName: string;
    jobTitle: string;
    jobType: RelationType;
    startedOn: string;
    endedOn: string | null;
    personLogoUrl: string;
}

// SubsequentOrgsInfo includes all information about the alumnis subsequent organisations and their information
export interface SubsequentOrgsInfo {
    personUuid: string;
    orgUuid: string;
    relationType: RelationType;
    jobTitleSubsequent: string;
    orgName: string;
    orgCountryCode: OrgCountryCode;
    // categoryList: CategoryList;
    totalFundingUsd: number | null;
    foundedOn: string;
  }

// AlumniNetwork includes all information about the alumnis and the companies they ahve a relationship to
export interface AlumniNetwork {
  personUuid: string;
  personName: string;
  jobTitle: string;
  personLogoUrl: string;
  orgUuid: string;
  relationType: RelationType;
  jobTitleSubsequent: string;
  orgName: string;
  orgCountryCode: OrgCountryCode;
  // categoryList: CategoryList;
  totalFundingUsd: number;
  foundedOn: string;
}