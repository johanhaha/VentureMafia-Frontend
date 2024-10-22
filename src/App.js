import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout.js";
import OrgAlumniContent from "./components/OrgAlumniContent.js";
import "./App.css";

const defaultTargetOrgName = "PayPal";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route
            path="/"
            element={<Navigate to={`/${defaultTargetOrgName}`} />}
          />
          <Route
            path="/:targetOrgName"
            element={
              <OrgAlumniContent defaultTargetOrgName={defaultTargetOrgName} />
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
