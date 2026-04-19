import { useState } from "react";
import API from "../api/axios";

const CreateTicket = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!subject.trim() || !message.trim()) {
      setError("Subject and Message are required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess(false);

      await API.post("/support/create", {
        subject,
        message,
      });

      setSuccess(true);
      setSubject("");
      setMessage("");

      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError("Failed to create ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">

      <div className="w-full max-w-xl bg-white rounded-2xl shadow-md p-6">

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          Create Support Ticket
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Describe your issue and we’ll help you soon
        </p>

        {/* Success / Error */}
        {error && (
          <div className="bg-red-100 text-red-600 text-sm p-2 rounded mb-3">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-600 text-sm p-2 rounded mb-3">
            Ticket created successfully 🎉
          </div>
        )}

        {/* Subject */}
        <label className="text-sm font-medium text-gray-700">
          Subject
        </label>
        <input
          value={subject}
          className="border w-full p-3 rounded-lg mt-1 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter subject..."
          onChange={(e) => setSubject(e.target.value)}
        />

        {/* Message */}
        <label className="text-sm font-medium text-gray-700">
          Message
        </label>
        <textarea
          value={message}
          className="border w-full p-3 rounded-lg mt-1 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Describe your issue..."
          onChange={(e) => setMessage(e.target.value)}
        />

        {/* Button */}
        <button
          onClick={submit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg mt-5 hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Ticket"}
        </button>

      </div>
    </div>
  );
};

export default CreateTicket;