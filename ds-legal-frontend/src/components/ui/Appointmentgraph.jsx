import React from 'react';
import { CiClock1 } from 'react-icons/ci';
import { SlCalender } from 'react-icons/sl';

const appointments = [
  { id: 1, startTime: '09:00 AM', endTime: '10:00 AM', title: 'Meeting with John' },
  { id: 2, startTime: '10:30 AM', endTime: '11:30 AM', title: 'Team Standup' },
  { id: 3, startTime: '12:00 PM', endTime: '01:00 PM', title: 'Lunch with Client' },
  { id: 4, startTime: '02:00 PM', endTime: '03:30 PM', title: 'Project Review' },
  { id: 5, startTime: '04:00 PM', endTime: '05:00 PM', title: 'Wrap-up' },
];

const fixedHeight = 120;

const AppointmentGraph = () => {
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
            {appointments.map((appt) => (
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
            {appointments.map((appt) => (
              <div
                key={appt.id}
                className="bg-[#E3EFFC] border-l-[4px] rounded-l-lg border-l-[#1983D5] px-3 sm:px-4 py-2 sm:py-3 shadow-sm text-sm font-medium text-blue-800 flex flex-col gap-2"
                style={{ height: `${fixedHeight}px` }}
              >
                <h3 className="text-[12px] text-[#212121] font-semibold">Hillary Wilton x John</h3>
                <div className="flex items-center text-[10px] sm:text-[11px] font-normal text-[#545454] gap-1">
                  <CiClock1 />
                  <p>{appt.startTime} - {appt.endTime}</p>
                </div>
                <div className="flex items-center text-[10px] sm:text-[11px] font-normal text-[#545454] gap-1">
                  <SlCalender />
                  <h4 className="ml-1">Trade Dollar, 18, London, E1 1AA, United Kingdom</h4>
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
