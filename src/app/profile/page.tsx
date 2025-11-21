'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface ProfileData {
  id: string;
  name: string;
  username: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
  totalPosts: number;
  totalFollowers: number;
  totalFollowing: number;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchProfile();
    }
  }, [session]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`/api/profile?userId=${session.user.id}`);
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="text-center mt-20 text-gray-600 text-lg">
        Please log in to view your profile.
      </div>
    );
  }

  if (loading) {
    return <div className="text-center mt-20 text-gray-600 text-lg">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="text-center mt-20 text-gray-600 text-lg">Profile not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-16 p-8 bg-white rounded-3xl shadow-2xl">
      <div className="text-center mb-8">
        <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-white text-4xl font-bold">
              {profile.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.name}</h1>
        <p className="text-gray-600 mb-4">@{profile.username}</p>
        {profile.bio && (
          <p className="text-gray-700 max-w-2xl mx-auto mb-6">{profile.bio}</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="text-center p-6 bg-gray-50 rounded-xl">
          <div className="text-3xl font-bold text-blue-600 mb-2">{profile.totalPosts}</div>
          <div className="text-gray-600">Posts</div>
        </div>
        <div className="text-center p-6 bg-gray-50 rounded-xl">
          <div className="text-3xl font-bold text-purple-600 mb-2">{profile.totalFollowers}</div>
          <div className="text-gray-600">Followers</div>
        </div>
        <div className="text-center p-6 bg-gray-50 rounded-xl">
          <div className="text-3xl font-bold text-pink-600 mb-2">{profile.totalFollowing}</div>
          <div className="text-gray-600">Following</div>
        </div>
      </div>

      <div className="text-center">
        <button className="px-6 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-lg hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300">
          Edit Profile
        </button>
      </div>
    </div>
  );
}