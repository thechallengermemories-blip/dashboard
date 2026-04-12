'use client';

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStories, clearStoryStatus } from "@/lib/redux/storySlice";
import { RootState, AppDispatch } from "@/lib/redux/store";
import StoryCard from "@/components/dashboard/StoryCard";
import { LibraryBig, History } from "lucide-react"; // Using appropriate icons for Heritage

export default function HeritagePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { stories, loading } = useSelector((state: RootState) => state.stories);

  useEffect(() => {
    // We pass the 'heritage' category filter to the thunk
    dispatch(fetchStories({ category: 'heritage' }));

    return () => {
      dispatch(clearStoryStatus());
    };
  }, [dispatch]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-blue-600 rounded-xl p-6 text-white shadow-lg shadow-blue-100 flex items-center gap-4">
        <div className="p-3 bg-white/20 rounded-lg">
          <LibraryBig size={32} />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Heritage Gallery</h1>
          <p className="opacity-90 text-sm">Explore and manage stories from families, colleagues, and friends.</p>
        </div>
      </div>

      {/* Loading State */}
      {loading && stories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-500 font-medium">Loading heritage stories...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <StoryCard key={story._id} story={story} />
          ))}
          
          {/* Empty State */}
          {stories.length === 0 && !loading && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
              <History size={48} className="text-slate-300 mb-4" />
              <p className="text-slate-500 text-lg font-medium">No heritage stories found.</p>
              <p className="text-slate-400">Start preserving history by creating a new story.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}