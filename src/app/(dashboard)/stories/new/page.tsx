"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  PlusCircle, 
  X, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Image as ImageIcon,
  Type,
  FileText
} from "lucide-react";

import { createStory, clearStoryStatus } from "@/lib/redux/storySlice";
import { RootState, AppDispatch } from "@/lib/redux/store";

export default function NewStoryPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // Redux State
  const { loading, error, success } = useSelector(
    (state: RootState) => state.stories
  );

  // Local Form State
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

  // Cleanup status on mount
  useEffect(() => {
    dispatch(clearStoryStatus());
  }, [dispatch]);

  // Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple Validation
    if (!formData.title || !formData.narrative) {
      alert("Please fill in the title and narrative.");
      return;
    }

    const result = await dispatch(createStory(formData));
    
    if (createStory.fulfilled.match(result)) {
      // Small delay to show success state before redirecting
      setTimeout(() => {
        dispatch(clearStoryStatus());
        router.push("/stories"); 
      }, 1500);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 px-4 sm:px-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <PlusCircle className="text-blue-600" size={32} />
            Add New Story
          </h1>
          <p className="text-slate-500 mt-1">Create a new historical record for the digital archive.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link 
            href="/stories" 
            className="flex-1 md:flex-none px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl flex items-center justify-center gap-2 transition-all font-medium border border-transparent hover:border-slate-200"
          >
            <X size={18} /> Cancel
          </Link>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 md:flex-none px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-blue-200 transition-all transform active:scale-95"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <PlusCircle size={18} />}
            {success ? "Created!" : "Publish Story"}
          </button>
        </div>
      </div>

      {/* Status Alerts */}
      {success && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 size={20} />
          <p className="font-medium">Story created successfully! Redirecting to archive...</p>
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
          <AlertCircle size={20} />
          <p className="font-medium">Error: {typeof error === 'string' ? error : 'Failed to create story'}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content (Left) */}
        <div className="lg:col-span-8 space-y-6">
          <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                <Type size={16} className="text-slate-400" /> Story Title
              </label>
              <input 
                name="title"
                type="text" 
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Reflections on the STS-51-L Launch Day"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-lg font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                <FileText size={16} className="text-slate-400" /> The Narrative
              </label>
              <textarea 
                name="narrative"
                rows={12}
                required
                value={formData.narrative}
                onChange={handleChange}
                placeholder="Write the full story details here..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all resize-none leading-relaxed"
              />
            </div>
          </section>

          <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-slate-800">
              <ImageIcon size={20} className="text-blue-500" />
              <h3 className="font-bold text-lg">Media Assets</h3>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600">Cover Image URL</label>
                <input 
                  name="imageUrl"
                  type="url" 
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="https://images.unsplash.com/photo-..."
                />
              </div>

              {formData.imageUrl ? (
                <div className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-video max-w-md bg-slate-100">
                   {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={formData.imageUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.src = "https://placehold.co/600x400?text=Invalid+Image+URL")}
                  />
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
                    <ImageIcon size={40} className="mb-2 opacity-20" />
                    <p className="text-sm">Provide an image URL to see a preview</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar Controls (Right) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Publishing Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              Visibility Settings
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Initial Status</label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                >
                  <option value="pending">🕒 Pending Review</option>
                  <option value="published">✅ Published</option>
                  <option value="archived">📁 Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Assign to Mission</label>
                <select 
                  name="mission"
                  value={formData.mission}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                >
                  <option value="challenger">Challenger (STS-51-L)</option>
                  <option value="columbia">Columbia (STS-107)</option>
                </select>
              </div>

              <div className="pt-2 space-y-3 border-t border-slate-50">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    name="isFeatured"
                    type="checkbox" 
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    className="w-5 h-5 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                  />
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">Mark as Featured</span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    name="isVerified"
                    type="checkbox" 
                    checked={formData.isVerified}
                    onChange={handleChange}
                    className="w-5 h-5 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                  />
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">Verified Submitter</span>
                </label>
              </div>
            </div>
          </div>

          {/* Classification Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-3">Metadata</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Archive Category</label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none"
                >
                  <option value="public">Public Archive</option>
                  <option value="heritage">Heritage (Internal)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Relationship</label>
                <select 
                  name="relation"
                  value={formData.relation}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none"
                >
                  <option value="immediate-family">Immediate Family</option>
                  <option value="friend">Friend</option>
                  <option value="colleague">Colleague</option>
                  <option value="public-observer">Public Observer</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
             <p className="text-xs text-blue-700 leading-relaxed font-medium">
                <strong>Tip:</strong> Good stories usually contain at least 200 words and include a high-quality cover image to increase engagement.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}