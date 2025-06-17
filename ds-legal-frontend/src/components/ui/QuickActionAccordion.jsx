import React from 'react';
import { FiCalendar } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const QuickAction = () => {
  const actions = [
    {
      title: "Create a task",
      description: "Add a new task to your task board quickly.",
      link: "/createTask",
    },
    {
      title: "Create an invoice",
      description: "Generate an invoice for your customers easily.",
      link: "/invoices",
    },
    {
      title: "Schedule an appointment",
      description: "Set up a new appointment in your calendar.",
      link: "/appointments",
    },
  ];

  return (
    <div className="border rounded-lg overflow-hidden border-[#E4E7EC] mt-4">
      {/* Header */}
      <div className="flex justify-between items-center px-2 py-4">
        <h2 className="text-lg text-[16px] font-[600]">Quick Action</h2>
      </div>

      {/* Action Items */}
      {actions.map(({ title, description, link }, idx) => (
        <Link
          to={link}
          key={idx}
          className="border-b border-[#E4E7EC] py-3 px-4 flex gap-4 items-center hover:bg-gray-50 cursor-pointer text-gray-700 no-underline"
        >
          <div className="h-8 w-8 flex items-center justify-center rounded-full bg-[#E4E7EC]">
            <FiCalendar className="text-[#344054] text-[12px]" />
          </div>
          <div className="flex flex-col flex-grow">
            <span className="text-[16px] font-[500]">{title}</span>
            <span className="text-[14px] font-[400] text-gray-600">{description}</span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default QuickAction;
