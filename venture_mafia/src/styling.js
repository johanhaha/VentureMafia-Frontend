import './assets/fonts.css';

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
    error: "hsl(5, 89%, 60%)",
  },
  neutrals: {
    text: "hsl(220, 15%, 20%)",
    textFocus: "hsl(220, 15%, 5%)",
    textUnfocus: "hsl(220, 15%, 50%)",
    background: "hsl(38, 100%, 93%)",
    background2: "hsl(0, 0%, 45%)",
  },
  relations: {
    executive: "hsl(48, 96%, 45%)",
    investor: "hsl(12, 60%, 50%)",
    board_member: "hsl(317, 39%, 75%)",
    advisor: "hsl(98, 23%, 55%)",
  },
};

export const opacity = {
  deselectNode: 0.1,
  deselectLink: 0.2,
};

export const text = {
  header: {
    fontFamily: "Jura",
    fontSize: "38px",
    fontWeight: "bold",
    color: colours.neutrals.textFocus,
  },
  subHeader: {
    fontFamily: "Jura",
    fontSize: "24px",
    fontWeight: "bold",
    color: colours.neutrals.text,
  },
  contentFocus: {
    fontFamily: "Jura",
    fontSize: "16px",
    fontWeight: "normal",
    color: colours.neutrals.textFocus,
  },
  content: {
    fontFamily: "Jura",
    fontSize: "14px",
    fontWeight: "normal",
    color: colours.neutrals.text,
  },
  contentUnfocus: {
    fontFamily: "Jura",
    fontSize: "14px",
    fontWeight: "normal",
    color: colours.neutrals.textUnfocus,
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
