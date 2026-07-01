'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { 
  PlusCircle, 
  Pencil, 
  Trash2, 
  Users, 
  Search, 
  SlidersHorizontal, 
  Briefcase, 
  Hash, 
  UserCheck 
} from 'lucide-react';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { fetchCrew, deleteCrewMember, clearCrewStatus } from '@/lib/redux/crewSlice';

const CrewPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { crew, loading, error } = useSelector((state: RootState) => state.crew);

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');

  useEffect(() => {
    dispatch(fetchCrew());
  }, [dispatch]);

  const handleDelete = (slug: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) return;
    dispatch(deleteCrewMember(slug)).then(() => {
      dispatch(clearCrewStatus());
    });
  };

  // Extract unique roles for the filter dropdown
  const uniqueRoles = useMemo(() => {
    const roles = crew.map((member) => member.role);
    return ['All', ...Array.from(new Set(roles))];
  }, [crew]);

  // Derived filtered data
  const filteredCrew = useMemo(() => {
    return crew.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.crewId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = selectedRole === 'All' || member.role === selectedRole;

      return matchesSearch && matchesRole;
    });
  }, [crew, searchQuery, selectedRole]);

  // Quick stats calculations
  const totalCrew = crew.length;
  const uniqueRolesCount = useMemo(() => new Set(crew.map((m) => m.role)).size, [crew]);
  const assignedSeatsCount = useMemo(() => crew.filter((m) => m.seat && m.seat.trim() !== '').length, [crew]);

  // Generate initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
            <Users size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Crew Registry</h1>
            <p className="text-sm text-slate-500">
              Manage your crew personnel, assign mission roles, and allocate cabin coordinates.
            </p>
          </div>
        </div>
        <Link
          href="/crew/new"
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm shadow-blue-500/10 hover:shadow-blue-500/20"
        >
          <PlusCircle size={16} />
          Add Crew Member
        </Link>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          {typeof error === 'string' ? error : 'Something went wrong loading crew data.'}
        </div>
      )}

      {/* Stats Cards Dashboard Overview */}
      {!loading && crew.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white border border-slate-200 p-5 rounded-xl flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Crew</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalCrew}</h3>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg text-slate-500 border border-slate-100">
              <Users size={20} />
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-xl flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Roles</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{uniqueRolesCount}</h3>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg text-slate-500 border border-slate-100">
              <Briefcase size={20} />
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-xl flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Allocated Seats</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {assignedSeatsCount} <span className="text-sm font-normal text-slate-400">/ {totalCrew}</span>
              </h3>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg text-slate-500 border border-slate-100">
              <UserCheck size={20} />
            </div>
          </div>
        </div>
      )}

      {/* Control Bar (Search & Filter) */}
      {!loading && crew.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="relative w-full sm:w-80">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search by name, ID, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white text-slate-900 placeholder-slate-400 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <SlidersHorizontal size={14} className="text-slate-400" />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white text-slate-700 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all cursor-pointer"
            >
              {uniqueRoles.map((role) => (
                <option key={role} value={role}>
                  {role === 'All' ? 'All Roles' : role}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Main Table / State Section */}
      {loading ? (
        // Skeleton Loader designed for Light Theme
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
          <div className="h-12 bg-slate-55 border-b border-slate-200 animate-pulse" />
          <div className="divide-y divide-slate-100">
            {[1, 2, 3, 4, 5].map((idx) => (
              <div key={idx} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-1/3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse" />
                  <div className="space-y-1 w-full">
                    <div className="h-4 bg-slate-150 rounded w-3/4 animate-pulse" />
                    <div className="h-3 bg-slate-150 rounded w-1/2 animate-pulse" />
                  </div>
                </div>
                <div className="h-4 bg-slate-150 rounded w-1/6 animate-pulse" />
                <div className="h-4 bg-slate-150 rounded w-1/6 animate-pulse" />
                <div className="h-8 bg-slate-150 rounded w-12 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      ) : filteredCrew.length === 0 ? (
        // Empty State designed for Light Theme
        <div className="flex flex-col items-center justify-center py-20 px-4 border border-dashed border-slate-200 rounded-2xl bg-white text-center shadow-sm">
          <div className="p-4 bg-slate-50 rounded-full border border-slate-100 text-slate-400 mb-4">
            <Users size={32} />
          </div>
          <h3 className="text-base font-semibold text-slate-900">No crew members found</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm">
            {searchQuery || selectedRole !== 'All' 
              ? "We couldn't find any crew records matching your search filters. Try adjusting your query."
              : "Get started by logging your first crew personnel record into the database."}
          </p>
          {(searchQuery || selectedRole !== 'All') ? (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedRole('All');
              }}
              className="mt-4 text-xs font-semibold text-blue-600 hover:text-blue-500 transition-colors"
            >
              Reset Filters
            </button>
          ) : (
            <Link
              href="/crew/new"
              className="mt-4 inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <PlusCircle size={15} />
              Add First Member
            </Link>
          )}
        </div>
      ) : (
        // Redesigned Table View for Light Theme
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase text-[11px] tracking-wider select-none">
                  <th className="px-6 py-4">Crew Member</th>
                  <th className="px-6 py-4">Crew ID</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Seat Assigned</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCrew.map((member) => (
                  <tr 
                    key={member.slug} 
                    className="group hover:bg-slate-50/60 transition-all duration-150"
                  >
                    {/* Name & Avatar column */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center text-xs font-semibold text-slate-600 shadow-sm">
                          {getInitials(member.name)}
                        </div>
                        <div>
                          <p className="text-slate-950 font-semibold hover:text-blue-600 transition-colors">
                            {member.name}
                          </p>
                          <span className="text-xs text-slate-400 block md:hidden">
                            ID: {member.crewId}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Crew ID column */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-50 text-slate-600 font-mono text-xs border border-slate-200">
                        <Hash size={11} className="text-slate-400" />
                        {member.crewId}
                      </span>
                    </td>

                    {/* Role Badge column */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center text-slate-700 bg-slate-100/70 px-2.5 py-1 rounded-full text-xs border border-slate-200/50 font-medium">
                        {member.role}
                      </span>
                    </td>

                    {/* Seat Assignment column */}
                    <td className="px-6 py-4">
                      {member.seat ? (
                        <span className="text-blue-700 font-mono text-xs bg-blue-50 border border-blue-100 px-2 py-0.5 rounded font-medium">
                          {member.seat}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs italic">Unassigned</span>
                      )}
                    </td>

                    {/* Action Panel Column */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-90 md:opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        <Link
                          href={`/crew/${member.slug}`}
                          className="p-1.5 text-slate-600 hover:text-blue-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-blue-200 rounded-md transition-all flex items-center gap-1 text-xs font-medium"
                          title="Edit member details"
                        >
                          <Pencil size={13} />
                          <span>Edit</span>
                        </Link>
                        <button
                          onClick={() => handleDelete(member.slug, member.name)}
                          className="p-1.5 text-slate-600 hover:text-red-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-red-200 rounded-md transition-all flex items-center gap-1 text-xs font-medium"
                          title="Delete member from database"
                        >
                          <Trash2 size={13} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Table Footer */}
          <div className="bg-slate-50/50 border-t border-slate-200 px-6 py-3.5 flex items-center justify-between text-xs text-slate-400">
            <span>
              Showing {filteredCrew.length} of {totalCrew} records
            </span>
            {searchQuery || selectedRole !== 'All' ? (
              <span>Filtered database view</span>
            ) : (
              <span>Active database connected</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CrewPage;