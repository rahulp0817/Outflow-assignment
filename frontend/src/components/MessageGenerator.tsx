import React, { useState } from 'react';
import axios from 'axios';

const MessageGenerator: React.FC = () => {
  const [form, setForm] = useState({
    name: 'John Doe',
    job_title: 'Software Engineer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    summary: 'Experienced in AI & ML...'
  });

  const [message, setMessage] = useState('');

  const generateMessage = async () => {
    const res = await axios.post('/personalized-message', form);
    setMessage(res.data.message);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">LinkedIn Message Generator</h2>
      <div className="space-y-2">
        {Object.entries(form).map(([key, val]) => (
          <input
            key={key}
            className="border p-1 block w-full"
            placeholder={key}
            value={val}
            onChange={e => setForm({ ...form, [key]: e.target.value })}
          />
        ))}
        <button className="bg-green-600 text-white px-3 py-1" onClick={generateMessage}>Generate</button>
        {message && <p className="mt-4 border p-2 bg-gray-100">{message}</p>}
      </div>
    </div>
  );
};

export default MessageGenerator;