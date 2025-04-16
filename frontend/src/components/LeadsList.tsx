import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Lead {
  name: string;
  jobTitle: string;
  company: string;
  location: string;
  profileUrl: string;
}

const LeadsList: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    const fetchLeads = async () => {
      const res = await axios.get('/leads');
      setLeads(res.data);
    };
    fetchLeads();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Scraped LinkedIn Leads</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {leads.map((lead, index) => (
          <div
            key={index}
            className="border p-4 rounded-lg shadow hover:shadow-md transition duration-300"
          >
            <h3 className="text-lg font-bold">{lead.name}</h3>
            <p className="text-sm">{lead.jobTitle}</p>
            <p className="text-sm text-gray-600">{lead.company}</p>
            <p className="text-sm text-gray-500">{lead.location}</p>
            <a
              href={lead.profileUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-2 text-blue-500 hover:underline"
            >
              View LinkedIn Profile
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeadsList;
