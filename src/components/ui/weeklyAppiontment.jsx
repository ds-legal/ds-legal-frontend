import React from 'react';
import clsx from 'clsx';
import { CiClock1 } from 'react-icons/ci';
import { SlCalender } from 'react-icons/sl';
import { useAppointment } from '../../store/appointment.context';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const timeSlots = [
  '08:00 AM', '09:00 AM', '10:00 AM',
  '11:00 AM', '12:00 PM', '01:00 PM',
  '02:00 PM', '03:00 PM', '04:00 PM',
];

const getAppointmentStyle = (index) => {
  const colors = ['yellow', 'blue', 'lightblue'];
  const color = colors[index % colors.length];
  
  switch (color) {
    case 'yellow':
      return 'bg-[#FFF3CD] border-l-[#FFC107]';
    case 'blue':
      return 'bg-[#CCE5FF] border-l-[#1983D5]';
    case 'lightblue':
      return 'bg-[#E3F2FD] border-l-[#42A5F5]';
    default:
      return 'bg-[#E3EFFC] border-l-[#1983D5]';
  }
};

const WeeklyAppointment = () => {
  const { appointments } = useAppointment();
  const appointmentList = Array.isArray(appointments) ? appointments : [];

  // Convert appointments to weekly format
  const weeklyAppointments = appointmentList.map((appointment, index) => {
    const startTime = new Date(appointment.start_time);
    const endTime = new Date(appointment.end_time);
    const dayName = startTime.toLocaleDateString('en-US', { weekday: 'long' });
    const timeString = startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    
    return {
      day: dayName,
      time: timeString,
      title: appointment.title,
      startTime: startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      endTime: endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      address: appointment.description || 'No description',
      colorIndex: index
    };
  });

  return (
    <div className="overflow-auto p-4">
      <div className="min-w-[800px] border border-gray-300 rounded-lg shadow-sm">
        {/* Header: Days */}
        <div className="grid grid-cols-7 bg-gray-50 text-sm 
        font-semibold text-center border-b border-gray-300">
          <div className="p-3 bg-white text-xs text-gray-600">Time</div>
          {days.map((day) => (
            <div key={day} className="p-3 border-l border-gray-300 text-gray-700">
              {day}
            </div>
          ))}
        </div>

        {/* Time + Appointments */}
        {timeSlots.map((time, index) => (
          <div key={time} className="grid grid-cols-7 text-sm border-b border-gray-200">
            {/* Time column */}
            <div className="flex flex-col justify-center items-center px-2 py-4 bg-gray-50 border-r border-gray-200">
              <div className="text-xs text-gray-600 font-medium">
                {time}
              </div>
            </div>

            {/* Day Columns */}
            {days.map((day) => {
              const appt = weeklyAppointments.find((a) => a.day === day && a.time === time);
              return (
                <div
                  key={`${day}-${time}`}
                  className="p-2 border-l border-gray-200 min-h-[80px] relative"
                >
                  {appt && (
                    <div className={`${getAppointmentStyle(appt.colorIndex)} border-l-4 rounded-l-lg p-2 h-full`}>
                      <h3 className="text-xs font-semibold text-gray-800 mb-1">{appt.title}</h3>
                      <div className="flex items-center text-xs text-gray-600 gap-1 mb-1">
                        <CiClock1 className="text-sm" />
                        <span>{appt.startTime} - {appt.endTime}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-600 gap-1">
                        <SlCalender className="text-xs" />
                        <span>{appt.address}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyAppointment;
