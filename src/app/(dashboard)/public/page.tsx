// src/app/(dashboard)/public/page.tsx
'use client';

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStories, clearStoryStatus } from "@/lib/redux/storySlice";
import { RootState, AppDispatch } from "@/lib/redux/store";
import StoryCard from "@/components/dashboard/StoryCard";
import { Globe } from "lucide-react";

export default function PublicStoriesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { stories, loading } = useSelector((state: RootState) => state.stories);

  useEffect(() => {
    // We pass the filter to the thunk
    // Note: Ensure your Story model has a 'visibility' or 'status' field
    dispatch(fetchStories({ visibility: 'public' }));

    return () => {
      dispatch(clearStoryStatus());
    };
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
          <Globe size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Public Stories</h1>
          <p className="text-slate-500 text-sm">Stories shared with the whole community</p>
        </div>
      </div>

      {loading && stories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-slate-500 font-medium">Loading public stories...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <StoryCard key={story._id} story={story} />
          ))}
          
          {stories.length === 0 && !loading && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
              <Globe size={48} className="text-slate-300 mb-4" />
              <p className="text-slate-500 text-lg font-medium">No public stories available yet.</p>
              <p className="text-slate-400">Be the first to share a story with the world!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}