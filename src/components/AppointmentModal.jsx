import React from 'react'
import { FaAngleDown, FaPlus, FaTimes, FaExternalLinkAlt, FaCopy } from 'react-icons/fa'
import { FaCalendarAlt } from 'react-icons/fa'
import { CiClock1 } from 'react-icons/ci'
import { useNavigate } from 'react-router-dom'
import { useAppointment } from '../store/appointment.context'
import toast from 'react-hot-toast'

const formatDateTime = (dateStr, timeStr) => {
  if (!dateStr) return { date: 'Invalid Date', time: 'Invalid Date' };
  
  try {
    // If timeStr is provided, combine date and time
    if (timeStr) {
      const combinedDateTime = `${dateStr}T${timeStr}`;
      const date = new Date(combinedDateTime);
      if (!isNaN(date.getTime())) {
        return {
          date: date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          }),
          time: date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          })
        };
      }
    }
    
    // Try parsing as full datetime string
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return {
        date: date.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        }),
        time: date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      };
    }
    
    // Fallback: display raw values if parsing fails
    return { 
      date: dateStr, 
      time: timeStr || 'N/A' 
    };
  } catch (error) {
    console.error('Date formatting error:', error);
    return { 
      date: dateStr || 'Invalid Date', 
      time: timeStr || 'Invalid Date' 
    };
  }
};

const AppointmentModal = ({ showModal, appointment }) => {
  const navigate = useNavigate();
  const { deleteAppointment, getAllAppointments } = useAppointment();
  
  if (!appointment) return null;

  const startDateTime = formatDateTime(appointment.date, appointment.start_time);
  const endDateTime = formatDateTime(appointment.date, appointment.end_time);

  const handleEdit = () => {
    navigate(`/editAppointment/${appointment.id}`);
    showModal(false);
  };

  const handleDelete = async () => {
    // Add confirmation dialog
    const confirmDelete = window.confirm('Are you sure you want to delete this appointment? This action cannot be undone.');
    
    if (!confirmDelete) {
      return;
    }
    
    const toastId = toast.loading('Deleting appointment...');
    
    try {
      const response = await deleteAppointment(appointment.id);
      console.log('Delete response:', response); // Debug log
      
      if (response?.ok || response?.status_code === 200 || response?.status_code === 204 || response?.message || response?.data) {
        toast.success('Appointment deleted successfully!', { id: toastId });
        getAllAppointments(); // Refresh the appointment list
        showModal(false); // Close the modal
      } else {
        console.error('Delete failed with response:', response);
        toast.error('Failed to delete appointment', { id: toastId });
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast.error('Failed to delete appointment', { id: toastId });
    }
  };

  const handleCopyLink = async () => {
    if (appointment.meeting_link) {
      try {
        await navigator.clipboard.writeText(appointment.meeting_link);
        toast.success('Meeting link copied to clipboard!');
      } catch (error) {
        console.error('Failed to copy link:', error);
        toast.error('Failed to copy link');
      }
    }
  };

  const handleJoinMeeting = () => {
    if (appointment.meeting_link) {
      window.open(appointment.meeting_link, '_blank');
    }
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4'>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        
        {/* Header */}
        <div className='flex justify-between items-center p-4 border-b border-gray-200'>
          <h3 className='font-semibold text-lg text-gray-900'>Appointment detail</h3>
          <button 
            onClick={() => showModal(false)} 
            className='text-gray-400 hover:text-gray-600 p-1'
          >
            <FaTimes size={16} />
          </button>
        </div>

        <div className="p-4">
          {/* Title with edit icon */}
          <div className="flex items-start justify-between mb-3">
            <h1 className='text-lg font-medium text-gray-900 flex-1 pr-2'>
              {appointment.title}
            </h1>
            <button 
              onClick={handleEdit}
              className="text-gray-400 hover:text-blue-600 p-1"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
          </div>

          {/* Date and Time */}
          <div className='text-sm text-gray-600 mb-4'>
            <p>{startDateTime.date}</p>
            <p className='font-medium text-gray-900'>{startDateTime.time} – {endDateTime.time}</p>
          </div>

          {/* Meeting Link */}
          {appointment.meeting_link && (
            <div className='mb-4'>
              <button 
                onClick={handleJoinMeeting}
                className='w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors mb-2'
              >
                <FaExternalLinkAlt size={14} />
                Join with Google Meet
              </button>
              <div className="flex items-center gap-2">
                <div className="flex-1 text-xs text-gray-500 bg-gray-50 p-2 rounded border">
                  {appointment.meeting_link}
                </div>
                <button
                  onClick={handleCopyLink}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                  title="Copy meeting link"
                >
                  <FaCopy size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Reminder */}
          <div className='mb-4'>
            <div className='flex items-center gap-2 text-sm text-gray-600 mb-2'>
              <CiClock1 size={16} />
              <span>Reminder</span>
              <span className="font-medium text-gray-900">
                {appointment.reminder?.before_value || appointment.before_value || 15} {appointment.reminder?.before_unit || appointment.before_unit || 'minutes'} before
              </span>
            </div>
            <div className='flex gap-2'>
              {(appointment.reminder?.via_email || appointment.via_email) && (
                <span className='px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded'>Email</span>
              )}
              {(appointment.reminder?.via_app || appointment.via_app) && (
                <span className='px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded'>App</span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className='mb-6'>
            <h3 className='text-sm font-medium text-gray-900 mb-2'>Description</h3>
            <p className='text-sm text-gray-600 leading-relaxed'>
              {appointment.description || 'No description provided.'}
            </p>
          </div>

          {/* Action buttons */}
          <div className='flex gap-3'>
            <button 
              onClick={handleDelete}
              className='flex-1 bg-red-600 text-white px-4 py-2.5 rounded-lg hover:bg-red-700 transition-colors font-medium'>
              Delete
            </button>
            <button 
              onClick={handleEdit}
              className='flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium'>
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppointmentModal
