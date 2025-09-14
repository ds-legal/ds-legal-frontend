import { format } from 'date-fns';
import { FiCalendar } from 'react-icons/fi'; 
import QuickActionAccordion from '../components/ui/QuickActionAccordion';
import { CiClock1 } from "react-icons/ci";
import { SlCalender } from "react-icons/sl";
import { MdArrowForwardIos } from "react-icons/md";
import { HiDotsVertical } from "react-icons/hi";
import  user from "../assets/user.png"
import { IoIosArrowUp } from "react-icons/io";
import { MdOutlineSdCard } from "react-icons/md";
import { useDashboard } from '../store/dashboard.context';
import { useEffect } from 'react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import { UseAuth } from '../store/auth.context';


function Dashboard() {
  const today = format(new Date(), 'PPP');
  const navigate = useNavigate();
  const { 
    dashboardData, 
    loading, 
    error, 
    isInitialized,
    fetchDashboardData, 
    user: userData, 
    statistics, 
    upcomingAppointments, 
    highPriorityTasks, 
    recentInvoices 
  } = useDashboard();
  
  const { user: authUser } = UseAuth();

  const handleSeeAllTasks = () => {
    navigate('/tasks');
  };

  // Show loading only if we don't have any data and are still loading
  if (loading && !dashboardData) {
    return (
      <div className="lg:px-8 py-4 px-3 flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="lg:px-8 py-4 px-3 flex justify-center items-center min-h-[400px]">
        <div className="text-red-500 text-center">
          <p>Error loading dashboard: {error}</p>
          <button 
            onClick={fetchDashboardData}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:px-8 py-4 px-3  overflow-y-scroll z-10 max-h-full ">
        {/* welcome sectio */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h3 className="text-[16px] md:text-[20px] lg:text-[24px] font-[600]">
            Welcome {userData?.first_name || 'User'}
          </h3>
          <h5 className="lg:text-[16px] text-[14px] font-[400]">Dashboard overview</h5>
        </div>

        <div className="bg-white flex flex-row items-center gap-2 px-4 py-2 rounded shadow border-[#E4E7EC]">
       <div className="h-6 w-6 flex items-center justify-center rounded-full  bg-[#E4E7EC]">
        <FiCalendar className=" text-[#344054] text-[12px]" />
        </div>

         <div>
        <span className='text-[#344054] flex-row flex text-[12px] font-[400]'>Today's Date</span>
          <span className="text-[14px] text-[#344054] font-[600] lg:text-[16px]">{today}</span>
        </div> 
        </div>
      </div>

      {/* grid section */}
      <div className=' grid lg:grid-cols-2 grid-cols-1 mt-4 gap-4 '>
        {/* first grid */}
        <div>
        <div className=' grid grid-cols-3 gap-2  md:gap-4'>
        <div className='bg-white border-[#E4E7EC] rounded-sm shadow lg:px-4 lg:py-4 p-2 ' >
        <h3 className='text-[#475367] font-[400] lg:text-[14px] text-[12px]'>All Tasks</h3>
        <h3 className='text-[#344054] font-[600] lg:text-[20px] text-[16px]'>
          {statistics?.tasks?.total || 0}
        </h3>
        {statistics?.tasks?.pending > 0 && (
          <p className='text-[10px] text-orange-500'>
            {statistics.tasks.pending} pending
          </p>
        )}
        </div>

         <div className='bg-white border-[#E4E7EC] rounded-sm shadow lg:px-4 lg:py-4 p-2' >
        <h3 className='text-[#475367] font-[400] lg:text-[14px] text-[12px]'>Total</h3>
        <h3 className='text-[#475367] font-[400] text-[14px]'>appointments</h3>
        <h3 className='text-[#344054] font-[600] lg:text-[20px] text-[16px]'>
          {statistics?.appointments?.total || 0}
        </h3>
        {statistics?.appointments?.today > 0 && (
          <p className='text-[10px] text-blue-500'>
            {statistics.appointments.today} today
          </p>
        )}
        </div>

         <div className='bg-white border-[#E4E7EC] rounded-sm shadow lg:px-4 lg:py-4 p-2' >
        <h3 className='text-[#475367] font-[400] lg:text-[14px] text-[12px]'>Invoices</h3>
        <h3 className='text-[#344054] font-[600] lg:text-[20px] text-[16px]'>
          {statistics?.invoices?.total || 0}
        </h3>
        {statistics?.invoices?.outstanding_amount > 0 && (
          <p className='text-[10px] text-red-500'>
            ${statistics.invoices.outstanding_amount} outstanding
          </p>
        )}
        </div>

        </div>
        <div className='z-0' >
       <QuickActionAccordion/> 
        </div>
        </div>

        {/* second grid */}

        <div className='bg-white border-[#E4E7EC] rounded-sm shadow  '>
         <div className=' border-b-2 border-[#E4E7EC]'>
        <h3 className='text-[18px] font-[600] px-2 py-4'>Upcoming appointments</h3>
         </div>
         <div>
        <div className='px-4 mt-4 flex flex-col gap-2'>
        {upcomingAppointments && upcomingAppointments.length > 0 ? (
          upcomingAppointments.slice(0, 3).map((appointment) => (
            <div key={appointment.id} className='bg-[#E3EFFC] lg:w-[70%] md:w-[80%] w-full px-2 border-l-[#1983D5] border-l-2 rounded-l-[6px] py-4 flex flex-col gap-1 '>
              <h3 className='text-[12px] font-[600] text-[#212121]'>
                {appointment.title || `${appointment.client_name}`}
              </h3>
              <div className='flex flex-row items-center text-[11px] font-[400] text-[#545454] gap-1'>
                <CiClock1 />  
                <p className=''>{appointment.start_time} - {appointment.end_time}</p>
              </div>
              <div className='flex flex-row items-center text-[11px] font-[400] text-[#545454] gap-1'>
                <SlCalender />
                <p className=''>{appointment.date}</p>
              </div>
              {appointment.location && (
                <h4 className='ml-2 text-[11px] font-[400] text-[#545454]'>{appointment.location}</h4>
              )}
            </div>
          ))
        ) : (
          <div className='text-center py-8 text-[#667185]'>
            <p>No upcoming appointments</p>
          </div>
        )}
       </div>

         </div>
        </div>
      </div>


       <div className='w-full bg-white shadow mt-6 '>
        <div className='flex justify-between  border-b-2  border-b-[#F0F2F5] px-4 py-4'>
        <h3 className='font-[600] text-[18px] '>High priority tasks</h3>
        <div 
          className=' flex  gap-1 items-center cursor-pointer hover:text-[#1983D5] transition-colors'
          onClick={handleSeeAllTasks}
        >
        <h3 className='font-[400] text-[16px] text-[#667185]'>See All</h3>
        <span className='font-[400] text-[16px] text-[#667185]'><MdArrowForwardIos /></span>
        </div>  
        </div>
        
        {highPriorityTasks && highPriorityTasks.length > 0 ? (
          highPriorityTasks.map((task) => (
            <div key={task.id} className='p-4 border-b border-[#F0F2F5] last:border-b-0'>
              <div className=' flex justify-between'>
                <h3 className='text-[16px] font-[600]'>{task.title}</h3>
                <div className='flex items-center gap-1'>
                  <button className='w-auto px-2 py-1 rounded-[16px] text-[8px] text-[#00AEFF] bg-[#E3EFFC] font-[800]'>
                    {task.status}
                  </button>
                  <span><HiDotsVertical /></span>    
                </div>
              </div>  
              <p className='text-[12px] text-[#54577A] font-[500] mt-2'>{task.description}</p>
              
              <div className='flex justify-between items-center mt-4'>
                <div className=' flex flex-col gap-1'>
                  <div className="flex flex-row">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 bg-[#ffece5] flex items-center justify-center">
                      {authUser?.avatar_url ? (
                        <img 
                          src={authUser.avatar_url} 
                          alt="user" 
                          className="w-full h-full object-cover object-center rounded-full"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-[#1983D5] rounded-full flex items-center justify-center text-white text-xs font-semibold">
                          {authUser?.first_name ? authUser.first_name.charAt(0).toUpperCase() : 'U'}
                        </div>
                      )}
                    </div>
                  </div>
                  {task.due_date && (
                    <p className='text-[12px] text-[#54577A] font-[500]'>Due: {task.due_date}</p>
                  )}
                </div>
                
                <div className='flex gap-1 items-center '>
                  <h5 className='text-[12px] font-[500] text-[#54577A]'>Priority:</h5>
                  <div className=' flex items-center gap-1'>
                    <span className={`${task.priority === 'high' ? 'text-red-500' : 'text-orange-300'}`}>
                      <IoIosArrowUp />
                    </span>
                    <span className='text-[12px] font-[500] text-[#54577A] capitalize'>{task.priority}</span>
                    {task.progress_percentage !== undefined && (
                      <div className='flex gap-1 items-center'>
                        <span><MdOutlineSdCard /></span>
                        <span>{task.progress_percentage}%</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className='p-4 text-center text-[#667185]'>
            <p>No high priority tasks</p>
          </div>
        )}

       </div>
    </div>
  );
}

export default Dashboard;
