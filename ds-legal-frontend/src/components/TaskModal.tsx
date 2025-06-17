import React from 'react'
import { CiFileOn } from 'react-icons/ci'
import { FaAngleDown, FaPlus, FaTimes } from 'react-icons/fa'
import { FaCalendarAlt } from 'react-icons/fa'
import { MdCategory } from 'react-icons/md'

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleString('default', {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

const TaskModal = ({ showModal, task }) => {
  if (!task) return null;

  return (
    <div className='fixed inset-0 bg-opacity-30 z-50 flex items-center justify-center px-4'>
      <div className="bg-white p-4 sm:p-6 w-full max-w-md sm:max-w-xl lg:max-w-3xl rounded-2xl shadow-lg overflow-y-auto max-h-[90vh]">
        
        {/* Header */}
        <div className='flex justify-between items-center'>
          <h3 className='font-medium text-[16px] sm:text-[18px] text-[#212121]'>Task Details</h3>
          <span onClick={() => showModal(false)} className='cursor-pointer'><FaTimes /></span>
        </div>

        <hr className='bg-[#E9E9E9] mt-4' />

        {/* Title */}
        <h1 className='text-[16px] sm:text-[20px] lg:text-[24px] font-semibold text-[#212121] mt-4'>
          {task.title}
        </h1>

        <hr className='bg-[#E9E9E9] mt-4' />

        {/* Priority and Status */}
        <div className='mt-4 flex gap-6 flex-wrap items-center'>
          <div className='flex gap-1 items-center'>
            <div className={`h-[12px] w-[12px] rounded-full ${task.priority === 'high' ? 'bg-[#DC5561]' : 'bg-gray-400'}`}></div>
            <h5 className='text-[12px] text-[#212121]'>{task.priority?.[0].toUpperCase() + task.priority?.slice(1)} Priority</h5>
            <FaAngleDown className='text-[#212121] text-[14px] pt-1' />
          </div>

          <div className='flex gap-1 items-center'>
            <button className='bg-[#EBC6231A] text-[#EBC623] px-2 py-1 rounded-full text-[12px]'>{task.status}</button>
            <FaAngleDown className='text-[#212121] text-[14px] pt-1' />
          </div>
        </div>

        <hr className='bg-[#E9E9E9] mt-4' />

        {/* Due Date */}
        <div className='mt-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8'>
          <div className='flex gap-2 items-center'>
            <FaCalendarAlt className='text-[#545454]' />
            <p className='text-[14px] sm:text-[16px] text-[#545454]'>Due Date</p>
          </div>
          <p className='text-[14px] sm:text-[16px] text-[#212121] font-medium'>{formatDate(task.due_date)}</p>
        </div>

        <hr className='bg-[#E9E9E9] mt-4' />

        {/* Category */}
        <div className='mt-4 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center'>
          <div className='flex items-center gap-4 flex-wrap'>
            <div className='flex gap-2 items-center'>
              <MdCategory className='text-[#545454]' />
              <p className='text-[14px] sm:text-[16px] text-[#545454]'>Category</p>
            </div>
            <div className='flex gap-2'>
              <button className='bg-[#1983D5] text-white rounded-2xl px-4 py-2 flex items-center gap-2'>
                <FaTimes /> {task.category}
              </button>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <h3 className='text-[#1983D5] text-[14px] sm:text-[16px]'>Add category</h3>
            <FaPlus className='text-[#1983D5]' />
          </div>
        </div>

        <hr className='bg-[#E9E9E9] mt-4' />

        {/* Description */}
        <div className='mt-4'>
          <h3 className='text-[16px] text-[#212121] font-[500]'>Description</h3>
          <p className='text-[#98A2B3] mt-2 text-[14px] tracking-tight'>
            {task.description || 'No description available.'}
          </p>
        </div>

        {/* Attachments */}
        <div className='mt-6'>
          <h3 className='text-[#212121] text-[16px] font-[500]'>Attachments</h3>
          <div className='flex gap-4 flex-wrap'>
            <div className='flex gap-1 items-center text-[#98A2B2] text-[12px] mt-1'>
              <CiFileOn /> <span>2</span>
            </div>
            <div className='flex gap-1 items-center text-[#98A2B2] text-[12px] mt-1'>
              <CiFileOn /> <span>4</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className='mt-6 flex flex-col sm:flex-row justify-between gap-4'>
          <button className='bg-[#EB2525] text-white px-6 py-3 rounded-full w-full sm:w-auto'>
            Delete
          </button>
          <button className='bg-[#1983D5] text-white px-6 py-3 rounded-full w-full sm:w-auto'>
            Edit
          </button>
        </div>
      </div>
    </div>
  )
}

export default TaskModal
