import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, Check, X, Search, LogOut, UserCheck, UserMinus, AlertCircle, Trash2, Plus } from 'lucide-react';
import { authApi, adminApi, teamApi } from '../api/auth';

interface MemberUser {
  _id: string;
  name: string;
  email: string;
  company: string;
  position: string;
  city: string;
  pincode: string;
  linkedin: string;
  role: 'member' | 'admin';
  isMainAdmin: boolean;
  status: 'pending' | 'accepted' | 'rejected';
  profileComplete: boolean;
}

const AdminDashboard: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [members, setMembers] = useState<MemberUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterRole, setFilterRole] = useState('');

  // Team Management state
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [teamLoading, setTeamLoading] = useState(true);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberPosition, setNewMemberPosition] = useState('');
  const [newMemberImage, setNewMemberImage] = useState('');
  const [newMemberLinkedin, setNewMemberLinkedin] = useState('');
  const [teamError, setTeamError] = useState<string | null>(null);
  const [teamSuccess, setTeamSuccess] = useState<string | null>(null);

  const navigate = useNavigate();

  // Load Admin User and Member List
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Get Me
      const meResponse = await authApi.getMe();
      if (!meResponse.success || !meResponse.user) {
        navigate('/login');
        return;
      }
      
      const user = meResponse.user;
      setCurrentUser(user);

      if (user.role !== 'admin' || user.status !== 'accepted') {
        setError('Access denied. This portal is restricted to accepted administrators.');
        setLoading(false);
        // Redirect standard members to home
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      // 2. Get Members list
      const params = {
        status: filterStatus || undefined,
        role: filterRole || undefined,
        q: searchQuery || undefined,
      };
      
      const membersResponse = await adminApi.getMembers(params);
      if (membersResponse.success) {
        setMembers(membersResponse.data);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to load system members.');
    } finally {
      setLoading(false);
    }
  };

  const loadTeam = async () => {
    setTeamLoading(true);
    setTeamError(null);
    try {
      const response = await teamApi.getTeam();
      if (response.success && response.data) {
        setTeamMembers(response.data);
      }
    } catch (err: any) {
      console.error(err);
      setTeamError(err.response?.data?.message || 'Failed to load team members.');
    } finally {
      setTeamLoading(false);
    }
  };

  const handleAddTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName || !newMemberPosition) {
      setTeamError('Name and Position are required');
      return;
    }
    setTeamError(null);
    setTeamSuccess(null);
    try {
      const response = await teamApi.addTeamMember({
        name: newMemberName,
        role: newMemberPosition,
        position: newMemberPosition,
        image: newMemberImage || 'images/Gaurav new.png',
        linkedinUrl: newMemberLinkedin
      });
      if (response.success) {
        setTeamSuccess('Team member added successfully!');
        setNewMemberName('');
        setNewMemberPosition('');
        setNewMemberImage('');
        setNewMemberLinkedin('');
        loadTeam();
      }
    } catch (err: any) {
      setTeamError(err.response?.data?.message || 'Failed to add team member.');
    }
  };

  const handleDeleteTeamMember = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this team member?')) return;
    setTeamError(null);
    setTeamSuccess(null);
    try {
      const response = await teamApi.deleteTeamMember(id);
      if (response.success) {
        setTeamSuccess('Team member deleted successfully!');
        loadTeam();
      }
    } catch (err: any) {
      setTeamError(err.response?.data?.message || 'Failed to delete team member.');
    }
  };

  useEffect(() => {
    loadData();
    loadTeam();
  }, [filterStatus, filterRole]); // reload when filter toggles

  // Trigger search on submit or debounce
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  // Approve / Reject status update
  const handleStatusUpdate = async (id: string, status: 'accepted' | 'rejected') => {
    setActionLoading(id);
    setError(null);
    try {
      const response = await adminApi.updateMemberStatus(id, status);
      if (response.success) {
        // Update local list state
        setMembers((prev) =>
          prev.map((member) => (member._id === id ? { ...member, status } : member))
        );
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update member status.');
    } finally {
      setActionLoading(null);
    }
  };

  // Promote / Demote admin privileges
  const handleRoleToggle = async (id: string, currentRole: 'member' | 'admin') => {
    setActionLoading(id);
    setError(null);
    const newRole = currentRole === 'admin' ? 'member' : 'admin';
    try {
      const response = await adminApi.updateMemberRole(id, newRole);
      if (response.success) {
        setMembers((prev) =>
          prev.map((member) => (member._id === id ? { ...member, role: newRole } : member))
        );
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update member role.');
    } finally {
      setActionLoading(null);
    }
  };

  // Logout
  const handleLogout = () => {
    authApi.logout();
    navigate('/login');
  };

  if (loading && !currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm font-semibold">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      
      {/* Header bar */}
      <header className="bg-sky-950 text-white py-5 px-8 shadow-md flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Shield className="text-sky-400" size={28} />
          <div>
            <h1 className="text-xl font-bold tracking-tight">Jobizza Tech Portal</h1>
            <p className="text-sky-300/70 text-xs">
              Role: {currentUser?.isMainAdmin ? 'Main Administrator' : 'Administrator'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold">{currentUser?.name}</p>
            <p className="text-xs text-sky-300">{currentUser?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-sky-900/40 hover:bg-sky-900 border border-sky-800 hover:border-sky-700 text-sky-200 hover:text-white rounded-xl text-xs font-semibold tracking-wider uppercase transition-all"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-8">
        
        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border-l-4 border-rose-500 rounded-r-xl flex items-start gap-3 text-rose-700 text-sm">
            <AlertCircle className="shrink-0 mt-0.5" size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar / Filters */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-6">
              <h3 className="font-bold text-slate-800 text-base">Filter Members</h3>
              
              {/* Status Filter */}
              <div>
                <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                  Approval Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-sm"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending Review</option>
                  <option value="accepted">Accepted Members</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Role Filter */}
              <div>
                <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                  System Role
                </label>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-sm"
                >
                  <option value="">All Roles</option>
                  <option value="member">Members</option>
                  <option value="admin">Administrators</option>
                </select>
              </div>

              {/* Search Form */}
              <form onSubmit={handleSearchSubmit} className="space-y-2">
                <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider">
                  Text Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    type="text"
                    placeholder="Name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-xl text-xs transition-all"
                >
                  Apply Search
                </button>
              </form>
            </div>

            {/* Quick stats */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="p-3 bg-sky-50 rounded-2xl text-sky-600">
                <Users size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{members.length}</p>
                <p className="text-slate-400 text-xs font-semibold">Matched Accounts</p>
              </div>
            </div>
          </div>

          {/* Members Table */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                      <th className="py-4 px-6">User / Info</th>
                      <th className="py-4 px-6">Company / Position</th>
                      <th className="py-4 px-6">Location</th>
                      <th className="py-4 px-6">Status / Role</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {members.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-400">
                          No members matching the filter criteria found.
                        </td>
                      </tr>
                    ) : (
                      members.map((member) => (
                        <tr key={member._id} className="hover:bg-slate-50/50 transition-all">
                          {/* User Name/Email */}
                          <td className="py-5 px-6">
                            <div>
                              <p className="font-bold text-slate-800">{member.name}</p>
                              <p className="text-slate-400 text-xs">{member.email}</p>
                              {member.linkedin && (
                                <a
                                  href={member.linkedin}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] text-sky-600 hover:underline font-semibold mt-1 inline-block"
                                >
                                  LinkedIn Profile
                                </a>
                              )}
                            </div>
                          </td>

                          {/* Company / Position */}
                          <td className="py-5 px-6">
                            {member.profileComplete ? (
                              <div>
                                <p className="font-semibold text-slate-700">{member.position}</p>
                                <p className="text-slate-400 text-xs">{member.company}</p>
                              </div>
                            ) : (
                              <span className="text-xs text-amber-500 font-semibold bg-amber-50 px-2.5 py-1 rounded-full">
                                Incomplete Profile
                              </span>
                            )}
                          </td>

                          {/* City / Pincode */}
                          <td className="py-5 px-6">
                            {member.profileComplete ? (
                              <p className="text-slate-500 text-xs">
                                {member.city}, {member.pincode}
                              </p>
                            ) : (
                              <span className="text-slate-300">-</span>
                            )}
                          </td>

                          {/* Status / Role badges */}
                          <td className="py-5 px-6 space-y-1.5">
                            <div>
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                                  member.status === 'accepted'
                                    ? 'bg-emerald-50 text-emerald-600'
                                    : member.status === 'rejected'
                                    ? 'bg-rose-50 text-rose-600'
                                    : 'bg-amber-50 text-amber-600'
                                }`}
                              >
                                {member.status}
                              </span>
                            </div>
                            <div>
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                                  member.role === 'admin'
                                    ? 'bg-purple-50 text-purple-600'
                                    : 'bg-slate-100 text-slate-500'
                                }`}
                              >
                                {member.isMainAdmin ? 'Main Admin' : member.role}
                              </span>
                            </div>
                          </td>

                          {/* Action Controls */}
                          <td className="py-5 px-6 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              {/* Member status controls */}
                              {member.status === 'pending' && !member.isMainAdmin && (
                                <>
                                  <button
                                    onClick={() => handleStatusUpdate(member._id, 'accepted')}
                                    disabled={actionLoading === member._id}
                                    title="Approve Member"
                                    className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl transition-all"
                                  >
                                    <Check size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleStatusUpdate(member._id, 'rejected')}
                                    disabled={actionLoading === member._id}
                                    title="Reject Member"
                                    className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-all"
                                  >
                                    <X size={16} />
                                  </button>
                                </>
                              )}

                              {/* Main Admin Controls (promote/demote admin roles) */}
                              {currentUser?.isMainAdmin &&
                                member._id !== currentUser._id &&
                                !member.isMainAdmin &&
                                member.status === 'accepted' && (
                                  <button
                                    onClick={() => handleRoleToggle(member._id, member.role)}
                                    disabled={actionLoading === member._id}
                                    title={member.role === 'admin' ? 'Revoke Admin Access' : 'Promote to Admin'}
                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                                      member.role === 'admin'
                                        ? 'bg-amber-50 hover:bg-amber-100 text-amber-600'
                                        : 'bg-purple-50 hover:bg-purple-100 text-purple-600'
                                    }`}
                                  >
                                    {member.role === 'admin' ? <UserMinus size={14} /> : <UserCheck size={14} />}
                                    <span>{member.role === 'admin' ? 'Demote' : 'Promote'}</span>
                                  </button>
                                )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>

        {/* Team Management Section */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <Users className="text-sky-600" size={24} />
            <h2 className="text-xl font-bold text-slate-800">Team Management</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Form side */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
                <h3 className="font-bold text-slate-800 text-sm">Add Team Member</h3>
                
                {teamError && (
                  <div className="p-3 bg-rose-50 text-rose-600 text-xs rounded-xl">
                    {teamError}
                  </div>
                )}
                {teamSuccess && (
                  <div className="p-3 bg-emerald-50 text-emerald-600 text-xs rounded-xl">
                    {teamSuccess}
                  </div>
                )}

                <form onSubmit={handleAddTeamMember} className="space-y-4">
                  <div>
                    <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Gaurav Sharma"
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
                      Position / Role
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Co-Founder"
                      value={newMemberPosition}
                      onChange={(e) => setNewMemberPosition(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
                      Image URL
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. images/Gaurav new.png"
                      value={newMemberImage}
                      onChange={(e) => setNewMemberImage(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
                      LinkedIn URL (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. https://linkedin.com/in/..."
                      value={newMemberLinkedin}
                      onChange={(e) => setNewMemberLinkedin(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                  >
                    <Plus size={14} />
                    Add Member
                  </button>
                </form>
              </div>
            </div>

            {/* Grid side */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                {teamLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : teamMembers.length === 0 ? (
                  <p className="text-center text-slate-400 text-sm py-12">
                    No team members found in database. Seeding will run if database is empty on restart.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teamMembers.map((member: any) => (
                      <div
                        key={member._id}
                        className="bg-slate-50 rounded-2xl border border-slate-150 overflow-hidden flex flex-col justify-between"
                      >
                        <div className="p-4 flex items-center gap-3">
                          <img
                            src={member.image || 'images/Gaurav new.png'}
                            alt={member.name}
                            className="w-12 h-12 rounded-full object-cover border border-slate-200"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'images/Gaurav new.png';
                            }}
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-slate-800 text-sm truncate">{member.name}</h4>
                            <p className="text-sky-500 text-xs truncate">{member.position || member.role}</p>
                          </div>
                        </div>
                        <div className="px-4 py-3 bg-slate-100/50 border-t border-slate-150 flex justify-between items-center">
                          {member.linkedinUrl ? (
                            <a
                              href={member.linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-sky-600 hover:underline font-bold"
                            >
                              LinkedIn
                            </a>
                          ) : (
                            <span className="text-[10px] text-slate-400">No LinkedIn</span>
                          )}
                          <button
                            onClick={() => handleDeleteTeamMember(member._id)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-all"
                            title="Delete Member"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </main>

    </div>
  );
};

export default AdminDashboard;
