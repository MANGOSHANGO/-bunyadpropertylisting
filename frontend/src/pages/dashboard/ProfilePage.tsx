import { useState } from 'react';
import { useAuthStore } from '../../store/auth';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-text mb-8">Profile Settings</h1>

      <div className="card p-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing}
              className={`input-field ${!isEditing ? 'bg-gray-100' : ''}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="input-field bg-gray-100"
            />
            <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="+92300000000"
              className={`input-field ${!isEditing ? 'bg-gray-100' : ''}`}
            />
          </div>

          {isEditing && (
            <>
              <hr className="my-6" />
              <h2 className="text-lg font-bold text-text mb-4">Change Password</h2>

              <div>
                <label className="block text-sm font-medium text-text mb-2">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </>
          )}

          <div className="flex gap-4">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Handle update
                    setIsEditing(false);
                  }}
                  className="btn-primary flex-1"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary flex-1"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
