
// client/src/pages/AICode.jsx
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import {
  Code,
  Bug,
  Zap,
  RefreshCw,
  Sun,
  Moon,
  Copy,
  Download,
  AlertTriangle,
  CheckCircle,
  Sparkles,
  Shield,
  Terminal,
  X,
} from "lucide-react";

// Configure axios base URL
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.com' // Replace with your actual backend URL
  : 'http://localhost:3000';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

function AICode() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [userCode, setUserCode] = useState("");
  const [fixedCode, setFixedCode] = useState("");
  const [explanation, setExplanation] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedIssues, setDetectedIssues] = useState([]);
  const [codeQualityScore, setCodeQualityScore] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const languages = [
    {
      value: "javascript",
      label: "JavaScript",
      ext: ".js",
      color: "from-yellow-400 to-orange-500",
    },
    {
      value: "python",
      label: "Python",
      ext: ".py",
      color: "from-blue-400 to-green-500",
    },
    {
      value: "java",
      label: "Java",
      ext: ".java",
      color: "from-red-500 to-orange-600",
    },
    {
      value: "cpp",
      label: "C++",
      ext: ".cpp",
      color: "from-blue-600 to-purple-600",
    },
    {
      value: "typescript",
      label: "TypeScript",
      ext: ".ts",
      color: "from-blue-500 to-indigo-600",
    },
    {
      value: "php",
      label: "PHP",
      ext: ".php",
      color: "from-purple-500 to-pink-500",
    },
    {
      value: "go",
      label: "Go",
      ext: ".go",
      color: "from-cyan-400 to-blue-500",
    },
    {
      value: "rust",
      label: "Rust",
      ext: ".rs",
      color: "from-orange-500 to-red-600",
    },
    {
      value: "csharp",
      label: "C#",
      ext: ".cs",
      color: "from-purple-600 to-blue-600",
    },
    {
      value: "ruby",
      label: "Ruby",
      ext: ".rb",
      color: "from-red-400 to-pink-500",
    },
  ];

  const analyzeCode = async () => {
    // Check if user is authenticated
    if (!isLoaded) {
      setError("Loading authentication...");
      return;
    }

    if (!isSignedIn) {
      setError("Please sign in to use the code analyzer");
      return;
    }

    if (!userCode.trim()) {
      setError("Please enter some code to analyze");
      return;
    }

    setIsAnalyzing(true);
    setError("");
    setSuccessMessage("");
    setDetectedIssues([]);
    setFixedCode("");
    setExplanation("");
    setCodeQualityScore(null);

    try {
      console.log("Starting code analysis...");
      const token = await getToken();
      
      if (!token) {
        throw new Error("Failed to get authentication token");
      }

      const response = await apiClient.post(
        "/api/ai/code/fix", // Correct API endpoint
        {
          code: userCode,
          language: selectedLanguage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("API Response:", response.data);

      if (response.data.success) {
        const data = response.data.data;
        
        // Validate and set the response data
        setDetectedIssues(Array.isArray(data.issues) ? data.issues : []);
        setFixedCode(data.fixedCode || userCode);
        setExplanation(data.explanation || "Code has been analyzed and optimized.");
        setCodeQualityScore(typeof data.qualityScore === 'number' ? data.qualityScore : 75);
        setSuccessMessage("Code analysis completed successfully!");

        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setError(response.data.message || "Failed to analyze code");
      }
    } catch (err) {
      console.error("API Error:", err);
      
      // Enhanced error handling
      if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        setError("Request timed out. The code analysis is taking longer than expected. Please try again.");
      } else if (err.response?.status === 401) {
        setError("Authentication required. Please login again.");
      } else if (err.response?.status === 429) {
        setError("Rate limit exceeded. Please try again later.");
      } else if (err.response?.status === 404) {
        setError("API endpoint not found. Please check your server configuration.");
      } else if (err.response?.status === 500) {
        setError("Server error occurred. Please try again later.");
      } else if (err.message === "Network Error") {
        setError("Network error. Please check your internet connection and try again.");
      } else if (err.code === 'ERR_NETWORK') {
        setError("Unable to connect to server. Please ensure the server is running.");
      } else {
        setError(
          err.response?.data?.message ||
          err.message ||
          "An unexpected error occurred. Please try again."
        );
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fixedCode);
      setSuccessMessage("Code copied to clipboard!");
      setTimeout(() => setSuccessMessage(""), 2000);
    } catch (err) {
      console.error("Copy error:", err);
      setError("Failed to copy code. Please select and copy manually.");
      setTimeout(() => setError(""), 3000);
    }
  };

  const downloadCode = () => {
    try {
      const ext = languages.find((l) => l.value === selectedLanguage)?.ext || ".txt";
      const blob = new Blob([fixedCode], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `fixed-code-${new Date().getTime()}${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setSuccessMessage("Code downloaded successfully!");
      setTimeout(() => setSuccessMessage(""), 2000);
    } catch (err) {
      console.error("Download error:", err);
      setError("Failed to download code.");
      setTimeout(() => setError(""), 3000);
    }
  };

  const clearAll = () => {
    setUserCode("");
    setFixedCode("");
    setExplanation("");
    setDetectedIssues([]);
    setCodeQualityScore(null);
    setError("");
    setSuccessMessage("");
  };

  const currentLanguage = languages.find((l) => l.value === selectedLanguage);

  // Show loading state if auth is not loaded
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Show sign-in prompt if user is not authenticated
  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <Code className="w-16 h-16 mx-auto mb-4 text-blue-600" />
          <h1 className="text-2xl font-bold mb-2">AI Code Analyzer</h1>
          <p className="text-gray-600 mb-6">Please sign in to use the code analyzer</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900"
      }`}
    >
      {/* Header */}
      <div
        className={`backdrop-blur-sm border-b transition-colors ${
          darkMode
            ? "bg-gray-900/50 border-gray-700"
            : "bg-white/50 border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-xl bg-gradient-to-r ${currentLanguage.color} shadow-lg`}
              >
                <Code className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Code Analyzer
                </h1>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Powered by AI • Detect bugs, fix errors, and optimize your code
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Language Selector */}
              <div className="relative">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className={`appearance-none px-4 py-2 pr-8 rounded-lg border font-medium transition-all ${
                    darkMode
                      ? "bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                      : "bg-white border-gray-300 text-gray-900 hover:bg-gray-50"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                >
                  {languages.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
                <div
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full bg-gradient-to-r ${currentLanguage.color}`}
                ></div>
              </div>

              {/* Clear Button */}
              <button
                onClick={clearAll}
                disabled={isAnalyzing}
                className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                  darkMode
                    ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                    : "bg-white hover:bg-gray-50 text-gray-600 shadow-sm"
                } border ${darkMode ? "border-gray-700" : "border-gray-200"} ${
                  isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <X className="w-4 h-4" />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-3 rounded-lg transition-all duration-300 ${
                  darkMode
                    ? "bg-gray-800 hover:bg-gray-700 text-yellow-400"
                    : "bg-white hover:bg-gray-50 text-gray-600 shadow-sm"
                } border ${darkMode ? "border-gray-700" : "border-gray-200"}`}
              >
                {darkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {(successMessage || error) && (
        <div className="max-w-7xl mx-auto px-6 pt-4">
          {successMessage && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="text-green-800 dark:text-green-200">
                  {successMessage}
                </span>
              </div>
            </div>
          )}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <span className="text-red-800 dark:text-red-200">{error}</span>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Bar */}
        {(detectedIssues.length > 0 || codeQualityScore) && (
          <div
            className={`mb-6 p-4 rounded-xl border ${
              darkMode
                ? "bg-gray-800/50 border-gray-700"
                : "bg-white/50 border-gray-200"
            } backdrop-blur-sm`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                {detectedIssues.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Bug className="w-5 h-5 text-red-500" />
                    <span className="font-medium">
                      {detectedIssues.length} Issues Found
                    </span>
                  </div>
                )}
                {codeQualityScore && (
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-green-500" />
                    <span className="font-medium">
                      Quality Score: {codeQualityScore}/100
                    </span>
                    <div
                      className={`w-24 h-2 rounded-full ${
                        darkMode ? "bg-gray-700" : "bg-gray-200"
                      }`}
                    >
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-1000"
                        style={{ width: `${codeQualityScore}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Terminal className="w-4 h-4" />
                <span>{currentLanguage.label}</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Input */}
          <div className="space-y-6">
            {/* Code Input Card */}
            <div
              className={`rounded-xl border shadow-lg transition-all ${
                darkMode
                  ? "bg-gray-800/50 border-gray-700"
                  : "bg-white/80 border-gray-200"
              } backdrop-blur-sm`}
            >
              <div
                className={`p-4 border-b ${
                  darkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                      <Bug className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">Input Code</h2>
                      <p
                        className={`text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Enter your {currentLanguage.label} code to analyze
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <textarea
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  disabled={isAnalyzing}
                  placeholder={`// Enter your ${currentLanguage.label} code here...
// The AI will detect bugs, security issues, and optimize your code

function example() {
    // Your code here
    console.log("Hello, World!");
}`}
                  className={`w-full h-80 p-4 font-mono text-sm rounded-lg border resize-none transition-all ${
                    darkMode
                      ? "bg-gray-900 border-gray-600 text-gray-100 placeholder-gray-500"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                />

                <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
                  <span>{userCode.length} characters</span>
                  <span>Language: {currentLanguage.label}</span>
                </div>
              </div>
            </div>

            {/* Analyze Button */}
            <button
              onClick={analyzeCode}
              disabled={isAnalyzing || !userCode.trim()}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 ${
                isAnalyzing || !userCode.trim()
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
              } flex items-center justify-center gap-3`}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Analyzing Code...</span>
                  <div className="flex gap-1 ml-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-white rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-white rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  <span>Analyze & Fix Code</span>
                  <Sparkles className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Issues Panel */}
            {detectedIssues.length > 0 && (
              <div
                className={`rounded-xl border ${
                  darkMode
                    ? "bg-gray-800/50 border-gray-700"
                    : "bg-white/80 border-gray-200"
                } backdrop-blur-sm`}
              >
                <div
                  className={`p-4 border-b ${
                    darkMode ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <h3 className="font-semibold flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    Detected Issues ({detectedIssues.length})
                  </h3>
                </div>
                <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                  {detectedIssues.map((issue, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border-l-4 ${
                        issue.type === "error"
                          ? "bg-red-50 dark:bg-red-900/20 border-red-500"
                          : issue.type === "warning"
                          ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500"
                          : "bg-blue-50 dark:bg-blue-900/20 border-blue-500"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`text-xs px-2 py-1 rounded-full font-medium ${
                                issue.type === "error"
                                  ? "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                                  : issue.type === "warning"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                                  : "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                              }`}
                            >
                              {issue.type.toUpperCase()}
                            </span>
                            {issue.line && (
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  darkMode
                                    ? "bg-gray-700 text-gray-300"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                Line {issue.line}
                              </span>
                            )}
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                issue.severity === "high"
                                  ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
                                  : issue.severity === "medium"
                                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200"
                                  : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200"
                              }`}
                            >
                              {issue.severity}
                            </span>
                          </div>
                          <p className="text-sm">{issue.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Output */}
          <div className="space-y-6">
            {fixedCode ? (
              <>
                {/* Fixed Code Card */}
                <div
                  className={`rounded-xl border shadow-lg transition-all ${
                    darkMode
                      ? "bg-gray-800/50 border-gray-700"
                      : "bg-white/80 border-gray-200"
                  } backdrop-blur-sm`}
                >
                  <div
                    className={`p-4 border-b ${
                      darkMode ? "border-gray-700" : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold">Fixed Code</h2>
                          <p
                            className={`text-sm ${
                              darkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            AI-optimized and improved version
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={copyToClipboard}
                          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                            darkMode
                              ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                          }`}
                        >
                          <Copy className="w-4 h-4 inline mr-1" />
                          Copy
                        </button>
                        <button
                          onClick={downloadCode}
                          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1.5 text-sm rounded-lg hover:shadow-lg transition-all duration-200"
                        >
                          <Download className="w-4 h-4 inline mr-1" />
                          Download
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <pre
                      className={`font-mono text-sm p-4 rounded-lg overflow-auto max-h-80 ${
                        darkMode
                          ? "bg-gray-900 text-gray-100"
                          : "bg-gray-50 text-gray-900"
                      } border ${
                        darkMode ? "border-gray-700" : "border-gray-200"
                      }`}
                    >
                      {fixedCode}
                    </pre>
                  </div>
                </div>

                {/* Explanation Card */}
                {explanation && (
                  <div
                    className={`rounded-xl border ${
                      darkMode
                        ? "bg-gray-800/50 border-gray-700"
                        : "bg-white/80 border-gray-200"
                    } backdrop-blur-sm`}
                  >
                    <div
                      className={`p-4 border-b ${
                        darkMode ? "border-gray-700" : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                          <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="text-lg font-semibold">
                          AI Explanation
                        </h3>
                      </div>
                    </div>
                    <div className="p-4">
                      <div
                        className={`${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        } leading-relaxed whitespace-pre-wrap`}
                      >
                        {explanation}
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Empty State */
              <div
                className={`rounded-xl border ${
                  darkMode
                    ? "bg-gray-800/30 border-gray-700"
                    : "bg-white/50 border-gray-200"
                } backdrop-blur-sm p-12 text-center`}
              >
                <div className="space-y-6">
                  <div
                    className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${
                      darkMode ? "bg-gray-800" : "bg-gray-100"
                    }`}
                  >
                    <Code
                      className={`w-10 h-10 ${
                        darkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">
                      Ready to analyze your code?
                    </h3>
                    <p
                      className={`${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      } max-w-md mx-auto leading-relaxed`}
                    >
                      Enter your {currentLanguage.label} code in the left panel
                      and let our AI detect bugs, security issues, optimize performance, and
                      provide detailed explanations.
                    </p>
                  </div>
                  <div className="flex justify-center gap-4 text-sm">
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>Bug Detection</span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-600">
                      <Zap className="w-4 h-4" />
                      <span>Code Optimization</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-600">
                      <Sparkles className="w-4 h-4" />
                      <span>AI Explanation</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AICode;