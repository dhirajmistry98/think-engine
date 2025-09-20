import React, { useState } from "react";
import { Edit, Hash, Sparkles } from "lucide-react";
import toast from 'react-hot-toast'
import axios from "axios"
import { useAuth } from "@clerk/clerk-react";
import Markdown from "react-markdown";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const BlogTitle = () => {
  const Categories = [
    { id: "general", text: "General" },
    { id: "technology", text: "Technology" },
    { id: "business", text: "Business" },
    { id: "health", text: "Health" },
    { id: "lifestyle", text: "Lifestyle" },
    { id: "education", text: "Education" },
    { id: "travel", text: "Travel" },
    { id: "food", text: "Food" },
  ];

  const [selectedCategory, setSelectedCategory] = useState(Categories[0]); // Fix: Use object instead of string
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const prompt = `Generate a blog title for the keyword ${input} in the category ${selectedCategory.text}`;
      const { data } = await axios.post('/api/ai/generate-blog-title', { prompt }, {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      });
      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message); // Fix: message instead of massage
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred'); // Fix: Better error handling
    }
    setLoading(false);
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
            <Sparkles className="w-6 text-[#4A7AFF]" />
            <h1 className="text-xl font-semibold">AI Title Generator</h1>
          </div>

          <p className="mt-6 text-sm font-medium">Keyword</p>
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-sm border border-gray-300"
            placeholder="The Future of AI...."
            required
          />

          <p className="mt-4 text-sm font-medium">Category</p>
          <div className="mt-3 flex gap-3 flex-wrap">
            {Categories.map((item, index) => (
              <span
                key={index}
                onClick={() => setSelectedCategory(item)} // Fix: Pass the entire object
                className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${
                  selectedCategory.id === item.id // Fix: Compare by id instead of text
                    ? "bg-orange-50 text-orange-700"
                    : "text-gray-500 border-gray-300"
                }`}
              >
                {item.text}
              </span>
            ))}
          </div>
          <br />
          <button 
            disabled={loading}
            type="submit"
            className="w-full flex justify-center items-center gap-2 bg-gradient-to-r to-[#65ADFF] from-orange-600 text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer"
          >
            {loading ? (
              <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
            ) : (
              <Hash className="w-5" />
            )}
            Generate Blog Title
          </button>
        </form>

        {/* Right column */}
        <div className="w-full lg:w-1/2">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm min-h-[500px] flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <Hash className="w-5 h-5 text-[#4A7AFF]" />
              <h1 className="text-xl font-semibold">Generated Titles</h1>
            </div>
            {!content ? (
              <div className="flex-1 flex justify-center items-center">
                <div className="text-center text-gray-400">
                  <Hash className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Enter keyword and click "Generate Title" to get started</p>
                </div>
              </div>
            ) : (
              <div className="mt-3 h-full overflow-y-scroll text-sm text-slate-600">
                <div className="prose prose-sm max-w-none">
                  <Markdown 
                    components={{
                      // Customize how different markdown elements are rendered
                      h1: ({ node, ...props }) => <h1 className="text-lg font-bold mb-3" {...props} />,
                      h2: ({ node, ...props }) => <h2 className="text-base font-semibold mb-2" {...props} />,
                      h3: ({ node, ...props }) => <h3 className="text-sm font-medium mb-2" {...props} />,
                      p: ({ node, ...props }) => <p className="mb-3 leading-relaxed" {...props} />,
                      ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-3" {...props} />,
                      ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-3" {...props} />,
                      li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                      blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-gray-300 pl-4 italic mb-3" {...props} />,
                      code: ({ node, inline, ...props }) => 
                        inline 
                          ? <code className="bg-gray-100 px-1 py-0.5 rounded text-xs" {...props} />
                          : <code className="block bg-gray-100 p-2 rounded text-xs overflow-x-auto" {...props} />,
                      pre: ({ node, ...props }) => <pre className="bg-gray-100 p-2 rounded mb-3 overflow-x-auto" {...props} />,
                      strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
                      em: ({ node, ...props }) => <em className="italic" {...props} />,
                    }}
                  >
                    {content}
                  </Markdown>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogTitle;