import React, { useState } from 'react';
import Nav from '../components/ui/Nav';
import { MdArrowBackIosNew, MdOutlineStickyNote2 } from "react-icons/md";
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useTask } from '../store/task.context';
import toast from 'react-hot-toast';
import { FaPlus } from "react-icons/fa6";
import { SiTheirishtimes } from 'react-icons/si';
import { TiTimes } from "react-icons/ti";

const EditTasks = () => {
  const { createTask , getAllTask} = useTask();

  const [showDays, setShowDays] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [showPriority, setShowPriority] = useState(false);
  const [priority, setPriority] = useState('high');
  const [showStatus, setShowStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('completed');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const naviagate = useNavigate()

  const priorities = [ 'low', 'medium', 'high'];
  const taskStatuses = [
    { label: 'in_progress', color: 'bg-blue-100 text-blue-800' },
    { label: 'completed', color: 'bg-green-100 text-green-800' },
    { label: 'pending', color: 'bg-green-100 text-green-800' },
    { label: 'cancelled', color: 'bg-green-100 text-green-800' },
  ];

  const selectedStatusObj = taskStatuses.find((s) => s.label === selectedStatus);

  const handleSelectDay = (day) => {
    setSelectedDay(day);
    setShowDays(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Creating task...');
    let dueDate = null;
    if (date && time) {
      const combined = new Date(`${date}T${time}`);
      dueDate = combined.toISOString();
    }

    const taskData = {
      title,
      description,
      category,
      due_date: dueDate,
      reminderDay: selectedDay,
      priority,
      status: selectedStatus,
    };

    const response = await createTask(taskData);
    if(response?.status_code === 201){
      getAllTask()
     toast.success(response.message, { id: toastId });
     naviagate("/tasks")
    }
    
    // Reset form
    setTitle('');
    setDescription('');
    setCategory('');
    setDate('');
    setTime('');
    setSelectedDay(null);
    setPriority('high');
    setSelectedStatus('completed');
  };

  return (
    <>
      <Nav />
      <div className='lg:w-[80%] w-[90%] mx-auto my-10'>
        <div className='flex justify-between'>
          <Link to="/tasks" className='flex items-center gap-1 text-[14px] text-[#667185] font-[500]'>
            <MdArrowBackIosNew className='text-[15px]' />
            <h3>Back</h3>
          </Link>
          <button onClick={handleSubmit} className='bg-[#1983D5] text-white rounded-[40px] px-4 py-2 text-[16px]'>
            Save
          </button>
        </div>

        <div className='bg-white shadow-lg lg:w-[70%] w-full mx-auto px-10 py-10'>
          <h2 className='text-[24px] font-semibold mb-6'>Edit Task</h2>

          <form className='space-y-6' onSubmit={handleSubmit}>
            <div>
              <label className="text-sm text-[#475367] font-medium mb-1 ">Task Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#EFF1F3] border-2 border-[#D0D5DD] rounded-md p-3 text-sm"
              />
            </div>

            <div>
              <label className="text-sm text-[#475367] font-medium ">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full bg-[#EFF1F3] border-2 border-[#D0D5DD] rounded-md p-3 text-sm mt-1"
              ></textarea>
            </div>

            <div>
              <label className='text-sm text-[#475367] font-medium '>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className='w-full bg-[#EFF1F3] border-2 border-[#D0D5DD] rounded-md p-3 mt-1'
              >
                <option value="">Select category</option>
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm text-[#475367] font-medium'>Select Date</label>
                <input
                  type='date'
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className='w-full bg-[#EFF1F3] border-2 border-[#D0D5DD] rounded-md p-2 mt-1'
                />
              </div>
              <div>
                <label className='block text-sm text-[#475367] font-medium'>Select Time</label>
                <input
                  type='time'
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className='w-full bg-[#EFF1F3] border-2 border-[#D0D5DD] rounded-md p-2 mt-1'
                />
              </div>
            </div>

            {/* Reminder Dropdown */}
            <div>
              <label className="text-sm text-[#475367] font-medium ">Reminder (Before)</label>
              <div className="relative mt-1">
                <div
                  onClick={() => setShowDays(!showDays)}
                  className="bg-[#EFF1F3] border-2 border-[#D0D5DD] p-3 rounded-md cursor-pointer flex justify-between items-center"
                >
                  <span>{selectedDay ? `${selectedDay} day(s)` : 'Select Day'}</span>
                  {showDays ? <FiChevronUp /> : <FiChevronDown />}
                </div>
                {showDays && (
                  <div className="absolute z-10 bg-white border mt-2 w-full max-h-40 overflow-y-auto rounded shadow-md">
                    {Array.from({ length: 31 }, (_, i) => (
                      <button
                        key={i}
                      type="button"
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => handleSelectDay(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div> 

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Priority */}
              <div>
                <label className="text-sm text-[#475367] font-medium ">Priority</label>
                <div className="relative mt-1">
                  <div
                    onClick={() => setShowPriority(!showPriority)}
                    className="bg-[#EFF1F3] border-2 border-[#D0D5DD] p-3 rounded-md cursor-pointer flex justify-between items-center"
                  >
                    <span>{priority}</span>
                    {showPriority ? <FiChevronUp /> : <FiChevronDown />}
                  </div>
                  {showPriority && (
                    <div className="absolute z-10 mt-2 w-full bg-white border rounded shadow-md">
                      {priorities.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => {
                            setPriority(item);
                            setShowPriority(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="text-sm text-[#475367] font-medium ">Task Status</label>
                <div className="relative mt-1">
                  <div
                    onClick={() => setShowStatus(!showStatus)}
                    className="bg-[#EFF1F3] border-2 border-[#D0D5DD] p-3 rounded-md cursor-pointer flex justify-between items-center"
                  >
                    <span className={`px-3 py-1 text-sm rounded-full ${selectedStatusObj?.color}`}>
                      {selectedStatus}
                    </span>
                    {showStatus ? <FiChevronUp /> : <FiChevronDown />}
                  </div>
                  {showStatus && (
                    <div className="absolute z-10 mt-2 w-full bg-white border rounded shadow-md p-2">
                      <div className="flex flex-wrap gap-2">
                        {taskStatuses.map((status) => (
                          <button
                            key={status.label}
                            type="button"
                            onClick={() => {
                              setSelectedStatus(status.label);
                              setShowStatus(false);
                            }}
                            className={`px-3 py-1 text-sm rounded-full ${status.color}`}
                          >
                            {status.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Attach notes */}
            <div>
              <div className=' flex gap-4 items-center'>
            <h3 className='text-[#1983D5] text-[16px]'>Attach notes</h3>
            <FaPlus className='text-[#1983D5] text-[16px]' />
             </div>
             <div className='   flex mt-4  gap-2 flex-col'>
              <div className=' flex  gap-12 font-bold items-center'>
            <div className=' flex gap-2 items-center text-[#CECECE]'>
            <MdOutlineStickyNote2 />
            <h5 className='text-[14px]'>Note</h5>
            </div>
             <TiTimes className='text-[#CECECE] ' />     
              </div>
               <div className=' flex  gap-12 font-bold items-center'>
            <div className=' flex gap-2 items-center text-[#CECECE]'>
            <MdOutlineStickyNote2 />
            <h5 className='text-[14px]'>Note</h5>
            </div>
             <TiTimes className='text-[#CECECE] ' />     
              </div>
               <div className=' flex  gap-12 font-bold items-center'>
            <div className=' flex gap-2 items-center text-[#CECECE]'>
            <MdOutlineStickyNote2 />
            <h5 className='text-[14px]'>Note</h5>
            </div>
             <TiTimes className='text-[#CECECE] ' />     
              </div> 
               <h3 className='text-[#475367] mt-4 text-[14px] font-bold'>Attachments</h3>     
            </div>         
            </div>
            {/* Attachment */}

             <div>
              <div className=' flex gap-4 items-center'>
            <h3 className='text-[#1983D5] text-[16px]'>Add Attachments</h3>
            <FaPlus className='text-[#1983D5] text-[16px]' />
             </div>
             <div className='   flex mt-4  gap-2 flex-col'>
              <div className=' flex  gap-8 font-bold items-center'>
            <div className=' flex gap-2 items-center text-[#CECECE]'>
            <MdOutlineStickyNote2 />
            <h5 className='text-[14px]'>Attachment 1</h5>
            </div>
             <TiTimes className='text-[#CECECE] ' />     
              </div>
               <div className=' flex  gap-8 font-bold items-center'>
            <div className=' flex gap-2 items-center text-[#CECECE]'>
            <MdOutlineStickyNote2 />
            <h5 className='text-[14px]'>Attachment 2</h5>
            </div>
             <TiTimes className='text-[#CECECE] ' />     
              </div>        
            </div>         
            </div>

            <div>
               <h3 className='text-[#475367] text-[14px]'>Attach Invoice</h3> 
                <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className='w-full bg-[#EFF1F3] border-2 border-[#D0D5DD] rounded-md p-3 mt-1'
              >
                <option value="">Select what you want to pay for</option>
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="urgent">Urgent</option>
              </select> 
            </div>

            

          </form>
        </div>
      </div>
    </>
  );
};

export default EditTasks;
