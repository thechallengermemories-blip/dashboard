'use client';

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStories, clearStoryStatus } from "@/lib/redux/storySlice";
import { RootState, AppDispatch } from "@/lib/redux/store";
import StoryCard from "@/components/dashboard/StoryCard";
import { LayoutDashboard, Plus } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { stories, loading } = useSelector((state: RootState) => state.stories);

  useEffect(() => {
    dispatch(fetchStories());
    
    return () => {
      dispatch(clearStoryStatus());
    };
  }, [dispatch]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
            <LayoutDashboard size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">All Stories</h1>
            <p className="text-slate-500 text-sm">Manage and view all your recorded memories</p>
          </div>
        </div>

        
      </div>

      {/* Main Content */}
      {loading && stories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-slate-500 font-medium">Fetching your stories...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <StoryCard key={story._id} story={story} />
          ))}
          
          {/* Empty State */}
          {stories.length === 0 && !loading && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
              <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                <LayoutDashboard size={40} className="text-slate-300" />
              </div>
              <p className="text-slate-600 text-lg font-semibold">No stories found</p>
              <p className="text-slate-400 mb-6 text-center max-w-xs">
                You haven't created any stories yet. Start by adding your first memory!
              </p>
              <Link 
                href="/stories/new" 
                className="text-indigo-600 font-medium hover:underline flex items-center gap-1"
              >
                Click here to get started <Plus size={16} />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}