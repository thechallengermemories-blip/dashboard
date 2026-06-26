"use client";

import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Save, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Image as ImageIcon,
  ChevronLeft,
  LayoutDashboard,
  Eye,
  Trash2,
  Video,
  X,
  Film,
  Upload,
  Plus
} from "lucide-react";

import { 
  fetchStoryById, 
  updateStory, 
  deleteStory, 
  clearStoryStatus 
} from "@/lib/redux/storySlice";
import { RootState, AppDispatch } from "@/lib/redux/store";

interface MediaItem {
  url: string;
  type: "image" | "video";
  _id: string;
}

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

async function uploadToCloudinary(file: File): Promise<{ url: string; type: "image" | "video" }> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('/api/upload', { method: 'POST', body: formData });
  if (!res.ok) throw new Error('Upload failed');
  return res.json(); // { url, type }
}

export default function EditStoryPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { currentStory, loading, error, success } = useSelector(
    (state: RootState) => state.stories
  );

  const [formData, setFormData] = useState({
    title: "",
    narrative: "",
    imageUrl: "",
    status: "pending",
    isFeatured: false,
    isVerified: false,
  });

  const [media, setMedia] = useState<MediaItem[]>([]);
  const [editingMediaId, setEditingMediaId] = useState<string | null>(null);
  const [editingMediaUrl, setEditingMediaUrl] = useState("");
  const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState<{ name: string; progress: "uploading" | "done" | "error" }[]>([]);

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
        isFeatured: !!currentStory.isFeatured,
        isVerified: !!currentStory.isVerified,
      });
      setMedia((currentStory as any).media || []);
    }
  }, [currentStory]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

