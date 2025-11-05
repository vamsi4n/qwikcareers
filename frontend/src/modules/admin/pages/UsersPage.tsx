import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  UserCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ShieldCheckIcon,
  BriefcaseIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';
import AnimatedCard from '../../../shared/components/animations/AnimatedCard';
import GlassCard from '../../../shared/components/ui/GlassCard';
import type { User } from '../../../types';

export default function UsersPage() {
  const dispatch = useDispatch();
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'jobseeker' | 'employer' | 'admin'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  // Mock data - replace with actual API call
  useEffect(() => {
    // TODO: Replace with actual API call
    // dispatch(fetchAllUsers());
    setIsLoading(true);
    setTimeout(() => {
      setUsers([
        {
          _id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          role: 'jobseeker',
          phone: '+1 (555) 123-4567',
          profilePicture: '',
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-02-20T14:45:00Z'
        },
        {
          _id: '2',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@techcorp.com',
          role: 'employer',
          phone: '+1 (555) 234-5678',
          profilePicture: '',
          createdAt: '2024-01-20T09:15:00Z',
          updatedAt: '2024-02-18T11:30:00Z'
        },
        {
          _id: '3',
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@qwikcareers.com',
          role: 'admin',
          phone: '+1 (555) 345-6789',
          profilePicture: '',
          createdAt: '2023-12-01T08:00:00Z',
          updatedAt: '2024-02-25T16:20:00Z'
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, [dispatch]);

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'employer':
        return 'bg-blue-100 text-blue-800';
      case 'jobseeker':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <ShieldCheckIcon className="w-5 h-5" />;
      case 'employer':
        return <BriefcaseIcon className="w-5 h-5" />;
      case 'jobseeker':
        return <UserIcon className="w-5 h-5" />;
      default:
        return <UserCircleIcon className="w-5 h-5" />;
    }
  };

  const handleSuspendUser = (userId: string) => {
    // TODO: Implement user suspension
    console.log('Suspending user:', userId);
    setShowActionMenu(null);
  };

  const handleActivateUser = (userId: string) => {
    // TODO: Implement user activation
    console.log('Activating user:', userId);
    setShowActionMenu(null);
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      // TODO: Implement user deletion
      console.log('Deleting user:', userId);
      setShowActionMenu(null);
    }
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
  };

  const stats = [
    {
      label: 'Total Users',
      value: users.length,
      icon: UserCircleIcon,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Job Seekers',
      value: users.filter(u => u.role === 'jobseeker').length,
      icon: UserIcon,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Employers',
      value: users.filter(u => u.role === 'employer').length,
      icon: BriefcaseIcon,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Admins',
      value: users.filter(u => u.role === 'admin').length,
      icon: ShieldCheckIcon,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">Manage and monitor all users on the platform</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <AnimatedCard key={stat.label} animation="fadeUp" delay={index * 50}>
              <GlassCard className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                </div>
              </GlassCard>
            </AnimatedCard>
          ))}
        </div>

        {/* Filters and Search */}
        <GlassCard className="p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Role Filter */}
            <div className="flex items-center gap-2">
              <FunnelIcon className="w-5 h-5 text-gray-400" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as any)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="all">All Roles</option>
                <option value="jobseeker">Job Seekers</option>
                <option value="employer">Employers</option>
                <option value="admin">Admins</option>
              </select>
            </div>
          </div>
        </GlassCard>

        {/* Users Table */}
        {isLoading ? (
          <GlassCard className="text-center py-20">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading users...</p>
          </GlassCard>
        ) : filteredUsers.length === 0 ? (
          <GlassCard className="text-center py-20">
            <UserCircleIcon className="w-20 h-20 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No users found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </GlassCard>
        ) : (
          <div className="space-y-4">
            {filteredUsers.map((user, index) => (
              <AnimatedCard key={user._id} animation="fadeUp" delay={index * 30}>
                <GlassCard className="p-6 hover:shadow-lg transition">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* User Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {user.firstName[0]}{user.lastName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">
                            {user.firstName} {user.lastName}
                          </h3>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}>
                            {getRoleIcon(user.role)}
                            {user.role}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                            <span className="truncate">{user.email}</span>
                          </div>
                          {user.phone && (
                            <div className="flex items-center gap-2">
                              <PhoneIcon className="w-4 h-4 text-gray-400" />
                              <span>{user.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4 text-gray-400" />
                            <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4 text-gray-400" />
                            <span>Updated {new Date(user.updatedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDetails(user)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"
                      >
                        View Details
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => setShowActionMenu(showActionMenu === user._id ? null : user._id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition"
                        >
                          <EllipsisVerticalIcon className="w-5 h-5 text-gray-600" />
                        </button>
                        {showActionMenu === user._id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                            <button
                              onClick={() => handleActivateUser(user._id)}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 flex items-center gap-2"
                            >
                              <CheckCircleIcon className="w-4 h-4" />
                              Activate User
                            </button>
                            <button
                              onClick={() => handleSuspendUser(user._id)}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 flex items-center gap-2"
                            >
                              <XCircleIcon className="w-4 h-4" />
                              Suspend User
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <XCircleIcon className="w-4 h-4" />
                              Delete User
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </AnimatedCard>
            ))}
          </div>
        )}

        {/* User Details Modal */}
        {selectedUser && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in"
            onClick={() => setSelectedUser(null)}
          >
            <div
              className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4 pb-6 border-b">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-3xl">
                    {selectedUser.firstName[0]}{selectedUser.lastName[0]}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </h3>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${getRoleColor(selectedUser.role)}`}>
                      {getRoleIcon(selectedUser.role)}
                      {selectedUser.role}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                    <p className="text-gray-900 font-semibold">{selectedUser.email}</p>
                  </div>
                  {selectedUser.phone && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
                      <p className="text-gray-900 font-semibold">{selectedUser.phone}</p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">User ID</label>
                    <p className="text-gray-900 font-mono text-sm">{selectedUser._id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Role</label>
                    <p className="text-gray-900 font-semibold capitalize">{selectedUser.role}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Joined Date</label>
                    <p className="text-gray-900 font-semibold">
                      {new Date(selectedUser.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Last Updated</label>
                    <p className="text-gray-900 font-semibold">
                      {new Date(selectedUser.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t flex gap-3">
                  <button
                    onClick={() => handleActivateUser(selectedUser._id)}
                    className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-medium"
                  >
                    Activate User
                  </button>
                  <button
                    onClick={() => handleSuspendUser(selectedUser._id)}
                    className="flex-1 bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition font-medium"
                  >
                    Suspend User
                  </button>
                  <button
                    onClick={() => handleDeleteUser(selectedUser._id)}
                    className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition font-medium"
                  >
                    Delete User
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
