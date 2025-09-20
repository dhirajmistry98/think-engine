import React, { useState } from "react";
import { Image, Sparkles } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const GenerateImages = () => {
  const imageStyle = [
    "Realistic",
    "Ghibli Style",
    "Anime Style",
    "Cartoon Style",
    "Fantasy Style",
    "3D Style",
    "Portrait Style",
  ];

  const [selectedStyle, setSelectedStyle] = useState("Realistic");
  const [input, setInput] = useState("");
  const [publish, setPublish] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
     e.preventDefault();
    try {
      setLoading(true);
      const prompt = `Generate an image of ${input} in the style ${selectedStyle}`;
      const { data } = await axios.post(
        "/api/ai/generate-image",
        { prompt, publish },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );
      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex gap-6 max-w-7xl mx-auto">
        {/* Left col */}
        <div className="w-full max-w-lg">
          <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-6 h-6 text-[#00AD25]" />
              <h1 className="text-xl font-semibold">AI Image Generator</h1>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Describe Your Image</p>
              <textarea
                onChange={(e) => setInput(e.target.value)}
                value={input}
                rows={4}
                className="w-full p-3 outline-none text-sm rounded-lg border border-gray-300 focus:border-[#00AD25] focus:ring-1 focus:ring-[#00AD25] resize-none"
                placeholder="Describe what you want to see in the image..."
                required
              />
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium mb-3">Style</p>
              <div className="flex gap-2 flex-wrap">
                {imageStyle.map((item, index) => (
                  <span
                    onClick={() => setSelectedStyle(item)}
                    className={`text-xs px-4 py-2 border rounded-full cursor-pointer transition-colors ${
                      selectedStyle === item
                        ? "bg-green-50 text-green-700 border-blue-200"
                        : "text-gray-500 border-gray-300 hover:border-gray-400"
                    }`}
                    key={index}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="my-6 flex items-center gap-2">
              <label className="relative cursor-pointer">
                <input
                  type="checkbox"
                  onChange={(e) => setPublish(e.target.checked)}
                  checked={publish}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-green-500 transition"></div>
                <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full peer-checked:translate-x-4 transition"></span>
              </label>
              <p className="text-sm">Make this Image Public</p>
            </div>
            <button
              disabled={loading}
              onClick={onSubmitHandler}
              className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#00AD25] to-[#04FF50] text-white px-4 py-3 text-sm rounded-lg cursor-pointer hover:shadow-lg transition-shadow"
            >
              {loading ? (
                <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
              ) : (
                <Image className="w-5 h-5" />
              )}
              Generate Image
            </button>
          </div>
        </div>

        {/* Right col */}
        <div className="w-full max-w-lg">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm min-h-[500px] flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <Image className="w-6 h-6 text-[#00AD25]" />
              <h1 className="text-xl font-semibold">Generated Image</h1>
            </div>
            {!content ? (
              <div className="flex-1 flex justify-center items-center">
                <div className="text-center text-gray-400">
                  <Image className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">
                    Enter keywords and click "Generate Image" to get started
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-3 h-full overflow-y-scroll">
                <img 
                  src={content} 
                  alt="Generated image" 
                  className="w-full h-auto rounded-lg shadow-sm"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateImages;