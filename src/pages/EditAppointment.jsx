import React, { useState, useEffect, useRef } from 'react';
import { MdArrowBackIosNew } from "react-icons/md";
import { FiChevronDown } from 'react-icons/fi';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppointment } from '../store/appointment.context';
import { useTask } from '../store/task.context';
import { getSingleAppointment } from '../api/appointment_api';
import toast from 'react-hot-toast';

const EditAppointment = () => {
  const { updateAppointment, getAllAppointments } = useAppointment();
  const { getAllTask, task, loading: taskLoading } = useTask();
  const { id } = useParams();
  const navigate = useNavigate();
  const taskDropdownRef = useRef(null);

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

  const [loading, setLoading] = useState(true);

  const reminderUnits = ['minutes', 'hours', 'days'];
  const priorities = ['low', 'medium', 'high'];
  const taskStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];

  const tasks = Array.isArray(task) ? task : [];

  // Debug logging
  useEffect(() => {
    console.log('Edit - Tasks data:', tasks);
    console.log('Edit - Task raw data:', task);
    console.log('Edit - Task loading state:', taskLoading);
  }, [task, tasks, taskLoading]);

  // Click outside handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (taskDropdownRef.current && !taskDropdownRef.current.contains(event.target)) {
        setShowTaskDropdown(false);
      }
      if (!event.target.closest('.reminder-dropdown')) {
        setShowReminderUnit(false);
      }
      if (!event.target.closest('.priority-dropdown')) {
        setShowPriority(false);
      }
      if (!event.target.closest('.status-dropdown')) {
        setShowStatus(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Load appointment data when component mounts
  useEffect(() => {
    // Load tasks first
    getAllTask();
    
    const loadAppointmentData = async () => {
      if (id) {
        try {
          const appointmentData = await getSingleAppointment(id);
          if (appointmentData && appointmentData.data) {
            const appointment = appointmentData.data;
            setTitle(appointment.title || '');
            setDescription(appointment.description || '');
            setMeetingLink(appointment.meeting_link || '');
            setRelatedTaskId(appointment.related_task_id || '');
            
            // Handle reminder settings - check both nested and flat structure
            if (appointment.reminder) {
              setViaEmail(appointment.reminder.via_email || false);
              setViaApp(appointment.reminder.via_app || false);
              setReminderValue(appointment.reminder.before_value || 15);
              setReminderUnit(appointment.reminder.before_unit || 'minutes');
            } else {
              // Handle flat structure
              setViaEmail(appointment.via_email || false);
              setViaApp(appointment.via_app || false);
              setReminderValue(appointment.before_value || 15);
              setReminderUnit(appointment.before_unit || 'minutes');
            }
            
            // Handle date and time parsing
            if (appointment.date) {
              setDate(appointment.date);
            } else if (appointment.start_time) {
              // Extract date from start_time if date field is not available
              const startDate = new Date(appointment.start_time);
              if (!isNaN(startDate.getTime())) {
                setDate(startDate.toISOString().split('T')[0]);
              }
            }
            
            // Handle start_time and end_time with better error handling
            if (appointment.start_time) {
              try {
                const startDate = new Date(appointment.start_time);
                if (!isNaN(startDate.getTime())) {
                  setStartTime(startDate.toTimeString().split(' ')[0].substring(0, 5));
                }
              } catch (error) {
                console.error('Error parsing start time:', error);
              }
            }
            
            if (appointment.end_time) {
              try {
                const endDate = new Date(appointment.end_time);
                if (!isNaN(endDate.getTime())) {
                  setEndTime(endDate.toTimeString().split(' ')[0].substring(0, 5));
                }
              } catch (error) {
                console.error('Error parsing end time:', error);
              }
            }
          }
        } catch (error) {
          console.error('Error loading appointment data:', error);
          toast.error('Failed to load appointment data');
        } finally {
          setLoading(false);
        }
      }
    };

    loadAppointmentData();
    getAllTask();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!id) {
      toast.error('Appointment ID is missing');
      return;
    }

    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!date || !startTime) {
      toast.error('Date and start time are required');
      return;
    }

    if (formType === 'appointment' && !endTime) {
      toast.error('End time is required for appointments');
      return;
    }

    const toastId = toast.loading('Updating appointment...');

    // Combine date and time
    const startDateTime = new Date(`${date}T${startTime}`).toISOString();
    const endDateTime = formType === 'appointment' 
      ? new Date(`${date}T${endTime}`).toISOString()
      : startDateTime;

    // Validate end time is after start time for appointments
    if (formType === 'appointment' && new Date(endDateTime) <= new Date(startDateTime)) {
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

    try {
      const response = await updateAppointment(id, appointmentData);
      console.log('Update response:', response);
      
      if (response?.ok || response?.status_code === 200 || response?.id || response?.data) {
        getAllAppointments();
        toast.success('Appointment updated successfully!', { id: toastId });
        navigate("/appointments");
      } else {
        console.error('Update failed with response:', response);
        // Show detailed validation errors if available
        if (response?.detail && Array.isArray(response.detail)) {
          const errorMessages = response.detail.map(err => err.msg || err.message || JSON.stringify(err)).join(', ');
          toast.error(`Validation errors: ${errorMessages}`, { id: toastId });
        } else if (response?.detail) {
          toast.error(`Error: ${response.detail}`, { id: toastId });
        } else {
          toast.error('Failed to update appointment', { id: toastId });
        }
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error('Failed to update appointment', { id: toastId });
    }
  };

  return (
    <>
      {loading ? (
        <div className='min-h-screen bg-gray-50 flex justify-center items-center'>
          <div className='text-lg text-gray-600'>Loading appointment data...</div>
        </div>
      ) : (
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
                        ? 'bg-[#F59E0B] text-white shadow-sm' 
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
                  Edit Appointment
                </h2>

                <div className='space-y-6'>
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

                  {/* Date */}
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

                  {/* Time Fields */}
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
                      <button 
                        type="button"
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          (viaEmail || viaApp) 
                            ? 'bg-[#1983D5] text-white' 
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {(viaEmail || viaApp) ? 'ON' : 'OFF'}
                      </button>
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
                          className="flex items-center justify-between w-24 bg-white border border-[#D1D5DB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1983D5]"
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

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-2">Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      className="w-full bg-white border border-[#D1D5DB] rounded-lg px-3 py-2.5 text-sm placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#1983D5] focus:border-transparent resize-none"
                      placeholder="Enter text here..."
                    />
                    <p className="text-xs text-[#6B7280] mt-1">Keep this simple at 50 character</p>
                  </div>

                  {/* Meeting Link */}
                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-2">Attach Meeting Link</label>
                    <input
                      type="url"
                      value={meetingLink}
                      onChange={(e) => setMeetingLink(e.target.value)}
                      className="w-full bg-white border border-[#D1D5DB] rounded-lg px-3 py-2.5 text-sm placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#1983D5] focus:border-transparent"
                      placeholder="https://meet.google.com/xyz-abc-def"
                    />
                  </div>

                  {/* Task Selection */}
                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-2">Select Task</label>
                    <div className="relative" ref={taskDropdownRef}>
                      <button
                        type="button"
                        onClick={() => setShowTaskDropdown(!showTaskDropdown)}
                        className="w-full bg-white border border-[#D1D5DB] rounded-lg px-3 py-2.5 text-sm text-left focus:outline-none focus:ring-2 focus:ring-[#1983D5] flex items-center justify-between"
                      >
                        <span className={relatedTaskId ? 'text-[#374151]' : 'text-[#9CA3AF]'}>
                          {relatedTaskId 
                            ? tasks.find(t => t.id === parseInt(relatedTaskId))?.title || 'Select a task'
                            : 'Select a task'
                          }
                        </span>
                        <FiChevronDown className={`transition-transform ${showTaskDropdown ? 'rotate-180' : ''}`} />
                      </button>
                      {showTaskDropdown && (
                        <div className='absolute top-full left-0 mt-1 w-full bg-white border border-[#D1D5DB] rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto'>
                          <button
                            type="button"
                            onClick={() => {
                              setRelatedTaskId('');
                              setShowTaskDropdown(false);
                            }}
                            className='w-full px-3 py-2 text-left text-sm hover:bg-gray-50 text-[#9CA3AF]'
                          >
                            No task selected
                          </button>
                          {taskLoading ? (
                            <div className='w-full px-3 py-2 text-left text-sm text-[#9CA3AF] border-t border-gray-100'>
                              Loading tasks...
                            </div>
                          ) : tasks.length > 0 ? (
                            tasks.map((task) => (
                              <button
                                key={task.id}
                                type="button"
                                onClick={() => {
                                  setRelatedTaskId(task.id.toString());
                                  setShowTaskDropdown(false);
                                }}
                                className='w-full px-3 py-2 text-left text-sm hover:bg-gray-50 border-t border-gray-100'
                              >
                                {task.title}
                              </button>
                            ))
                          ) : (
                            <div className='w-full px-3 py-2 text-left text-sm text-[#9CA3AF] border-t border-gray-100'>
                              No tasks available
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Task-specific fields */}
                  {formType === 'task' && (
                    <div className="grid grid-cols-2 gap-4">
                      {/* Priority */}
                      <div>
                        <label className="block text-sm font-medium text-[#374151] mb-2">Priority Level</label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setShowPriority(!showPriority)}
                            className="w-full bg-white border border-[#D1D5DB] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1983D5] flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <div className={`h-3 w-3 rounded-full ${
                                priority === 'high' ? 'bg-red-500' : 
                                priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                              }`}></div>
                              <span className="capitalize">{priority} Priority</span>
                            </div>
                            <FiChevronDown className={`transition-transform ${showPriority ? 'rotate-180' : ''}`} />
                          </button>
                          {showPriority && (
                            <div className="absolute top-full left-0 mt-1 w-full bg-white border border-[#D1D5DB] rounded-lg shadow-lg z-10">
                              {priorities.map((item) => (
                                <button
                                  key={item}
                                  type="button"
                                  onClick={() => {
                                    setPriority(item);
                                    setShowPriority(false);
                                  }}
                                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <div className={`h-3 w-3 rounded-full ${
                                    item === 'high' ? 'bg-red-500' : 
                                    item === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                                  }`}></div>
                                  <span className="capitalize">{item} Priority</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Task Status */}
                      <div>
                        <label className="block text-sm font-medium text-[#374151] mb-2">Task Status</label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setShowStatus(!showStatus)}
                            className="w-full bg-white border border-[#D1D5DB] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1983D5] flex items-center justify-between"
                          >
                            <span className="capitalize">{status.replace('_', ' ')}</span>
                            <FiChevronDown className={`transition-transform ${showStatus ? 'rotate-180' : ''}`} />
                          </button>
                          {showStatus && (
                            <div className="absolute top-full left-0 mt-1 w-full bg-white border border-[#D1D5DB] rounded-lg shadow-lg z-10">
                              {taskStatuses.map((item) => (
                                <button
                                  key={item}
                                  type="button"
                                  onClick={() => {
                                    setStatus(item);
                                    setShowStatus(false);
                                  }}
                                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 capitalize"
                                >
                                  {item.replace('_', ' ')}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditAppointment;
