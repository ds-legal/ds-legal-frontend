import React from 'react';
import Nav from '../../components/ui/Nav';

const QuickInvoice = () => {
  return (
    <>
      <Nav />
      <div className="max-w-3xl mx-auto mt-10 px-4">
        <div className="bg-white p-6 rounded-[14px] shadow space-y-6">
          {/* Title */}
          <div>
            <h1 className="text-[24px] font-bold text-[#212121]">Quick Invoice</h1>
            <hr className="border-t border-gray-300 mt-1" />
          </div>

          {/* Client Name */}
          <div>
            <label className=" text-sm font-medium text-[#19213D] mb-1">Client Name</label>
            <input
              type="text"
              placeholder="Enter client name"
              className="w-full p-2 border border-[#D0D5DD] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1983D5]"
            />
          </div>

          {/* Purpose Dropdown */}
          <div>
            <h4  className=" text-[14px] text-[#101928] font-[500] mb-1">Purpose</h4>
            <select
              className="w-full p-2 border border-[#D0D5DD] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1983D5]"
            >
              <option>Select purpose</option>
              <option>Consultation</option>
              <option>Development</option>
              <option>Support</option>
            </select>
          </div>

          {/* Amount and Tax */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full lg:w-[50%]">
              <h4  className=" text-[14px] text-[#101928] font-[500] mb-1">Amount</h4>
              <input
                type="number"
                placeholder="$0.00"
                className="w-full p-2 border border-[#D0D5DD] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1983D5]"
              />
            </div>
            <div className="w-full lg:w-[50%]">
              <h4  className=" text-[14px] text-[#101928] font-[500] mb-1">Tax (%)</h4>
              <input
                type="number"
                placeholder="0"
                className="w-full p-2 border border-[#D0D5DD] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1983D5]"
              />
            </div>
          </div>

          {/* Due Date and Time */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="lg:w-[50%] w-full">
              <h4  className=" text-[14px] text-[#101928] font-[500] mb-1">Due Date</h4>
              <input
                type="date"
                className="w-full p-2 border border-[#D0D5DD] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1983D5]"
              />
            </div>
            <div className="lg:w-[50%] w-full">
              <h4 className=" text-[14px] text-[#101928] font-[500] mb-1">Time</h4>
              <input
                type="time"
                className="w-full p-2 border border-[#D0D5DD] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1983D5]"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button className="bg-[#1983D5] rounded-[40px] text-white px-6 py-4 font-medium
             hover:bg-[#156bb2] transition-all duration-200 text-[14px] ">
              Generate invoice
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuickInvoice;
