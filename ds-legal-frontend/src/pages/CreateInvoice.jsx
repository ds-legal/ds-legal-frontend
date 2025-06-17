import React, { useState } from 'react'
import Nav from '../components/ui/Nav'
import { MdArrowBackIosNew } from "react-icons/md";
import { Link } from 'react-router-dom';
import * as Switch from '@radix-ui/react-switch';

const CreateInvoice = () => {
    const [selectedOption, setSelectedOption] = useState("");
    const [sendInvoice, setSendInvoice] = useState(false);

  const options = [
    {
      id: "pay_twice",
      title: "Pay Twice",
      description: "Every 30 days in 2 instalment",
      dates: "05/02/2025, 06/03/2025",
    },
    {
      id: "full_payment",
      title: "Full Payment",
      description: "One-time payment",
      dates: "05/02/2025",
    },
  ];
  return (
    <>
      <Nav />
      <div className='lg:w-[80%] w-[90%] mx-auto my-10'>
        <div className='flex justify-between items-center mb-6'>
          <Link to="/invoices" className='flex items-center gap-1 text-[14px] text-[#667185] font-[500]'>
            <MdArrowBackIosNew className='text-[15px]' />
            <h3>Back</h3>
          </Link>
          <button className='bg-[#1983D5] text-white rounded-[40px] px-4 py-2 text-[16px]'>
            Create Invoice
          </button>
        </div>

           <div className='bg-white shadow-lg lg:w-[70%] w-full mx-auto px-10 py-10 rounded-md'>
            <h2 className='text-[24px] font-[600] mb-2 text-[#212121]'>Billing </h2>
            <hr className='mb-6 bg-[#E9E9E9]' />
            <form className='space-y-6'>
                {/* invoice Id */}
            <div>
             <h4 className='text-[14px] mb-2 font-[500] text-[#101928]'>Invoice ID</h4>
            <input type="text" placeholder="Enter invoice ID"
            className='w-full   rounded-[6px] px-4 border-[#D0D5DD]  py-4 border-2 ' />
            </div>
             {/* client name */}
             <div>
            <h4 className='text-[14px] mb-2 font-[500] text-[#101928]'>Client Name</h4>
            <input type="text" placeholder="Enter client name" 
            className='w-full rounded-[6px] px-4 border-[#D0D5DD]  py-4 border-2' />
            </div> 
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <h4 className='text-[14px] mb-2 font-[500] text-[#101928]'>State</h4>
                <select className='w-full   px-4 border-[#D0D5DD]  py-4 border-2 rounded-[6px]'>
                  <option value="">Select state</option>
                  <option value="lagos">Lagos</option>
                  <option value="abuja">Abuja</option>
                  <option value="rivers">Rivers</option>
                </select>
              </div>
              <div>
                <h4 className='text-[14px] mb-2 font-[500] text-[#101928]'>Postal Code</h4>
                <input type="text" placeholder="Postal Code"
                 className='w-full  rounded-[6px] px-4 border-[#D0D5DD]  py-4 border-2' />
              </div>
            </div> 

            <div>
              <h4 className='text-[14px] mb-2 font-[500] text-[#101928]'>Purpose</h4>
              <select className='w-full  rounded-[6px] px-4 border-[#D0D5DD]  py-4 border-2'>
                <option value="">Select purpose</option>
                <option value="consulting">Consulting</option>
                <option value="development">Development</option>
                <option value="design">Design</option>
              </select>
            </div> 

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
            <h4 className='text-[14px] mb-2 font-[500] text-[#101928]'>Amount</h4>
            <input type="number" placeholder="Enter amount"
             className='w-full   rounded-[6px] px-4 border-[#D0D5DD]  py-4 border-2' />
            </div>
            <div>
            <h4 className='text-[14px] mb-2 font-[500] text-[#101928]'>VAT (%)</h4>
            <input type="number" placeholder="Enter VAT"
             className='w-full  rounded-[6px] px-4 border-[#D0D5DD]  py-4 border-2' />
            </div>
          </div> 
         <div>
        <label className=' text-sm font-medium mb-4'>Billing</label>
        <div className='flex  lg:gap-4 gap-2 lg:flex-nowrap flex-wrap mt-2 '>
        <div className='flex gap-2 items-center justify-between'>
       <input type="radio" className='accent-blue-500' />  
        <h5 className='text-[#475467] text-[14px] font-[500]'> Hourly</h5> 
        </div> 
         <div className='flex gap-2 items-center justify-between'>
       <input type="radio" className='accent-blue-500' />  
        <h5 className='text-[#475467] text-[14px] font-[500]'>Flat  Fees</h5> 
        </div>
        <div className='flex gap-2 items-center justify-between'>
       <input type="radio" className='accent-blue-500' />  
        <h5 className='text-[#475467] text-[14px] font-[500]'>Flat  Fees/Hourly</h5> 
        </div>
         </div>
        </div>
        <h4 className='text-[16px] mt-2 text-[#475367] font-[500]'>Instalment</h4> 
          <div className="flex flex-col gap-4">
        {options.map((option) => (
           <div
          key={option.id}
          className={` cursor-pointer w-full transition-all p-[16px] border-[#E7EAEE] border-2 rounded-[4px] hover:border-[#1983D5] ${
            selectedOption === option.id
              ? "border-[#1983D5]"
              : "border-[#E7EAEE] hover:border-[#1983D5]"
          }`}
          onClick={() => setSelectedOption(option.id)}
        >
          <div className="flex justify-between items-center">
            <h1 className="text-[#050505] text-[16px] mb-2 font-[600]">{option.title}</h1>
            <input
              type="radio"
              name="payment"
              checked={selectedOption === option.id}
              onChange={() => setSelectedOption(option.id)}
              className="accent-blue-500"
            />
          </div>
          <h3 className="text-[12px] font-[400] text-[#787878] mb-2">{option.description}</h3>
          <h3 className="text-[12px] font-[400] text-[#787878]">{option.dates}</h3>
        </div>
      
          ))} 
         </div> 
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
        <h4 className='text-[14px] mb-2 font-[500] text-[#101928]'>Due Date</h4>
        <input type="date" className="w-full  rounded-[6px] px-4 border-[#D0D5DD]  py-4 border-2" />
        </div>
        <div>
        <h4 className='text-[14px] mb-2 font-[500] text-[#101928]'>Time</h4>
        <input type="time" className="w-full  rounded-[6px] px-4 border-[#D0D5DD]  py-4 border-2" />
        </div>
        </div>
          <div>
        <h4 className='text-[14px] mb-2 font-[500] text-[#101928]'>Payment Status</h4>
        <select className="w-full  rounded-[6px] px-4 border-[#D0D5DD]  py-4 border-2">
        <option value="">Select status</option>
        <option value="paid">Paid</option>
        <option value="pending">Pending</option>
        <option value="overdue">Overdue</option>
        </select>
        </div> 
        <div> 
        <h4 className='text-[14px] mb-2 font-[500] text-[#101928]'>Description</h4>
        <textarea placeholder="Enter description" rows="4" 
        className="w-full  rounded-[6px] px-4 border-[#D0D5DD]  py-4 border-2" />
      </div> 

    <div>
    <h4 className='text-[14px] mb-2 font-[500] text-[#101928]'>Address</h4>
    <input type="text" placeholder="Enter address"
     className="w-full  rounded-[6px] px-4 border-[#D0D5DD]  py-4 border-2" />
    </div> 

  <div>
    <h4 className='text-[14px] mb-2 font-[500] text-[#101928]'>Assign Task</h4>
    <select className="w-full  rounded-[6px] px-4 border-[#D0D5DD]  py-4 border-2">
      <option value="">Select assignee</option>
      <option value="john">John Doe</option>
      <option value="jane">Jane Smith</option>
      <option value="team">Team Member</option>
    </select>
  </div> 
  <h3 className='text-[14px] font-[400px] mb-2'>Don’t have a Task?
   <span className='text-[#1983D5]'> Create Task</span></h3> 
   <hr className='bg-[##E9E9E9] mt-6 ' />
     <div className="flex items-center justify-between mt-4">
      <h3 className="text-[14px] text-[#667185] font-[500]">
        Do you want to send invoice to email?
      </h3>

      <button
        onClick={() => setSendInvoice(!sendInvoice)}
        className={`w-12 h-6 rounded-full relative transition-colors duration-300 outline-none 
          ${sendInvoice ? 'bg-blue-500' : 'bg-gray-300'}`}
      >
        <span
          className={`block w-5 h-5 bg-white rounded-full shadow-md absolute top-0.5 left-0.5 transition-transform duration-300
            ${sendInvoice ? 'translate-x-6' : 'translate-x-0'}`}
        />
      </button>
    </div> 

  <div>
    <h4 className='text-[14px] mb-2 font-[500] text-[#101928]'>Email</h4>
    <input type="email" placeholder="Enter email"
     className="w-full  rounded-[6px] px-4 border-[#D0D5DD]  py-4 border-2" />
  </div>    
   <hr className='bg-[##E9E9E9] mt-6 ' /> 
    <div className='flex justify-between items-center mb-6'>
    <Link to="/invoices" className='flex items-center gap-1 text-[14px] text-[#667185] font-[500]'>
      <MdArrowBackIosNew className='text-[15px]' />
      <h3>Back</h3>
    </Link>
    <button className='bg-[#1983D5] text-white rounded-[40px] px-4 py-2 text-[16px]'>
      Create Invoice
    </button>
     </div>  
  </form>
  </div>
  </div>
    </>
  )
}

export default CreateInvoice
