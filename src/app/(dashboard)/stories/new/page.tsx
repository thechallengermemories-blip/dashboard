"use client";

import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  PlusCircle, 
  ChevronLeft, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Image as ImageIcon,
  Type,
  FileText,
  User,
  Mail,
  UploadCloud,
  Send
} from "lucide-react";

import { createStory, clearStoryStatus } from "@/lib/redux/storySlice";
import { RootState, AppDispatch } from "@/lib/redux/store";

export default function NewStoryPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { loading, error, success } = useSelector((state: RootState) => state.stories);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    title: "",
    narrative: "",
    mission: "challenger",
    category: "public",
    relation: "public-observer",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    dispatch(clearStoryStatus());
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.narrative || !formData.name) {
      alert("Please fill in Name, Title, and Narrative.");
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (imageFile) data.append("image", imageFile);

    const result = await dispatch(createStory(data as any));
    if (createStory.fulfilled.match(result)) {
      setTimeout(() => {
        dispatch(clearStoryStatus());
        router.push("/");
      }, 1500);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 px-4 pt-4 sm:pt-8">
      {/* 1. Header with Back Button on Left */}
      <div className="flex flex-col gap-4 mb-8">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-semibold w-fit"
        >
          <ChevronLeft size={20} />
          Back to Stories
        </Link>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
          New Archive Entry
        </h1>
      </div>

      {/* Status Notifications */}
      {success && (
        <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 size={24} className="text-emerald-500" />
          <p className="font-bold">Story Published Successfully! Redirecting...</p>
        </div>
      )}
      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl flex items-center gap-3">
          <AlertCircle size={24} className="text-red-500" />
          <p className="font-bold">Error: {typeof error === 'string' ? error : 'Failed to save'}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: MAIN CONTENT */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* High Visibility Title Section */}
          <section className="bg-white p-6 md:p-8 rounded-3xl border-2 border-slate-200 shadow-sm">
            <label className="block text-sm font-black text-blue-600 uppercase tracking-widest mb-3">
              Story Title
            </label>
            <input 
              name="title"
              type="text" 
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter a descriptive title..."
              className="w-full px-0 py-2 bg-transparent border-b-4 border-slate-100 focus:border-blue-500 outline-none transition-all text-3xl md:text-4xl font-bold text-slate-950 placeholder:text-slate-300"
            />
          </section>

          {/* Narrative Section */}
          <section className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-800 font-bold mb-2">
              <FileText size={20} className="text-blue-500" />
              <span>Narrative Details</span>
            </div>
            <textarea 
              name="narrative"
              rows={12}
              required
              value={formData.narrative}
              onChange={handleChange}
              placeholder="Tell the story here..."
              className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-lg text-slate-800 leading-relaxed"
            />
          </section>

          {/* Author Info Section */}
          <section className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase">Author Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input name="name" type="text" required value={formData.name} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900" placeholder="Your Name" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900" placeholder="Email (Optional)" />
                  </div>
                </div>
             </div>
          </section>

          {/* Image Upload */}
          <section className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
              <ImageIcon size={20} className="text-blue-500" /> Media Attachment
            </h3>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center bg-slate-50 hover:bg-white hover:border-blue-400 transition-all cursor-pointer"
            >
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="max-h-64 rounded-xl shadow-lg" />
              ) : (
                <>
                  <UploadCloud size={48} className="text-slate-300 mb-2" />
                  <p className="font-bold text-slate-600">Click to upload story image</p>
                </>
              )}
            </div>
          </section>

          {/* SAVE BUTTON BELOW FORM */}
          <div className="pt-6">
            <button 
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-12 py-5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-xl shadow-blue-200 transition-all transform active:scale-95"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Send size={24} />}
              {success ? "Success!" : "Save & Publish Story"}
            </button>
            <p className="text-center md:text-left text-slate-400 text-sm mt-4">
              By publishing, you agree that this content is accurate and follows community guidelines.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: CLASSIFICATION */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 p-6 md:p-8 rounded-3xl text-white shadow-2xl lg:sticky lg:top-8">
            <h3 className="text-lg font-bold border-b border-slate-800 pb-4 mb-6">Settings</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="public">Public Stories</option>
                  <option value="heritage">Heritage Archive</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Target Mission</label>
                <select name="mission" value={formData.mission} onChange={handleChange} className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl font-bold outline-none">
                  <option value="challenger">Challenger (STS-51-L)</option>
                  <option value="columbia">Columbia (STS-107)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Connection</label>
                <select name="relation" value={formData.relation} onChange={handleChange} className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl font-bold outline-none">
                  <option value="public-observer">Public Observer</option>
                  <option value="immediate-family">Immediate Family</option>
                  <option value="friend">Friend</option>
                  <option value="colleague">Colleague</option>
                </select>
              </div>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}