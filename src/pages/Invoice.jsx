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
        <div className="lg:px-8 py-4 px-4 max-w-5/6 lg:max-w-full">
         <div className="flex justify-between lg:flex-row flex-col gap-4 ">
          <div>
            <h4 className="text-[24px] font-[600] text-[#000000]">Invoice</h4>
            <h4 className="text-[16px] font-[500] text-[#475367]">
             Manage all your tasks and prioritize better
            </h4>
          </div>
          <div className="flex gap-2">
         <Link to="/quickInvoice" className=" dmsansFonts flex  justify-center border-[#1983D5] border-2 bg-white  text-[#1983D5] rounded-[40px]
           text-white lg:px-4 lg:py-1 py-3 px-4 items-center w-[40%] lg:w-auto ">
            <span className="lg:text-[16px] text-[12px] text-[#1983D5]">Generate invoice</span>
          </Link>
           <Link to="/createInvoice" className=" dmsansFonts flex  justify-center bg-[#1983D5] rounded-[40px]
           text-white lg:px-4 lg:py-1 py-3 px-4 items-center w-[40%] lg:w-auto ">
            <span className="lg:text-[16px] text-[12px]">Create invoice</span>
          </Link>
           </div>
         
        </div>
        {/* headers */}
          <div className="lg:bg-white shadow lg:px-10 py-3 mt-4 flex  lg:flex-row flex-col gap-2 lg:justify-between lg:flex-col">
          <div className="border border-[#E4E7EC] px-4 rounded-md bg-white
           lg:shadow-sm h-9 flex items-center w-1/3 lg:w-auto text-[12px]">
            <button 
              onClick={() => setStatusFilter('paid')}
              className={`flex items-center gap-1 pr-4 h-full border-r border-[#D0D5DD] w-auto ${
                statusFilter === 'paid' ? 'text-[#101928]' : 'text-[#667185]'
              }`}
            >
              <h3>Paid</h3>   
            </button>
            <button 
              onClick={() => setStatusFilter('unpaid')}
              className={`flex items-center gap-1 pl-4 ${
                statusFilter === 'unpaid' ? 'text-[#101928]' : 'text-[#667185]'
              }`}
            >
              <h3>Unpaid</h3>   
            </button>
           </div>
           {/* date */}
          <div className="lg:flex justify-between gap-2  lg:flex-row flex-col  ">
          <div className="flex gap-2 ">
          <div className="relative border border-[#E4E7EC] px-4 rounded-md lg:bg-[#F9FAFB] shadow-sm">
            <div
              onClick={() => setShowCalendar(!showCalendar)}
              className="flex items-center gap-2 border h-9 border-[#F9FAFB] z-50 px-4 py-1 w-auto cursor-pointer"
            >
              <h4 className="text-[#344054] text-[12px] font-[600] ">
                {startDate.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </h4>
              {showCalendar ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </div>

            {showCalendar && (
              <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded shadow z-50  max-w-1/4">
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

          <div className="border border-[#E4E7EC] px-4 rounded-md bg-[#F9FAFB] shadow-sm flex justify-between text-[12px] items-center">
           <span className="text-[20px] "> <IoIosArrowBack /></span>
           <span  className="text-[20px] "> <IoIosArrowForward /></span>
          </div>
          </div>
          <div className="border border-[#E4E7EC] px-4 rounded-md mt-2 lg:mt-0 bg-[#F9FAFB] w-2/3 shadow-sm h-9 flex items-center lg:w-auto text-[12px]">
            <button 
              onClick={() => setTimeFrame('day')}
              className={`flex items-center gap-1 pr-4 h-full border-r border-[#D0D5DD] ${
                timeFrame === 'day' ? 'text-[#101928]' : 'text-[#667185]'
              }`}
            >
              <h3>Day</h3>   
            </button>
            <button 
              onClick={() => setTimeFrame('week')}
              className={`flex items-center gap-1 pl-4 pr-4 h-full border-r border-[#D0D5DD] ${
                timeFrame === 'week' ? 'text-[#101928]' : 'text-[#667185]'
              }`}
            >
              <h3>Week</h3>   
            </button>
            <button 
              onClick={() => setTimeFrame('month')}
              className={`flex items-center gap-1 pl-4 pr-4 h-full border-r border-[#D0D5DD] ${
                timeFrame === 'month' ? 'text-[#101928]' : 'text-[#667185]'
              }`}
            >
              <h3>Month</h3>   
            </button> 
            <button 
              onClick={() => setTimeFrame('year')}
              className={`flex items-center gap-1 pl-4 ${
                timeFrame === 'year' ? 'text-[#101928]' : 'text-[#667185]'
              }`}
            >
              <h3>Year</h3>   
            </button>
           </div>
          </div>
            {/* date */}

        </div>
         <div>
          <InvoiceTable statusFilter={statusFilter} />
         </div>
        </div>
        </>
    );
}

export default Invoice;
