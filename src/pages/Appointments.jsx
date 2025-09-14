import { FaPlus } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward, IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from "react";
import { CgSortAz } from "react-icons/cg";
import Appointmentgraph from "../components/ui/Appointmentgraph";
import WeeklyAppointment from "../components/ui/weeklyAppiontment";
import MonthlyAppointment from "../components/ui/MonthlyAppointment";
import { useAppointment } from "../store/appointment.context";
import { getSingleAppointment } from "../api/appointment_api";
import AppointmentCard from "../components/AppointmentCard";
import AppointmentModal from "../components/AppointmentModal";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';

function Appointments() {
    const { getAllAppointments, appointments, loading } = useAppointment();
    const [startDate, setStartDate] = useState(new Date());
    const [showCalendar, setShowCalendar] = useState(false);
    const [view, setView] = useState("days");
    const [showModal, setShowModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState();
    const [singleLoading, setSingleLoading] = useState(false);

    const appointmentList = Array.isArray(appointments) ? appointments : [];

    useEffect(() => {
        getAllAppointments();
    }, []);

    const getSingleAppointmentData = async (id) => {
        setShowModal(true);      // show the modal immediately
        setSingleLoading(true);  // show loading skeleton
        try {
            const appointment = await getSingleAppointment(id);
            setSelectedAppointment(appointment.data);
        } catch (error) {
            console.error("Failed to fetch single appointment", error);
        } finally {
            setSingleLoading(false); // hide loading
        }
    };
    return (
        <>
        <div className="w-full max-w-5/6  lg:max-w-none px-4 lg:px-8 py-4 sm:mx-auto mt-8 ">
        <div>
         <div className="flex justify-between md:flex-row flex-col gap-4 mt-2">

          <div>
            <h4 className="text-[24px] font-[600] text-[#000000]">Appointments</h4>
            <h4 className="text-[16px] font-[500] text-[#475367]">
              Manage all your appointments and prioritize better
            </h4>
          </div>
          <Link to="/createAppointment" className="flex gap-2 bg-[#1983D5] rounded-lg text-white
           px-4 py-2.5 items-center hover:bg-[#146bb3] transition-colors">
            <span className="text-sm font-medium">New appointment</span>
            <span className="text-sm"><FaPlus /></span>
          </Link>
        </div>
        <div className="bg-white lg:shadow border rounded-lg py-8 px-6 border-[#E4E7EC] mt-8 w-full">

        <div className="lg:flex gap-4 lg:flex-row">
        <div className="lg:justify-between flex lg:flex-row flex-col w-full gap-4">
        <div className="flex lg:gap-4 gap-2 flex-col lg:flex-row">
        <div className="flex lg:gap-2 gap-2">
        <div className="relative border border-[#E4E7EC] px-4 rounded-lg bg-[#F9FAFB] shadow-sm">
        <div
        onClick={() => setShowCalendar(!showCalendar)}
        className="flex items-center gap-2 h-10 px-2 py-1 cursor-pointer"
        >
        <h4 className="text-[#344054] text-sm font-medium">
        Today {startDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",  
        })}
        </h4>
         {showCalendar ? <IoIosArrowUp /> : <IoIosArrowDown />}
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
         
        <div className="border border-[#E4E7EC] px-4 rounded-lg bg-[#F9FAFB] shadow-sm flex justify-between text-sm items-center gap-2">
        <span className="text-lg cursor-pointer hover:text-[#1983D5]"> <IoIosArrowBack /></span>
        <span className="text-lg cursor-pointer hover:text-[#1983D5]"> <IoIosArrowForward /></span>
        </div>
        </div>
        <div className="border border-[#E4E7EC] px-1 rounded-md mt-2 lg:mt-0 
        bg-[#F9FAFB] shadow-sm h-9 flex items-center text-[12px] font-medium">
        <div onClick={()=>setView("days")}
         className={`flex items-center gap-1 px-3 h-full cursor-pointer ${
           view === "days" ? "text-[#1983D5] border-b-2 border-[#1983D5]" : "text-[#667185] hover:text-[#333]"
         }`}>
        <h3>Day</h3>   
        </div>
        <div 
        onClick={()=>setView("week")}
        className={`flex items-center gap-1 px-3 h-full cursor-pointer ${
          view === "week" ? "text-[#1983D5] border-b-2 border-[#1983D5]" : "text-[#667185] hover:text-[#333]"
        }`}>
        <h3>Week</h3>   
        </div>
        <div
        onClick={()=>setView("month")}
        className={`flex items-center gap-1 px-3 h-full cursor-pointer ${
          view === "month" ? "text-[#1983D5] border-b-2 border-[#1983D5]" : "text-[#667185] hover:text-[#333]"
        }`}>
        <h3>Month</h3>   
        </div> 
        <div className={`flex items-center gap-1 px-3 h-full cursor-pointer text-[#667185] hover:text-[#333]`}>
        <h3>Year</h3>   
        </div>
        </div>   
        </div>        
        <div 
        className="border border-[#E4E7EC] px-4 rounded-lg bg-[#F9FAFB] 
        shadow-sm flex justify-between text-sm items-center gap-2">
        <h4 className="text-[#344054] font-medium">Sort by</h4>
        <span className="text-xl text-gray-600"> <CgSortAz /></span>
        </div>
        </div>
         </div>
          <div className="mt-8 ">
           {view === "days" && <Appointmentgraph />}
          {view === "week" && <WeeklyAppointment />}
          {view === "month" && <MonthlyAppointment />}
          </div>

          {/* Appointments List */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">All Appointments</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {loading ? (
                Array(8).fill(0).map((_, idx) => (
                  <div key={idx} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <Skeleton height={20} width={`70%`} />
                    <Skeleton height={15} className="mt-2" count={2} />
                    <Skeleton height={12} width={`50%`} className="mt-3" />
                  </div>
                ))
              ) : appointmentList.length === 0 ? (
                <div className="col-span-full text-center mt-12 py-8">
                  <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaPlus className="text-gray-400 text-xl" />
                    </div>
                    <p className="text-lg font-medium text-gray-600 mb-2">No appointments yet</p>
                    <p className="text-sm text-gray-500 mb-6">Schedule your first appointment to get started</p>
                    <Link to="/createAppointment" className="inline-flex items-center gap-2 bg-[#1983D5] text-white px-6 py-3 rounded-lg hover:bg-[#146bb3] transition-colors">
                      <FaPlus className="text-sm" />
                      <span>Schedule Your First Appointment</span>
                    </Link>
                  </div>
                </div>
              ) : (
                appointmentList.map((appointment, id) => (
                  <AppointmentCard 
                    showModal={setShowModal} 
                    appointment={appointment} 
                    index={id} 
                    key={appointment.id || id} 
                    getAppointment={getSingleAppointmentData} 
                  />
                ))
              )}
            </div>
          </div>

         </div>
          <div>        
          </div>
         </div>
       </div>

       {showModal && (
        singleLoading ? (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 w-full max-w-3xl shadow-lg rounded-2xl">
              <Skeleton height={30} width="50%" />
              <Skeleton count={4} className="mt-4" />
              <Skeleton height={50} className="mt-6" />
              <Skeleton height={50} className="mt-2" />
            </div>
          </div>
        ) : (
          <AppointmentModal showModal={setShowModal} appointment={selectedAppointment} />
        )
      )}
        </>
    );
}

export default Appointments;
