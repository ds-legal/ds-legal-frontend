import { useEffect, useState, useRef } from 'react';
import { getUserProfile, updateUserProfile, updateUserAvatar } from './authentication/../../api/auth_api';
import toast from 'react-hot-toast';
import { Camera, Upload } from 'lucide-react';
import { useDashboard } from '../store/dashboard.context';
import { UseAuth } from '../store/auth.context';

function Settings() {
  const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
  const [profile, setProfile] = useState({
    first_name: storedUser?.first_name || '',
    last_name: storedUser?.last_name || '',
    email: storedUser?.email || '',
    firm_name: storedUser?.firm_name || '',
    address: storedUser?.address || '',
    state: storedUser?.state || '',
    postal_code: storedUser?.postal_code || '',
    phone_number: storedUser?.phone_number || '',
  });
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const fileInputRef = useRef(null);
  const { fetchDashboardData } = useDashboard();
  const { updateUser } = UseAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await getUserProfile();
        if (res && res.data) {
          const profileData = {
            first_name: res.data.first_name || '',
            last_name: res.data.last_name || '',
            email: res.data.email || '',
            firm_name: res.data.firm_name || '',
            address: res.data.address || '',
            state: res.data.state || '',
            postal_code: res.data.postal_code || '',
            phone_number: res.data.phone_number || '',
          };
          setProfile(profileData);
          setAvatarUrl(res.data.avatar_url || '');
          
          // Update auth context with complete profile data including avatar
          if (res.data.avatar_url) {
            updateUser({ ...profileData, avatar_url: res.data.avatar_url });
          }
        }
      } catch (error) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [updateUser]);

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, or GIF)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setAvatarLoading(true);
    try {
      const res = await updateUserAvatar(file);
      if (res && res.success) {
        setAvatarUrl(res.data.avatar_url);
        
        // Update auth context and localStorage with new avatar URL
        updateUser({ avatar_url: res.data.avatar_url });
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new Event('userUpdated'));
        
        // Refresh dashboard data to update user info across the app
        fetchDashboardData();
        toast.success(res.message || 'Profile picture updated successfully');
      } else {
        toast.error(res.message || 'Failed to update profile picture');
      }
    } catch (error) {
      toast.error('Failed to upload profile picture');
      console.error('Avatar upload error:', error);
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        firm_name: profile.firm_name,
        address: profile.address,
        state: profile.state,
        postal_code: profile.postal_code,
        phone_number: profile.phone_number,
      };
      
      console.log('Updating profile with payload:', payload);
      const res = await updateUserProfile(payload);
      console.log('Update profile response:', res);
      
      if (res && res.status_code === 200) {
        // Update auth context with new profile data
        updateUser(payload);
        toast.success(res.message || 'Profile updated successfully');
      } else {
        console.error('Profile update failed:', res);
        toast.error(res.message || res.detail || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="px-4 lg:px-8 py-4 max-w-full">
        {/* Heading */}
        <div className="flex justify-between lg:flex-row flex-col gap-4 mb-4">
          <div>
            <h4 className="text-[24px] font-semibold text-[#000000]">Settings</h4>
            <h4 className="text-[16px] font-medium text-[#475367]">
              Manage your profile details and all related settings.
            </h4>
          </div>
        </div>

        {/* Tabs */}
        <div className="md:inline-flex flex flex-wrap border border-[#E4E7EC] rounded-md bg-[#F9FAFB] shadow-sm h-auto sm:h-9 text-[12px] w-full sm:w-auto overflow-auto">
          <div className="flex items-center gap-1 px-4 py-2 sm:py-0 border-b sm:border-b-0 sm:border-r border-[#D0D5DD]">
            <h3 className="text-[#101928]">Profile</h3>
          </div>
          <div className="flex items-center gap-1 px-4 py-2 sm:py-0 border-b sm:border-b-0 sm:border-r border-[#D0D5DD]">
            <h3 className="text-[#667185]">Team members</h3>
          </div>
          <div className="flex items-center gap-1 px-4 py-2 sm:py-0 border-b sm:border-b-0 sm:border-r border-[#D0D5DD]">
            <h3 className="text-[#667185]">Security</h3>
          </div>
          <div className="flex items-center gap-1 px-4 py-2 sm:py-0">
            <h3 className="text-[#667185]">Preference</h3>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 bg-white shadow-lg rounded-[10px] mt-4">
          {/* Left Column */}
          <div>
            <h1 className="text-[16px] font-semibold text-[#101928]">Personal Information</h1>
            <p className="text-[14px] text-[#667185]">Update your personal details here.</p>
          </div>

          {/* Right Column - Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Profile Picture Upload - Full Width */}
            <div className="md:col-span-2 mb-4">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200 bg-gray-100 flex items-center justify-center">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Profile"
                        className="w-full h-full object-cover object-center rounded-full"
                        style={{ aspectRatio: '1 / 1' }}
                      />
                    ) : (
                      <div className="w-full h-full bg-[#1983D5] rounded-full flex items-center justify-center text-white text-xl font-semibold">
                        {profile.first_name ? profile.first_name.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                  </div>
                  
                  {/* Camera Icon Overlay */}
                  <button
                    onClick={handleAvatarClick}
                    disabled={avatarLoading}
                    className="absolute bottom-0 right-0 w-8 h-8 bg-[#1983D5] rounded-full flex items-center justify-center text-white hover:bg-[#1570B8] transition-colors disabled:opacity-50"
                  >
                    {avatarLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Camera size={16} />
                    )}
                  </button>
                </div>

                <div className="flex-1">
                  <button
                    onClick={handleAvatarClick}
                    disabled={avatarLoading}
                    className="flex items-center gap-2 px-4 py-2 border border-[#D0D5DD] rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    <Upload size={16} />
                    <span className="text-[14px] font-medium">
                      {avatarLoading ? 'Uploading...' : 'Click to upload'}
                    </span>
                  </button>
                  <p className="text-[12px] text-[#667185] mt-2">
                    SVG, PNG, JPG or GIF (max. 5MB)
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
            </div>

            <div>
              <label className="text-[14px] font-normal text-[#101928]">First Name</label>
              <input
                type="text"
                value={profile.first_name}
                onChange={(e) => setProfile((p) => ({ ...p, first_name: e.target.value }))}
                className="mt-1 w-full rounded-md border-2 border-[#D0D5DD] text-sm p-2"
              />
            </div>
            <div>
              <label className="text-[14px] font-normal text-[#101928]">Last Name</label>
              <input
                type="text"
                value={profile.last_name}
                onChange={(e) => setProfile((p) => ({ ...p, last_name: e.target.value }))}
                className="mt-1 w-full rounded-md border-2 border-[#D0D5DD] text-sm p-2"
              />
            </div>
            <div>
              <label className="text-[14px] font-normal text-[#101928]">Email Address</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                className="mt-1 w-full rounded-md border-2 border-[#D0D5DD] text-sm p-2"
              />
            </div>
            <div>
              <label className="text-[14px] font-normal text-[#101928]">Firm Name</label>
              <input
                type="text"
                value={profile.firm_name}
                onChange={(e) => setProfile((p) => ({ ...p, firm_name: e.target.value }))}
                className="mt-1 w-full rounded-md border-2 border-[#D0D5DD] text-sm p-2"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                value={profile.address}
                onChange={(e) => setProfile((p) => ({ ...p, address: e.target.value }))}
                className="mt-1 w-full rounded-md border-2 border-[#D0D5DD] text-sm p-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">State</label>
              <select
                value={profile.state}
                onChange={(e) => setProfile((p) => ({ ...p, state: e.target.value }))}
                className="mt-1 w-full rounded-md border-2 border-[#D0D5DD] text-sm p-2"
              >
                <option value="">Select state</option>
                <option value="lagos">Lagos</option>
                <option value="abuja">Abuja</option>
                <option value="rivers">Rivers</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Postal Code</label>
              <input
                type="text"
                value={profile.postal_code}
                onChange={(e) => setProfile((p) => ({ ...p, postal_code: e.target.value }))}
                className="mt-1 w-full rounded-md border-2 border-[#D0D5DD] text-sm p-2"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                value={profile.phone_number}
                onChange={(e) => setProfile((p) => ({ ...p, phone_number: e.target.value }))}
                className="mt-1 w-full rounded-md border-2 border-[#D0D5DD] text-sm p-2"
              />
            </div>
            <div className="md:col-span-2 mt-4 flex justify-end">
              <button
                onClick={handleSave}
                disabled={loading}
                className="bg-[#101928] text-white px-6 py-2 rounded-md hover:bg-opacity-90 text-sm disabled:opacity-60"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Settings;
