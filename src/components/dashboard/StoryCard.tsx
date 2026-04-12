'use client';
import { Story } from "@/types/story";
import { Eye, Edit3, Trash2, CheckCircle, Star } from "lucide-react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { deleteStory } from "@/lib/redux/storySlice";
import { AppDispatch } from "@/lib/redux/store";

export default function StoryCard({ story }: { story: Story }) {
  const dispatch = useDispatch<AppDispatch>();
  
  const missionColor = story.mission === "challenger" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700";
  const statusColor = {
    published: "bg-green-100 text-green-700",
    pending: "bg-amber-100 text-amber-700",
    archived: "bg-slate-100 text-slate-700",
  }[story.status];

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this story?")) {
      dispatch(deleteStory(story._id!));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
      {story.imageUrl && (
        <div className="h-40 w-full relative overflow-hidden">
          <img src={story.imageUrl} alt={story.title} className="w-full h-full object-cover" />
          {story.isFeatured && (
            <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
              <Star size={12} fill="currentColor" /> FEATURED
            </div>
          )}
        </div>
      )}
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${missionColor}`}>
            {story.mission}
          </span>
          <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${statusColor}`}>
            {story.status}
          </span>
        </div>

        <h3 className="text-lg font-bold text-slate-800 line-clamp-1">{story.title}</h3>
        
        <div className="flex items-center gap-2 mt-1 mb-3">
          <p className="text-sm text-slate-500 font-medium">By {story.name}</p>
          {story.isVerified && <CheckCircle size={14} className="text-blue-500" />}
        </div>

        <p className="text-slate-600 text-sm line-clamp-2 mb-4 leading-relaxed">
          {story.narrative}
        </p>

        <div className="flex items-center gap-2 pt-4 border-t border-slate-50">
          <Link 
            href={`/stories/${story._id}`}
            className="flex-1 flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            <Eye size={16} /> View
          </Link>
          <Link 
            href={`/stories/${story._id}/edit`}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            <Edit3 size={16} /> Edit
          </Link>
          <button 
            onClick={handleDelete}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}