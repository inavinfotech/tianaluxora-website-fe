import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[var(--color-primary)]">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center pt-12 pb-12 px-4 sm:px-6">
      <div className="w-full max-w-2xl">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-32 h-32 rounded-full bg-[var(--accent)]/20 border-2 border-[var(--accent)] flex items-center justify-center text-4xl font-serif text-[var(--accent)]">
              {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
            </div>
            <button 
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="px-6 py-2 text-sm border border-red-500/30 text-red-400 rounded-full hover:bg-red-500/10 transition-colors"
            >
              Sign Out
            </button>
          </div>

          {/* Details Section */}
          <div className="flex-1 w-full space-y-6">
            <div>
              <h2 className="text-3xl font-light mb-1 text-[var(--color-primary)]">My Profile</h2>
              <p className="text-sm text-[var(--color-primary)]/60">Manage your Tiana Luxora account</p>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                <label className="block text-xs uppercase tracking-wider text-[var(--color-primary)]/50 mb-1">Full Name</label>
                <div className="text-lg text-white">{user.full_name || 'Not provided'}</div>
              </div>
              <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                <label className="block text-xs uppercase tracking-wider text-[var(--color-primary)]/50 mb-1">Email Address</label>
                <div className="text-lg text-white">{user.email || user.username || 'Not provided'}</div>
              </div>

              {user.user_id && (
                <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                  <label className="block text-xs uppercase tracking-wider text-[var(--color-primary)]/50 mb-1">User ID</label>
                  <div className="text-sm text-white/70 font-mono break-all">{user.user_id}</div>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-white/10">
              <h3 className="text-lg font-medium text-[var(--color-primary)] mb-4">Account Settings</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors group">
                  <span className="text-sm text-[var(--color-primary)]">Order History</span>
                  <svg className="w-4 h-4 text-[var(--color-primary)]/50 group-hover:text-[var(--accent)] group-hover:-translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
                <button className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors group">
                  <span className="text-sm text-[var(--color-primary)]">Saved Addresses</span>
                  <svg className="w-4 h-4 text-primary/50 group-hover:text-[var(--accent)] group-hover:-translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
