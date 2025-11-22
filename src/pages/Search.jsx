import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchDocuments, fetchTags } from "../features/documents/documentSlice";

const Search = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const { searchResults, tags, loading, error } = useSelector(
    (state) => state.documents
  );

  // Fetch tags on mount
  useEffect(() => {
    if (token) {
      dispatch(fetchTags(token));
    }
  }, [token, dispatch]);

  const [filters, setFilters] = useState({
    major_head: "",
    minor_head: "",
    from_date: "",
    to_date: "",
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");

  const handleSearch = async () => {
    const payload = {
      major_head: filters.major_head,
      minor_head: filters.minor_head,
      from_date: filters.from_date,
      to_date: filters.to_date,
      tags: filters.tags.map((t) => ({ tag_name: t })),
      uploaded_by: "",
      start: 0,
      length: 10,
      filterId: "",
      search: { value: "" },
    };

    await dispatch(searchDocuments({ payload, token }));
  };

  const handleTagAdd = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      setFilters({ ...filters, tags: [...filters.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const handleTagRemove = (index) => {
    setFilters({
      ...filters,
      tags: filters.tags.filter((_, i) => i !== index),
    });
  };

  const handlePreview = (fileUrl) => {
    if (fileUrl) {
      window.open(fileUrl, "_blank");
    } else {
      alert("Preview not available for this file type");
    }
  };

  const handleDownload = (fileUrl, fileName) => {
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = fileName;
    a.click();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
          <h2 className="text-2xl font-bold">Search Documents</h2>
          <p className="text-purple-100 text-sm mt-1">
            Find and manage your uploaded files
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Category
              </label>
              <select
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                onChange={(e) =>
                  setFilters({ ...filters, major_head: e.target.value })
                }
              >
                <option value="">All Categories</option>
                <option value="Personal">Personal</option>
                <option value="Professional">Professional</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                From Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                onChange={(e) =>
                  setFilters({ ...filters, from_date: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                To Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                onChange={(e) =>
                  setFilters({ ...filters, to_date: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <label className="text-sm font-semibold text-gray-700">
              Filter by Tags
            </label>
            <div className="border border-gray-300 rounded-xl p-3 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent transition-all bg-white">
              <div className="flex flex-wrap gap-2 mb-2">
                {filters.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-purple-50 text-purple-700 px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-2 border border-purple-100"
                  >
                    #{tag}
                    <button
                      onClick={() => handleTagRemove(i)}
                      className="hover:text-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                className="w-full outline-none text-sm"
                placeholder="Type tag and press Enter..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagAdd}
              />
            </div>
             {/* Tag Suggestions */}
              {tags && tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="text-xs text-gray-500 w-full">Suggested Tags:</span>
                  {tags.filter(t => !filters.tags.includes(t.tag_name)).map((tag, i) => (
                     <button
                       key={i}
                       onClick={() => {
                         setFilters({ ...filters, tags: [...filters.tags, tag.tag_name] });
                       }}
                       className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-md transition-colors"
                     >
                       + {tag.tag_name}
                     </button>
                  ))}
                </div>
              )}
          </div>

          <button
            onClick={handleSearch}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3.5 rounded-xl font-bold shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:-translate-y-0.5"
          >
            {loading ? "Searching..." : "Find Documents"}
          </button>
        </div>
      </div>

      {/* Results Header & Actions */}
      {searchResults?.length > 0 && (
        <div className="flex justify-end mb-4">
          <button
            onClick={() => alert("ZIP Download functionality would be implemented here using a library like JSZip or a backend endpoint.")}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download All as ZIP
          </button>
        </div>
      )}

      {/* Results Section */}
      <div className="space-y-4">
        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-center">
            {error}
          </div>
        )}

        {searchResults?.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {searchResults.map((doc) => (
              <div
                key={doc.id}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="font-bold text-lg text-gray-800">
                      {doc.document_name || "Untitled Document"}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">
                    {doc.document_remarks || "No remarks"}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      {doc.document_date}
                    </span>
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      {doc.major_head} / {doc.minor_head}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                  <button
                    onClick={() => handlePreview(doc.file_url)}
                    className="flex-1 md:flex-none px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg font-medium hover:bg-yellow-100 transition-colors border border-yellow-200"
                  >
                    Preview
                  </button>
                  <button
                    onClick={() =>
                      handleDownload(doc.file_url, doc.document_name)
                    }
                    className="flex-1 md:flex-none px-4 py-2 bg-green-50 text-green-700 rounded-lg font-medium hover:bg-green-100 transition-colors border border-green-200"
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading &&
          searchResults && (
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                No documents found
              </h3>
              <p className="text-gray-500 mt-1">
                Try adjusting your search filters
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Search;
