import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchDocuments } from "../features/documents/documentSlice";

const Search = () => {
  const [filters, setFilters] = useState({
    major_head: "",
    minor_head: "",
    from_date: "",
    to_date: "",
    tags: [],
  });

  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const searchResults = useSelector((state) => state.documents.searchResults);

  const handleSearch = () => {
    const searchPayload = {
      ...filters,
      tags:
        filters.tags.length > 0
          ? filters.tags.map((tag) => ({ tag_name: tag }))
          : [],
      start: 0,
      length: 10,
      uploaded_by: "",
      filterId: "",
      search: { value: "" },
    };
    dispatch(searchDocuments({ payload: searchPayload, token }));
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Search Documents</h1>

      {/* Search Filters */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-6 space-y-4">
        <select
          onChange={(e) =>
            setFilters({ ...filters, major_head: e.target.value })
          }
          className="w-full px-4 py-3 border rounded-lg"
        >
          <option value="">All Categories</option>
          <option value="Personal">Personal</option>
          <option value="Professional">Professional</option>
        </select>

        {/* Add more filters similarly */}

        <input
          type="date"
          placeholder="From Date"
          onChange={(e) =>
            setFilters({ ...filters, from_date: e.target.value })
          }
          className="w-full px-4 py-3 border rounded-lg"
        />
        <input
          type="date"
          placeholder="To Date"
          onChange={(e) => setFilters({ ...filters, to_date: e.target.value })}
          className="w-full px-4 py-3 border rounded-lg"
        />

        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {/* Results */}
      <div className="grid gap-4">
        {searchResults?.map((doc) => (
          <div
            key={doc.id}
            className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{doc.name}</h3>
              <p className="text-gray-600 text-sm">{doc.document_remarks}</p>
            </div>
            <div className="flex gap-2">
              <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                Preview
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
