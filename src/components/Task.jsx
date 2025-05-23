import React from 'react';
import { HiDotsVertical } from "react-icons/hi";
import { MdOutlineSdCard } from "react-icons/md";
import { PiNote } from "react-icons/pi";
import { CiClock1 } from "react-icons/ci";

const Task = ({ task }) => {
  const status = task.status.toLowerCase();

  // Time logic
  const dueDate = new Date(task.due_date);
  const now = new Date();
  const diff = dueDate - now;
  const diffHours = Math.floor(diff / (1000 * 60 * 60));
  const isOverdue = diff < 0;
  const absDiffHours = Math.abs(diffHours);

  let dueTimeDisplay = "";

  const displayTime = (amount, unit) =>
    `${amount} ${unit}${amount > 1 ? 's' : ''} ${isOverdue ? 'overdue' : 'left'}`;

  if (absDiffHours < 24) {
    dueTimeDisplay = displayTime(absDiffHours, 'hour');
  } else if (absDiffHours < 168) { // Less than a week
    dueTimeDisplay = displayTime(Math.floor(absDiffHours / 24), 'day');
  } else if (absDiffHours < 720) { // Less than a month (~30 days)
    dueTimeDisplay = displayTime(Math.floor(absDiffHours / 168), 'week');
  } else {
    dueTimeDisplay = displayTime(Math.floor(absDiffHours / 720), 'month');
  }

  return (
    <div  className='bg-white shadow px-6 py-6 rounded-md'>
      <div className='flex justify-between'>
        <h2 className='text-[16px] font-[600] heading-jakarta'>{task.title}</h2>
        <div className='flex items-center gap-1'>
          <button
            className={
              status === "pending"
                ? "text-yellow-800 bg-yellow-100 px-3 py-1 rounded-[16px] text-[10px] font-semibold w-auto"
                : status === "completed"
                ? "text-green-800 bg-green-100 px-3 py-1 rounded-[16px] text-[10px] font-semibold w-auto"
                : status === "in_progress"
                ? "text-blue-800 bg-blue-100 px-3 py-1 rounded-[16px] text-[10px] font-semibold w-auto"
                : status === "cancelled"
                ? "text-red-800 bg-red-100 px-3 py-1 rounded-[16px] text-[10px] font-semibold w-auto"
                : "text-gray-800 bg-gray-100 px-3 py-1 rounded-[16px] text-[10px] font-semibold w-auto"
            }
          >
            {task.status}
          </button>
          <HiDotsVertical className='text-[#1C2122] text-[16px]' />
        </div>
      </div>

      <p className='text-[12px] mt-2 font-[500] text-[#54577A]'>{task.description}</p>

      <div className='flex justify-between items-center mt-4'>
        <div className='flex gap-2 mt-2 items-center'>
          <h3 className='text-[12px] font-[500]'>Priority:</h3>
          <div className='flex items-center gap-1'>
            <div className='h-[12px] w-[12px] bg-[#F1A064] rounded-full'></div>
            <h4 className='text-[12px] font-[400]'>{task.priority}</h4>
          </div>
        </div>

        <div>
          <div className='flex gap-1'>
            <div className='flex gap-1 items-center pt-1'>
              <MdOutlineSdCard className='text-[#98A2B2] text-[13px]' />
              <h2 className='text-[12px] text-[#98A2B2] font-[800]'>2</h2>
            </div>
            <div className='flex gap-1 items-center pt-1'>
              <PiNote />
              <h2 className='text-[12px] text-[#98A2B2] font-[800]'>4</h2>
            </div>
          </div>
        </div>
      </div>

      <div className='mt-4 flex gap-1 items-center text-[#54577A]'>
        <CiClock1 />
        <h5 className='text-[12px] font-[500]'>{dueTimeDisplay}</h5>
      </div>
    </div>
  );
};

export default Task;
