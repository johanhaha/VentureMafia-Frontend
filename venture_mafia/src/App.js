import "./App.css";
import NetworkGraph from "./components/NetworkGraph.js";
import { ReactComponent as VMlogo } from "./VMlogo.svg";

function App() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 3fr", // ratio between left panel and NetworkGraph
        height: "100vh",
        width: "100vw",
      }}
    >
      {/* Left panel */}
      <div
        style={{
          gridArea: "1 / 1 / 2 / 2",
          backgroundColor: "#f0f0f0",
          display: "flex",
          flexDirection: "column", // Adjusted to stack the logo and text vertically
          justifyContent: "flex-start",
          alignItems: "flex-start",
          padding: "30px 50px 30px 50px",
        }}
      >
        <VMlogo style={{ width: "60%", height: "auto" }} />
        <div style={{ marginTop: "20px" }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </div>
        <div style={{ marginTop: "20px" }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </div>
        <div style={{ marginTop: "20px" }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </div>
      </div>
      {/* NetworkGraph */}
      <div
      >
        <NetworkGraph />
      </div>
    </div>
  );
}

export default App;
