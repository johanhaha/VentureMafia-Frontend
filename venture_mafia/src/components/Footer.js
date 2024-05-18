import React, { useEffect } from "react";
import { colours, text } from "../styling.js";

function Footer() {

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
        justifyContent: "center",
        alignItems: "center",
        padding: "10px 2vw",
      }}
    >
      {relationKeys.map((key) => (
        <div
          key={key}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5vw",
            paddingLeft: "2vw",
          }}
        >
          <div
            style={{
              width: "25px",
              height: "25px",
              borderRadius: "50%",
              backgroundColor: colours.relations[key],
              flexShrink: 0,
            }}
          ></div>
          {/* Use the mapping for display text */}
          <span style={text.content}>{attributeDisplayMapping[key]}</span>
        </div>
      ))}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5vw",
          paddingLeft: "1vw",
        }}
      >
        <div
          style={{
            width: "25px",
            height: "25px",
            borderRadius: "50%",
            backgroundColor: colours.neutrals.background2,
            flexShrink: 0,
          }}
        ></div>
        {/* Use the mapping for display text */}
        <span style={text.content}>Size represents funding amount</span>
      </div>
    </div>
  );
}

export default Footer;
