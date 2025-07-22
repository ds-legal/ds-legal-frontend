import React from 'react';
import { CiClock1 } from 'react-icons/ci';
import { SlCalender } from 'react-icons/sl';
import { useAppointment } from '../../store/appointment.context';

const getAppointmentStyle = (index) => {
  const colors = ['yellow', 'blue', 'lightblue'];
  const color = colors[index % colors.length];
  
  switch (color) {
    case 'yellow':
      return 'bg-[#FFF3CD] border-l-[#FFC107] text-[#8B6914]';
    case 'blue':
      return 'bg-[#CCE5FF] border-l-[#1983D5] text-[#0C5AA6]';
    case 'lightblue':
      return 'bg-[#E3F2FD] border-l-[#42A5F5] text-[#1976D2]';
    default:
      return 'bg-[#E3EFFC] border-l-[#1983D5] text-[#0C5AA6]';
  }
};

const fixedHeight = 120;

const AppointmentGraph = () => {
  const { appointments } = useAppointment();
  const appointmentList = Array.isArray(appointments) ? appointments : [];

  // Filter today's appointments and format them
  const todayAppointments = appointmentList.map((appointment, index) => {
    const startTime = new Date(appointment.start_time);
    const endTime = new Date(appointment.end_time);
    
    return {
      id: appointment.id,
      startTime: startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      endTime: endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      title: appointment.title,
      address: appointment.description || 'No description',
      colorIndex: index
    };
  }).slice(0, 5); // Limit to 5 appointments for display

  // If no appointments, show placeholder
  if (todayAppointments.length === 0) {
    return (
      <div className="w-full p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <SlCalender className="text-gray-400 text-xl" />
          </div>
          <p className="text-gray-600 font-medium mb-2">No appointments for today</p>
          <p className="text-sm text-gray-500">Your daily schedule will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="w-full min-w-[450px]">
        {/* Top Title Row */}
        <div className="flex">
          <div className="w-20 lg:w-28 h-[60px]"></div>
          <div className="flex-1 bg-gray-100 flex items-center justify-center px-4 sm:px-6 text-center border-b-[#1983D5] border-b-2">
            <span className="text-[14px] sm:text-[16px] font-semibold text-gray-700 text-center">Thu 17</span>
          </div>
        </div>

        {/* Main Graph Content */}
        <div className="relative w-full flex">
          {/* Vertical Line */}
          <div className="absolute left-20 lg:left-28 top-0 bottom-0 border-r border-gray-400 z-10"></div>

          {/* Time Column */}
          <div className="w-20 lg:w-28 flex flex-col gap-8 px-1 lg:px-2 pt-8">
            {todayAppointments.map((appt) => (
              <div
                key={appt.id}
                className="flex flex-col justify-between items-end text-xs text-gray-700"
                style={{ height: `${fixedHeight}px` }}
              >
                <div className="flex items-center gap-1">
                  <span className="text-[10px] sm:text-[11px]">{appt.startTime}</span>
                  <div className="w-3 sm:w-4 h-[1px] bg-gray-400"></div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] sm:text-[11px]">{appt.endTime}</span>
                  <div className="w-3 sm:w-4 h-[1px] bg-gray-400"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Appointments */}
          <div className="flex-1 px-2 sm:px-4 lg:px-6 flex flex-col gap-8 pt-8">
            {todayAppointments.map((appt) => (
              <div
                key={appt.id}
                className={`${getAppointmentStyle(appt.colorIndex)} border-l-[4px] rounded-l-lg px-3 sm:px-4 py-2 sm:py-3 shadow-sm text-sm font-medium flex flex-col gap-2`}
                style={{ height: `${fixedHeight}px` }}
              >
                <h3 className="text-[12px] text-[#212121] font-semibold">{appt.title}</h3>
                <div className="flex items-center text-[10px] sm:text-[11px] font-normal text-[#545454] gap-1">
                  <CiClock1 />
                  <p>{appt.startTime} - {appt.endTime}</p>
                </div>
                <div className="flex items-center text-[10px] sm:text-[11px] font-normal text-[#545454] gap-1">
                  <SlCalender />
                  <h4 className="ml-1">{appt.address}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentGraph;
