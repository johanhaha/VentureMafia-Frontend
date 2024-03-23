import "./App.css";
import NetworkGraph from "./NetworkGraph.js";

function App() {
  return (
    <div style = {{height: window.innerHeight, width: window.innerWidth}}>
      <NetworkGraph />
    </div>
  );
}

export default App;
