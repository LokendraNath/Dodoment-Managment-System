/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTags, uploadFile } from "../features/documents/documentSlice";

const Upload = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No file chosen");
  const [date, setDate] = useState("");
  const [majorHead, setMajorHead] = useState("");
  const [minorHead, setMinorHead] = useState("");
  const [remarks, setRemarks] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.user?.id || "current_user");
  const { tags, loading, error } = useSelector((state) => state.documents);

  useEffect(() => {
    if (token) {
      dispatch(fetchTags(token));
    }
  }, [token, dispatch]);

  useEffect(() => {
    if (successMsg || errorMsg) {
      const timer = setTimeout(() => {
        setSuccessMsg("");
        setErrorMsg("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMsg, errorMsg]);

  const minorOptions = {
    Personal: ["John", "Tom", "Emily", "Sarah"],
    Professional: ["Accounts", "HR", "IT", "Finance", "Marketing"],
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    processFile(selectedFile);
  };

  const processFile = (selectedFile) => {
    if (selectedFile) {
      if (!selectedFile.type.match(/(jpg|jpeg|png|pdf)/)) {
        setErrorMsg("Only JPG, PNG and PDF files are allowed!");
        setFile(null);
        setFileName("No file chosen");
        return;
      }
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setErrorMsg("");
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleTagAdd = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const newTag = { tag_name: tagInput.trim() };
      if (!selectedTags.some((t) => t.tag_name === newTag.tag_name)) {
        setSelectedTags([...selectedTags, newTag]);
      }
      setTagInput("");
    }
  };

  const handleTagRemove = (index) => {
    setSelectedTags(selectedTags.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!file) return setErrorMsg("Please select a file (JPG, PNG, or PDF)");
    if (!date) return setErrorMsg("Please select a document date");
    if (!majorHead) return setErrorMsg("Please select a category");
    if (!minorHead) return setErrorMsg("Please select a name/department");

    const formData = new FormData();
    formData.append("file", file);

    // Convert date from YYYY-MM-DD to DD-MM-YYYY format (only if date exists)
    const formattedDate = date ? date.split('-').reverse().join('-') : '';

    const data = {
      major_head: majorHead,
      minor_head: minorHead,
      document_date: formattedDate,
      document_remarks: remarks,
      tags: selectedTags,
      user_id: userId,
    };

    console.log("=== UPLOAD DEBUG ===");
    console.log("File:", file.name, file.type);
    console.log("Data Object:", data);
    console.log("Data JSON String:", JSON.stringify(data));
    console.log("Token:", token ? "Present" : "Missing");

    formData.append("data", JSON.stringify(data));

    try {
      const result = await dispatch(uploadFile({ formData, token }));
      console.log("Upload Result:", result);
      console.log("=== END UPLOAD DEBUG ===");

      if (result.meta.requestStatus === "fulfilled") {
        setSuccessMsg("Document uploaded successfully!");
        setFile(null);
        setFileName("No file chosen");
        setDate("");
        setMajorHead("");
        setMinorHead("");
        setRemarks("");
        setSelectedTags([]);
      } else {
        setErrorMsg(error || "Upload failed. Please try again.");
      }
    } catch (err) {
      setErrorMsg("Network error. Please check your connection.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-black p-6 text-white">
          <h1 className="text-2xl font-bold">Upload Document</h1>
          <p className="text-gray-300 text-sm mt-1">
            Add new documents to the system
          </p>
        </div>

        <div className="p-8">
          {(successMsg || errorMsg) && (
            <div
              className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
                successMsg
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {successMsg ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
              {successMsg || errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* File Drop Zone */}
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                dragActive
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-300 hover:border-orange-400 hover:bg-gray-50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
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
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-700 font-medium text-lg">
                    {file ? file.name : "Drag & Drop or Click to Upload"}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Supported formats: JPG, PNG, PDF
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Document Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={majorHead}
                  onChange={(e) => {
                    setMajorHead(e.target.value);
                    setMinorHead("");
                  }}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Personal">Personal</option>
                  <option value="Professional">Professional</option>
                </select>
              </div>

              {majorHead && (
                <div className="space-y-2 animate-fade-in">
                  <label className="text-sm font-semibold text-gray-700">
                    {majorHead === "Personal" ? "Name" : "Department"}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={minorHead}
                    onChange={(e) => setMinorHead(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="">
                      Select {majorHead === "Personal" ? "Name" : "Department"}
                    </option>
                    {minorOptions[majorHead]?.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Remarks
                </label>
                <input
                  type="text"
                  placeholder="Add optional remarks..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Tags
              </label>
              <div className="border border-gray-300 rounded-xl p-4 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all bg-white">
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedTags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 border border-blue-100"
                    >
                      #{tag.tag_name}
                      <button
                        type="button"
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
                  placeholder="Type tag and press Enter..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagAdd}
                  className="w-full outline-none text-sm"
                />
              </div>
              {/* Tag Suggestions */}
              {tags && tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="text-xs text-gray-500 w-full">Suggested Tags:</span>
                  {tags.filter(t => !selectedTags.some(st => st.tag_name === t.tag_name)).map((tag, i) => (
                     <button
                       key={i}
                       type="button"
                       onClick={() => {
                         const newTag = { tag_name: tag.tag_name };
                         setSelectedTags([...selectedTags, newTag]);
                       }}
                       className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-md transition-colors"
                     >
                       + {tag.tag_name}
                     </button>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-800 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Uploading Document...
                  </span>
                ) : (
                  "Upload Document"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Upload;
