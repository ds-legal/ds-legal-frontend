import React, { useState } from 'react'
import { MdViewModule } from "react-icons/md";
import { IoIosArrowUp, IoIosArrowDown, IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { CgSortAz } from "react-icons/cg";
import FilterModal from './FilterModal';



const Filter = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
   const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div>
      <div className="bg-white shadow px-10 py-3 mt-4 flex justify-between">
          {/* Tab View */}
          <div className="border border-[#E4E7EC] px-4 rounded-md bg-[#F9FAFB] shadow-sm h-9 flex items-center w-auto text-[12px]">
            <div className="flex items-center gap-1 pr-4 h-full border-r border-[#D0D5DD]">
              <h3 className="text-[#344054]">Board</h3>
              <MdViewModule className="text-[#1983D5]" />
            </div>
            <div className="flex items-center gap-1 pl-4">
              <h3 className="text-[#344054]">Tile</h3>
              <MdViewModule className="text-[#545454]" />
            </div>
          </div>

          {/* Date Toggle */}
          <div className="lg:flex justify-between gap-2  hidden">
          <div className="relative border border-[#E4E7EC] px-4 rounded-md bg-[#F9FAFB] shadow-sm">
            <div
              onClick={() => setShowCalendar(!showCalendar)}
              className="flex items-center gap-2 border h-9 border-[#F9FAFB] px-4 py-1 w-auto cursor-pointer"
            >
              <h4 className="text-[#344054] text-[12px] font-[600]">
                {startDate.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </h4>
              {showCalendar ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </div>

            {showCalendar && (
              <div className="absolute right-0 z-10 mt-2 bg-white border border-gray-200 rounded shadow">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => {
                    setStartDate(date);
                    setShowCalendar(false);
                  }}
                  inline
                />
              </div>
            )}
          </div>
          <div className="border border-[#E4E7EC] px-4 rounded-md bg-[#F9FAFB] shadow-sm flex justify-between text-[12px] items-center">
           <span className="text-[20px] "> <IoIosArrowBack /></span>
           <span  className="text-[20px] "> <IoIosArrowForward /></span>
          </div>
          <div 
           onClick={() => setIsModalOpen(true)}
          className="border border-[#E4E7EC] px-4 rounded-md bg-[#F9FAFB] shadow-sm flex justify-between text-[12px] items-center">
            <h4 className="text-[#344054] text-[12px]">Sort by</h4>
           <span  className="text-[30px] font-semibold"> <CgSortAz /></span>
          </div>
          </div>
        </div>  
        {isModalOpen && <FilterModal onClose={() => setIsModalOpen(false)} />} 
    </div>
  )
}

export default Filter