import { useState, useContext } from 'react';
import { UserContext } from '../Context/dataCont';
import { fetchWithRefresh } from '../Components/api';
import Title from '../Components/Title';

const API_URL = import.meta.env.VITE_API_URL;

export default function PreferencesPage() {
  const { authData, setAuthData } = useContext(UserContext);
  const user = authData.user;

  const [language, setLanguage] = useState(user?.preferences?.language || 'fr');
  const [emailNotifications, setEmailNotifications] = useState(user?.preferences?.notifications?.email ?? true);
  const [message, setMessage] = useState(null);
  
  // Modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [modalLoading, setModalLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowPasswordModal(true);
    setPassword('');
  };

  const confirmUpdate = async () => {
    if (!password) {
      setMessage({ type: 'error', text: 'Password is required' });
      return;
    }
    setModalLoading(true);
    setMessage(null);

    try {
      const updatedPreferences = {
        language,
        notifications: { email: emailNotifications }
      };
      const res = await fetchWithRefresh(
        `${API_URL}/user/${user._id}/preferences`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ preferences: updatedPreferences })
        },
        authData.token,
        setAuthData
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');

      // Update context with fresh user data
      setAuthData(prev => ({
        ...prev,
        user: data.user,
        token: data.token || prev.token
      }));

      setMessage({ type: 'success', text: 'Preferences updated successfully!' });
      setTimeout(() => setMessage(null), 3000);
      
      setShowPasswordModal(false);
      setPassword('');
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: err.message || 'Failed to update preferences' });
    } finally {
      setModalLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-900 pb-16">
      <div className="h-32 bg-yellow-400/80 shadow-md"></div>
      <div className="w-3/4 mx-auto -mt-16">
        <div className="bg-gray-800/80 backdrop-blur-xl border border-yellow-400/30 rounded-xl shadow-xl p-8">
          <Title title="Preferences" textColor="text-yellow-300" />

          {message && (
            <div className={`mt-4 p-3 rounded-lg text-center ${
              message.type === 'success' 
                ? 'bg-green-500/20 text-green-300 border border-green-400/40'
                : 'bg-red-500/20 text-red-300 border border-red-400/40'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {/* Language */}
            <div>
              <label className="block text-yellow-300 font-medium mb-2">Language / Langue</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full max-w-md px-4 py-2 bg-gray-900 rounded-lg border border-gray-700 text-white focus:outline-none focus:border-yellow-400"
              >
                <option value="fr">Français</option>
                <option value="ar">العربية</option>
                <option value="en">English</option>
              </select>
            </div>

            {/* Email notifications toggle */}
            <div className="flex items-center justify-between max-w-md">
              <span className="text-yellow-300 font-medium">Email notifications</span>
              <button
                type="button"
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  emailNotifications ? 'bg-yellow-400' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-yellow-400 text-gray-900 rounded-lg font-semibold hover:bg-yellow-300 transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-gray-800 rounded-xl p-6 w-96 border border-yellow-400/30 shadow-2xl">
            <h3 className="text-xl font-bold text-yellow-300 mb-4">Confirm Password</h3>
            <p className="text-gray-300 mb-4">Please enter your password to save preferences.</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 rounded text-white border border-gray-700 focus:outline-none focus:border-yellow-400"
              placeholder="Enter your password"
              autoFocus
            />
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 transition text-white"
              >
                Cancel
              </button>
              <button
                onClick={confirmUpdate}
                disabled={modalLoading}
                className="px-4 py-2 bg-yellow-400 rounded hover:bg-yellow-300 transition text-gray-900 font-medium disabled:opacity-50"
              >
                {modalLoading ? 'Saving...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}