const handleSave = async (e: React.FormEvent) => {
  e.preventDefault();

  // Strip local-* _ids so Mongoose generates real ones
  const cleanMedia = media.map(({ _id, ...rest }) =>
    _id.startsWith("local-") ? rest : { _id, ...rest }
  );

  const result = await dispatch(
    updateStory({ id: id as string, storyData: { ...formData, media: cleanMedia } })
  );
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

  // ── Media upload ──────────────────────────────────────────────
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // Reset input so the same file can be re-selected if needed
    e.target.value = "";

    const trackers = files.map((f) => ({ name: f.name, progress: "uploading" as const }));
    setUploadingFiles(trackers);

    const results = await Promise.allSettled(files.map((f) => uploadToCloudinary(f)));

    const newItems: MediaItem[] = [];
    const updated = trackers.map((t, i) => {
      const result = results[i];
      if (result.status === "fulfilled") {
        newItems.push({
          url: result.value.url,
          type: result.value.type,
          _id: `local-${Date.now()}-${i}`,
        });
        return { ...t, progress: "done" as const };
      }
      return { ...t, progress: "error" as const };
    });

    setUploadingFiles(updated);
    setMedia((prev) => [...prev, ...newItems]);

    // Clear trackers after a moment
    setTimeout(() => setUploadingFiles([]), 2500);
  };

  // ── Media editing ─────────────────────────────────────────────
  const startEditMedia = (item: MediaItem) => {
    setEditingMediaId(item._id);
    setEditingMediaUrl(item.url);
  };

  const saveMediaEdit = (itemId: string) => {
    setMedia((prev) =>
      prev.map((m) => (m._id === itemId ? { ...m, url: editingMediaUrl } : m))
    );
    setEditingMediaId(null);
    setEditingMediaUrl("");
  };

  const removeMedia = (itemId: string) => {
    const removed = media.find((m) => m._id === itemId);
    setMedia((prev) => prev.filter((m) => m._id !== itemId));
    if (removed?.url === formData.imageUrl) {
      setFormData((prev) => ({ ...prev, imageUrl: "" }));
    }
  };

  const setCoverImage = (url: string) => {
    setFormData((prev) => ({ ...prev, imageUrl: url }));
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
      {/* Sticky Header */}
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
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3">
            <CheckCircle2 className="text-emerald-500 shrink-0" size={24} />
            <p className="font-semibold">Your changes have been preserved successfully.</p>
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl flex items-center gap-3">
            <AlertCircle className="text-red-500 shrink-0" size={24} />
            <p className="font-semibold">
              Update failed: {typeof error === "string" ? error : "Check your connection"}
            </p>
          </div>
        )}

        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* ── Left Column ── */}
          <div className="lg:col-span-8 space-y-6">

            {/* Core Narrative */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                <LayoutDashboard size={18} className="text-blue-500" />
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
                    Narrative Content
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
                    <span className="text-[10px] text-slate-400 font-mono">
                      {formData.narrative.length} characters
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Media Gallery */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                <Film size={18} className="text-blue-500" />
                <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                  Attached Media
                </h2>
                <span className="ml-auto text-xs text-slate-400 font-medium">
                  {media.length} item{media.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="p-6 md:p-8 space-y-5">

                {/* Upload drop zone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/40 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center transition-colors">
                    <Plus size={22} className="text-blue-600" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-slate-700 group-hover:text-blue-700 transition-colors">
                      Add images or videos
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Click to browse · JPG, PNG, WebP, MP4, WebM
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </div>

                {/* Upload progress trackers */}
                {uploadingFiles.length > 0 && (
                  <div className="space-y-2">
                    {uploadingFiles.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-100 bg-slate-50"
                      >
                        {f.progress === "uploading" && (
                          <Loader2 size={16} className="animate-spin text-blue-500 shrink-0" />
                        )}
                        {f.progress === "done" && (
                          <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                        )}
                        {f.progress === "error" && (
                          <AlertCircle size={16} className="text-red-500 shrink-0" />
                        )}
                        <span className="text-xs font-medium text-slate-600 truncate flex-1">
                          {f.name}
                        </span>
                        <span className={`text-[10px] font-bold uppercase tracking-wide
                          ${f.progress === "uploading" ? "text-blue-500" : ""}
                          ${f.progress === "done" ? "text-emerald-500" : ""}
                          ${f.progress === "error" ? "text-red-500" : ""}
                        `}>
                          {f.progress === "uploading" ? "Uploading…" : f.progress === "done" ? "Done" : "Failed"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Media grid */}
                {media.length === 0 && uploadingFiles.length === 0 ? (
                  <div className="text-center py-6 text-slate-400">
                    <ImageIcon size={32} className="mx-auto mb-2 opacity-40" />
                    <p className="text-sm font-medium">No media attached yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {media.map((item) => (
                      <div
                        key={item._id}
                        className="group relative rounded-2xl border border-slate-200 overflow-hidden bg-slate-50"
                      >
                        {/* Thumbnail */}
                        <div className="relative aspect-video bg-slate-100">
                          {item.type === "image" ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.url}
                              alt="media"
                              className="w-full h-full object-cover"
                              onError={(e) =>
                                (e.currentTarget.src = "https://placehold.co/600x400?text=Error")
                              }
                            />
                          ) : (
                            <video
                              src={item.url}
                              className="w-full h-full object-cover"
                              muted
                              preload="metadata"
                            />
                          )}

                          {/* Hover overlay */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <button
                              type="button"
                              onClick={() => setPreviewMedia(item)}
                              className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                              title="Preview"
                            >
                              <Eye size={16} className="text-slate-700" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeMedia(item._id)}
                              className="p-2 bg-white/90 rounded-full hover:bg-red-50 transition-colors"
                              title="Remove"
                            >
                              <Trash2 size={16} className="text-red-500" />
                            </button>
                          </div>

                          {/* Badges */}
                          {item.url === formData.imageUrl && (
                            <span className="absolute top-2 left-2 text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full">
                              Cover
                            </span>
                          )}
                          <span className="absolute top-2 right-2 text-[10px] font-bold bg-black/60 text-white px-2 py-0.5 rounded-full capitalize flex items-center gap-1">
                            {item.type === "video" ? <Video size={10} /> : <ImageIcon size={10} />}
                            {item.type}
                          </span>
                        </div>

                        {/* URL / actions row */}
                        <div className="p-3 space-y-2">
                          {editingMediaId === item._id ? (
                            <div className="flex gap-2">
                              <input
                                type="url"
                                value={editingMediaUrl}
                                onChange={(e) => setEditingMediaUrl(e.target.value)}
                                className="flex-1 text-xs px-3 py-2 border border-blue-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-200"
                                autoFocus
                              />
                              <button
                                type="button"
                                onClick={() => saveMediaEdit(item._id)}
                                className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700"
                              >
                                OK
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingMediaId(null)}
                                className="p-1.5 text-slate-400 hover:text-slate-600"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <p
                                className="flex-1 text-xs text-slate-400 truncate font-mono"
                                title={item.url}
                              >
                                {item.url}
                              </p>
                              <button
                                type="button"
                                onClick={() => startEditMedia(item)}
                                className="shrink-0 text-[10px] font-bold text-blue-500 hover:text-blue-700 transition-colors"
                              >
                                Edit URL
                              </button>
                            </div>
                          )}

                          {item.type === "image" && item.url !== formData.imageUrl && (
                            <button
                              type="button"
                              onClick={() => setCoverImage(item.url)}
                              className="w-full text-[11px] font-bold text-slate-500 hover:text-blue-600 hover:bg-blue-50 py-1.5 rounded-lg transition-colors border border-slate-100"
                            >
                              Set as Cover Image
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* ── Right Sidebar ── */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
              <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-4">Settings</h3>

              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Story Status
                </label>
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

              <div className="pt-2 space-y-2 border-t border-slate-100">
                <label className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group">
                  <div>
                    <p className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                      Featured Story
                    </p>
                    <p className="text-xs text-slate-400">Highlighted on the homepage</p>
                  </div>
                  <input
                    name="isFeatured"
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    className="w-5 h-5 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group">
                  <div>
                    <p className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                      Verified Identity
                    </p>
                    <p className="text-xs text-slate-400">Submitter identity confirmed</p>
                  </div>
                  <input
                    name="isVerified"
                    type="checkbox"
                    checked={formData.isVerified}
                    onChange={handleChange}
                    className="w-5 h-5 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* Submitter Info */}
            {currentStory && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-4">Submitter</h3>
                <div className="space-y-3 text-sm">
                  {(currentStory as any).name && (
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">Name</span>
                      <span className="font-bold text-slate-700">{(currentStory as any).name}</span>
                    </div>
                  )}
                  {(currentStory as any).email && (
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-400 font-medium shrink-0">Email</span>
                      <span className="font-bold text-slate-700 text-right break-all">
                        {(currentStory as any).email}
                      </span>
                    </div>
                  )}
                  {(currentStory as any).relation && (
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">Relation</span>
                      <span className="font-bold text-slate-700 capitalize">
                        {(currentStory as any).relation.replace(/-/g, " ")}
                      </span>
                    </div>
                  )}
                  {(currentStory as any).createdAt && (
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">Submitted</span>
                      <span className="font-bold text-slate-700">
                        {new Date((currentStory as any).createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Danger Zone */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleDelete}
                className="w-full flex items-center justify-center gap-2 py-4 text-red-500 hover:text-red-700 hover:bg-red-50 border border-red-100 rounded-2xl transition-all font-bold"
              >
                <Trash2 size={18} />
                Delete Permanent Record
              </button>
            </div>
          </div>
        </form>
      </main>

      {/* Preview Modal */}
      {previewMedia && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewMedia(null)}
        >
          <div
            className="relative max-w-3xl w-full rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewMedia(null)}
              className="absolute top-3 right-3 z-10 p-2 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors"
            >
              <X size={18} />
            </button>
            {previewMedia.type === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewMedia.url}
                alt="preview"
                className="w-full max-h-[80vh] object-contain bg-black"
              />
            ) : (
              <video
                src={previewMedia.url}
                controls
                autoPlay
                className="w-full max-h-[80vh] bg-black"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}