import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

interface Campaign {
  _id?: string;
  name: string;
  description: string;
  status: "ACTIVE" | "INACTIVE" | "DELETED";
  leads: string[];
  accountIDs: string[];
}

const CampaignDashboard: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [form, setForm] = useState<Campaign>({
    name: "",
    description: "",
    status: "ACTIVE",
    leads: [],
    accountIDs: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    description?: string;
  }>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchCampaigns = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("http://localhost:5000/campaigns");
      setCampaigns(res.data);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch campaigns. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const validateForm = () => {
    const errors: { name?: string; description?: string } = {};
    if (!form.name.trim()) {
      errors.name = "Name is required";
    }
    if (!form.description.trim()) {
      errors.description = "Description is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const createCampaign = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/campaigns",
        form
      );
      console.log("API Response:", response.data);
      setForm({
        name: "",
        description: "",
        status: "ACTIVE",
        leads: [],
        accountIDs: [],
      });
      setSuccessMessage("Campaign created successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
      fetchCampaigns();
    } catch (error) {
      console.error("Error creating campaign:", error);
      setError("Failed to create campaign. Please try again.");
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const deleteCampaign = async (id: string) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/campaigns/${id}`);
      setSuccessMessage("Campaign deleted successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
      fetchCampaigns();
    } catch (error) {
      console.error("Error deleting campaign:", error);
      setError("Failed to delete campaign. Please try again.");
      setTimeout(() => setError(null), 3000);
      setLoading(false);
    }
  };

  const toggleStatus = async (
    id: string,
    currentStatus: "ACTIVE" | "INACTIVE"
  ) => {
    try {
      setLoading(true);
      const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      await axios.put(`http://localhost:5000/campaigns/${id}`, {
        status: newStatus,
      });
      setSuccessMessage(
        `Campaign status changed to ${newStatus.toLowerCase()}!`
      );
      setTimeout(() => setSuccessMessage(null), 3000);
      fetchCampaigns();
    } catch (error) {
      console.error("Error toggling status:", error);
      setError("Failed to update campaign status. Please try again.");
      setTimeout(() => setError(null), 3000);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Campaign Dashboard
          </h1>
          <div className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md">
            {campaigns.length} Campaign{campaigns.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Notification messages */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded shadow"
            >
              {successMessage}
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Create Campaign Form */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white p-6 rounded-lg shadow-lg mb-8"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Create New Campaign
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                className={`w-full border rounded-md p-2 ${
                  formErrors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Campaign name"
                value={form.name}
                onChange={(e) => {
                  setForm({ ...form, name: e.target.value });
                  if (e.target.value.trim()) {
                    setFormErrors({ ...formErrors, name: undefined });
                  }
                }}
              />
              {formErrors.name && (
                <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                className={`w-full border rounded-md p-2 ${
                  formErrors.description ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Campaign description"
                value={form.description}
                onChange={(e) => {
                  setForm({ ...form, description: e.target.value });
                  if (e.target.value.trim()) {
                    setFormErrors({ ...formErrors, description: undefined });
                  }
                }}
              />
              {formErrors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.description}
                </p>
              )}
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              className="w-full border border-gray-300 rounded-md p-2 cursor-pointer"
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value as "ACTIVE" | "INACTIVE" | "DELETED",
                })
              }
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
          <div className="mt-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow transition duration-200 cursor-pointer"
              onClick={createCampaign}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Campaign"}
            </motion.button>
          </div>
        </motion.div>

        {/* Campaigns List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Your Campaigns
          </h2>

          {loading && !error && (
            <div className="flex justify-center items-center h-24">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {!loading && campaigns.length === 0 && !error && (
            <div className="bg-gray-50 border border-gray-200 rounded-md p-8 text-center">
              <div className="text-gray-500 mb-2 text-lg">
                No campaigns found
              </div>
              <p className="text-gray-400">
                Create your first campaign to get started!
              </p>
            </div>
          )}

          <AnimatePresence>
            {!loading &&
              campaigns.length > 0 &&
              campaigns.map((campaign) => (
                <motion.div
                  key={campaign._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="border-b border-gray-200 py-4 last:border-b-0"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="font-medium text-lg text-gray-800">
                          {campaign.name}
                        </h3>
                        <span
                          className={`ml-3 px-2 py-1 text-xs rounded-full ${
                            campaign.status === "ACTIVE"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {campaign.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-1">
                        {campaign.description}
                      </p>
                    </div>
                    <div className="mt-3 md:mt-0 flex">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`mr-2 px-3 py-1 rounded-md text-sm cursor-pointer ${
                          campaign.status === "ACTIVE"
                            ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                        }`}
                        onClick={() =>
                          toggleStatus(
                            campaign._id!,
                            campaign.status as "ACTIVE" | "INACTIVE"
                          )
                        }
                      >
                        {campaign.status === "ACTIVE"
                          ? "Deactivate"
                          : "Activate"}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 cursor-pointer rounded-md text-sm"
                        onClick={() => deleteCampaign(campaign._id!)}
                      >
                        Delete
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CampaignDashboard;
