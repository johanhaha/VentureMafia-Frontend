"use client";

import { analytics, logEvent } from "../../app/firebase.js";
import { text } from "../../app/styling.js";

function FooterAuthor() {
  return (
    <p
      style={{
        ...text.contentFocus,
        paddingLeft: "20px",
        fontSize: "20px",
      }}
    >
      <a
        href="https://www.linkedin.com/in/johan-torssell/"
        target="_blank"
        rel="noreferrer"
        style={{ textDecoration: "none", color: "inherit" }}
        onClick={(event) => {
          logEvent(analytics, "johan_linkedin_click"); // Log click to LinkedIn profile
        }}
      >
        &copy;Johan Torssell
      </a>
    </p>
  );
}

export default FooterAuthor;
