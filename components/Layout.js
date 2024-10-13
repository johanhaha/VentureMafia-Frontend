import Footer from "./Footer/Footer";
import { colours } from "../app/styling.js";

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

      <Footer />
    </div>
  );
};

export default Layout;
