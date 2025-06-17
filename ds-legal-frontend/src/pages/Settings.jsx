function Settings() {
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
              <input type="text" className="mt-1 w-full rounded-md border-2 border-[#D0D5DD] text-sm p-2" />
            </div>
            <div>
              <label className="text-[14px] font-normal text-[#101928]">Last Name</label>
              <input type="text" className="mt-1 w-full rounded-md border-2 border-[#D0D5DD] text-sm p-2" />
            </div>
            <div>
              <label className="text-[14px] font-normal text-[#101928]">Email Address</label>
              <input type="email" className="mt-1 w-full rounded-md border-2 border-[#D0D5DD] text-sm p-2" />
            </div>
            <div>
              <label className="text-[14px] font-normal text-[#101928]">Firm Name</label>
              <input type="text" className="mt-1 w-full rounded-md border-2 border-[#D0D5DD] text-sm p-2" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Address</label>
              <input type="text" className="mt-1 w-full rounded-md border-2 border-[#D0D5DD] text-sm p-2" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">State</label>
              <select className="mt-1 w-full rounded-md border-2 border-[#D0D5DD] text-sm p-2">
                <option value="">Select state</option>
                <option value="lagos">Lagos</option>
                <option value="abuja">Abuja</option>
                <option value="rivers">Rivers</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Postal Code</label>
              <input type="text" className="mt-1 w-full rounded-md border-2 border-[#D0D5DD] text-sm p-2" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Phone Number</label>
              <input type="tel" className="mt-1 w-full rounded-md border-2 border-[#D0D5DD] text-sm p-2" />
            </div>
            <div className="md:col-span-2 mt-4 flex justify-end">
              <button className="bg-[#101928] text-white px-6 py-2 rounded-md hover:bg-opacity-90 text-sm">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Settings;
