import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generateOTP, validateOTP } from "../features/auth/authSlice";

const Login = () => {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleGenerateOTP = async () => {
    if (mobile.length < 10) {
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
      // Login successful
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="w-full py-6 px-8 flex justify-between items-center border-b border-gray-100 shadow-sm">
        <div className="text-3xl font-bold text-black tracking-tight">
          allsoft<sup className="text-sm font-normal">®</sup>
        </div>
        <nav className="hidden md:flex gap-8 text-gray-600 font-medium text-sm">
          <a href="#" className="hover:text-orange-500 transition-colors">Home</a>
          <a href="#" className="hover:text-orange-500 transition-colors">About Us</a>
          <a href="#" className="hover:text-orange-500 transition-colors">Services</a>
          <a href="#" className="hover:text-orange-500 transition-colors">Projects</a>
          <a href="#" className="hover:text-orange-500 transition-colors">Contact Us</a>
        </nav>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* Left Side - Illustration & Text */}
          <div className="space-y-6 hidden md:block">
            <h1 className="text-5xl font-bold text-gray-900 leading-tight">
              Grow Your <br />
              Business with <br />
              Our Bespoke <br />
              Tech Solutions.
            </h1>
            <p className="text-gray-500 text-lg max-w-md">
              Automate to elevate – Unlock your team's potential with our seamless bespoke business process automation tools.
            </p>
            <button className="bg-orange-400 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-500 transition-colors shadow-lg shadow-orange-200">
              Get In Touch
            </button>
          </div>

          {/* Right Side - Login Form */}
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-gray-100 max-w-md w-full mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-500 text-sm">Login to access your Document Management System</p>
            </div>

            {!showOTP ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter your mobile number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all bg-gray-50 hover:bg-white text-gray-800 font-medium"
                  />
                </div>
                <button
                  onClick={handleGenerateOTP}
                  disabled={loading}
                  className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 shadow-lg"
                >
                  {loading ? "Sending Code..." : "Generate OTP"}
                </button>
              </div>
            ) : (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all bg-gray-50 hover:bg-white text-center tracking-widest text-xl font-bold text-gray-800"
                  />
                </div>
                <button
                  onClick={handleValidateOTP}
                  disabled={loading}
                  className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold hover:bg-orange-600 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 shadow-lg shadow-orange-200"
                >
                  {loading ? "Verifying..." : "Verify & Login"}
                </button>
                <button
                  onClick={() => setShowOTP(false)}
                  className="w-full text-sm text-gray-400 hover:text-black transition-colors font-medium"
                >
                  ← Change Mobile Number
                </button>
              </div>
            )}

            {error && (
              <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
