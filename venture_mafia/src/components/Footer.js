import React, { useEffect } from "react";
import { colours } from "../styling.js";

function Footer({ selectedNodeData }) {
  useEffect(() => {
    console.log("Node Data Updated:", selectedNodeData);
  }, [selectedNodeData]);

  // Manual mapping between attribute keys and display text
  const attributeDisplayMapping = {
    executive: "Executive",
    board_member: "Board member",
    advisor: "Advisor",
    investor: "Investor",
  };

  const relationKeys = Object.keys(colours.relations);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
        padding: "10px 450px",
      }}
    >
      {relationKeys.map((key) => (
        <div
          key={key}
          style={{ display: "flex", alignItems: "center", gap: "10px" }}
        >
          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              backgroundColor: colours.relations[key],
            }}
          ></div>
          {/* Use the mapping for display text */}
          <span style={{ fontSize: "20px" }}>
            {attributeDisplayMapping[key]}
          </span>
        </div>
      ))}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          paddingLeft: "50px",
        }}
      >
        <div
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            backgroundColor: "#737373",
          }}
        ></div>
        {/* Use the mapping for display text */}
        <span style={{ fontSize: "20px" }}>Size represents funding amount</span>
      </div>
    </div>
  );
}

export default Footer;
