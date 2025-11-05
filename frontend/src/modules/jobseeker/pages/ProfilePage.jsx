import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  UserCircleIcon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  EyeIcon,
  DocumentTextIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';
import { getProfile, updateProfile } from '../../../store/slices/userSlice';
import AnimatedCard from '../../../components/animations/AnimatedCard';
import GlassCard from '../../../components/ui/GlassCard';

export default function ProfilePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { profile, isLoading } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: {
      city: '',
      state: '',
      country: '',
    },
    bio: '',
    headline: '',
    skills: [],
    experience: [],
    education: [],
  });

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        phone: profile.phone || '',
        location: profile.location || { city: '', state: '', country: '' },
        bio: profile.bio || '',
        headline: profile.headline || '',
        skills: profile.skills || [],
        experience: profile.experience || [],
        education: profile.education || [],
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfile(formData));
    setIsEditing(false);
  };

  if (isLoading && !profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <GlassCard className="text-center py-20">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            {isEditing ? (
              <>
                <XMarkIcon className="w-5 h-5" />
                Cancel
              </>
            ) : (
              <>
                <PencilIcon className="w-5 h-5" />
                Edit Profile
              </>
            )}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <AnimatedCard animation="fadeUp" delay={0}>
              <GlassCard className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Professional Headline
                  </label>
                  <input
                    type="text"
                    name="headline"
                    value={formData.headline}
                    onChange={handleChange}
                    placeholder="e.g. Senior Software Engineer"
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="location.city"
                      value={formData.location.city}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      name="location.state"
                      value={formData.location.state}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      name="location.country"
                      value={formData.location.country}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </GlassCard>
            </AnimatedCard>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="inline-flex items-center gap-2 px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
              >
                <XMarkIcon className="w-5 h-5" />
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                <CheckIcon className="w-5 h-5" />
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <>
            {/* View Mode */}
            <AnimatedCard animation="fadeUp" delay={0}>
              <GlassCard className="p-8 mb-6">
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-3xl font-bold text-white">
                      {profile?.firstName?.[0]}{profile?.lastName?.[0]}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                      {profile?.firstName} {profile?.lastName}
                    </h2>
                    {profile?.headline && (
                      <p className="text-lg text-blue-600 font-medium mt-2">{profile.headline}</p>
                    )}
                    <div className="flex flex-wrap gap-4 mt-4">
                      {profile?.location && (
                        <span className="inline-flex items-center gap-1.5 text-sm text-gray-600 bg-blue-50 px-3 py-1.5 rounded-lg">
                          <MapPinIcon className="w-4 h-4" />
                          {profile.location.city}, {profile.location.state}
                        </span>
                      )}
                      {profile?.email && (
                        <span className="inline-flex items-center gap-1.5 text-sm text-gray-600 bg-purple-50 px-3 py-1.5 rounded-lg">
                          <EnvelopeIcon className="w-4 h-4" />
                          {profile.email}
                        </span>
                      )}
                      {profile?.phone && (
                        <span className="inline-flex items-center gap-1.5 text-sm text-gray-600 bg-green-50 px-3 py-1.5 rounded-lg">
                          <PhoneIcon className="w-4 h-4" />
                          {profile.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {profile?.bio && (
                  <div className="mt-6 pt-6 border-t-2 border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">About</h3>
                    <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
                  </div>
                )}
              </GlassCard>
            </AnimatedCard>

            {/* Skills */}
            {profile?.skills && profile.skills.length > 0 && (
              <AnimatedCard animation="fadeUp" delay={50}>
                <GlassCard className="p-6 mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold border-2 border-blue-100 hover:bg-blue-100 transition"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </GlassCard>
              </AnimatedCard>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <AnimatedCard animation="fadeUp" delay={100}>
                <GlassCard className="p-6 text-center hover:shadow-lg transition hover:scale-[1.01]">
                  <div className="inline-flex p-4 bg-blue-100 rounded-xl mb-3">
                    <EyeIcon className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-4xl font-bold text-gray-900">{profile?.profileViews || 0}</p>
                  <p className="text-gray-600 mt-2 font-medium">Profile Views</p>
                </GlassCard>
              </AnimatedCard>

              <AnimatedCard animation="fadeUp" delay={150}>
                <GlassCard className="p-6 text-center hover:shadow-lg transition hover:scale-[1.01]">
                  <div className="inline-flex p-4 bg-purple-100 rounded-xl mb-3">
                    <DocumentTextIcon className="w-8 h-8 text-purple-600" />
                  </div>
                  <p className="text-4xl font-bold text-gray-900">{profile?.applicationsCount || 0}</p>
                  <p className="text-gray-600 mt-2 font-medium">Applications</p>
                </GlassCard>
              </AnimatedCard>

              <AnimatedCard animation="fadeUp" delay={200}>
                <GlassCard className="p-6 text-center hover:shadow-lg transition hover:scale-[1.01]">
                  <div className="inline-flex p-4 bg-green-100 rounded-xl mb-3">
                    <BookmarkIcon className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-4xl font-bold text-gray-900">{profile?.savedJobsCount || 0}</p>
                  <p className="text-gray-600 mt-2 font-medium">Saved Jobs</p>
                </GlassCard>
              </AnimatedCard>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
