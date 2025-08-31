import { useEffect, useState } from 'react';
import { getUserProfile, updateUserProfile } from './authentication/../../api/auth_api';
import toast from 'react-hot-toast';

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

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await getUserProfile();
        if (res && res.data) {
          setProfile({
            first_name: res.data.first_name || '',
            last_name: res.data.last_name || '',
            email: res.data.email || '',
            firm_name: res.data.firm_name || '',
            address: res.data.address || '',
            state: res.data.state || '',
            postal_code: res.data.postal_code || '',
            phone_number: res.data.phone_number || '',
          });
        }
      } catch (error) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

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
      const res = await updateUserProfile(payload);
      if (res && res.status_code === 200) {
        toast.success(res.message || 'Profile updated');
      } else {
        toast.error(res.detail || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('Failed to update profile');
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
