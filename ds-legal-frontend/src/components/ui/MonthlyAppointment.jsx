import React from 'react';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const totalDays = 31;

const appointments = [
  { day: 1, title: 'Meeting' },
  { day: 1, title: 'Call Client' },
  { day: 1, title: 'Gym' },
  { day: 3, title: 'Project Review' },
  { day: 5, title: 'Doctor Visit' },
  { day: 5, title: 'Code Review' },
  { day: 12, title: 'Dinner' },
  { day: 12, title: 'Team Sync' },
  { day: 12, title: 'Presentation' },
  { day: 12, title: 'Extra Task' },
   { day: 7, title: 'Presentation' },
  { day: 7, title: 'Extra Task' },
];

const MonthlyAppointment = () => {
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
            const dayAppointments = appointments
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
                      className="bg-[#E3EFFC] border-l-[3px] rounded-lg border-l-[#1983D5] px-1 py-[4px] truncate"
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
