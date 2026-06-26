'use client';
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/redux/store";
import { publishStory, fetchStoryById } from "@/lib/redux/storySlice";
import {
  CheckCircle, Star, Mail, User, ShieldCheck,
  ArrowLeft, Calendar, BookOpen, Send, Loader2,
  Video, ImageOff, X, ChevronLeft, ChevronRight, Play
} from "lucide-react";
import Link from "next/link";

interface MediaItem {
  url: string;
  type: "image" | "video";
  _id: string;
}

export default function ViewStoryPage() {
  const params   = useParams();
  const id       = params.id as string;
  const dispatch = useDispatch<AppDispatch>();

  const [publishing, setPublishing] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const story = useSelector((state: RootState) =>
    state.stories.stories.find((s) => s._id === id) ??
    state.stories.currentStory
  );

  const storeLoading = useSelector((state: RootState) => state.stories.loading);

  // Fetch if not already in store (e.g. direct URL visit)
  useEffect(() => {
    if (!story) dispatch(fetchStoryById(id));
  }, [id, story, dispatch]);

  const handlePublish = async () => {
    if (!story || publishing) return;
    setPublishing(true);
    await dispatch(publishStory(story._id!));
    setPublishing(false);
  };

  // ── Media helpers ──────────────────────────────────────────────
  const media: MediaItem[] = (story as any)?.media || [];

  // Hero: explicit imageUrl, then first media image, then first media video
  const heroImageUrl  = story?.imageUrl || media.find(m => m.type === "image")?.url || null;
  const heroVideoItem = !heroImageUrl ? media.find(m => m.type === "video") : null;

  // Lightbox nav
  const openLightbox  = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prevItem = () => setLightboxIndex(i => i !== null ? (i - 1 + media.length) % media.length : null);
  const nextItem = () => setLightboxIndex(i => i !== null ? (i + 1) % media.length : null);

  // ── Loading / not found states ─────────────────────────────────
  if (!story && storeLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 size={40} className="animate-spin text-blue-500" />
        <p className="text-slate-500 font-medium">Loading story…</p>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="p-4 bg-slate-100 rounded-full text-slate-400">
          <BookOpen size={48} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Story not found</h2>
        <p className="text-slate-500">This story doesn't exist or has been moved.</p>
        <Link href="/" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 animate-in fade-in duration-500">
      <Link
        href="/"
        className="group inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-8 transition-colors font-medium"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl shadow-slate-200/50">

        {/* ── Hero ────────────────────────────────────────────────── */}
        <div className="relative w-full h-[450px] bg-slate-900">
          {heroImageUrl ? (
            <img
              src={heroImageUrl}
              alt={story.title}
              className="w-full h-full object-cover opacity-80"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          ) : heroVideoItem ? (
            <video
              src={heroVideoItem.url}
              className="w-full h-full object-cover opacity-80"
              muted
              preload="metadata"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900">
              <BookOpen size={80} className="text-slate-600" />
            </div>
          )}

          {/* Play icon overlay for video hero */}
          {heroVideoItem && (
            <button
              onClick={() => openLightbox(media.findIndex(m => m._id === heroVideoItem._id))}
              className="absolute inset-0 flex items-center justify-center group"
            >
              <div className="bg-black/50 group-hover:bg-black/70 rounded-full p-5 transition-colors">
                <Play size={32} className="text-white" fill="white" />
              </div>
            </button>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />

          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <div className="flex flex-wrap gap-2 mb-4">
              {story.isFeatured && (
                <span className="bg-amber-400 text-amber-950 px-4 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 shadow-lg shadow-amber-400/30">
                  <Star size={12} fill="currentColor" /> FEATURED
                </span>
              )}
              {media.length > 0 && (
                <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-[11px] font-bold">
                  {media.length} media item{media.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight max-w-3xl">
              {story.title}
            </h1>
          </div>
        </div>

        {/* ── Body ────────────────────────────────────────────────── */}
        <div className="p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* Main column */}
            <div className="lg:col-span-8 space-y-10">

              {/* Narrative */}
              <div>
                <div className="flex items-center gap-2 mb-6 text-slate-400">
                  <div className="h-px w-8 bg-slate-200" />
                  <h2 className="text-xs uppercase tracking-[0.2em] font-bold">The Narrative</h2>
                </div>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-xl font-medium">
                  {story.narrative}
                </p>
              </div>

              {/* Media gallery */}
              {media.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-6 text-slate-400">
                    <div className="h-px w-8 bg-slate-200" />
                    <h2 className="text-xs uppercase tracking-[0.2em] font-bold">Media</h2>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {media.map((item, i) => (
                      <button
                        key={item._id}
                        type="button"
                        onClick={() => openLightbox(i)}
                        className="group relative aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all"
                      >
                        {item.type === "image" ? (
                          <img
                            src={item.url}
                            alt={`media-${i}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              (e.currentTarget.nextSibling as HTMLElement)?.classList.remove("hidden");
                            }}
                          />
                        ) : (
                          <video
                            src={item.url}
                            className="w-full h-full object-cover"
                            muted
                            preload="metadata"
                          />
                        )}

                        {/* Error fallback */}
                        <div className="hidden absolute inset-0 flex items-center justify-center text-slate-300">
                          <ImageOff size={24} />
                        </div>

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          {item.type === "video" && (
                            <div className="bg-black/60 rounded-full p-2">
                              <Play size={18} className="text-white" fill="white" />
                            </div>
                          )}
                        </div>

                        {/* Type badge */}
                        <span className="absolute bottom-1.5 right-1.5 text-[9px] font-bold bg-black/60 text-white px-1.5 py-0.5 rounded-full capitalize flex items-center gap-0.5">
                          {item.type === "video" ? <Video size={9} /> : null}
                          {item.type}
                        </span>

                        {/* Cover badge */}
                        {item.url === story.imageUrl && (
                          <span className="absolute top-1.5 left-1.5 text-[9px] font-bold bg-blue-600 text-white px-1.5 py-0.5 rounded-full">
                            Cover
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4">
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 sticky top-8 space-y-8">
                <h3 className="text-slate-900 font-bold">Metadata</h3>

                {/* Author */}
                <div className="group">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Author</label>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100">
                      <User size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 text-base">
                        {story.name}
                        {story.isVerified && <CheckCircle size={16} className="text-blue-500 fill-blue-50" />}
                      </div>
                      {story.email && (
                        <div className="flex items-center gap-1.5 text-sm text-slate-500 font-medium">
                          <Mail size={14} /> {story.email}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Relation */}
                {(story as any).relation && (
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Relation</label>
                    <div className="flex items-center gap-3 text-slate-700 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                      <ShieldCheck size={18} className="text-indigo-500" />
                      <span className="font-semibold capitalize text-sm">
                        {(story as any).relation.replace(/-/g, " ")}
                      </span>
                    </div>
                  </div>
                )}

                {/* Status */}
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Status</label>
                  <div className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wide bg-white border border-slate-100 shadow-sm mb-4">
                    <div className={`w-2 h-2 rounded-full mr-2 ${story.status === "published" ? "bg-green-500 animate-pulse" : "bg-amber-500"}`} />
                    <span className={story.status === "published" ? "text-green-700" : "text-amber-700"}>
                      {story.status}
                    </span>
                  </div>

                  {story.status === "pending" && (
                    <button
                      onClick={handlePublish}
                      disabled={publishing}
                      className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-sm shadow-green-200"
                    >
                      {publishing
                        ? <><Loader2 size={16} className="animate-spin" /> Publishing…</>
                        : <><Send size={16} /> Publish Story</>}
                    </button>
                  )}

                  {story.status === "published" && (
                    <p className="text-green-600 text-xs font-semibold flex items-center gap-1.5 mt-1">
                      <CheckCircle size={13} /> Live on the main site
                    </p>
                  )}
                </div>

                {/* Date / ID */}
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  {(story as any).createdAt && (
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <Calendar size={14} />
                      {new Date((story as any).createdAt).toLocaleDateString("en-US", {
                        month: "long", day: "numeric", year: "numeric"
                      })}
                    </div>
                  )}
                  <p className="text-slate-300 text-xs font-mono">
                    ID: {story._id?.slice(-8).toUpperCase()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Lightbox ──────────────────────────────────────────────── */}
      {lightboxIndex !== null && media[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
          >
            <X size={20} />
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm font-medium">
            {lightboxIndex + 1} / {media.length}
          </div>

          {/* Prev */}
          {media.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prevItem(); }}
              className="absolute left-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Media */}
          <div
            className="relative max-w-4xl w-full rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {media[lightboxIndex].type === "image" ? (
              <img
                src={media[lightboxIndex].url}
                alt="preview"
                className="w-full max-h-[80vh] object-contain bg-black"
              />
            ) : (
              <video
                src={media[lightboxIndex].url}
                controls
                autoPlay
                className="w-full max-h-[80vh] bg-black"
              />
            )}
          </div>

          {/* Next */}
          {media.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); nextItem(); }}
              className="absolute right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}