import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generateOTP, validateOTP } from "../features/auth/authSlice";

const Login = () => {
  const [mobile, setMobile] = useState("8269869510");
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleGenerateOTP = async () => {
    if (mobile.length < 10) {
      // You might want to set a local error state here if you had one for validation
      return;
    }
    const result = await dispatch(generateOTP(mobile));
    if (result.meta.requestStatus === "fulfilled") {
      setShowOTP(true);
    }
  };

  const handleValidateOTP = async () => {
    const result = await dispatch(validateOTP({ mobile_number: mobile, otp }));
    if (result.meta.requestStatus === "fulfilled") {
      // Login successful, redirection is handled by the router based on token
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all hover:scale-[1.01]">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-500">Document Management System</p>
        </div>

        {!showOTP ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number
              </label>
              <input
                type="tel"
                placeholder="Enter your mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
              />
            </div>
            <button
              onClick={handleGenerateOTP}
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl font-bold shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Generating OTP..." : "Generate OTP"}
            </button>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                placeholder="Enter the 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white text-center tracking-widest text-lg"
              />
            </div>
            <button
              onClick={handleValidateOTP}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3.5 rounded-xl font-bold shadow-lg hover:shadow-xl hover:from-green-600 hover:to-emerald-700 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
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
                  Validating...
                </span>
              ) : (
                "Verify & Login"
              )}
            </button>
            <button
              onClick={() => setShowOTP(false)}
              className="w-full text-sm text-gray-500 hover:text-indigo-600 transition-colors"
            >
              Change Mobile Number
            </button>
          </div>
        )}

        {error && (
          <div className="mt-6 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg text-center animate-pulse">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
