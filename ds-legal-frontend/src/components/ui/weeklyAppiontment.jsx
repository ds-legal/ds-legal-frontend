import React from 'react';
import clsx from 'clsx';
import { CiClock1 } from 'react-icons/ci';
import { SlCalender } from 'react-icons/sl';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const timeSlots = [
  '08:00 AM', '09:00 AM', '10:00 AM',
  '11:00 AM', '12:00 PM', '01:00 PM',
  '02:00 PM', '03:00 PM', '04:00 PM',
];

const appointments = [
  { day: 'Mon', time: '10:00 AM', title: 'Hillary Wilton x John', startTime: '10:00 AM', endTime: '11:00 AM', address: 'Trade Dollar, 18, London, E1 1AA, United Kingdom' },
  { day: 'Mon', time: '01:00 PM', title: 'Design Review', startTime: '01:00 PM', endTime: '02:00 PM', address: 'Boardroom A, 5th Floor' },
  { day: 'Tue', time: '09:00 AM', title: 'Team Standup', startTime: '09:00 AM', endTime: '10:00 AM', address: 'Zoom Meeting' },
  { day: 'Tue', time: '02:00 PM', title: 'Client Presentation', startTime: '02:00 PM', endTime: '03:00 PM', address: 'Trade Dollar, 18, London' },
  { day: 'Wed', time: '01:00 PM', title: 'Hillary Wilton x John', startTime: '01:00 PM', endTime: '02:00 PM', address: 'Trade Dollar, 18, London, E1 1AA, United Kingdom' },
  { day: 'Thu', time: '08:00 AM', title: 'Breakfast Briefing', startTime: '08:00 AM', endTime: '09:00 AM', address: 'Café Delight, Ground Floor' },
  { day: 'Thu', time: '12:00 PM', title: 'Strategy Meeting', startTime: '12:00 PM', endTime: '01:00 PM', address: 'Conference Room B' },
  { day: 'Fri', time: '03:00 PM', title: 'Hillary Wilton x John', startTime: '03:00 PM', endTime: '04:00 PM', address: 'Trade Dollar, 18, London, E1 1AA, United Kingdom' },
  { day: 'Sat', time: '10:00 AM', title: 'Weekly Review', startTime: '10:00 AM', endTime: '11:00 AM', address: 'Office Lounge' },
  { day: 'Sun', time: '12:00 PM', title: 'Planning Session', startTime: '12:00 PM', endTime: '01:00 PM', address: 'Remote via Teams' },
];

const WeeklyAppointment = () => {
  return (
    <div className="overflow-auto p-4">
      <div className="min-w-[800px] border border-gray-300 rounded-lg shadow-sm">
        {/* Header: Days */}
        <div className="grid grid-cols-8 bg-gray-100 text-sm 
        font-semibold text-center border-b border-gray-300">
          <div className="p-2 bg-white" />
          {days.map((day) => (
            <div key={day} className="p-2 border-l border-gray-300">
              {day}
            </div>
          ))}
        </div>

        {/* Time + Appointments */}
        {timeSlots.map((time, index) => (
          <div key={time} className="grid grid-cols-8 text-sm border-b border-gray-200">
            {/* Time column: borderless */}
            <div className="flex flex-col justify-between items-end px-2 py-6 bg-white">
              <div className="flex items-center gap-1 text-[10px] text-gray-600">
                <span>{time}</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-gray-600">
                <span>{timeSlots[index + 1] ?? ''}</span>
              </div>
            </div>

            {/* Day Columns */}
            {days.map((day) => {
              const appt = appointments.find((a) => a.day === day && a.time === time);
              return (
                <div
                  key={`${day}-${time}`}
                  className={clsx(
                    'p-2 border-l border-gray-200 min-h-[100px] relative',
                    appt && 'bg-[#E3EFFC] border-l-[4px] rounded-l-lg border-l-[#1983D5]'
                  )}
                >
                  {appt && (
                    <div className="flex flex-col justify-start gap-1">
                      <h3 className="text-[13px] font-semibold text-[#212121]">{appt.title}</h3>
                      <div className="flex items-center text-[11px] text-[#545454] gap-1">
                        <CiClock1 className="text-[14px]" />
                        <p>{appt.startTime} - {appt.endTime}</p>
                      </div>
                      <div className="flex items-start text-[11px] text-[#545454] gap-1">
                        <SlCalender className="text-[12px] mt-0.5" />
                        <h4>{appt.address}</h4>
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
