import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Campaign {
  _id?: string;
  name: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE';
  leads: string[];
  accountIDs: string[];
}

const CampaignDashboard: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [form, setForm] = useState<Campaign>({ name: '', description: '', status: 'ACTIVE', leads: [], accountIDs: [] });

  const fetchCampaigns = async () => {
    const res = await axios.get('/campaigns');
    setCampaigns(res.data);
  };

  const createCampaign = async () => {
    await axios.post('/campaigns', form);
    setForm({ name: '', description: '', status: 'ACTIVE', leads: [], accountIDs: [] });
    fetchCampaigns();
  };

  const deleteCampaign = async (id: string) => {
    await axios.delete(`/campaigns/${id}`);
    fetchCampaigns();
  };

  const toggleStatus = async (id: string, status: 'ACTIVE' | 'INACTIVE') => {
    await axios.put(`/campaigns/${id}`, { status });
    fetchCampaigns();
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Campaigns</h2>
      <div className="mb-4">
        <input className="border p-1 mr-2" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input className="border p-1 mr-2" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <button className="bg-blue-500 text-white px-3 py-1" onClick={createCampaign}>Add</button>
      </div>
      <ul>
        {campaigns.map(c => (
          <li key={c._id} className="mb-2 border-b pb-2">
            <strong>{c.name}</strong> - {c.description} ({c.status})
            <button className="ml-2 text-blue-600" onClick={() => toggleStatus(c._id!, c.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE')}>
              Toggle Status
            </button>
            <button className="ml-2 text-red-500" onClick={() => deleteCampaign(c._id!)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CampaignDashboard;