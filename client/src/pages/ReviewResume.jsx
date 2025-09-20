import { FileText, Sparkles } from 'lucide-react';
import React, { useState } from 'react'
import toast from "react-hot-toast";
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react';
import Markdown from "react-markdown";


axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const ReviewResume = () => {

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const { getToken } = useAuth();

      const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
          setLoading(true);
          const formData = new FormData();
          formData.append('resume', input);
    
          const { data } = await axios.post(
            "/api/ai/resume-review",
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
          } else {
            toast.error(data.message);
          }
        } catch (error) {
          toast.error(error.message);
        }
        setLoading(false)
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
            <Sparkles className="w-6 text-[#00DA83]" />
            <h1 className="text-xl font-semibold">Review Resume</h1>
          </div>

          <p className="mt-6 text-sm font-medium">Upload Resume</p>
          <input
            onChange={(e) => setInput(e.target.files[0])}
            accept="application/pdf"
            type="file"
            className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-sm border border-gray-300 text-gray-600"
            required
          />
          <p className="text-xs text-gray-500 font-light mt-1">
            Support PDF resume only.
          </p>

          <button
            type="submit"
            className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#00DA83] to-[#009BB3] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer"
          >
            {
              loading ? 
              <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>
              :
              <FileText className="w-5" />
            }
            Review Resume
          </button>
        </form>

        {/* Right column */}
        <div className="w-full lg:w-1/2">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm min-h-96 max-h-[600px] flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-5 h-5 text-[#00DA83]" />
              <h1 className="text-xl font-semibold">Analysis Result</h1>
            </div>
            {
              ! content ? 
              (
                <div className="flex-1 flex justify-center items-center">
                <div className="text-center text-gray-400">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Upload a resume and click "Review Resume" to get started</p>
                </div>
              </div>
              ) :
              (
                <div className="mt-3 h-full overflow-y-scroll text-sm text-slate-600">
                <div className='reset-tw'>
                  <Markdown>{content}</Markdown>
                </div>
              </div>
              )
            }

          </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewResume;