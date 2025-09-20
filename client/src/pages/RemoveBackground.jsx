import { Eraser, Scissors } from 'lucide-react';
import React, { useState } from 'react';
import toast from "react-hot-toast";
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveBackground = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!input) {
      toast.error("Please select an image first");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('image', input);

      const { data } = await axios.post(
        "/api/ai/remove-image-background",
        formData, 
        { 
          headers: { 
            Authorization: `Bearer ${await getToken()}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (data.success) {
        setContent(data.content);
        toast.success("Background removed successfully!");
      } else {
        toast.error(data.message || "Failed to remove background");
      }
    } catch (error) {
      console.error("Background removal error:", error);
      // Fix: use error.response?.data?.message instead of data.message
      toast.error(error.response?.data?.message || error.message || "An error occurred");
    } finally {
      setLoading(false); // Move to finally block to ensure it runs
    }
  };

  return (
    <div className="h-full overflow-y-scroll p-6 text-slate-700">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left column */}
        <form
          onSubmit={onSubmitHandler}
          className="w-full lg:w-1/2 p-4 bg-white rounded-lg border border-gray-200"
        >
          <div className="flex items-center gap-3">
            <Scissors className="w-6 text-[#4A7AFF]" />
            <h1 className="text-xl font-semibold">Background Removal</h1>
          </div>

          <p className="mt-6 text-sm font-medium">Upload Image</p>
          <input
            onChange={(e) => setInput(e.target.files[0])}
            accept="image/*"
            type="file"
            className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-sm border border-gray-300 text-gray-600"
            required
          />
          <p className="text-xs text-gray-500 font-light mt-1">
            Support JPG, PNG and other image formats
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Eraser className="w-5" />
            )}
            {loading ? "Processing..." : "Remove Background"}
          </button>
        </form>

        {/* Right column */}
        <div className="w-full lg:w-1/2">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm min-h-[500px] flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <Eraser className="w-5 h-5 text-pink-500" />
              <h1 className="text-xl font-semibold">Processed Image</h1>
            </div>
            {!content ? (
              <div className="flex-1 flex justify-center items-center">
                <div className="text-center text-gray-400">
                  <Eraser className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Upload an image and click "Remove Background" to get started</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex justify-center items-center">
                <img 
                  src={content} 
                  alt="Processed image with background removed" 
                  className="max-w-full max-h-full object-contain rounded-lg shadow-md"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RemoveBackground;