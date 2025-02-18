import { useEffect, useState } from "react";
import { isMatch } from "../utils/utils";
import { getAdminByUsername, updateAdmins } from "../api/api";

const Login = () => {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetError, setResetError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (await isMatch(username, password)) {
      console.log(isMatch(username, password));
      localStorage.setItem("user", username);
      localStorage.setItem("pass", password);
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Invalid password");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      // Fetch admin data by username
      const adminData = await getAdminByUsername(username);
      if (adminData && adminData.answer === securityAnswer) {
        // Update the password
        await updateAdmins(adminData.id, { username: username, password: newPassword });
        setResetError("Password updated successfully!");
        setShowResetModal(false);
      } else {
        setResetError("Invalid security answer.");
      }
    } catch (error) {
      setResetError("Failed to reset password." + error);
    }
  };

  const fetchSecurityQuestion = async (username) => {
    try {
      const adminData = await getAdminByUsername(username);
      if (adminData) {
        setSecurityQuestion(adminData.question);
      } else {
        setResetError("Username not found.");
      }
    } catch (error) {
      setResetError("Failed to fetch security question." + error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = "/";
    }
  }, [isAuthenticated]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <form onSubmit={handleLogin}>
          <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label className="block text-gray-700 mb-2">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p
              className="text-blue-500 text-sm mt-2 cursor-pointer"
              onClick={() => {
                setShowResetModal(true);
                fetchSecurityQuestion(username);
              }}
            >
              Forgot Password?
            </p>
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
          >
            Login
          </button>
        </form>
      </div>

      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md w-96">
            <h2 className="text-2xl font-semibold text-center mb-6">Reset Password</h2>
            <form onSubmit={handleResetPassword}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Username:</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <label className="block text-gray-700 mb-2">Security Question:</label>
                <p className="text-gray-700 mb-2">{securityQuestion}</p>
                <label className="block text-gray-700 mb-2">Answer:</label>
                <input
                  type="text"
                  value={securityAnswer}
                  onChange={(e) => setSecurityAnswer(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <label className="block text-gray-700 mb-2">New Password:</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {resetError && <p className="text-red-500 text-sm mb-4">{resetError}</p>}
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
              >
                Reset Password
              </button>
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition duration-200 mt-2"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;