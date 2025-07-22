import React from 'react'
import Nav from '../../components/ui/Nav'
import { FiShare2, FiDownload } from 'react-icons/fi';
import { FaShare } from "react-icons/fa6";


const Receipts = () => {
  return (
   <>
   <Nav/>
    <div className='lg:w-[80%] lg:py-4 lg:px-4 w-full  mx-auto my-10 overflow-x-hidden'>
    <div className='lg:w-[60%] w-full bg-white shadow mx-auto lg:px-6 py-6 px-6 rounded-[16px]'>
    <h1 className='text-[28px] font-[600] text-[#1983D5]'> ID: 0000637</h1>
    <h1 className='text-[#19213D] text-[20px] font-[600] mt-4'>DS Legal</h1>
    <div className='flex justify-between mt-4'>
    <h3 className='text-[12px] text-[#5D6481] font-[400]'>Exco Tenos, Oxford county, OX 922202, United Kingdom</h3> 
    <div className='flex gap-1 flex-col'>
    <h3 className='text-[12px] text-[#5D6481] font-[400]'>(612) 856 - 0989</h3> 
     <h3 className='text-[12px] text-[#5D6481] font-[400]'>Dslegal@yahoo.co.uk</h3> 
    </div> 
    </div> 
     <hr className='my-4 border-t border-gray-300' /> 
    <div className='flex justify-between'>
    <h3 className='text-[10px] text-[#5D6481] font-[400]'>Bill to:</h3>
     <h3 className='text-[10px] text-[#5D6481] font-[400]'>Created: <span className='text-[#19213D] font-[600]'>05/02/2025</span></h3>    
    </div>
     <div className='flex justify-between mt-2'>
    <h3 className='text-[12px] text-[#19213D] font-[600]'>Dafurn Americans</h3>
     <h3 className='text-[10px] text-[#5D6481] font-[400]'>Due date: <span className='text-[#19213D] font-[600]'>05/02/2025</span></h3>    
    </div>
    <div className='flex flex-col gap-1'>
    <h3 className='text-[12px] text-[#5D6481] font-[400]'>Pablo Alto, San Francisco, CA 92102, United States of America</h3> 
     <h3 className='text-[12px] text-[#5D6481] font-[400]'>(612) 856 - 0989</h3> 
     <h3 className='text-[12px] text-[#5D6481] font-[400]'>contact@chimdi.com</h3> 
    </div>
     <hr className='my-4 border-t border-gray-300' /> 
     <div>
     <h3 className='text-[12px] text-[#5D6481] font-[400]'>Payment Details:</h3> 
     <div>
     <h3 className='text-[12px] text-[#212121] font-[600] mt-2'>Note: This is an instalment payment.</h3>

     <div className='flex justify-between mt-2'>
     <div className='flex flex-col gap-1'>
     <h3 className='text-[12px] text-[#050505] font-[500]'><span className='text-[18px]'>1</span>/2</h3>  
     <h3 className='text-[10px] text-[#212121] font-[600]'>05/02/2025</h3>
     </div>
     <h3 className='text-[#1983D5] font-[600] text-[16px]'>$260</h3>
     </div>
      <div className='flex justify-between mt-2'>
     <div className='flex flex-col gap-1'>
     <h3 className='text-[12px] text-[#050505] font-[500]'><span className='text-[18px]'>1</span>/2</h3>  
     <h3 className='text-[10px] text-[#212121] font-[600]'>05/02/2025</h3>
     </div>
     <h3 className='text-[#19213D] font-[600] text-[12px]'>$260</h3>
     </div>
     </div>
     {/* receipt */}
 <div className="bg-white shadow-md rounded-[14px] mt-6 border-[#EBEFF6] border-2 lg:p-8 p-4  ">
  {/* Inner wrapper to prevent shrinking */}
  <div className=" overflow-x-auto ">
    {/* Header Buttons */}
    <div className="flex justify-between mb-4 mt-4 text-[#19213D]">
      <div className='lg:flex-grow'>
        <button className="bg-[#E3EFFF] w-auto p-4 flex items-center justify-center h-[32px] rounded-[24px]">
          Item
        </button>
      </div>
      <button className="bg-[#E3EFFF] lg:w-1/6 w-auto  p-4 flex items-center justify-center h-[32px] rounded-[24px] ml-2">
        Billing
      </button>
      <button className="bg-[#E3EFFF] lg:w-1/6 w-auto  p-2 flex items-center justify-center h-[32px] rounded-[24px] ml-2">
        Price
      </button>
      <button className="bg-[#E3EFFF] lg:w-1/6 w-auto  p-4 flex items-center justify-center h-[32px] rounded-[24px] ml-2">
        Total
      </button>
    </div>

    {/* Data Rows */}
    {[...Array(5)].map((_, index) => (
      <div key={index}>
        <div className="flex items-center justify-between mb-3 text-sm">
          <div className="lg:flex-grow w-1/6 text-[#19213D] text-[12px] font-[500] py-2 
          justify-center whitespace-nowrap overflow-hidden text-ellipsis">
            Legal Advice
          </div>
          <div className="w-1/6 text-[#5D6481] text-[12px] font-[400] flex items-center py-2 justify-center whitespace-nowrap overflow-hidden text-ellipsis">
            Flat Fees/Hourly
          </div>
          <div className="w-1/6 text-[#5D6481] font-[400] text-[12px] flex items-center p-2 justify-center">
            5,250.00
          </div>
          <div className="w-1/6 flex items-center p-2 text-[#19213D] text-[12px] font-[500] justify-center">
            5,250.00
          </div>
        </div>
        <hr className="border-t border-gray-300 mt-4" />
      </div>
    ))}
  </div>
</div>

    {/* Wrapper to push the summary box to the right */}
    <div className="flex justify-end mt-6">
   <div className='bg-[#1983D5] rounded-[14px] lg:w-[50%] w-[80%] md:w-[60%] p-6'>
    {/* Subtotal, Tax, and Total Section */}
    <div className="text-[12px] text-white font-[500]">
      <div className="flex justify-between mb-2">
        <span>Subtotal</span>
        <span className='text-[10px]' >$10,500.00</span>
      </div>
       <hr className="border-t border-white/30 my-2" />
      <div className="flex justify-between mb-2">
        <span>Tax</span>
        <span className='text-[10px]'>$0.00</span>
      </div>
      <hr className="border-t border-white/30 my-2" />
      <div className="flex justify-between mt-2 text-[14px] font-[700]">
        <span className='text-[12px]'> invoice Total</span>
        <span>$10,500.00</span>
      </div>
    </div>
    </div>
    </div>
     {/* button */}
     <div className="flex justify-between mt-6 gap-4">
  {/* Share Button */}
    <button className="flex items-center gap-2 bg-[#FFFFFF] border-[#1983D5] border-2 text-[#1983D5]
      px-6 py-2 rounded-[40px] font-[500] text-[16px] hover:bg-[#d0e6ff] transition-all duration-200">
      Share
      <FaShare className='text-[20px]' />
    </button>

  {/* Download Invoice Button */}
    <button className="flex items-center gap-2 bg-[#1983D5] border-[#1983D5] 
    text-[#1983D5] px-4 py-4 rounded-[40px] font-[500] text-[14px] hover:bg-[#156bb2] text-white transition-all duration-200">
    <FiDownload size={18} />
      Download Invoice
    </button>
  </div>


     </div>
    </div>
    </div>
   </>
  )
}

export default Receipts