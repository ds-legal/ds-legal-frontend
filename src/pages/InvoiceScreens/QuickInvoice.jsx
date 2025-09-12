import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createInvoice } from '../../api/invoice_api';
import { getFirmSettings } from '../../api/firm_api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="bg-white p-6 rounded-[14px] shadow space-y-6">
          {/* Title */}
          <div>
            <h1 className="text-[24px] font-bold text-[#212121]">Quick Invoice</h1>
            <hr className="border-t border-gray-300 mt-1" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Client Name */}
            <div>
              <label className="text-sm font-medium text-[#19213D] mb-1 block">Client Name</label>
              <input
                type="text"
                name="client_name"
                value={formData.client_name}
                onChange={handleInputChange}
                placeholder="Enter client name"
                className="w-full p-3 border border-[#D0D5DD] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1983D5] focus:border-transparent"
                required
              />
            </div>

            {/* Purpose Dropdown */}
            <div>
              <label className="text-[14px] text-[#101928] font-[500] mb-1 block">Purpose</label>
              <select
                name="purpose"
                value={formData.purpose}
                onChange={handleInputChange}
                className="w-full p-3 border border-[#D0D5DD] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1983D5] focus:border-transparent"
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
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full lg:w-[50%]">
                <label className="text-[14px] text-[#101928] font-[500] mb-1 block">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={handleAmountChange}
                    placeholder="0.00"
                    min="0.01"
                    step="0.01"
                    className="w-full pl-8 pr-12 p-3 border border-[#D0D5DD] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1983D5] focus:border-transparent"
                    required
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, amount: prev.amount + 1 }))}
                      className="text-gray-400 hover:text-gray-600 text-xs"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, amount: Math.max(0, prev.amount - 1) }))}
                      className="text-gray-400 hover:text-gray-600 text-xs"
                    >
                      ▼
                    </button>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-[50%]">
                <label className="text-[14px] text-[#101928] font-[500] mb-1 block">Tax (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.tax_rate}
                    onChange={handleTaxChange}
                    placeholder="0"
                    min="0"
                    max="100"
                    step="0.1"
                    className="w-full pr-12 p-3 border border-[#D0D5DD] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1983D5] focus:border-transparent"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, tax_rate: Math.min(100, prev.tax_rate + 1) }))}
                      className="text-gray-400 hover:text-gray-600 text-xs"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, tax_rate: Math.max(0, prev.tax_rate - 1) }))}
                      className="text-gray-400 hover:text-gray-600 text-xs"
                    >
                      ▼
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Due Date and Time */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="lg:w-[50%] w-full">
                <label className="text-[14px] text-[#101928] font-[500] mb-1 block">Due Date</label>
                <input
                  type="date"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-[#D0D5DD] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1983D5] focus:border-transparent"
                  required
                />
              </div>
              <div className="lg:w-[50%] w-full">
                <label className="text-[14px] text-[#101928] font-[500] mb-1 block">Time</label>
                <input
                  type="time"
                  name="invoice_time"
                  value={formData.invoice_time}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-[#D0D5DD] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1983D5] focus:border-transparent"
                />
              </div>
            </div>

            {/* Additional Fields */}
            <div className="space-y-4">
              <div>
                <label className="text-[14px] text-[#101928] font-[500] mb-1 block">Client Email (Optional)</label>
                <input
                  type="email"
                  name="client_email"
                  value={formData.client_email}
                  onChange={handleInputChange}
                  placeholder="client@example.com"
                  className="w-full p-3 border border-[#D0D5DD] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1983D5] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="text-[14px] text-[#101928] font-[500] mb-1 block">Client Address (Optional)</label>
                <input
                  type="text"
                  name="client_address"
                  value={formData.client_address}
                  onChange={handleInputChange}
                  placeholder="Enter client address"
                  className="w-full p-3 border border-[#D0D5DD] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1983D5] focus:border-transparent"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button 
                type="submit"
                disabled={loading}
                className="bg-[#1983D5] rounded-[40px] text-white px-8 py-4 font-medium hover:bg-[#156bb2] transition-all duration-200 text-[14px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <LoadingSpinner />
                    Generating invoice...
                  </>
                ) : (
                  'Generate invoice'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuickInvoice;
