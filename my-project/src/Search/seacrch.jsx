import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import API from "../api/axios";

const SearchPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const query = new URLSearchParams(useLocation().search);
  const q = query.get("q");

  useEffect(() => {
    const fetchSearch = async () => {
      if (!q) return;

      try {
        setLoading(true);

        const res = await API.get(`/shipments/search?q=${q.trim()}`);
        setResults(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearch();
  }, [q]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Search Results</h1>

      <p className="text-gray-600 mb-4">
        You searched for: <b>{q}</b>
      </p>

      {loading ? (
        <p>Loading...</p>
      ) : results.length === 0 ? (
        <p className="text-gray-400">No results found</p>
      ) : (
        results.map((s) => (
          <div key={s._id} className="p-4 border rounded mb-3 bg-white shadow-sm">

            {/* SAME AS DASHBOARD */}
            <p className="text-gray-700 font-medium">
              {s.sender?.fullName || "Unknown"} → {s.receiverName || "N/A"}
            </p>

            {/* ADDRESS */}
            {s.sender?.address && (
              <p className="text-gray-400 text-sm">
                From: {s.sender.address}
              </p>
            )}

            {s.receiverAddress && (
              <p className="text-gray-400 text-sm">
                To: {s.receiverAddress}
              </p>
            )}

            {/* DETAILS */}
            <p className="text-sm text-gray-500 mt-2">
              Tracker ID: {s.trackerid}
            </p>

            <p className="text-sm text-gray-500">
              Docket Number: {s.DocketNumber}
            </p>

            <p className="text-sm">
              Status:{" "}
              <span className="text-indigo-600 font-semibold">
                {s.status}
              </span>
            </p>

          </div>
        ))
      )}
    </div>
  );
};

export default SearchPage;