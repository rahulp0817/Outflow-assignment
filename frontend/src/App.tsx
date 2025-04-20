import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import CampaignDashboard from "./components/CampaignDashboard";
import MessageGenerator from "./components/MessageGenerator";
import LeadsList from "./components/LeadsList";

const App = () => {
  return (
    <Router>
      <div className="p-4">
        <nav className="justify-between flex px-10">
          <h1 className="text-2xl font-bold mb-4">OutFlo Assignment</h1>
          <div className="mb-4 text-blue-500 *:hover:text-red-500 font-medium">
            <Link to="/" className="mr-4 ">
              Campaigns
            </Link>
            <Link to="/message">Message Generator</Link>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<CampaignDashboard />} />
          <Route path="/message" element={<MessageGenerator />} />
          <Route path="/leads" element={<LeadsList />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
