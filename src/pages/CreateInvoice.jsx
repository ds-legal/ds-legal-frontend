import React, { useState, useEffect } from 'react'
import Nav from '../components/ui/Nav'
import { MdArrowBackIosNew } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import * as Switch from '@radix-ui/react-switch';
import toast from 'react-hot-toast';
import { createInvoice, updateInvoice, sendInvoiceEmail } from '../api/invoice_api';
import { getFirmSettings } from '../api/firm_api';
import { GetAllTask } from '../api/task_api';

const CreateInvoice = () => {
    const navigate = useNavigate();
    const [selectedOption, setSelectedOption] = useState("");
    const [sendInvoice, setSendInvoice] = useState(false);
    const [firmInfo, setFirmInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [editingInvoice, setEditingInvoice] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [tasks, setTasks] = useState([]);

    // Form state
    const [formData, setFormData] = useState({
        client_name: '',
        client_address: '',
        client_state: '',
        client_postal_code: '',
        client_email: '',
        invoice_date: '',
        invoice_time: '',
        due_date: '',
        purpose: '',
        billing_type: 'hourly',
        payment_method: 'full_payment',
        currency: 'USD',
        associated_task_id: '',
        send_to_email: false,
        recipient_email: '',
        tax_rate: 0,
        vat_rate: 0,
        line_items: [
            {
                description: '',
                quantity: 1,
                unit_price: 0.01
            }
        ]
    });

    // Fetch tasks
    const fetchTasks = async () => {
        try {
            const response = await GetAllTask();
            if (response?.data) {
                setTasks(response.data);
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
            // Don't show error toast for tasks as it's not critical
        }
    };

    // Initialize form with firm settings
    useEffect(() => {
        const initializeForm = async () => {
            try {
                setInitialLoading(true);
                
                // Fetch tasks
                await fetchTasks();
                
                // Check if we're editing an existing invoice
                const storedInvoice = localStorage.getItem('editingInvoice');
                const savedFormData = localStorage.getItem('invoiceFormData');
                
                if (storedInvoice) {
                    const invoiceData = JSON.parse(storedInvoice);
                    setEditingInvoice(invoiceData);
                    setIsEditing(true);
                    
                    // Populate form with existing invoice data
                    setFormData({
                        client_name: invoiceData.client_name || '',
                        client_address: invoiceData.client_address || '',
                        client_state: invoiceData.client_state || '',
                        client_postal_code: invoiceData.client_postal_code || '',
                        client_email: invoiceData.client_email || '',
                        invoice_date: invoiceData.invoice_date ? new Date(invoiceData.invoice_date).toISOString().split('T')[0] : '',
                        invoice_time: invoiceData.invoice_time || '08:00 AM',
                        due_date: invoiceData.due_date ? new Date(invoiceData.due_date).toISOString().split('T')[0] : '',
                        purpose: invoiceData.purpose || '',
                        billing_type: invoiceData.billing_type || 'hourly',
                        payment_method: invoiceData.payment_method || 'full_payment',
                        currency: invoiceData.currency || 'USD',
                        associated_task_id: invoiceData.associated_task_id || '',
                        send_to_email: invoiceData.send_to_email || false,
                        recipient_email: invoiceData.recipient_email || '',
                        tax_rate: invoiceData.tax_rate || 0,
                        vat_rate: invoiceData.vat_rate || 0,
                        status: invoiceData.status || 'draft',
                        line_items: invoiceData.line_items || [
                            {
                                description: '',
                                quantity: 1,
                                unit_price: 0.01
                            }
                        ]
                    });
                    
                    setSendInvoice(invoiceData.send_to_email || false);
                    setSelectedOption(invoiceData.payment_method || 'full_payment');
                    
                    // Clear the stored invoice data
                    localStorage.removeItem('editingInvoice');
                } else if (savedFormData) {
                    // Load saved form data
                    const formData = JSON.parse(savedFormData);
                    setFormData(formData);
                    setSendInvoice(formData.send_to_email || false);
                    setSelectedOption(formData.payment_method || 'full_payment');
                } else {
                    // Get firm settings from API for new invoice
                    const firmResponse = await getFirmSettings();
                    if (firmResponse?.success && firmResponse?.data) {
                        const firmData = firmResponse.data;
                        setFirmInfo(firmData);
                        
                        // Set default values from firm settings
                        setFormData(prev => ({
                            ...prev,
                            currency: firmData.default_currency || 'USD',
                            vat_rate: firmData.default_vat_rate || 0,
                            tax_rate: firmData.default_vat_rate || 0
                        }));
                    }
                    
                    // Set default dates
                    const today = new Date();
                    const dueDate = new Date(today);
                    dueDate.setDate(today.getDate() + 30); // 30 days from today
                    
                    setFormData(prev => ({
                        ...prev,
                        invoice_date: today.toISOString().split('T')[0],
                        invoice_time: '08:00 AM',
                        due_date: dueDate.toISOString().split('T')[0]
                    }));
                }
                
            } catch (error) {
                console.error('Error initializing form:', error);
                toast.error('Failed to load form data');
                navigate('/invoices');
            } finally {
                setInitialLoading(false);
            }
        };

        initializeForm();
    }, [navigate]);

    const handleInputChange = (field, value) => {
        setFormData(prev => {
            const newData = {
                ...prev,
                [field]: value
            };
            // Save to localStorage for persistence
            localStorage.setItem('invoiceFormData', JSON.stringify(newData));
            return newData;
        });
    };

    const handleLineItemChange = (index, field, value) => {
        setFormData(prev => {
            const newData = {
                ...prev,
                line_items: prev.line_items.map((item, i) => 
                    i === index ? { ...item, [field]: value } : item
                )
            };
            // Save to localStorage for persistence
            localStorage.setItem('invoiceFormData', JSON.stringify(newData));
            return newData;
        });
    };

    const addLineItem = () => {
        setFormData(prev => {
            const newData = {
                ...prev,
            line_items: [...prev.line_items, {
                description: '',
                quantity: 1,
                unit_price: 0.01
            }]
            };
            // Save to localStorage for persistence
            localStorage.setItem('invoiceFormData', JSON.stringify(newData));
            return newData;
        });
    };

    const removeLineItem = (index) => {
        if (formData.line_items.length > 1) {
            setFormData(prev => {
                const newData = {
                    ...prev,
                    line_items: prev.line_items.filter((_, i) => i !== index)
                };
                // Save to localStorage for persistence
                localStorage.setItem('invoiceFormData', JSON.stringify(newData));
                return newData;
            });
        }
    };

    const clearFormData = () => {
        localStorage.removeItem('invoiceFormData');
        // Reset form to initial state
        setFormData({
            client_name: '',
            client_address: '',
            client_state: '',
            client_postal_code: '',
            client_email: '',
            invoice_date: '',
            invoice_time: '',
            due_date: '',
            purpose: '',
            billing_type: 'hourly',
            payment_method: 'full_payment',
            currency: 'USD',
            associated_task_id: '',
            send_to_email: false,
            recipient_email: '',
            tax_rate: 0,
            vat_rate: 0,
            status: 'draft',
            line_items: [
                {
                    description: '',
                    quantity: 1,
                    unit_price: 0.01
                }
            ]
        });
        setSendInvoice(false);
        setSelectedOption('');
        toast.success('Form cleared successfully!');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.client_name.trim()) {
            toast.error('Client name is required');
            return;
        }
        if (!formData.client_email.trim()) {
            toast.error('Client email is required');
            return;
        }
        if (!formData.client_address.trim()) {
            toast.error('Client address is required');
            return;
        }
        if (!formData.client_state.trim()) {
            toast.error('Client state is required');
            return;
        }
        if (!formData.client_postal_code.trim()) {
            toast.error('Client postal code is required');
            return;
        }
        if (!formData.purpose.trim()) {
            toast.error('Purpose is required');
            return;
        }
        if (!formData.invoice_date) {
            toast.error('Invoice date is required');
            return;
        }
        if (!formData.due_date) {
            toast.error('Due date is required');
            return;
        }
        if (formData.line_items.some(item => !item.description.trim())) {
            toast.error('All line items must have descriptions');
            return;
        }
        
        // Validate line items have valid prices
        if (formData.line_items.some(item => item.unit_price <= 0)) {
            toast.error('All line items must have a unit price greater than 0');
            return;
        }
        
        // Validate line items have valid quantities
        if (formData.line_items.some(item => item.quantity <= 0)) {
            toast.error('All line items must have a quantity greater than 0');
            return;
        }
        if (sendInvoice && !formData.recipient_email.trim()) {
            toast.error('Recipient email is required when sending via email');
            return;
        }
        
        setLoading(true);
        
        try {
            // Prepare data for API with proper date formatting
            const formatDate = (dateStr) => {
                if (!dateStr) return null;
                const date = new Date(dateStr);
                if (isNaN(date.getTime())) {
                    throw new Error(`Invalid date format: ${dateStr}`);
                }
                return date.toISOString();
            };

            console.log('Form data before processing:', {
                invoice_date: formData.invoice_date,
                due_date: formData.due_date,
                invoice_time: formData.invoice_time,
                send_to_email: sendInvoice,
                recipient_email: formData.recipient_email
            });

            const invoiceData = {
                ...formData,
                invoice_date: formatDate(formData.invoice_date),
                due_date: formatDate(formData.due_date),
                payment_terms: {},
                send_to_email: sendInvoice,
                recipient_email: sendInvoice ? formData.recipient_email : ''
            };

            console.log('Full invoice data being sent:', invoiceData);
            
            let response;
            let invoiceId;
            
            if (isEditing && editingInvoice?.id) {
                response = await updateInvoice(editingInvoice.id, invoiceData);
                if (response?.success) {
                    invoiceId = editingInvoice.id;
                    toast.success('Invoice updated successfully!');
                } else {
                    throw new Error(response?.message || 'Failed to update invoice');
                }
            } else {
                console.log('Calling createInvoice API...');
                response = await createInvoice(invoiceData);
                console.log('API Response:', response);
                
                if (response?.success) {
                    invoiceId = response?.data?.id;
                    toast.success('Invoice created successfully!');
                    // Clear saved form data after successful creation
                    localStorage.removeItem('invoiceFormData');
                } else {
                    throw new Error(response?.message || 'Failed to create invoice');
                }
            }
            
            // Send email if toggle is enabled and recipient email is provided
            if (sendInvoice && formData.recipient_email && invoiceId) {
                try {
                    await sendInvoiceEmail(invoiceId);
                    toast.success('Invoice sent via email successfully!');
                } catch (emailError) {
                    console.error('Error sending email:', emailError);
                    toast.error('Invoice created but failed to send email');
                }
            }
            
            // Navigate to preview
            if (invoiceId) {
                console.log('Navigating to preview with invoice ID:', invoiceId);
                navigate(`/invoice-preview/${invoiceId}`);
            } else {
                console.log('No invoice ID, navigating to invoices list');
                navigate('/invoices');
            }
        } catch (error) {
            console.error('Error creating invoice:', error);
            console.error('Full error object:', error);
            
            // Show more specific error messages
            if (error.message.includes('Validation Error:')) {
                const validationError = error.message.replace('Validation Error: ', '');
                console.error('Validation details:', validationError);
                
                // Parse validation error to show user-friendly message
                try {
                    const errors = JSON.parse(validationError);
                    if (Array.isArray(errors) && errors.length > 0) {
                        const firstError = errors[0];
                        if (firstError.loc && firstError.loc.includes('unit_price')) {
                            toast.error('Please ensure all line items have a unit price greater than 0');
                        } else if (firstError.loc && firstError.loc.includes('quantity')) {
                            toast.error('Please ensure all line items have a quantity greater than 0');
                        } else {
                            toast.error(`Validation Error: ${firstError.msg || 'Please check your input'}`);
                        }
                    } else {
                        toast.error('Validation Error: Please check your input');
                    }
                } catch (parseError) {
                    toast.error('Validation Error: Please check your input');
                }
            } else if (error.message.includes('Failed to create invoice')) {
                toast.error('Failed to create invoice. Please check all required fields and try again.');
            } else if (error.message.includes('Invalid date format')) {
                toast.error('Please check your date fields and try again.');
            } else {
                toast.error(error.message || 'Failed to create invoice. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

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

  if (initialLoading) {
    return (
      <>
        <Nav />
        <div className='lg:w-[80%] w-[90%] mx-auto my-10'>
          <div className='flex justify-center items-center h-64'>
            <div className='text-lg'>Loading invoice form...</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Nav />
      <div className='lg:w-[80%] w-[90%] mx-auto my-10'>
        <div className='flex justify-between items-center mb-6'>
          <Link to="/firmInfo" className='flex items-center gap-1 text-[14px] text-[#667185] font-[500]'>
            <MdArrowBackIosNew className='text-[15px]' />
            <h3>Back</h3>
          </Link>
          <button
            onClick={clearFormData}
            className='text-[14px] text-red-500 hover:text-red-700 font-[500]'
          >
            Clear Form
          </button>
        </div>

           <div className='bg-white shadow-lg lg:w-[70%] w-full mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10 rounded-md'>
            <h2 className='text-[24px] font-[600] mb-2 text-[#212121]'>
              {isEditing ? 'Edit Invoice' : 'Create Invoice'}
            </h2>
            <hr className='mb-6 bg-[#E9E9E9]' />
            <form onSubmit={handleSubmit} className='space-y-6'>
             {/* client name */}
             <div>
            <h4 className='text-[14px] mb-2 font-[500] text-[#101928]'>Client Name</h4>
            <input 
              type="text" 
              placeholder="Enter client name"
              value={formData.client_name}
              onChange={(e) => handleInputChange('client_name', e.target.value)}
              className='w-full rounded-[6px] px-4 border-[#D0D5DD]  py-4 border-2' 
            />
            </div> 
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div>
                <h4 className='text-[14px] mb-2 font-[500] text-[#101928]'>State</h4>
                <select 
                  value={formData.client_state}
                  onChange={(e) => handleInputChange('client_state', e.target.value)}
                  className='w-full   px-4 border-[#D0D5DD]  py-4 border-2 rounded-[6px]'
                >
                  <option value="">Select state</option>
                  <option value="Lagos">Lagos</option>
                  <option value="Abuja">Abuja</option>
                  <option value="Rivers">Rivers</option>
                </select>
              </div>
              <div>
                <h4 className='text-[14px] mb-2 font-[500] text-[#101928]'>Postal Code</h4>
                <input 
                  type="text" 
                  placeholder="Postal Code"
                  value={formData.client_postal_code}
                  onChange={(e) => handleInputChange('client_postal_code', e.target.value)}
                  className='w-full  rounded-[6px] px-4 border-[#D0D5DD]  py-4 border-2' 
                />
              </div>
            </div> 

            <div>
              <h4 className='text-[14px] mb-2 font-[500] text-[#101928]'>Purpose</h4>
              <input 
                type="text" 
                placeholder="Enter purpose"
                value={formData.purpose}
                onChange={(e) => handleInputChange('purpose', e.target.value)}
                className='w-full  rounded-[6px] px-4 border-[#D0D5DD]  py-4 border-2'
              />
            </div> 

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
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
        <label className=' text-sm font-medium mb-4'>Billing Type</label>
        <div className='flex  lg:gap-4 gap-2 lg:flex-nowrap flex-wrap mt-2 '>
        <div className='flex gap-2 items-center justify-between'>
       <input 
         type="radio" 
         name="billing_type"
         value="hourly"
         checked={formData.billing_type === 'hourly'}
         onChange={(e) => handleInputChange('billing_type', e.target.value)}
         className='accent-blue-500' 
       />  
        <h5 className='text-[#475467] text-[14px] font-[500]'> Hourly</h5> 
        </div> 
         <div className='flex gap-2 items-center justify-between'>
       <input 
         type="radio" 
         name="billing_type"
         value="flat_fees"
         checked={formData.billing_type === 'flat_fees'}
         onChange={(e) => handleInputChange('billing_type', e.target.value)}
         className='accent-blue-500' 
       />  
        <h5 className='text-[#475467] text-[14px] font-[500]'>Flat Fees</h5> 
        </div>
        <div className='flex gap-2 items-center justify-between'>
       <input 
         type="radio" 
         name="billing_type"
         value="flat_fees_hourly"
         checked={formData.billing_type === 'flat_fees_hourly'}
         onChange={(e) => handleInputChange('billing_type', e.target.value)}
         className='accent-blue-500' 
       />  
        <h5 className='text-[#475467] text-[14px] font-[500]'>Mixed</h5> 
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

         {/* Line Items Section */}
         <div className="space-y-4">
           <div className="flex justify-between items-center">
             <h4 className='text-[16px] text-[#475367] font-[500]'>Line Items</h4>
             <button
               type="button"
               onClick={addLineItem}
               className="bg-[#1983D5] text-white px-4 py-2 rounded-md text-sm hover:bg-[#156bb2] transition-colors"
             >
               Add Item
             </button>
           </div>
           
           {formData.line_items.map((item, index) => (
             <div key={index} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border border-[#D0D5DD] rounded-md">
               <div>
                 <label className="text-sm text-[#101928] font-[500] mb-1 block">Description</label>
                 <input
                   type="text"
                   value={item.description}
                   onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
                   placeholder="Item description"
                   className="w-full rounded-[6px] px-3 py-2 border-[#D0D5DD] border-2 text-sm"
                 />
               </div>
               <div>
                 <label className="text-sm text-[#101928] font-[500] mb-1 block">Quantity</label>
                 <input
                   type="number"
                   value={item.quantity}
                   onChange={(e) => {
                     const value = parseInt(e.target.value) || 1;
                     handleLineItemChange(index, 'quantity', Math.max(1, value));
                   }}
                   min="1"
                   className="w-full rounded-[6px] px-3 py-2 border-[#D0D5DD] border-2 text-sm"
                 />
               </div>
               <div>
                 <label className="text-sm text-[#101928] font-[500] mb-1 block">Unit Price ($)</label>
                 <input
                   type="number"
                   value={item.unit_price}
                   onChange={(e) => {
                     const value = parseFloat(e.target.value) || 0;
                     handleLineItemChange(index, 'unit_price', Math.max(0.01, value));
                   }}
                   min="0.01"
                   step="0.01"
                   placeholder="0.00"
                   className="w-full rounded-[6px] px-3 py-2 border-[#D0D5DD] border-2 text-sm"
                 />
               </div>
               <div className="flex items-end">
                 <div className="w-full">
                   <label className="text-sm text-[#101928] font-[500] mb-1 block">Total</label>
                   <div className="w-full rounded-[6px] px-3 py-2 border-[#D0D5DD] border-2 text-sm bg-gray-50">
                     ${(item.quantity * item.unit_price).toFixed(2)}
                   </div>
                 </div>
                 {formData.line_items.length > 1 && (
                   <button
                     type="button"
                     onClick={() => removeLineItem(index)}
                     className="ml-2 text-red-500 hover:text-red-700"
                   >
                     Remove
                   </button>
                 )}
               </div>
             </div>
           ))}
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
        <h4 className='text-[14px] mb-2 font-[500] text-[#101928]'>Invoice Date</h4>
        <input 
          type="date" 
          value={formData.invoice_date}
          onChange={(e) => handleInputChange('invoice_date', e.target.value)}
          className="w-full  rounded-[6px] px-4 border-[#D0D5DD]  py-4 border-2" 
        />
        </div>
        <div>
        <h4 className='text-[14px] mb-2 font-[500] text-[#101928]'>Due Date</h4>
        <input 
          type="date" 
          value={formData.due_date}
          onChange={(e) => handleInputChange('due_date', e.target.value)}
          className="w-full  rounded-[6px] px-4 border-[#D0D5DD]  py-4 border-2" 
        />
        </div>
        <div>
        <h4 className='text-[14px] mb-2 font-[500] text-[#101928]'>Invoice Time</h4>
        <input 
          type="text" 
          value={formData.invoice_time}
          onChange={(e) => handleInputChange('invoice_time', e.target.value)}
          placeholder="e.g., 08:00 AM"
          className="w-full  rounded-[6px] px-4 border-[#D0D5DD]  py-4 border-2" 
        />
        </div>
        </div>
          <div>
        <h4 className='text-[14px] mb-2 font-[500] text-[#101928]'>Payment Status</h4>
        <select 
          name="status"
          value={formData.status}
          onChange={(e) => handleInputChange('status', e.target.value)}
          className="w-full rounded-[6px] px-4 border-[#D0D5DD] py-4 border-2 focus:outline-none focus:ring-2 focus:ring-[#1983D5] focus:border-transparent"
        >
        <option value="draft">Draft</option>
        <option value="sent">Sent</option>
        <option value="pending">Pending</option>
        <option value="paid">Paid</option>
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
    <input 
      type="text" 
      placeholder="Enter address"
      value={formData.client_address}
      onChange={(e) => handleInputChange('client_address', e.target.value)}
      className="w-full  rounded-[6px] px-4 border-[#D0D5DD]  py-4 border-2" 
    />
    </div> 

  <div>
    <div className='flex justify-between items-center mb-2'>
      <h4 className='text-[14px] font-[500] text-[#101928]'>Assign Task</h4>
      <button
        type='button'
        onClick={fetchTasks}
        className='text-[12px] text-[#1983D5] hover:underline'
      >
        Refresh Tasks
      </button>
    </div>
    <select 
      value={formData.associated_task_id}
      onChange={(e) => handleInputChange('associated_task_id', e.target.value)}
      className="w-full  rounded-[6px] px-4 border-[#D0D5DD]  py-4 border-2"
    >
      <option value="">Select assignee</option>
      {tasks.map((task) => (
        <option key={task.id} value={task.id}>
          {task.title} - {task.status}
        </option>
      ))}
    </select>
  </div> 
  <h3 className='text-[14px] font-[400px] mb-2'>Don't have a Task?
   <Link to="/createTask" className='text-[#1983D5] hover:underline'> Create Task</Link></h3> 
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

    {sendInvoice && (
      <div>
        <h4 className='text-[14px] mb-2 font-[500] text-[#101928]'>Recipient Email</h4>
        <input 
          type="email" 
          placeholder="Enter recipient email"
          value={formData.recipient_email}
          onChange={(e) => handleInputChange('recipient_email', e.target.value)}
          className="w-full  rounded-[6px] px-4 border-[#D0D5DD]  py-4 border-2" 
        />
      </div>
    )}

  <div>
    <h4 className='text-[14px] mb-2 font-[500] text-[#101928]'>Client Email</h4>
    <input 
      type="email" 
      placeholder="Enter client email"
      value={formData.client_email}
      onChange={(e) => handleInputChange('client_email', e.target.value)}
      className="w-full  rounded-[6px] px-4 border-[#D0D5DD]  py-4 border-2" 
    />
  </div>    
   <hr className='bg-[##E9E9E9] mt-6 ' /> 
    <div className='flex justify-between items-center mb-6'>
    <Link to="/firmInfo" className='flex items-center gap-1 text-[14px] text-[#667185] font-[500]'>
      <MdArrowBackIosNew className='text-[15px]' />
      <h3>Back</h3>
    </Link>
    <button 
      type='submit'
      disabled={loading}
      className='bg-[#1983D5] text-white rounded-[40px] px-4 py-2 text-[16px] hover:bg-[#156bb2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
    >
      {loading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Invoice' : 'Create Invoice')}
    </button>
     </div>  
  </form>
  </div>
  </div>
    </>
  )
}

export default CreateInvoice
 