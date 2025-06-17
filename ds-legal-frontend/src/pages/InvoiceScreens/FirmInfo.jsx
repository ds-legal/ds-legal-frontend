import React from 'react'
import { Link } from 'react-router-dom'
import { MdArrowBackIosNew } from "react-icons/md";
import Nav from '../../components/ui/Nav';

const FirmInfo = () => {
  return (
    <>
      <Nav />
      <div className='lg:w-[80%] w-[90%] mx-auto my-10'>
        <div className='flex justify-between items-center mb-6'>
          <Link to="/tasks" className='flex items-center gap-1 text-[14px] text-[#667185] font-[500]'>
            <MdArrowBackIosNew className='text-[15px]' />
            <h3>Back</h3>
          </Link>
          <button className='bg-[#1983D5] text-white rounded-[40px] px-4 py-2 text-[16px]'>
            Create Invoice
          </button>
        </div>

        <div className='lg:w-[60%] w-full bg-white shadow mx-auto px-6 py-6 rounded-[16px]'>
          <h2 className='text-[24px] text-[#212121] font-[600] mb-6'>Firm Information</h2>

          <div className='space-y-4'>
            <div>
              <h3 className=' text-[#101928] text-[14px] font-[500] mb-1'>Firm Name</h3>
              <input type='text' placeholder='Enter firm name' className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400' />
            </div>

            <div>
              <label className='text-[#101928] text-[14px] font-[500] mb-1'>Email Address</label>
              <input type='email' placeholder='example@firm.com' className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400' />
            </div>

            <div>
              <label className='text-[#101928] text-[14px] font-[500] mb-1'>Address</label>
              <input type='text' placeholder='123 Firm Street, Lagos' className='w-full border border-[#D0D5DD] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400' />
            </div>

            <div className='flex flex-col lg:flex-row gap-4'>
              <div className='flex-1'>
                <h3 className='text-[#101928] text-[14px] font-[500] mb-1'>State</h3>
                <input type='text' placeholder='Lagos' className='w-full border border-[#D0D5DD] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400' />
              </div>
              <div className='flex-1'>
                <h3 className='text-[#101928] text-[14px] font-[500] mb-1'>Postcode</h3>
                <input type='text' placeholder='100001' className='w-full border border-[#D0D5DD] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400' />
              </div>
            </div>

            <div>
              <h3 className='text-[#101928] text-[14px] font-[500] mb-1'>Phone Number</h3>
              <input type='tel' placeholder='+234 801 234 5678' className='w-full border border-[#D0D5DD] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400' />
            </div>
             <hr className='my-6 border-t border-[#E4E7EC]' />

            {/* Next button aligned to bottom right */}
            <div className='flex justify-end'>
                <button className='bg-[#1983D5] text-white px-6 py-2 rounded-[40px] text-[16px]'>
                Next
                </button>
            </div>

            
          </div>
        </div>
      </div>
    </>
  )
}

export default FirmInfo
