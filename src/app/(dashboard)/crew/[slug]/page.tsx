'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Save, Trash2, ShieldAlert, Image, User, Briefcase } from 'lucide-react';
import { AppDispatch, RootState } from '@/lib/redux/store';
import {
  fetchCrewBySlug,
  createCrewMember,
  updateCrewMember,
  deleteCrewMember,
  resetCurrentCrewMember,
  clearCrewStatus,
} from '@/lib/redux/crewSlice';

const emptyForm = {
  slug: '',
  name: '',
  role: '',
  crewId: '',
  seat: '',
  img: '',
  shortBio: '',
  rawBiography: '',
  media: '', // comma-separated in the form, converted to array on submit
};

const CrewDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const slugParam = params?.slug as string;
  const isNew = slugParam === 'new';

  const { currentCrewMember, loading, error } = useSelector((state: RootState) => state.crew);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isNew) {
      dispatch(fetchCrewBySlug(slugParam));
    } else {
      dispatch(resetCurrentCrewMember());
    }
    return () => {
      dispatch(resetCurrentCrewMember());
    };
  }, [dispatch, slugParam, isNew]);

  useEffect(() => {
    if (currentCrewMember && !isNew) {
      setForm({
        slug: currentCrewMember.slug || '',
        name: currentCrewMember.name || '',
        role: currentCrewMember.role || '',
        crewId: currentCrewMember.crewId || '',
        seat: currentCrewMember.seat || '',
        img: currentCrewMember.img || '',
        shortBio: currentCrewMember.shortBio || '',
        rawBiography: currentCrewMember.rawBiography || '',
        media: (currentCrewMember.media || []).join(', '),
      });
    }
  }, [currentCrewMember, isNew]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      ...form,
      media: form.media
        .split(',')
        .map((m) => m.trim())
        .filter(Boolean),
    };

    try {
      if (isNew) {
        const result = await dispatch(createCrewMember(payload)).unwrap();
        router.push(`/crew/${result.slug}`);
      } else {
        await dispatch(updateCrewMember({ slug: slugParam, crewData: payload })).unwrap();
      }
      dispatch(clearCrewStatus());
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${form.name || 'this crew member'}? This cannot be undone.`)) return;
    await dispatch(deleteCrewMember(slugParam));
    router.push('/crew');
  };

  if (!isNew && loading && !currentCrewMember) {
    return (
      <div className="max-w-3xl mx-auto py-20 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4" />
        <p className="text-slate-500 font-medium text-sm">Loading crew record...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-slate-800">
      
      {/* Navigation & Header */}
      <div className="space-y-4">
        <button
          onClick={() => router.push('/crew')}
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-900 text-sm font-medium transition-colors group"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
          Back to Crew Records
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {isNew ? 'Add Crew Member' : `Edit ${form.name || 'Crew Member'}`}
            </h1>
            <p className="text-sm text-slate-500">
              {isNew 
                ? 'Create a new database entry for incoming crew personnel.' 
                : 'Modify identity details, metadata, and biographies for this crew record.'}
            </p>
          </div>
          
          {!isNew && (
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-red-200 hover:border-red-300 bg-red-50 hover:bg-red-100/80 text-red-600 text-xs font-semibold rounded-lg transition-colors"
            >
              <Trash2 size={14} />
              Delete Record
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="px-4 py-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <ShieldAlert size={16} className="text-red-500 flex-shrink-0" />
          <span>{typeof error === 'string' ? error : (error?.error || 'Something went wrong saving this record.')}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1: Personal & Primary Information */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <User size={18} className="text-blue-500" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Personal Profile</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field 
              label="Full Name" 
              name="name" 
              value={form.name} 
              onChange={handleChange} 
              required 
              placeholder="e.g. Francis R. Scobee"
            />
            <Field
              label="Slug Identifier"
              name="slug"
              value={form.slug}
              onChange={handleChange}
              required
              disabled={!isNew}
              placeholder="e.g. francis-scobee"
              hint={!isNew ? 'Slug cannot be changed after creation' : 'Generated URL segment, use dashes (e.g., jane-doe)'}
            />
          </div>
        </div>

        {/* Section 2: Mission Details */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Briefcase size={18} className="text-blue-500" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Mission Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Field 
              label="Role / Title" 
              name="role" 
              value={form.role} 
              onChange={handleChange} 
              required 
              placeholder="e.g. Commander" 
            />
            <Field 
              label="Crew ID Reference" 
              name="crewId" 
              value={form.crewId} 
              onChange={handleChange} 
              required 
              placeholder="e.g. CDR" 
            />
            <Field 
              label="Seat Coordination" 
              name="seat" 
              value={form.seat} 
              onChange={handleChange} 
              required 
              placeholder="e.g. 01" 
            />
          </div>
        </div>

        {/* Section 3: Media & Biographies */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Image size={18} className="text-blue-500" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Biographies & Resources</h2>
          </div>

          <div className="space-y-5">
            <Field 
              label="Primary Image URL" 
              name="img" 
              value={form.img} 
              onChange={handleChange} 
              required 
              placeholder="https://example.com/avatar.jpg"
            />

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Short Biography <span className="text-red-500">*</span>
              </label>
              <textarea
                name="shortBio"
                value={form.shortBio}
                onChange={handleChange}
                rows={2}
                required
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white text-slate-950 text-sm placeholder:text-slate-400 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
                placeholder="A high-level sentence summarizing their mission status or history."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Full Biography Narrative
              </label>
              <textarea
                name="rawBiography"
                value={form.rawBiography}
                onChange={handleChange}
                rows={6}
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white text-slate-950 text-sm placeholder:text-slate-400 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
                placeholder="Write the comprehensive history, structural credentials, and background for this member..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Auxiliary Media Resource URLs <span className="text-slate-400 font-normal lowercase">(separated by commas)</span>
              </label>
              <input
                name="media"
                value={form.media}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white text-slate-950 text-sm placeholder:text-slate-400 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
                placeholder="https://example.com/media1.jpg, https://example.com/media2.jpg"
              />
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="flex items-center gap-3 justify-end pt-2">
          <button
            type="button"
            onClick={() => router.push('/crew')}
            className="px-4 py-2.5 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 text-sm font-semibold rounded-lg transition-colors"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm shadow-blue-500/15"
          >
            <Save size={16} />
            {submitting ? 'Saving changes...' : isNew ? 'Create Crew Member' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

interface FieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  hint?: string;
}

const Field = ({ label, name, value, onChange, required, disabled, placeholder, hint }: FieldProps) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      placeholder={placeholder}
      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white text-slate-950 text-sm placeholder:text-slate-400 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/10 disabled:opacity-60 disabled:bg-slate-100 disabled:text-slate-500 disabled:border-slate-200 disabled:cursor-not-allowed transition-all"
    />
    {hint && <p className="text-xs text-slate-400 font-medium leading-relaxed">{hint}</p>}
  </div>
);

export default CrewDetailPage;