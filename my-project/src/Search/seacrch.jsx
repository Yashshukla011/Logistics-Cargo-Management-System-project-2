import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import API from "../api/axios";

const SearchPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const query = new URLSearchParams(useLocation().search);
  const q = query.get("q"); // ✅ FIXED

  useEffect(() => {
    const fetchSearch = async () => {
      if (!q) return;

      try {
        setLoading(true);

        const res = await API.get(`/shipments/search?q=${q.trim()}`);

        setResults(res.data || []);
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
        results.map((item) => (
          <div key={item._id} className="p-3 border rounded mb-2 bg-white">
            <p className="font-medium">
              {item.receiverName} → {item.receiverAddress}
            </p>

            <p className="text-sm text-gray-500">
              Tracker ID: {item.trackerid}
            </p>
            <p className="text-sm text-gray-500">
              Docket Number: {item.DocketNumber}
          
          
            </p>
            <p className="text-sm">
              Status:{" "}
              <span className="text-indigo-600 font-semibold">
                {item.status}
              </span>
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default SearchPage;