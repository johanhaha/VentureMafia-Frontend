import Footer from "./Footer";
import { colours, text } from "../styling.js";
// import { analytics, logEvent } from "../firebase.js";

const Layout = ({ children }) => {
  return (
    <div style={{ backgroundColor: colours.neutrals.background }}>
      {/* Main Content */}
      <main
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 3fr",
          height: "calc(100vh - 50px)", // Adjust height to account for footer
          width: "100vw",
        }}
      >
        {children}
      </main>

      {/* Footer */}
      <footer
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 3fr",
          width: "100vw",
          height: "50px",
          overflow: "hidden",
        }}
      >
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
            // onClick={(event) => {
            //   logEvent(analytics, "johan_linkedin_click"); // Log click to LinkedIn profile
            // }}
          >
            &copy;Johan Torssell
          </a>
        </p>
        <div style={{ height: "100%" }}>
          <Footer />
        </div>
      </footer>
    </div>
  );
};

export default Layout;
