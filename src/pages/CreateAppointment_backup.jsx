import React, { useState, useEffect } from 'react';
import Nav from '../components/ui/Nav';
import { MdArrowBackIosNew } from "react-icons/md";
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useAppointment } from '../store/appointment.context';
import { useTask } from '../store/task.context';
import toast from 'react-hot-toast';

const CreateAppointment = () => {
  const { createAppointment, getAllAppointments } = useAppointment();
  const { getAllTask, task } = useTask();
  const navigate = useNavigate();

  // Form type toggle
  const [formType, setFormType] = useState('appointment'); // 'appointment' or 'task'

  // Basic fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // Reminder fields
  const [viaEmail, setViaEmail] = useState(false);
  const [viaApp, setViaApp] = useState(false);
  const [reminderValue, setReminderValue] = useState(15);
  const [reminderUnit, setReminderUnit] = useState('minutes');
  const [showReminderUnit, setShowReminderUnit] = useState(false);

  // Meeting fields
  const [meetingLink, setMeetingLink] = useState('');
  const [relatedTaskId, setRelatedTaskId] = useState('');
  const [showTaskDropdown, setShowTaskDropdown] = useState(false);

  // Task-specific fields (when formType === 'task')
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('pending');
  const [showPriority, setShowPriority] = useState(false);
  const [showStatus, setShowStatus] = useState(false);

  const reminderUnits = ['minutes', 'hours', 'days'];
  const priorities = ['low', 'medium', 'high'];
  const taskStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];

  const tasks = Array.isArray(task) ? task : [];

  useEffect(() => {
    getAllTask();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!date || !startTime || !endTime) {
      toast.error('Date and time fields are required');
      return;
    }

    const toastId = toast.loading('Creating appointment...');

    // Combine date and time
    const startDateTime = new Date(`${date}T${startTime}`).toISOString();
    const endDateTime = new Date(`${date}T${endTime}`).toISOString();

    // Validate end time is after start time
    if (new Date(endDateTime) <= new Date(startDateTime)) {
      toast.error('End time must be after start time', { id: toastId });
      return;
    }

    const appointmentData = {
      title,
      description,
      date,
      start_time: startDateTime,
      end_time: endDateTime,
      meeting_link: meetingLink,
      via_email: viaEmail,
      via_app: viaApp,
      before_value: reminderValue,
      before_unit: reminderUnit,
      related_task_id: relatedTaskId || null,
    };

    console.log('Sending appointment data:', appointmentData);

    try {
      const response = await createAppointment(appointmentData);
      console.log('Create response:', response);
      
      if (response?.ok || response?.status_code === 201 || response?.id || response?.data) {
        getAllAppointments();
        toast.success('Appointment created successfully!', { id: toastId });
        navigate("/appointments");
      } else {
        console.error('Create failed with response:', response);
        // Show detailed validation errors if available
        if (response?.detail && Array.isArray(response.detail)) {
          const errorMessages = response.detail.map(err => err.msg || err.message || JSON.stringify(err)).join(', ');
          toast.error(`Validation errors: ${errorMessages}`, { id: toastId });
        } else if (response?.detail) {
          toast.error(`Error: ${response.detail}`, { id: toastId });
        } else {
          toast.error('Failed to create appointment', { id: toastId });
        }
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error('Failed to create appointment', { id: toastId });
    }
  };

  return (
    <>
      <Nav />
      <div className='min-h-screen bg-gray-50 py-8'>
        <div className='max-w-2xl mx-auto px-4'>
          {/* Header */}
          <div className='flex justify-between items-center mb-8'>
            <Link to="/appointments" className='flex items-center gap-2 text-[#667185] hover:text-[#1983D5] transition-colors'>
              <MdArrowBackIosNew className='text-[16px]' />
              <span className='text-sm font-medium'>Back</span>
            </Link>
            <button 
              onClick={handleSubmit} 
              className='bg-[#1983D5] hover:bg-[#146bb3] text-white rounded-lg px-6 py-2.5 text-sm font-medium transition-colors'
            >
              Save
            </button>
          </div>

          {/* Main Form Card */}
          <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
            {/* Form Type Toggle */}
            <div className='px-6 pt-6 pb-0'>
              <div className='flex bg-gray-50 rounded-lg p-1'>
                <button
                  type="button"
                  onClick={() => setFormType('appointment')}
                  className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-md transition-all ${
                    formType === 'appointment' 
                      ? 'bg-[#1983D5] text-white shadow-sm' 
                      : 'text-[#667185] hover:text-[#333]'
                  }`}
                >
                  Schedule an appointment
                </button>
                <button
                  type="button"
                  onClick={() => setFormType('task')}
                  className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-md transition-all ${
                    formType === 'task' 
                      ? 'bg-[#FFA500] text-white shadow-sm' 
                      : 'text-[#667185] hover:text-[#333]'
                  }`}
                >
                  Task
                </button>
              </div>
            </div>

            {/* Form Content */}
            <div className='p-6'>
              <h2 className='text-xl font-semibold text-[#1F2937] mb-6'>
                {formType === 'appointment' ? 'Create Appointment' : 'Create Appointment'}
              </h2>

              <form className='space-y-6' onSubmit={handleSubmit}>
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-white border border-[#D1D5DB] rounded-lg px-3 py-2.5 text-sm placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#1983D5] focus:border-transparent"
                    placeholder="Enter Subject"
                    required
                  />
                </div>

                {/* Date and Time Layout */}
                <div className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium text-[#374151] mb-2'>
                      {formType === 'task' ? 'Due date' : 'Date'}
                    </label>
                    <input
                      type='date'
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className='w-full bg-white border border-[#D1D5DB] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1983D5] focus:border-transparent'
                      required
                    />
                  </div>

                  {formType === 'appointment' && (
                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <label className='block text-sm font-medium text-[#374151] mb-2'>Start</label>
                        <input
                          type='time'
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          className='w-full bg-white border border-[#D1D5DB] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1983D5] focus:border-transparent'
                          required
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-[#374151] mb-2'>End</label>
                        <input
                          type='time'
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className='w-full bg-white border border-[#D1D5DB] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1983D5] focus:border-transparent'
                          required
                        />
                      </div>
                    </div>
                  )}

                  {formType === 'task' && (
                    <div>
                      <label className='block text-sm font-medium text-[#374151] mb-2'>Time</label>
                      <input
                        type='time'
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className='w-full bg-white border border-[#D1D5DB] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1983D5] focus:border-transparent'
                        required
                      />
                    </div>
                  )}
                </div>

                {/* Reminder Section */}
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-3">Reminder</label>
                  <div className='flex flex-wrap gap-3 mb-4'>
                    <label className='flex items-center space-x-2'>
                      <input
                        type='checkbox'
                        checked={viaEmail}
                        onChange={(e) => setViaEmail(e.target.checked)}
                        className='w-4 h-4 text-[#1983D5] border-[#D1D5DB] rounded focus:ring-[#1983D5]'
                      />
                      <span className='text-sm text-[#374151]'>Email</span>
                    </label>
                    <label className='flex items-center space-x-2'>
                      <input
                        type='checkbox'
                        checked={viaApp}
                        onChange={(e) => setViaApp(e.target.checked)}
                        className='w-4 h-4 text-[#1983D5] border-[#D1D5DB] rounded focus:ring-[#1983D5]'
                      />
                      <span className='text-sm text-[#374151]'>Application</span>
                    </label>
                    <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#1983D5] text-white'>
                      {(viaEmail || viaApp) ? 'ON' : 'OFF'}
                    </span>
                  </div>

                  <div className='flex items-center gap-3'>
                    <label className="text-sm font-medium text-[#374151]">Before</label>
                    <input
                      type='number'
                      value={reminderValue}
                      onChange={(e) => setReminderValue(parseInt(e.target.value) || 15)}
                      className='w-20 bg-white border border-[#D1D5DB] rounded-lg px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#1983D5] focus:border-transparent'
                      min="1"
                    />
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowReminderUnit(!showReminderUnit)}
                        className="flex items-center justify-between w-20 bg-white border border-[#D1D5DB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1983D5]"
                      >
                        <span className='capitalize'>{reminderUnit}</span>
                        <FiChevronDown className={`transition-transform ${showReminderUnit ? 'rotate-180' : ''}`} />
                      </button>
                      {showReminderUnit && (
                        <div className='absolute top-full left-0 mt-1 w-full bg-white border border-[#D1D5DB] rounded-lg shadow-lg z-10'>
                          {reminderUnits.map((unit) => (
                            <button
                              key={unit}
                              type="button"
                              onClick={() => {
                                setReminderUnit(unit);
                                setShowReminderUnit(false);
                              }}
                              className='w-full px-3 py-2 text-left text-sm hover:bg-gray-50 capitalize'
                            >
                              {unit}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                    >
                      <div className="flex items-center gap-2">
                        <div className={`h-[12px] w-[12px] rounded-full ${
                          priority === 'high' ? 'bg-red-500' : 
                          priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}></div>
                        <span className="capitalize">{priority}</span>
                      </div>
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
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <div className={`h-[12px] w-[12px] rounded-full ${
                              item === 'high' ? 'bg-red-500' : 
                              item === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                            }`}></div>
                            <span className="capitalize">{item}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="text-sm text-[#475367] font-medium">Task Status</label>
                  <div className="relative mt-1">
                    <div
                      onClick={() => setShowStatus(!showStatus)}
                      className="bg-[#EFF1F3] border-2 border-[#D0D5DD] p-3 rounded-md cursor-pointer flex justify-between items-center"
                    >
                      <span className="capitalize">{status}</span>
                      {showStatus ? <FiChevronUp /> : <FiChevronDown />}
                    </div>
                    {showStatus && (
                      <div className="absolute z-10 mt-2 w-full bg-white border rounded shadow-md">
                        {taskStatuses.map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => {
                              setStatus(item);
                              setShowStatus(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 capitalize"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <label className="text-sm text-[#475367] font-medium">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                maxLength={200}
                className="w-full bg-[#EFF1F3] border-2 border-[#D0D5DD] rounded-md p-3 text-sm mt-1"
                placeholder="Enter description (max 200 characters)"
              ></textarea>
            </div>

            {/* Reminder Settings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm text-[#475367] font-medium">Reminder Options</label>
                <div className="mt-1 space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={viaEmail}
                      onChange={(e) => setViaEmail(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm">Via Email</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={viaApp}
                      onChange={(e) => setViaApp(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm">Via Application</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-sm text-[#475367] font-medium">Reminder Before</label>
                <input
                  type="number"
                  value={reminderValue}
                  onChange={(e) => setReminderValue(parseInt(e.target.value) || 0)}
                  min="1"
                  className="w-full bg-[#EFF1F3] border-2 border-[#D0D5DD] rounded-md p-3 text-sm mt-1"
                />
              </div>

              <div>
                <label className="text-sm text-[#475367] font-medium">Unit</label>
                <div className="relative mt-1">
                  <div
                    onClick={() => setShowReminderUnit(!showReminderUnit)}
                    className="bg-[#EFF1F3] border-2 border-[#D0D5DD] p-3 rounded-md cursor-pointer flex justify-between items-center"
                  >
                    <span className="capitalize">{reminderUnit}</span>
                    {showReminderUnit ? <FiChevronUp /> : <FiChevronDown />}
                  </div>
                  {showReminderUnit && (
                    <div className="absolute z-10 mt-2 w-full bg-white border rounded shadow-md">
                      {reminderUnits.map((unit) => (
                        <button
                          key={unit}
                          type="button"
                          onClick={() => {
                            setReminderUnit(unit);
                            setShowReminderUnit(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 capitalize"
                        >
                          {unit}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Meeting Link */}
            {formType === 'appointment' && (
              <div>
                <label className="text-sm text-[#475367] font-medium">Meeting Link</label>
                <input
                  type="url"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  className="w-full bg-[#EFF1F3] border-2 border-[#D0D5DD] rounded-md p-3 text-sm mt-1"
                  placeholder="https://meet.google.com/..."
                />
              </div>
            )}

            {/* Select Task */}
            <div>
              <label className="text-sm text-[#475367] font-medium">Link to Task (Optional)</label>
              <div className="relative mt-1">
                <div
                  onClick={() => setShowTaskDropdown(!showTaskDropdown)}
                  className="bg-[#EFF1F3] border-2 border-[#D0D5DD] p-3 rounded-md cursor-pointer flex justify-between items-center"
                >
                  <span>
                    {relatedTaskId 
                      ? tasks.find(t => t.id === relatedTaskId)?.title || 'Select a task'
                      : 'Select a task'
                    }
                  </span>
                  {showTaskDropdown ? <FiChevronUp /> : <FiChevronDown />}
                </div>
                {showTaskDropdown && (
                  <div className="absolute z-10 mt-2 w-full bg-white border rounded shadow-md max-h-48 overflow-y-auto">
                    <button
                      type="button"
                      onClick={() => {
                        setRelatedTaskId('');
                        setShowTaskDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-500"
                    >
                      No task selected
                    </button>
                    {tasks.map((task) => (
                      <button
                        key={task.id}
                        type="button"
                        onClick={() => {
                          setRelatedTaskId(task.id);
                          setShowTaskDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        {task.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateAppointment;
