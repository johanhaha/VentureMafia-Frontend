import { Tooltip as ReactTooltip } from "react-tooltip";
import { text } from "../styling.js";

function Tooltip({ tooltipDefaultOpen }) {
  return (
    <ReactTooltip
      key={tooltipDefaultOpen} // Forces re-render on change
      anchorSelect=".react-select__control"
      content="Select company here!"
      border="1px solid grey"
      defaultIsOpen={tooltipDefaultOpen}
      style={{
        padding: "7px",
        backgroundColor: "transparent",
        borderRadius: "10px",
        ...text.contentUnfocus,
      }}
    />
  );
}
export default Tooltip;
