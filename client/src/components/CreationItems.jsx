import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const CreationItems = ({ item }) => {
  if (!item) return null;
  
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      {item.prompt && (
        <h2 className="text-lg font-medium text-slate-700">{item.prompt}</h2>
      )}
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-slate-500">
          {item.type && (
            <span className="capitalize">{item.type.replace('-', ' ')}</span>
          )}
        </span>
        {item.created_at && (
          <span className="text-xs text-slate-400">
            {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
          </span>
        )}
      </div>
      {item.type === 'image' && item.content && (
        <div className="mt-3">
          <img 
            src={item.content} 
            alt={item.prompt || 'Generated image'} 
            className="w-full h-auto rounded-md"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Available';
            }}
          />
        </div>
      )}
      {item.type !== 'image' && item.content && (
        <div className="mt-3 text-sm text-slate-600 line-clamp-3">
          {item.content}
        </div>
      )}
    </div>
  );
};

export default CreationItems;