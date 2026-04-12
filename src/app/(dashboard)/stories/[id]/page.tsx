'use client';
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { 
  CheckCircle, 
  Star, 
  Mail, 
  User, 
  Tag, 
  ShieldCheck, 
  ArrowLeft, 
  Calendar,
  BookOpen
} from "lucide-react";
import Link from "next/link";

export default function ViewStoryPage() {
  const params = useParams();
  const id = params.id as string;
  
  const story = useSelector((state: RootState) => 
    state.stories.stories.find((s) => s._id === id)
  );

  if (!story) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="p-4 bg-slate-100 rounded-full text-slate-400">
          <BookOpen size={48} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Story not found</h2>
        <p className="text-slate-500">The story you are looking for doesn't exist or has been moved.</p>
        <Link href="/" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className=" mx-auto px-4  animate-in fade-in duration-500">
      {/* Navigation */}
      <Link 
        href="/" 
        className="group inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-8 transition-colors font-medium"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
        Back to Dashboard
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl shadow-slate-200/50">
        {/* Header/Image Section */}
        <div className="relative w-full h-[450px] bg-slate-900">
          {story.imageUrl ? (
            <img 
              src={story.imageUrl} 
              alt={story.title} 
              className="w-full h-full object-cover opacity-80" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900">
              <BookOpen size={80} className="text-slate-600" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-lg shadow-blue-500/30">
                {story.mission}
              </span>
              {story.isFeatured && (
                <span className="bg-amber-400 text-amber-950 px-4 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 shadow-lg shadow-amber-400/30">
                  <Star size={12} fill="currentColor" /> FEATURED
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight max-w-3xl">
              {story.title}
            </h1>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Main Narrative */}
            <div className="lg:col-span-8">
              <div className="flex items-center gap-2 mb-6 text-slate-400">
                <div className="h-px w-8 bg-slate-200" />
                <h2 className="text-xs uppercase tracking-[0.2em] font-bold">The Narrative</h2>
              </div>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-xl font-medium">
                  {story.narrative}
                </p>
              </div>
            </div>

            {/* Meta Sidebar */}
            <div className="lg:col-span-4">
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 sticky top-8">
                <h3 className="text-slate-900 font-bold mb-6 flex items-center gap-2">
                  Metadata Details
                </h3>
                
                <div className="space-y-8">
                  {/* Author Info */}
                  <div className="group">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Author</label>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100 group-hover:text-blue-600 transition-colors">
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

                  {/* Classification */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-3">Classification</label>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-slate-700 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                        <Tag size={18} className="text-blue-500" />
                        <span className="font-semibold capitalize">{story.category}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-700 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                        <ShieldCheck size={18} className="text-indigo-500" />
                        <span className="font-semibold capitalize text-sm">{story.relation?.replace("-", " ")}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Current Status</label>
                    <div className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wide bg-white border border-slate-100 shadow-sm">
                      <div className={`w-2 h-2 rounded-full mr-2 ${story.status === 'published' ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`} />
                      <span className={story.status === 'published' ? 'text-green-700' : 'text-amber-700'}>
                        {story.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Footer Meta */}
      <div className="mt-8 flex justify-center items-center gap-6 text-slate-400 text-sm font-medium">
        <div className="flex items-center gap-2">
          <Calendar size={14} /> Registered Internal ID: {story._id.slice(-8).toUpperCase()}
        </div>
      </div>
    </div>
  );
}