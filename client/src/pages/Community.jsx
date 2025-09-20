import React, { useEffect, useState } from 'react'
import { useAuth, useUser } from '@clerk/clerk-react'
import { Heart } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

function Community() {
  const [creations, setCreations] = useState([])
  const { user } = useUser()
  const [loading, setLoading] = useState(true)
  const { getToken } = useAuth();

  const fetchCreations = async () => {
    try {
      const { data } = await axios.get('/api/user/get-publish-creations', {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      if (data.success) {
        setCreations(data.message || [])
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
      console.error('Fetch creations error:', error)
    }
    setLoading(false)
  }

  const imageLikeToggle = async(id) => {
    try {
      const { data } = await axios.post('/api/user/toggle-like-creation', {id}, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      if (data.success) {
        toast.success(data.message)
        await fetchCreations()
      } else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (user) {
      fetchCreations()
    }
  }, [user])

  if (loading) {
    return (
      <div className='flex-1 w-full flex flex-col gap-4 p-6'>
        <h2 className='text-xl font-semibold'>Community Creations</h2>
        <div className='bg-white h-full w-full rounded-xl flex items-center justify-center'>
          <div className='flex justify-center items-center'>
            <span className='w-10 h-10 my-1 rounded-full border-3 border-blue-500 border-t-transparent animate-spin'></span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='flex-1 w-full flex flex-col gap-4 p-6'>
      <h2 className='text-xl font-semibold'>Community Creations</h2>
      <div className='bg-white h-full w-full rounded-xl overflow-y-scroll'>
        {Array.isArray(creations) && creations.length > 0 ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4'>
            {creations.map((creation, index) => (
              <div key={creation.id || index} className='relative group w-full'>
                <img
                  src={creation.content}
                  alt={creation.prompt || "Generated image"}
                  className='w-full h-64 object-cover rounded-lg'
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                  }}
                />
                <div className='absolute inset-0 flex flex-col justify-end p-3 gap-2 text-white rounded-lg bg-gradient-to-b from-transparent to-black/80 opacity-0 group-hover:opacity-100 transition-opacity'>
                  <p className='text-sm'>{creation.prompt}</p>
                  <div className='flex items-center gap-1 justify-end'>
                    <p>{Array.isArray(creation.likes) ? creation.likes.length : 0}</p>
                    <Heart 
                      onClick={() => imageLikeToggle(creation.id)}
                      className={`w-5 h-5 cursor-pointer ${
                        Array.isArray(creation.likes) && creation.likes.includes(user?.id)
                          ? 'fill-red-500 text-red-600'
                          : 'text-white hover:text-red-300'
                      }`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='flex items-center justify-center py-8 h-full'>
            <div className='text-center'>
              <p className='text-gray-500 text-lg mb-2'>No published creations found</p>
              <p className='text-gray-400 text-sm'>Be the first to publish your creation!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Community