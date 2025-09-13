import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createInvoice } from '../../api/invoice_api';
import { getFirmSettings } from '../../api/firm_api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Nav from '../../components/ui/Nav';
import toast from 'react-hot-toast';

const QuickInvoice = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState({
    client_name: '',
    purpose: '',
    amount: 0,
    tax_rate: 0,
    due_date: '',
    invoice_time: '',
    client_email: '',
    client_address: '',
    client_state: '',
    client_postal_code: '',
    billing_type: 'flat_fees',
    currency: 'USD',
    vat_rate: 0,
    payment_method: 'full_payment',
    send_to_email: false,
    recipient_email: '',
    line_items: [
      {
        description: '',
        quantity: 1,
        unit_price: 0,
        billing_type: 'flat_fees'
      }
    ]
  });

  // Fetch firm settings for defaults
  useEffect(() => {
    const fetchFirmSettings = async () => {
      try {
        const firmSettings = await getFirmSettings();
        if (firmSettings?.success && firmSettings?.data) {
          const settings = firmSettings.data;
          setFormData(prev => ({
            ...prev,
            currency: settings.default_currency || 'USD',
            vat_rate: settings.default_vat_rate || 0,
            tax_rate: settings.default_vat_rate || 0
          }));
        }
      } catch (error) {
        console.error('Error fetching firm settings:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchFirmSettings();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAmountChange = (e) => {
    const amount = parseFloat(e.target.value) || 0;
    setFormData(prev => ({
      ...prev,
      amount: amount,
      line_items: [{
        ...prev.line_items[0],
        unit_price: amount
      }]
    }));
  };

  const handleTaxChange = (e) => {
    const taxRate = parseFloat(e.target.value) || 0;
    setFormData(prev => ({
      ...prev,
      tax_rate: taxRate,
      vat_rate: taxRate
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.client_name.trim()) {
      toast.error('Client name is required');
      return;
    }
    if (!formData.purpose.trim()) {
      toast.error('Purpose is required');
      return;
    }
    if (formData.amount <= 0) {
      toast.error('Amount must be greater than 0');
      return;
    }
    if (!formData.due_date) {
      toast.error('Due date is required');
      return;
    }

    try {
      setLoading(true);
      
      // Prepare invoice data
      const invoiceData = {
        client_name: formData.client_name,
        client_email: formData.client_email || '',
        client_address: formData.client_address || '',
        client_state: formData.client_state || '',
        client_postal_code: formData.client_postal_code || '',
        purpose: formData.purpose,
        billing_type: formData.billing_type,
        currency: formData.currency,
        vat_rate: formData.vat_rate / 100, // Convert percentage to decimal
        tax_rate: formData.tax_rate / 100, // Convert percentage to decimal
        payment_method: formData.payment_method,
        invoice_date: new Date().toISOString().split('T')[0],
        invoice_time: formData.invoice_time || '08:00 AM',
        due_date: new Date(formData.due_date).toISOString(),
        send_to_email: formData.send_to_email,
        recipient_email: formData.recipient_email || '',
        line_items: [
          {
            description: formData.purpose,
            quantity: 1,
            unit_price: formData.amount,
            billing_type: formData.billing_type
          }
        ]
      };

      console.log('Creating quick invoice with data:', invoiceData);
      
      const response = await createInvoice(invoiceData);
      
      if (response?.success && response?.data) {
        toast.success('Quick invoice created successfully!');
        // Navigate to invoice preview
        navigate(`/invoice-preview/${response.data.id}`);
      } else {
        throw new Error(response?.message || 'Failed to create invoice');
      }
    } catch (error) {
      console.error('Error creating quick invoice:', error);
      toast.error(error.message || 'Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <Nav />
      <div className='lg:w-[80%] w-[90%] mx-auto my-10'>
        <div className='flex justify-between items-center mb-6'>
          <Link to="/invoices" className='flex items-center gap-1 text-[14px] text-[#667185] font-[500]'>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <h3>Back</h3>
          </Link>
        </div>

        <div className='bg-white shadow-lg lg:w-[70%] w-full mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10 rounded-md'>
          <h2 className='text-[24px] font-[600] mb-2 text-[#212121]'>Quick Invoice</h2>
          <hr className='mb-6 bg-[#E9E9E9]' />
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Client Name */}
            <div>
              <h4 className='text-[14px] mb-2 font-[500] text-[#101928]'>Client Name</h4>
              <input
                type="text"
                name="client_name"
                value={formData.client_name}
                onChange={handleInputChange}
                placeholder="Enter client name"
                className='w-full rounded-[6px] px-4 border-[#D0D5DD] py-4 border-2'
                required
              />
            </div>

            {/* Purpose Dropdown */}
            <div>
              <h4 className='text-[14px] mb-2 font-[500] text-[#101928]'>Purpose</h4>
              <select
                name="purpose"
                value={formData.purpose}
                onChange={handleInputChange}
                className='w-full px-4 border-[#D0D5DD] py-4 border-2 rounded-[6px]'
                required
              >
                <option value="">Select purpose</option>
                <option value="Legal Consultation">Legal Consultation</option>
                <option value="Document Review">Document Review</option>
                <option value="Contract Drafting">Contract Drafting</option>
                <option value="Court Representation">Court Representation</option>
                <option value="Legal Research">Legal Research</option>
                <option value="Other Legal Services">Other Legal Services</option>
              </select>
            </div>

            {/* Amount and Tax */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div>
                <h4 className='text-[14px] mb-2 font-[500] text-[#101928]'>Amount</h4>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={handleAmountChange}
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  className='w-full rounded-[6px] px-4 border-[#D0D5DD] py-4 border-2'
                  required
                />
              </div>
              <div>
                <h4 className='text-[14px] mb-2 font-[500] text-[#101928]'>Tax (%)</h4>
                <input
                  type="number"
                  value={formData.tax_rate}
                  onChange={handleTaxChange}
                  placeholder="0"
                  min="0"
                  max="100"
                  step="0.1"
                  className='w-full rounded-[6px] px-4 border-[#D0D5DD] py-4 border-2'
                />
              </div>
            </div>

            {/* Due Date and Time */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div>
                <h4 className='text-[14px] mb-2 font-[500] text-[#101928]'>Due Date</h4>
                <input
                  type="date"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleInputChange}
                  className='w-full px-4 border-[#D0D5DD] py-4 border-2 rounded-[6px]'
                  required
                />
              </div>
              <div>
                <h4 className='text-[14px] mb-2 font-[500] text-[#101928]'>Time</h4>
                <input
                  type="time"
                  name="invoice_time"
                  value={formData.invoice_time}
                  onChange={handleInputChange}
                  className='w-full px-4 border-[#D0D5DD] py-4 border-2 rounded-[6px]'
                />
              </div>
            </div>

            {/* Additional Fields */}
            <div>
              <h4 className='text-[14px] mb-2 font-[500] text-[#101928]'>Client Email (Optional)</h4>
              <input
                type="email"
                name="client_email"
                value={formData.client_email}
                onChange={handleInputChange}
                placeholder="client@example.com"
                className='w-full rounded-[6px] px-4 border-[#D0D5DD] py-4 border-2'
              />
            </div>
            
            <div>
              <h4 className='text-[14px] mb-2 font-[500] text-[#101928]'>Client Address (Optional)</h4>
              <input
                type="text"
                name="client_address"
                value={formData.client_address}
                onChange={handleInputChange}
                placeholder="Enter client address"
                className='w-full rounded-[6px] px-4 border-[#D0D5DD] py-4 border-2'
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button 
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-[#1983D5] text-white px-8 py-4 font-medium hover:bg-[#156bb2] transition-all duration-200 text-[14px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 rounded-[6px]"
              >
                {loading ? (
                  <>
                    <LoadingSpinner />
                    <span>Generating invoice...</span>
                  </>
                ) : (
                  <span>Generate Invoice</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default QuickInvoice;
