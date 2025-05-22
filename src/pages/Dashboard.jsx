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


function Dashboard() {
  const today = format(new Date(), 'PPP');

  return (
    <div className="lg:px-8 py-4 px-3  overflow-y-scroll z-10 ">
        {/* welcome sectio */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h3 className="text-[16px] md:text-[20px] lg:text-[24px] font-[600]">Welcome Joan</h3>
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
        <h3 className='text-[#344054] font-[600] lg:text-[20px] text-[16px]'>200</h3>
        </div>

         <div className='bg-white border-[#E4E7EC] rounded-sm shadow lg:px-4 lg:py-4 p-2' >
        <h3 className='text-[#475367] font-[400] lg:text-[14px] text-[12px]'>All Tasks</h3>
        <h3 className='text-[#475367] font-[400] text-[14px]'>appointments</h3>
        <h3 className='text-[#344054] font-[600] lg:text-[20px] text-[16px]'>200</h3>
        </div>

         <div className='bg-white border-[#E4E7EC] rounded-sm shadow lg:px-4 lg:py-4 p-2' >
        <h3 className='text-[#475367] font-[400] lg:text-[14px] text-[12px]'>Invoices</h3>
        <h3 className='text-[#344054] font-[600] lg:text-[20px] text-[16px]'>200</h3>
        </div>

        </div>
        <div className='z-0' >
       <QuickActionAccordion/> 
        </div>
        </div>

        {/* second grid */}

        <div className='bg-white border-[#E4E7EC] rounded-sm shadow  '>
         <div className=' border-b-2 border-[#E4E7EC]'>
        <h3 className='text-[18px] font-[600] px-2 py-4'>Upcoming apointments</h3>
         </div>
         <div>
        <div className='px-4 mt-4 flex flex-col gap-2'>
        <div  className='bg-[#E3EFFC] lg:w-[70%] md:w-[80%] w-full px-2 border-l-[#1983D5] border-l-2 rounded-l-[6px] py-4 flex flex-col gap-1 '>
        <h3 className='text-[12px] font-[600] text-[#212121 '>Hillary Wilton x John</h3>
        <div className='flex flex-row items-center text-[11px] font-[400] text-[#545454] gap-1'>
          <CiClock1 />  
          <p className=''>11pm - 12pm</p>
        </div>
        <span className='text-[11px] font-[400] text-[#545454] '><SlCalender /></span>
        <h4 className='ml-2 text-[11px] font-[400] text-[#545454] '>Trade Dollar , 18 , London, E1 1AA, United Kingdom</h4>
            
        </div>

        <div  className='bg-[#E3EFFC] lg:w-[70%] md:w-[80%] w-full px-2 border-l-[#1983D5] border-l-2 rounded-l-[6px] py-4 flex flex-col gap-1 '>
        <h3 className='text-[12px] font-[600] text-[#212121 '>Hillary Wilton x John</h3>
        <div className='flex flex-row items-center text-[11px] font-[400] text-[#545454] gap-1'>
          <CiClock1 />  
          <p className=''>11pm - 12pm</p>
        </div>
        <span className='text-[11px] font-[400] text-[#545454] '><SlCalender /></span>
        <h4 className='ml-2 text-[11px] font-[400] text-[#545454] '>Trade Dollar , 18 , London, E1 1AA, United Kingdom</h4>    
        </div>

        <div  className='bg-[#E3EFFC] lg:w-[70%] md:w-[80%] w-full px-2 border-l-[#1983D5] border-l-2 rounded-l-[6px] py-4 flex flex-col gap-1 '>
        <h3 className='text-[12px] font-[600] text-[#212121 '>Hillary Wilton x John</h3>
        <div className='flex flex-row items-center text-[11px] font-[400] text-[#545454] gap-1'>
          <CiClock1 />  
          <p className=''>11pm - 12pm</p>
        </div>
        <span className='text-[11px] font-[400] text-[#545454] '><SlCalender /></span>
        <h4 className='ml-2 text-[11px] font-[400] text-[#545454] '>Trade Dollar , 18 , London, E1 1AA, United Kingdom</h4>      
        </div>
       </div>

         </div>
        </div>
      </div>


       <div className='w-full bg-white shadow mt-6 '>
        <div className='flex justify-between  border-b-2  border-b-[#F0F2F5] px-4 py-4'>
        <h3 className='font-[600] text-[18px] '>High priority tasks</h3>
        <div className=' flex  gap-1 items-center'>
        <h3 className='font-[400] text-[16px] text-[#667185]'>See All</h3>
        <span className='font-[400] text-[16px] text-[#667185]'><MdArrowForwardIos /></span>
        </div>  
        </div>
        <div className='p-4'>
          <div className=' flex justify-between'>
        <h3 className='text-[16px] font-[600]'>Lorem ipsum dolor sit amet consectetur.</h3>
         <div className='flex items-center gap-1'>
        <button className='w-auto px-2 py-1 rounded-[16px] text-[8px] text-[#00AEFF] bg-[#E3EFFC] font-[800]'>Action</button>
        <span><HiDotsVertical /></span>    
         </div>
        </div>  
        <p className='text-[12px] text-[#54577A] font-[500]'>Lorem ipsum dolor sit amet consectetur.Lorem ipsum dolor sit amet consectetur.</p>
         <div className='flex justify-between items-center'>
          <div className=' flex flex-col gap-1'>
        <div className="mt-4 flex flex-row">
        <img src={user} alt="" className="w-8 h-8 object-cover rounded-full" />
        <img src={user} alt="" className="w-8 h-8 object-cover rounded-full -ml-4" />
        <img src={user} alt="" className="w-8 h-8 object-cover rounded-full -ml-4" />
        <img src={user} alt="" className="w-8 h-8 object-cover rounded-full -ml-4" />
       </div>
       <p className='text-[12px] text-[#54577A] font-[500]'>Lorem ipsum dolor sit amet consectetur.Lorem ipsum dolor sit amet consectetur.</p>
        </div>
        <div className='flex gap-1 items-center '>
          <h5 className='text-[12px] font-[500] font-[#54577A]'>Priority:</h5>
        <div className=' flex'>
           <span className='text-orange-300'>    <IoIosArrowUp /></span>
           <span className='text-[12px] font-[500] font-[#54577A]'>Highest</span>
           <div className='flex gap-1'>
               <span>
              <MdOutlineSdCard />
              </span>
              <span>2</span>
           </div>
            
        </div>

        </div>

         </div>


        </div>

       </div>
    </div>
  );
}

export default Dashboard;
