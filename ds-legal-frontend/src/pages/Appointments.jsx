import { FaPlus } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward,IoIosArrowDown } from "react-icons/io";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import { CgSortAz } from "react-icons/cg";
import Appointmentgraph from "../components/ui/Appointmentgraph";
import WeeklyAppointment from "../components/ui/weeklyAppiontment";
import MonthlyAppointment from "../components/ui/MonthlyAppointment";

function Appointments() {
    const [startDate, setStartDate] = useState(new Date());
      const [showCalendar, setShowCalendar] = useState(false);
      const [view, setView] = useState("days")
    return (
        <>
        <div className="w-full max-w-5/6  lg:max-w-none px-4 lg:px-8 py-4 sm:mx-auto mt-8 ">
        <div>
         <div className="flex justify-between md:flex-row flex-col gap-4 mt-2">

          <div>
            <h4 className="text-[24px] font-[600] text-[#000000]">Appointments</h4>
            <h4 className="text-[16px] font-[500] text-[#475367]">
              Manage all your tasks and prioritize better
            </h4>
          </div>
          <Link to="/createTask" className="flex gap-2 bg-[#1983D5] rounded-[40px] text-white
           lg:px-6 lg:py-1 py-3 px-4 items-center w-[40%] md:w-auto ">
            <span className="text-[12px]">New appointment</span>
            <span className="text-[12px]"><FaPlus /></span>
          </Link>
        </div>
        <div className="bg-white lg:shadow border-2 rounded-[10px] py-10 px-4 border-[#E4E7EC] mt-10 w-full">

        <div className="lg:flex  gap-2 lg:flex-row   ">
        <div className="lg:justify-between flex lg:flex-row flex-col  w-full gap-2">
        <div className=" flex lg:gap-2 gap-2  flex-col lg:flex-row   ">
        <div className="flex lg:gap-2 gap-2 ">
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
        <div className="border border-[#E4E7EC] px-4 rounded-md mt-2 lg:mt-0 
        bg-[#F9FAFB] w-2/3 shadow-sm h-9 flex items-center lg:w-auto text-[12px]">
        <div onClick={()=>setView("days")}
         className="flex items-center gap-1 pr-4 h-full border-r border-[#D0D5DD] cursor-pointer">
        <h3 className="text-[#101928]">Day</h3>   
        </div>
        <div 
        onClick={()=>setView("week")}
        className="flex items-center gap-1 pl-4 pr-4 h-full border-r border-[#D0D5DD] cursor-pointer">
        <h3 className="text-[##667185]">Week</h3>   
        </div>
        <div
        onClick={()=>setView("month")}
         className="flex items-center gap-1 pl-4 pr-4 h-full border-r border-[#D0D5DD] cursor-pointer">
        <h3 className="text-[##667185]">Month</h3>   
        </div> 
        <div className="flex items-center gap-1 pl-4 cursor-pointer">
        <h3 className="text-[##667185]">Year</h3>   
        </div>
        </div>   
        </div>        
        <div 
        // onClick={() => setIsModalOpen(true)}
        className="border border-[#E4E7EC] px-4 rounded-md bg-[#F9FAFB] 
        shadow-sm flex justify-between text-[12px] items-center w-1/4 lg:w-auto">
        <h4 className="text-[#344054] text-[12px]">Sort by</h4>
        <span  className="text-[30px] font-semibold"> <CgSortAz /></span>
        </div>
        </div>
         </div>
          <div className="mt-8 ">
           {view === "days" && <Appointmentgraph />}
          {view === "week" && <WeeklyAppointment />}
          {view === "month" && <MonthlyAppointment />}
          </div>
         </div>
          <div>        
          </div>
         </div>
       </div>
        </>
    );
}

export default Appointments;
