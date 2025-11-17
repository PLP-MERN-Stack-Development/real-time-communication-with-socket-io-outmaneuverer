import React, { useContext, useState } from "react";
import { AuthContext } from "/./context/AuthContext";
import { Loader2 } from "lucide-react";

const LoginPage = () => {
  const [currState, setCurrState] = useState("Login");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [bio, setBio] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Validation for Sign Up - First Step
      if (currState === "Sign Up" && !isDataSubmitted) {
        if (!fullName.trim()) {
          setError("Full name is required!");
          setIsLoading(false);
          return;
        }
        if (!email.trim() || !email.includes("@")) {
          setError("Please enter a valid email!");
          setIsLoading(false);
          return;
        }
        if (password.length < 6) {
          setError("Password must be at least 6 characters!");
          setIsLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setError("Passwords do not match!");
          setIsLoading(false);
          return;
        }
        if (!agreedToTerms) {
          setError("Please agree to terms and conditions!");
          setIsLoading(false);
          return;
        }
        setIsDataSubmitted(true);
        setIsLoading(false);
        return;
      }

      // Final Sign Up submission with bio
      if (currState === "Sign Up" && isDataSubmitted) {
        const credentials = {
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          password,
          bio: bio.trim() || "Hey there! I'm using Quick Chat"
        };
        
        await login("register", credentials);
        resetForm();
        setIsLoading(false);
        return;
      }

      // Login submission
      if (currState === "Login") {
        if (!email.trim() || !email.includes("@")) {
          setError("Please enter a valid email!");
          setIsLoading(false);
          return;
        }
        if (!password) {
          setError("Password is required!");
          setIsLoading(false);
          return;
        }

        const credentials = {
          email: email.trim().toLowerCase(),
          password
        };
        
        await login("login", credentials);
        resetForm();
        setIsLoading(false);
      }
    } catch (err) {
      setError(err.message || "Something went wrong!");
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setBio("");
    setAgreedToTerms(false);
    setIsDataSubmitted(false);
    setError("");
  };

  const switchState = (newState) => {
    setCurrState(newState);
    setIsDataSubmitted(false);
    setError("");
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600 flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col p-4">
      {/* Left Side - Branding */}
      <div className="flex flex-col items-center gap-4 text-white">
        <div className="relative">
          <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full"></div>
          <img
            src="https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=400"
            alt="Chat Logo"
            className="relative w-[min(30vw,250px)] rounded-2xl shadow-2xl"
          />
        </div>
        <div className="text-center">
          <p className="text-4xl font-bold drop-shadow-lg">Quick Chat</p>
          <p className="text-lg text-white/90 mt-2">Connect. Chat. Share.</p>
          <p className="text-sm text-white/70 mt-1">Real-time messaging made simple</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-[min(90%,420px)]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-3xl text-gray-800">
            {isDataSubmitted ? "Complete Profile" : currState}
          </h2>
          <div className="flex items-center gap-2">
            {isDataSubmitted && (
              <button
                type="button"
                onClick={() => setIsDataSubmitted(false)}
                disabled={isLoading}
                className="text-gray-600 hover:text-violet-600 text-2xl transition-colors duration-200 disabled:opacity-50"
              >
                ←
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-md p-3 mb-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Bio Section (Step 2 of Sign Up) */}
        {isDataSubmitted && currState === "Sign Up" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tell us about yourself (Optional)
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write a short bio about yourself..."
                className="w-full border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-violet-500 transition-colors min-h-[120px] resize-none"
                maxLength={200}
              />
              <p className="text-xs text-gray-500 mt-1">{bio.length}/200 characters</p>
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                 <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Complete Sign Up"
              )}
            </button>
          </div>
        )}

        {/* Initial Form Fields */}
        {!isDataSubmitted && (
          <div className="space-y-4">
            {currState === "Sign Up" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-violet-500 transition-colors"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-violet-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-violet-500 transition-colors"
                required
              />
            </div>

            {currState === "Sign Up" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-violet-500 transition-colors"
                    required
                  />
                </div>
                
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    required
                    className="mt-1 w-4 h-4 cursor-pointer accent-violet-600"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                    I agree to the{" "}
                    <span className="text-violet-600 hover:underline">terms and conditions</span>
                  </label>
                </div>
              </>
            )}

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {currState === "Sign Up" ? "Processing..." : "Logging in..."}
                </>
              ) : (
                currState === "Sign Up" ? "Continue" : "Login"
              )}
            </button>
          </div>
        )}

        {/* Switch State Link */}
        {!isDataSubmitted && (
          <div className="text-center mt-6">
            {currState === "Sign Up" ? (
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchState("Login")}
                  className="text-violet-600 hover:text-violet-700 font-semibold hover:underline"
                  disabled={isLoading}
                >
                  Login
                </button>
              </p>
            ) : (
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchState("Sign Up")}
                  className="text-violet-600 hover:text-violet-700 font-semibold hover:underline"
                  disabled={isLoading}
                >
                  Sign Up
                </button>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;