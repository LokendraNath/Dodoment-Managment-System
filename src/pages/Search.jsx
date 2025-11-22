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

  // Preview Modal State
  const [previewDoc, setPreviewDoc] = useState(null);

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

    console.log("=== SEARCH DEBUG ===");
    console.log("Filters:", filters);
    console.log("Formatted Payload:", JSON.stringify(payload, null, 2));
    console.log("Token:", token ? "Present" : "Missing");

    const result = await dispatch(searchDocuments({ payload, token }));
    console.log("Search Result:", result);
    console.log("=== END DEBUG ===");
  };

  const handleTagAdd = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      const newTag = tagInput.trim();
      if (!filters.tags.includes(newTag)) {
        setFilters({ ...filters, tags: [...filters.tags, newTag] });
      }
      setTagInput("");
    }
  };

  const handleTagRemove = (index) => {
    setFilters({
      ...filters,
      tags: filters.tags.filter((_, i) => i !== index),
    });
  };

  const getFileUrl = (doc) => {
    if (!doc) return null;

    console.log("=== GET FILE URL DEBUG ===");
    console.log("Document object:", doc);

    // Try to find the URL in common fields
    const url = doc.file_url || doc.document_url || doc.url || doc.file || doc.path;
    console.log("Found URL in document:", url);

    if (!url) {
      console.log("No URL found in any field!");
      return null;
    }

    // If it's already an absolute URL, return it
    if (url.startsWith("http://") || url.startsWith("https://")) {
      console.log("Absolute URL, returning as-is:", url);
      return url;
    }

    // If it's a relative path, prepend the API domain
    const cleanPath = url.startsWith("/") ? url.slice(1) : url;
    const fullUrl = `https://apis.allsoft.co/${cleanPath}`;
    console.log("Relative URL, converted to:", fullUrl);
    return fullUrl;
  };

  const handlePreview = (doc) => {
    console.log("=== PREVIEW CLICKED ===");
    console.log("Opening preview for:", doc);
    setPreviewDoc(doc);
  };

  const closePreview = () => {
    setPreviewDoc(null);
  };

  const handleDownload = async (doc) => {
    const fileUrl = getFileUrl(doc);
    if (!fileUrl) {
      alert("Download not available: File URL is missing.");
      return;
    }

    try {
      console.log("Attempting download for:", fileUrl);
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.document_name || "document";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Blob download failed, falling back to direct link:", error);
      const a = document.createElement("a");
      a.href = fileUrl;
      a.download = doc.document_name || "document";
      a.target = "_blank";
      a.click();
    }
  };

  // Helper to determine file type for preview
  const getFileType = (url) => {
    if (!url) return "unknown";
    const extension = url.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) return "image";
    if (extension === 'pdf') return "pdf";
    return "unsupported";
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border border-gray-100">
        <div className="bg-black p-6 text-white">
          <h2 className="text-2xl font-bold">Search Documents</h2>
          <p className="text-gray-300 text-sm mt-1">
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
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
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
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
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
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
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
            <div className="border border-gray-300 rounded-xl p-3 focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-transparent transition-all bg-white">
              <div className="flex flex-wrap gap-2 mb-2">
                {filters.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-orange-50 text-orange-700 px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-2 border border-orange-100"
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
                         if (!filters.tags.includes(tag.tag_name)) {
                           setFilters({ ...filters, tags: [...filters.tags, tag.tag_name] });
                         }
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
            className="w-full bg-orange-500 text-white py-3.5 rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-orange-600 transition-all transform hover:-translate-y-0.5"
          >
            {loading ? "Searching..." : "Find Documents"}
          </button>
        </div>
      </div>

      {/* Results Header & Actions */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Search Results</h2>
        {searchResults?.length > 0 && (
          <button
            onClick={() => alert("ZIP Download functionality would be implemented here using a library like JSZip or a backend endpoint.")}
            className="bg-orange-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-orange-600 transition-colors shadow-md flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download All (ZIP)
          </button>
        )}
      </div>

      {/* Results Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {error && (
          <div className="p-4 bg-red-50 text-red-700 border-b border-red-200 text-center">
            {error}
          </div>
        )}

        {searchResults?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Name/Dept</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[...searchResults]
                  .sort((a, b) => {
                    // Calculate tag match scores
                    const searchTags = filters.tags.map(t => t.toLowerCase());
                    const aTagsLower = (a.tags || []).map(tag =>
                      (typeof tag === 'string' ? tag : tag.tag_name || '').toLowerCase()
                    );
                    const bTagsLower = (b.tags || []).map(tag =>
                      (typeof tag === 'string' ? tag : tag.tag_name || '').toLowerCase()
                    );

                    const aMatches = searchTags.filter(searchTag =>
                      aTagsLower.some(docTag => docTag.includes(searchTag) || searchTag.includes(docTag))
                    ).length;
                    const bMatches = searchTags.filter(searchTag =>
                      bTagsLower.some(docTag => docTag.includes(searchTag) || searchTag.includes(docTag))
                    ).length;

                    // Primary sort: by tag matches (descending)
                    if (aMatches !== bMatches) {
                      return bMatches - aMatches;
                    }

                    // Secondary sort: by date (descending)
                    const dateA = new Date(a.document_date);
                    const dateB = new Date(b.document_date);
                    const timeA = isNaN(dateA.getTime()) ? 0 : dateA.getTime();
                    const timeB = isNaN(dateB.getTime()) ? 0 : dateB.getTime();
                    return timeB - timeA;
                  })
                  .map((doc) => {
                   const url = getFileUrl(doc);
                   const type = getFileType(url);
                   return (
                    <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                        {doc.document_date ? doc.document_date.split('T')[0] : "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            doc.major_head === "Personal"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {doc.major_head}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                        {doc.minor_head}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          {type === "image" ? (
                            <>
                              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              Image
                            </>
                          ) : type === "pdf" ? (
                            <>
                              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                              PDF
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Doc
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => handlePreview(doc)}
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                            title="Preview"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDownload(doc)}
                            className="text-gray-400 hover:text-green-600 transition-colors"
                            title="Download"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          !loading && (
            <div className="text-center py-12">
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

      {/* Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800 truncate">
                {previewDoc.document_name || "Document Preview"}
              </h3>
              <button
                onClick={closePreview}
                className="text-gray-500 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-full"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4 bg-gray-100 flex items-center justify-center">
              {(() => {
                const url = getFileUrl(previewDoc);
                const type = getFileType(url);

                if (!url) return <div className="text-red-500">File URL not found</div>;

                if (type === "image") {
                  return (
                    <img
                      src={url}
                      alt="Preview"
                      className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-md"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/400x300?text=Image+Load+Error";
                      }}
                    />
                  );
                } else if (type === "pdf") {
                  return (
                    <iframe
                      src={url}
                      className="w-full h-[70vh] rounded-lg shadow-md bg-white"
                      title="PDF Preview"
                    />
                  );
                } else {
                  return (
                    <div className="text-center p-8">
                      <div className="w-16 h-16 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="text-gray-600 font-medium">Preview not available for this file type.</p>
                      <p className="text-gray-400 text-sm mt-2 mb-4">Please download the file to view it.</p>
                      <button
                        onClick={() => handleDownload(previewDoc)}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        Download File
                      </button>
                    </div>
                  );
                }
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
