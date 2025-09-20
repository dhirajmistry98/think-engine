import { Scissors, Sparkle } from 'lucide-react';
import React, { useState } from 'react'
import axios from "axios";
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const RemoveObject = (props) => {
  const [input, setInput] = useState("");
  const [object, setObject] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if(object.split(' ').length > 1 ){
        return toast.error('Please enter only one object name')
      }
      const formData = new FormData();
      formData.append('image', input);
      formData.append('object', object);

      const { data } = await axios.post(
        "/api/ai/remove-image-object",
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
      toast.error(error.response?.data?.message || 'An error occurred while processing the image')
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
            <Sparkle className="w-6 text-[#4A7AFF]" />
            <h1 className="text-xl font-semibold">Object Removal</h1>
          </div>

          <p className="mt-6 text-sm font-medium">Upload Image</p>
          <input
            onChange={(e) => setInput(e.target.files[0])}
            accept="image/*"
            type="file"
            className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-sm border border-gray-300 text-gray-600"
            required
          />
          <p className="text-sm font-medium mb-2">Describe object name to remove</p>
          <textarea
            onChange={(e) => setObject(e.target.value)}
            value={object}
            rows={4}
            className="w-full p-3 outline-none text-sm rounded-lg border border-gray-300 focus:border-[#00AD25] focus:ring-1 focus:ring-[#00AD25] resize-none"
            placeholder="e.g., watch or spoon , Only single object name"
            required
          />
          <button disabled={loading}
            type="submit"
            className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#417DF6] to-[#8E37EB] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer"
          >
            {
              loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>
              :
              <Scissors className="w-5" />
            }
            Remove Object
          </button>
        </form>

        {/* Right column */}
        <div className="w-full lg:w-1/2">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm min-h-[500px] flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <Scissors className="w-5 h-5 text-[#FF4938]" />
              <h1 className="text-xl font-semibold">Processed Image</h1>
            </div>
            {
              !content ? 
              (
                <div className="flex-1 flex justify-center items-center">
                  <div className="text-center text-gray-400">
                    <Scissors className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Upload an image and click "Remove object" to get started</p>
                  </div>
                </div>
              )
              :
              (
                <img src={content} alt="image" className='mt-3 w-full h-full' />
              )
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default RemoveObject