import React from 'react';
import { FiCalendar } from 'react-icons/fi'; 
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const QuickActionAccordion = () => {
  return (
    <div className=" border rounded-lg   overflow-hidden border-[#E4E7EC] mt-4  ">
      {/* Quick Action Header */}
      <div className="flex justify-between items-center  px-2 py-4">
        <h2 className="text-lg text-[16px] font-[600]">Quick Action</h2>   
      </div>

      {/* Accordion Items */}
      <Accordion disableGutters square className="border-b border-[#E4E7EC] shadow-none py-2 overflow-hidden">
        <AccordionSummary expandIcon={<ExpandMoreIcon />} className="px-0">
          <div className="flex flex-row gap-2 items-center w-full">
            <div className="h-8 w-8 flex items-center justify-center rounded-full bg-[#E4E7EC]">
              <FiCalendar className="text-[#344054] text-[12px]" />
            </div>
            <div>
              <h3 className="text-[16px] font-[500]">Create a task</h3> 
              <h4 className="text-[14px] font-[400]">Lorem ipsum dolor sit amet consectetur.</h4>  
            </div>
          </div>
        </AccordionSummary>
        <AccordionDetails className="px-0">
          <p className="text-sm text-gray-600">Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore, est?</p>
        </AccordionDetails>
      </Accordion>

      <Accordion disableGutters square className="border-b border-[#E4E7EC] shadow-none py-2">
        <AccordionSummary expandIcon={<ExpandMoreIcon />} className="px-0">
          <div className="flex flex-row gap-2 items-center w-full">
            <div className="h-8 w-8 flex items-center justify-center rounded-full bg-[#E4E7EC]">
              <FiCalendar className="text-[#344054] text-[12px]" />
            </div>
            <div>
              <h3 className="text-[16px] font-[500]">Create an invoice</h3> 
              <h4 className="text-[14px] font-[400]">Lorem ipsum dolor sit amet consectetur.</h4>  
            </div>
          </div>
        </AccordionSummary>
        <AccordionDetails className="px-0">
          <p className="text-sm text-gray-600">This is the detail for the second action.</p>
        </AccordionDetails>
      </Accordion>

      <Accordion disableGutters square className="border-b border-[#E4E7EC] shadow-none py-2 z-10">
        <AccordionSummary expandIcon={<ExpandMoreIcon />} className="px-0">
          <div className="flex flex-row gap-2 items-center w-full">
            <div className="h-8 w-8 flex items-center justify-center rounded-full bg-[#E4E7EC]">
              <FiCalendar className="text-[#344054] text-[12px]" />
            </div>
            <div>
              <h3 className="text-[16px] font-[500]">Schedule an appointment</h3> 
              <h4 className="text-[14px] font-[400]">Lorem ipsum dolor sit amet consectetur.</h4>  
            </div>
          </div>
        </AccordionSummary>
        <AccordionDetails className="px-0">
          <p className="text-sm text-gray-600">This is the detail for the third action.</p>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default QuickActionAccordion;
