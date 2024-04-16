export const colours = {
  main: {
    primary1: "hsl(200, 49%, 62%)", // blueish
    // primary1: "hsl(144, 43%, 72%)", // greenish
    // primary1: "hsl(12, 60%, 50%)", // redish
    primary2: "#ffab00",
    primary3: "#ffab00",
    secondary1: "#E5E8E8",
    secondary2: "#B2BABB",
    secondary3: "#737373",
    accent1: "#FF2D00",
    accent2: "#28a745",
  },
  supporting: {
    success: "hsl(140, 47%, 42%)",
    info: "hsl(200, 49%, 62%)",
    warning: "hsl(40, 100%, 67%)",
    error: "hsl(12, 60%, 50%)",
  },
  neutrals: {
    text: "hsl(220, 15%, 20%)",
    textFocus: "hsl(220, 15%, 5%)",
    background: "hsl(38, 100%, 93%)",
  },
  relations: {
    executive: "#1f77b4",
    board_member: "#ff7f0e",
    advisor: "#2ca02c",
    investor: "#d62728",
  },
};

export const opacity = {
  deselectNode: 0.1,
  deselectLink: 0.2,
};

export const text = {
  header: {
    fontSize: "32px",
    fontWeight: "bold",
    color: colours.neutrals.textFocus,
  },
  subHeader: {
    fontSize: "24px",
    fontWeight: "bold",
    color: colours.neutrals.text,
  },
  contentFocus: {
    fontSize: "14px",
    fontWeight: "normal",
    color: colours.neutrals.textFocus,
  },
  content: {
    fontSize: "14px",
    fontWeight: "normal",
    color: colours.neutrals.text,
  },
};

export const margins = {
  segment: {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50,
  },
};
