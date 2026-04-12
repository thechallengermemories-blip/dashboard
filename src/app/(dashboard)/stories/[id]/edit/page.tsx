"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Save, 
  X, 
  Trash2, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Image as ImageIcon,
  ChevronLeft,
  LayoutDashboard,
  Eye
} from "lucide-react";

import { 
  fetchStoryById, 
  updateStory, 
  deleteStory, 
  clearStoryStatus 
} from "@/lib/redux/storySlice";
import { RootState, AppDispatch } from "@/lib/redux/store";

export default function EditStoryPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { currentStory, loading, error, success } = useSelector(
    (state: RootState) => state.stories
  );

  const [formData, setFormData] = useState({
    title: "",
    narrative: "",
    imageUrl: "",
    status: "pending",
    mission: "challenger",
    category: "public",
    relation: "friend",
    isFeatured: false,
    isVerified: false,
  });

  useEffect(() => {
    dispatch(fetchStoryById(id as string));
  }, [dispatch, id]);

  useEffect(() => {
    if (currentStory) {
      setFormData({
        title: currentStory.title || "",
        narrative: currentStory.narrative || "",
        imageUrl: currentStory.imageUrl || "",
        status: currentStory.status || "pending",
        mission: currentStory.mission || "challenger",
        category: currentStory.category || "public",
        relation: currentStory.relation || "friend",
        isFeatured: !!currentStory.isFeatured,
        isVerified: !!currentStory.isVerified,
      });
    }
  }, [currentStory]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(updateStory({ id: id as string, storyData: formData }));
    if (updateStory.fulfilled.match(result)) {
      setTimeout(() => {
        dispatch(clearStoryStatus());
        router.push(`/stories/${id}`);
      }, 1500);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this story? This action cannot be undone.")) {
      const result = await dispatch(deleteStory(id as string));
      if (deleteStory.fulfilled.match(result)) {
        router.push("/stories");
      }
    }
  };

  if (loading && !currentStory) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">Fetching story details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Sticky Header Action Bar */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href={`/stories/${id}`}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ChevronLeft className="text-slate-600" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-tight">Edit Story</h1>
              <p className="text-xs text-slate-500 font-medium truncate max-w-[200px] sm:max-w-xs">
                {formData.title || "Untitled Record"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link 
              href={`/stories/${id}`} 
              className="hidden sm:flex px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors"
            >
              Cancel
            </Link>
            <button 
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              <span>{success ? "Saved!" : "Save Changes"}</span>
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        {/* Alerts */}
        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 animate-in fade-in zoom-in duration-300">
            <CheckCircle2 className="text-emerald-500" size={24} />
            <p className="font-semibold">Your changes have been preserved successfully.</p>
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl flex items-center gap-3">
            <AlertCircle className="text-red-500" size={24} />
            <p className="font-semibold">Update failed: {typeof error === 'string' ? error : 'Check your connection'}</p>
          </div>
        )}

        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-6">
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-1 bg-slate-50 border-b border-slate-100 flex items-center px-6 py-3">
                 <LayoutDashboard size={18} className="text-blue-500 mr-2" />
                 <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Core Narrative</h2>
              </div>
              
              <div className="p-6 md:p-8 space-y-6">
                <div className="group space-y-2">
                  <label className="text-sm font-bold text-slate-600 group-focus-within:text-blue-600 transition-colors">
                    Story Title
                  </label>
                  <input 
                    name="title"
                    type="text" 
                    required
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., A Legacy of Bravery"
                    className="w-full px-4 py-4 bg-white text-slate-900 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all text-xl font-semibold placeholder:text-slate-300"
                  />
                </div>

                <div className="group space-y-2">
                  <label className="text-sm font-bold text-slate-600 group-focus-within:text-blue-600 transition-colors">
                    The Narrative Content
                  </label>
                  <textarea 
                    name="narrative"
                    required
                    rows={12}
                    value={formData.narrative}
                    onChange={handleChange}
                    placeholder="Describe the events and memories in detail..."
                    className="w-full px-4 py-4 bg-white text-slate-900 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all resize-none leading-relaxed text-base placeholder:text-slate-300"
                  />
                  <div className="flex justify-end">
                    <span className="text-[10px] text-slate-400 font-mono">{formData.narrative.length} characters</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-1 bg-slate-50 border-b border-slate-100 flex items-center px-6 py-3">
                 <ImageIcon size={18} className="text-blue-500 mr-2" />
                 <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Visual Media</h2>
              </div>
              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-600">Cover Image URL</label>
                      <input 
                        name="imageUrl"
                        type="url" 
                        value={formData.imageUrl}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-white text-slate-900 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                    <p className="text-xs text-slate-500">Provide a direct link to a high-quality JPG or PNG image.</p>
                  </div>

                  <div className="relative group rounded-2xl overflow-hidden border-2 border-dashed border-slate-200 bg-slate-50 aspect-video flex items-center justify-center">
                    {formData.imageUrl ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={formData.imageUrl} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                          onError={(e) => (e.currentTarget.src = "https://placehold.co/600x400?text=Invalid+Image+URL")}
                        />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Eye className="text-white mr-2" size={20} />
                          <span className="text-white font-bold">Preview</span>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-4">
                        <ImageIcon size={32} className="mx-auto text-slate-300 mb-2" />
                        <p className="text-xs font-bold text-slate-400">No image preview available</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-6">
            {/* Publication Settings */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
                Settings
              </h3>
              
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">Story Status</label>
                  <select 
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 text-slate-900 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                  >
                    <option value="pending">🕒 Pending Review</option>
                    <option value="published">✅ Published</option>
                    <option value="archived">📁 Archived</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">Mission</label>
                  <select 
                    name="mission"
                    value={formData.mission}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 text-slate-900 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                  >
                    <option value="challenger">Challenger (STS-51-L)</option>
                    <option value="columbia">Columbia (STS-107)</option>
                  </select>
                </div>

                <div className="pt-4 space-y-4 border-t border-slate-100">
                  <label className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group">
                    <span className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">Featured Story</span>
                    <input 
                      name="isFeatured"
                      type="checkbox" 
                      checked={formData.isFeatured}
                      onChange={handleChange}
                      className="w-5 h-5 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer" 
                    />
                  </label>
                  
                  <label className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group">
                    <span className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">Verified Identity</span>
                    <input 
                      name="isVerified"
                      type="checkbox" 
                      checked={formData.isVerified}
                      onChange={handleChange}
                      className="w-5 h-5 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer" 
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Classification */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-4">Classification</h3>
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">Category</label>
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 text-slate-900 border border-slate-200 rounded-xl text-sm font-bold outline-none"
                  >
                    <option value="public">Public Archive</option>
                    <option value="heritage">Heritage (Internal)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">Relation to Subject</label>
                  <select 
                    name="relation"
                    value={formData.relation}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 text-slate-900 border border-slate-200 rounded-xl text-sm font-bold outline-none"
                  >
                    <option value="immediate-family">Immediate Family</option>
                    <option value="friend">Friend</option>
                    <option value="colleague">Colleague</option>
                    <option value="public-observer">Public Observer</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="pt-4">
              <button 
                type="button"
                onClick={handleDelete}
                className="w-full flex items-center justify-center gap-2 py-4 text-red-500 hover:text-red-700 hover:bg-red-50 border border-red-100 rounded-2xl transition-all font-bold group"
              >
                <Trash2 size={18} className="group-hover:shake" />
                Delete Permanent Record
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}