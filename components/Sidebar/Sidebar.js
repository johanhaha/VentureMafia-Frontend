import { colours } from "../../app/styling.js";
import VMlogo from "../../public/logos/VMlogo.svg";

function Sidebar({ children }) {
  return (
    <div
      style={{
        gridArea: "1 / 1 / 2 / 2",
        display: "flex",
        flexDirection: "column", // Adjusted to stack the logo and text vertically
        justifyContent: "flex-start",
        alignItems: "flex-start",
        padding: "2vw",
      }}
    >
      <VMlogo
        style={{
          stroke: colours.main.primary1,
          width: "70%",
          height: "auto",
          marginBottom: "3vw",
        }}
        alt="Venture Mafia logo"
      />
      {children}
    </div>
  );
}

export default Sidebar;
