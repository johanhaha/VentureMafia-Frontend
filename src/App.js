import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Helmet from "react-helmet";
import Layout from "./components/Layout.js";
import OrgAlumniContent from "./components/OrgAlumniContent.js";
import "./App.css";

const defaultTargetOrgName = "PayPal";

function App() {
  return (
    <Router>
      <Helmet>
        <title>Venture Mafia</title>
        <meta
          name="description"
          content="Explore the alumni networks of founders and early executives from various successful startups. Discover their professional connections, subsequent ventures, investments, and roles in other companies. Including the PayPal Mafia, Skype Mafia, eBay Mafia, and LinkedIn Mafia"
        />
        <meta
          name="keywords"
          content="venture mafia, startup mafia, alumni network, founder factory, startup founders, startup networks, startup alumni, venture capital, PayPal mafia, Skype mafia, eBay mafia, LinkedIn mafia"
        />
        <meta name="author" content="Johan Torssell" />
        {/* <!-- Social media tags --> */}
        <meta property="og:title" content="Venture Mafia" />
        <meta
          property="og:description"
          content="Explore the alumni networks of founders and early executives from successful startups. Discover their professional connections, subsequent ventures, investments, and roles in other companies. Including the PayPal Mafia, Skype Mafia, eBay Mafia, and LinkedIn Mafia"
        />
        <meta property="og:site_name" content="Venture Mafia" />
        <meta
          property="og:image"
          content="https://venturemafia.xyz/VMoverview.png"
        />
        <meta property="og:image:width" content="2212" />
        <meta property="og:image:height" content="1203" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Venture Mafia" />
        <meta
          property="twitter:description"
          content="Explore the alumni networks of founders and early executives from successful startups. Discover their professional connections, subsequent ventures, investments, and roles in other companies. Including the PayPal Mafia, Skype Mafia, eBay Mafia, and LinkedIn Mafia"
        />
        <meta
          property="og:image"
          content="https://venturemafia.xyz/VMoverview.png"
        />
        <meta property="og:type" content="website" />
      </Helmet>
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
