import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const MessageGenerator: React.FC = () => {
  const [form, setForm] = useState({
    name: "John Doe",
    job_title: "Software Engineer",
    company: "TechCorp",
    location: "San Francisco, CA",
    summary: "Experienced in AI & ML...",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fieldLabels: Record<string, string> = {
    name: "Recipient's Name",
    job_title: "Job Title",
    company: "Company",
    location: "Location",
    summary: "Experience Summary",
  };

  const generateMessage = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(
        "http://localhost:5000/personalized-message",
        form
      );
      setMessage(res.data.message);
    } catch (err) {
      setError("Failed to generate message. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto rounded-xl shadow-xl bg-white overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-white mb-1">LinkedIn Message Generator</h2>
            <p className="text-blue-100 text-sm">
              Create personalized outreach messages in seconds
            </p>
          </motion.div>
        </div>

        {/* Form */}
        <div className="p-6">
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {Object.entries(form).map(([key, val], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {fieldLabels[key]}
                </label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  className="border border-gray-300 rounded-lg p-3 block w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                  placeholder={fieldLabels[key]}
                  value={val}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              </motion.div>
            ))}

            {/* Generate Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6"
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium w-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center cursor-pointer"
                onClick={generateMessage}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Generating...
                  </div>
                ) : (
                  "Generate Personalized Message"
                )}
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 bg-red-50 text-red-700 p-3 rounded-lg border border-red-200"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Generated Message */}
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-8"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">Your Message</h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={copyToClipboard}
                    className="text-blue-600 text-sm hover:text-blue-800 flex items-center"
                  >
                    {copied ? (
                      <>
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-4 w-4 mr-1" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M5 13l4 4L19 7" 
                          />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-4 w-4 mr-1" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" 
                          />
                        </svg>
                        Copy to clipboard
                      </>
                    )}
                  </motion.button>
                </div>
                <motion.div
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-700 whitespace-pre-wrap shadow-inner"
                >
                  {message}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Tips Card */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-2xl mx-auto mt-6 rounded-xl shadow-lg bg-white p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Tips for Effective Outreach</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Personalize further by mentioning specific projects or achievements</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Keep your message concise - aim for 2-3 short paragraphs</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>End with a clear call-to-action like a specific question</span>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MessageGenerator;