import React from 'react';
import { HiDotsVertical } from "react-icons/hi";
import { CiClock1 } from "react-icons/ci";
import { FaCalendarAlt } from "react-icons/fa";

const AppointmentCard = ({ appointment, showModal, getAppointment }) => {
  
  // Enhanced date/time formatting with proper fallback
  const formatTimeFromDateAndTime = (date, time) => {
    try {
      // If we have both date and time, combine them
      if (date && time) {
        // Handle different time formats
        let timeStr = time;
        if (typeof time === 'string' && !time.includes('T')) {
          // If time is just "HH:MM" format, add it to the date
          const combinedDateTime = new Date(`${date}T${timeStr}`);
          if (!isNaN(combinedDateTime.getTime())) {
            return combinedDateTime;
          }
        } else {
          const combinedDateTime = new Date(`${date}T${timeStr}`);
          if (!isNaN(combinedDateTime.getTime())) {
            return combinedDateTime;
          }
        }
      }
      
      // Try parsing the date field as a full datetime
      if (date) {
        const dateObj = new Date(date);
        if (!isNaN(dateObj.getTime())) {
          return dateObj;
        }
      }
      
      // Fallback to current date if parsing fails
      return new Date();
    } catch (error) {
      console.error('Date parsing error:', error);
      return new Date();
    }
  };

  // Time logic - use current date as fallback for time-only fields
  const appointmentDate = appointment.date || new Date().toISOString().split('T')[0];
  const startTime = formatTimeFromDateAndTime(appointmentDate, appointment.start_time);
  const endTime = formatTimeFromDateAndTime(appointmentDate, appointment.end_time);
  const now = new Date();
  const isUpcoming = startTime > now;
  const isActive = startTime <= now && endTime >= now;
  const isPast = endTime < now;

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusStyle = () => {
    if (isActive) {
      return "text-green-800 bg-green-100 px-3 py-1 rounded-full text-xs font-medium";
    } else if (isUpcoming) {
      return "text-blue-800 bg-blue-100 px-3 py-1 rounded-full text-xs font-medium";
    } else {
      return "text-gray-800 bg-gray-100 px-3 py-1 rounded-full text-xs font-medium";
    }
  };

  const getCardStyle = () => {
    // Vary card colors similar to the design
    const colors = ['yellow', 'blue', 'lightblue'];
    const colorIndex = appointment.id % colors.length;
    
    switch (colors[colorIndex]) {
      case 'yellow':
        return 'bg-[#FFF3CD] border-l-[#FFC107]';
      case 'blue':
        return 'bg-[#CCE5FF] border-l-[#1983D5]';
      case 'lightblue':
        return 'bg-[#E3F2FD] border-l-[#42A5F5]';
      default:
        return 'bg-white border-l-blue-500';
    }
  };

  const getStatusText = () => {
    if (isActive) return "Active";
    if (isUpcoming) return "Upcoming";
    return "Completed";
  };

  return (
    <div 
      onClick={() => {showModal(true), getAppointment(appointment.id)}}
      className={`${getCardStyle()} shadow-sm px-4 py-4 rounded-lg border-l-4 cursor-pointer hover:shadow-md transition-shadow`}
    >
      <div className='flex justify-between items-start mb-3'>
        <h2 className='text-sm font-semibold text-gray-800 flex-1 pr-2'>{appointment.title}</h2>
        <div className='flex items-center gap-2 flex-shrink-0'>
          <button className={getStatusStyle()}>
            {getStatusText()}
          </button>
          <HiDotsVertical className='text-gray-600 text-sm cursor-pointer hover:text-gray-800' />
        </div>
      </div>

      <p className='text-xs text-gray-600 mb-3 line-clamp-2'>
        {appointment.description || 'No description provided'}
      </p>

      <div className='flex justify-between items-center text-xs'>
        <div className='flex gap-1 items-center text-gray-500'>
          <CiClock1 className='text-sm' />
          <span>{formatTime(startTime)} - {formatTime(endTime)}</span>
        </div>

        <div className='flex gap-1 items-center text-gray-500'>
          <FaCalendarAlt className='text-xs' />
          <span>{formatDate(startTime)}</span>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;
