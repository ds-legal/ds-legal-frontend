import React from 'react';
import { useAppointment } from '../../store/appointment.context';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const totalDays = 31;

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

const MonthlyAppointment = () => {
  const { appointments } = useAppointment();
  const appointmentList = Array.isArray(appointments) ? appointments : [];

  // Convert appointments to monthly format
  const monthlyAppointments = appointmentList.map((appointment, index) => {
    const startDate = new Date(appointment.start_time);
    const day = startDate.getDate();
    
    return {
      day: day,
      title: appointment.title,
      colorIndex: index
    };
  });

  return (
    // Horizontal scroll container on small screens
    <div className="w-full overflow-x-auto">
      {/* Min width so grid doesn’t shrink too much on small screens */}
      <div className="p-4   min-w-[600px] lg:min-w-[980px]">
        {/* Days of the Week */}
        <div className="grid grid-cols-7 text-center text-sm font-semibold text-[#344054] bg-[#F9FAFB] border-2 border-[#E4E7EC]">
          {daysOfWeek.map((day) => (
            <div key={day} className="p-2">
              {day}
            </div>
          ))}
        </div>

        {/* Days of the Month */}
        <div className="grid grid-cols-7 border-t border-gray-400">
          {Array.from({ length: totalDays }, (_, i) => {
            const day = i + 1;
            const dayAppointments = monthlyAppointments
              .filter((a) => a.day === day)
              .slice(0, 3);
            return (
              <div
                key={day}
                className="
                  border border-[#E4E7EC] p-2
                  h-32 sm:h-40 md:h-48
                  text-xs sm:text-sm
                  "
              >
                <div className="font-bold text-gray-800 mb-1 text-center">{day}</div>

                {/* Flex column with gap for appointments */}
                <div className="flex flex-col gap-1">
                  {dayAppointments.map((appt, idx) => (
                    <div
                      key={idx}
                      className={`${getAppointmentStyle(appt.colorIndex)} border-l-[3px] rounded-l-md px-2 py-1 text-xs truncate`}
                    >
                      {appt.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MonthlyAppointment;
