import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { IoIosArrowUp, IoIosArrowDown, IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useState } from "react";
import InvoiceTable from "../components/ui/InvoiceTable";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


function Invoice() {
  const [startDate, setStartDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [statusFilter, setStatusFilter] = useState('unpaid');
  const [timeFrame, setTimeFrame] = useState('day');
    return (
        <>
        <div className="lg:w-[80%] w-[90%] mx-auto my-10 pb-20 sm:pb-8">
         <div className="flex justify-between lg:flex-row flex-col gap-4 mb-6">
          <div>
            <h2 className="text-[24px] font-[600] text-[#212121]">Invoice</h2>
            <p className="text-[16px] font-[500] text-[#475367]">
             Manage all your invoices and track payments
            </p>
          </div>
          <div className="flex gap-2">
         <Link to="/quickInvoice" className="flex justify-center border-[#1983D5] border-2 bg-white text-[#1983D5] rounded-[6px] px-4 py-3 items-center w-full sm:w-auto">
            <span className="text-[14px] font-medium">Generate invoice</span>
          </Link>
           <Link to="/createInvoice" className="flex justify-center bg-[#1983D5] rounded-[6px] text-white px-4 py-3 items-center w-full sm:w-auto">
            <span className="text-[14px] font-medium">Create invoice</span>
          </Link>
           </div>
         
        </div>
        {/* Filter Section */}
          <div className="bg-white shadow-lg px-4 sm:px-6 lg:px-10 py-6 rounded-md">
            <div className="flex flex-col lg:flex-row gap-4 lg:justify-between lg:items-center">
              {/* Status Filter */}
              <div className="flex border border-[#E4E7EC] rounded-md bg-white shadow-sm h-10 w-full lg:w-auto">
                <button 
                  onClick={() => setStatusFilter('paid')}
                  className={`flex items-center justify-center gap-1 px-4 h-full border-r border-[#D0D5DD] flex-1 lg:flex-none ${
                    statusFilter === 'paid' ? 'text-[#101928] bg-gray-50' : 'text-[#667185] hover:bg-gray-50'
                  }`}
                >
                  <span className="text-[14px] font-medium">Paid</span>   
                </button>
                <button 
                  onClick={() => setStatusFilter('unpaid')}
                  className={`flex items-center justify-center gap-1 px-4 flex-1 lg:flex-none ${
                    statusFilter === 'unpaid' ? 'text-[#101928] bg-gray-50' : 'text-[#667185] hover:bg-gray-50'
                  }`}
                >
                  <span className="text-[14px] font-medium">Unpaid</span>   
                </button>
               </div>
              {/* Date and Time Frame Controls */}
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                {/* Date Picker */}
                <div className="relative border border-[#E4E7EC] rounded-md bg-white shadow-sm">
                  <div
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="flex items-center gap-2 px-4 py-2 cursor-pointer min-w-[200px]"
                  >
                    <span className="text-[#344054] text-[14px] font-medium">
                      {startDate.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    {showCalendar ? <IoIosArrowUp className="text-gray-500" /> : <IoIosArrowDown className="text-gray-500" />}
                  </div>

                  {showCalendar && (
                    <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded shadow-lg z-50">
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => {
                          setStartDate(date);
                          setShowCalendar(false);
                        }}
                        inline
                      />
                    </div>
                  )}
                </div>

                {/* Navigation Arrows */}
                <div className="border border-[#E4E7EC] rounded-md bg-white shadow-sm flex justify-between items-center px-4 py-2">
                  <button className="text-gray-600 hover:text-gray-800">
                    <IoIosArrowBack className="text-lg" />
                  </button>
                  <button className="text-gray-600 hover:text-gray-800">
                    <IoIosArrowForward className="text-lg" />
                  </button>
                </div>

                {/* Time Frame Selector */}
                <div className="flex border border-[#E4E7EC] rounded-md bg-white shadow-sm h-10 w-full sm:w-auto">
                  <button 
                    onClick={() => setTimeFrame('day')}
                    className={`flex items-center justify-center px-3 h-full border-r border-[#D0D5DD] flex-1 sm:flex-none ${
                      timeFrame === 'day' ? 'text-[#101928] bg-gray-50' : 'text-[#667185] hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-[12px] font-medium">Day</span>   
                  </button>
                  <button 
                    onClick={() => setTimeFrame('week')}
                    className={`flex items-center justify-center px-3 h-full border-r border-[#D0D5DD] flex-1 sm:flex-none ${
                      timeFrame === 'week' ? 'text-[#101928] bg-gray-50' : 'text-[#667185] hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-[12px] font-medium">Week</span>   
                  </button>
                  <button 
                    onClick={() => setTimeFrame('month')}
                    className={`flex items-center justify-center px-3 h-full border-r border-[#D0D5DD] flex-1 sm:flex-none ${
                      timeFrame === 'month' ? 'text-[#101928] bg-gray-50' : 'text-[#667185] hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-[12px] font-medium">Month</span>   
                  </button> 
                  <button 
                    onClick={() => setTimeFrame('year')}
                    className={`flex items-center justify-center px-3 flex-1 sm:flex-none ${
                      timeFrame === 'year' ? 'text-[#101928] bg-gray-50' : 'text-[#667185] hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-[12px] font-medium">Year</span>   
                  </button>
                 </div>
              </div>
            </div>
          </div>
         <div>
          <InvoiceTable statusFilter={statusFilter} />
         </div>
        </div>
        </>
    );
}

export default Invoice;
