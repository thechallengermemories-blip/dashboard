'use client';
import { Story } from "@/types/story";
import { Eye, Edit3, Trash2, CheckCircle, Star, ImageOff, Video } from "lucide-react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { deleteStory } from "@/lib/redux/storySlice";
import { AppDispatch } from "@/lib/redux/store";

interface MediaItem {
  url: string;
  type: "image" | "video";
  _id: string;
}

export default function StoryCard({ story }: { story: Story }) {
  const dispatch = useDispatch<AppDispatch>();

  const media: MediaItem[] = (story as any).media || [];

  // Resolve what to show in the card thumbnail
  const coverImage = story.imageUrl || null;
  const firstMedia = media[0] || null;

  // Prefer explicit coverImage, then first media item
  const thumbUrl = coverImage || (firstMedia?.type === "image" ? firstMedia.url : null);
  const isVideoThumb = !coverImage && firstMedia?.type === "video";
  const hasMedia = !!coverImage || !!firstMedia;

  const statusColor = {
    published: "bg-green-100 text-green-700",
    pending: "bg-amber-100 text-amber-700",
    archived: "bg-slate-100 text-slate-700",
  }[story.status] ?? "bg-slate-100 text-slate-700";

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this story?")) {
      dispatch(deleteStory(story._id!));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      
      {/* Thumbnail */}
      <div className="h-44 w-full relative overflow-hidden bg-slate-100 shrink-0">
        {thumbUrl ? (
          <img
            src={thumbUrl}
            alt={story.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.nextElementSibling?.classList.remove("hidden");
            }}
          />
        ) : isVideoThumb ? (
          <video
            src={firstMedia!.url}
            className="w-full h-full object-cover"
            muted
            preload="metadata"
          />
        ) : (
          // No media at all
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-300">
            <ImageOff size={32} />
            <span className="text-xs font-medium">No media</span>
          </div>
        )}

        {/* Fallback shown via JS if img errors */}
        <div className="hidden w-full h-full absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-300 bg-slate-100">
          <ImageOff size={32} />
          <span className="text-xs font-medium">Image unavailable</span>
        </div>

        {/* Video badge when showing a video thumbnail */}
        {isVideoThumb && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/50 rounded-full p-3">
              <Video size={24} className="text-white" />
            </div>
          </div>
        )}

        {/* Top badges */}
        <div className="absolute top-2 left-2 right-2 flex items-start justify-between gap-2">
          {/* Media count pill */}
          {media.length > 0 && (
            <span className="text-[10px] font-bold bg-black/60 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
              {media.length} media
            </span>
          )}

          {story.isFeatured && (
            <span className="ml-auto text-[10px] font-bold bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Star size={10} fill="currentColor" /> Featured
            </span>
          )}
        </div>

        {/* Status badge overlaid bottom-left */}
        <div className="absolute bottom-2 left-2">
          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${statusColor}`}>
            {story.status}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-base font-bold text-slate-800 line-clamp-1 mb-1">
          {story.title}
        </h3>

        <div className="flex items-center gap-1.5 mb-3">
          <p className="text-xs text-slate-500 font-medium">By {story.name}</p>
          {story.isVerified && (
            <CheckCircle size={13} className="text-blue-500 shrink-0" />
          )}
        </div>

        <p className="text-slate-500 text-sm line-clamp-3 leading-relaxed flex-1">
          {story.narrative}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-4 mt-4 border-t border-slate-100">
          <Link
            href={`/stories/${story._id}`}
            className="flex-1 flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            <Eye size={15} /> View
          </Link>
          <Link
            href={`/stories/${story._id}/edit`}
            className="flex-1 flex items-center justify-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            <Edit3 size={15} /> Edit
          </Link>
          <button
            onClick={handleDelete}
            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}