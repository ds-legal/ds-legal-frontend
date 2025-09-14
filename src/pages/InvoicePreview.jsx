import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MdArrowBackIosNew } from "react-icons/md";
import { FiDownload } from 'react-icons/fi';
import { FiEdit3 } from 'react-icons/fi';
import { FiMail } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getInvoicePreview, getSingleInvoice, downloadInvoice, sendInvoiceEmail, updateInvoiceStatus } from '../api/invoice_api';

const InvoicePreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        console.log('Fetching invoice with ID:', id);
        
        // Try preview endpoint first, fallback to single invoice
        let response;
        try {
          response = await getInvoicePreview(id);
          console.log('Preview response:', response);
        } catch (previewError) {
          console.log('Preview failed, trying single invoice:', previewError);
          response = await getSingleInvoice(id);
          console.log('Single invoice response:', response);
        }
        
        if (response?.success && response?.data) {
          setInvoice(response.data);
        } else {
          throw new Error(response?.message || 'Failed to fetch invoice');
        }
      } catch (error) {
        console.error('Error fetching invoice:', error);
        toast.error('Failed to load invoice');
        navigate('/invoices');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInvoice();
    }
  }, [id, navigate]);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await downloadInvoice(id);
      toast.success('Invoice downloaded successfully!');
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast.error('Failed to download invoice');
    } finally {
      setDownloading(false);
    }
  };

  const handleSendEmail = async () => {
    try {
      setSendingEmail(true);
      await sendInvoiceEmail(id);
      toast.success('Invoice sent via email successfully!');
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send invoice email');
    } finally {
      setSendingEmail(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdatingStatus(true);
      const response = await updateInvoiceStatus(id, newStatus);
      
      if (response?.success && response?.data) {
        setInvoice(response.data); // Update local invoice data
        toast.success(`Invoice status updated to ${newStatus}`);
      } else {
        throw new Error(response?.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleEdit = () => {
    // Store invoice data for editing
    localStorage.setItem('editingInvoice', JSON.stringify(invoice));
    navigate('/createInvoice');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatCurrency = (amount, currency = 'USD') => {
    // Force USD currency display regardless of backend currency
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatBillingType = (billingType) => {
    switch (billingType) {
      case 'hourly':
        return 'Hourly';
      case 'flat_fee':
        return 'Flat Fees';
      case 'mixed':
        return 'Flat Fees/Hourly';
      default:
        return 'Flat Fees/Hourly';
    }
  };

  const getPaymentMethodText = (paymentMethod) => {
    switch (paymentMethod) {
      case 'pay_twice':
        return 'Pay Twice';
      case 'full_payment':
        return 'Full Payment';
      default:
        return 'Full Payment';
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-lg'>Loading invoice...</div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-lg text-red-500'>Invoice not found</div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 pb-20 sm:pb-8'>
      <div className='max-w-6xl mx-auto p-4 sm:p-6 lg:p-8'>
        {/* Header with Back button and Actions */}
        <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6'>
          <Link to="/invoices" className='flex items-center gap-1 text-[14px] text-[#667185] font-[500]'>
            <MdArrowBackIosNew className='text-[15px]' />
            <h3>Back to Invoices</h3>
          </Link>
          <div className='flex flex-wrap gap-2 sm:gap-3'>
            <button
              onClick={handleEdit}
              className='flex items-center gap-2 bg-gray-100 text-gray-700 px-3 sm:px-4 py-2 rounded-md text-sm hover:bg-gray-200 transition-colors'
            >
              <FiEdit3 className='text-sm' />
              <span className='hidden sm:inline'>Edit Invoice</span>
              <span className='sm:hidden'>Edit</span>
            </button>
            {/* Status Change Dropdown */}
            <div className='relative'>
              <select
                value={invoice.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={updatingStatus}
                className='flex items-center gap-2 bg-blue-100 text-blue-700 px-3 sm:px-4 py-2 rounded-md text-sm hover:bg-blue-200 transition-colors disabled:opacity-50 cursor-pointer border-0 appearance-none pr-8'
              >
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
              <div className='absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none'>
                <svg className='w-4 h-4 text-blue-700' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                </svg>
              </div>
            </div>
            
            <button
              onClick={handleSendEmail}
              disabled={sendingEmail}
              className='flex items-center gap-2 bg-green-500 text-white px-3 sm:px-4 py-2 rounded-md text-sm hover:bg-green-600 transition-colors disabled:opacity-50'
            >
              <FiMail className='text-sm' />
              <span className='hidden sm:inline'>{sendingEmail ? 'Sending...' : 'Send Email'}</span>
              <span className='sm:hidden'>{sendingEmail ? 'Sending...' : 'Send'}</span>
            </button>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className='flex items-center gap-2 bg-[#1983D5] text-white px-3 sm:px-4 py-2 rounded-md text-sm hover:bg-[#156bb2] transition-colors disabled:opacity-50'
            >
              <FiDownload className='text-sm' />
              <span className='hidden sm:inline'>{downloading ? 'Downloading...' : 'Download Invoice'}</span>
              <span className='sm:hidden'>{downloading ? 'Downloading...' : 'Download'}</span>
            </button>
          </div>
        </div>
        <div className='bg-white shadow-lg rounded-lg p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto'>
          {/* Header Section */}
          <div className='flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8'>
            {/* Firm Information */}
            <div className='flex-1'>
              <h1 className='text-2xl sm:text-3xl font-bold text-[#1983D5] mb-2'>{invoice.firm_name || 'DS Legal'}</h1>
              <p className='text-gray-600 mb-1 text-sm sm:text-base'>{invoice.firm_address || 'Extra Town, Oxford county, OX 92300, United Kingdom'}</p>
              <p className='text-gray-600 mb-1 text-sm sm:text-base'>{invoice.firm_phone || '(21) 090 - 0000'}</p>
              <p className='text-gray-600 text-sm sm:text-base'>{invoice.firm_email || 'dslegal@yahoo.co.uk'}</p>
            </div>
            
            {/* Logo placeholder */}
            <div className='w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-lg flex items-center justify-center self-start sm:self-auto'>
              <span className='text-gray-400 text-xs'>LOGO</span>
            </div>
          </div>

          {/* Invoice Dates */}
          <div className='flex justify-end mb-6'>
            <div className='text-right'>
              <div className='mb-2'>
                <span className='text-gray-600 text-sm sm:text-base'>Created on: </span>
                <span className='font-medium text-sm sm:text-base'>{formatDate(invoice.invoice_date)}</span>
              </div>
              <div>
                <span className='text-gray-600 text-sm sm:text-base'>Due date: </span>
                <span className='font-medium text-sm sm:text-base'>{formatDate(invoice.due_date)}</span>
              </div>
            </div>
          </div>

          {/* Bill To Section */}
          <div className='mb-8'>
            <h3 className='text-lg font-semibold text-gray-800 mb-3'>Bill to:</h3>
            <p className='text-gray-700 font-medium mb-1 text-sm sm:text-base'>{invoice.client_name}</p>
            <p className='text-gray-600 mb-1 text-sm sm:text-base'>{invoice.client_address}</p>
            <p className='text-gray-600 mb-1 text-sm sm:text-base'>{invoice.client_phone || '(2) 055 - 0909'}</p>
            <p className='text-gray-600 text-sm sm:text-base'>{invoice.client_email}</p>
          </div>

          {/* Payment Details */}
          <div className='mb-8'>
            <p className='text-gray-600 mb-4'>Note: This is an installment payment.</p>
            <div className='space-y-3'>
              <div className='flex justify-between items-center'>
                <span className='text-gray-700 font-medium'>1/0</span>
                <span className='text-gray-600'>{formatDate(invoice.invoice_date)}</span>
                <span className='text-[#1983D5] font-semibold'>{formatCurrency(invoice.subtotal_amount / 2)}</span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-gray-700 font-medium'>2/0</span>
                <span className='text-gray-600'>{formatDate(invoice.due_date)}</span>
                <span className='text-gray-700'>{formatCurrency(invoice.subtotal_amount / 2)}</span>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className='mb-8 overflow-x-auto'>
            <table className='w-full border-collapse min-w-full'>
              <thead>
                <tr className='border-b-2 border-gray-200'>
                  <th className='text-left py-3 px-2 sm:px-4 font-semibold text-gray-800 text-sm sm:text-base'>Item</th>
                  <th className='text-left py-3 px-2 sm:px-4 font-semibold text-gray-800 text-sm sm:text-base'>Billing</th>
                  <th className='text-right py-3 px-2 sm:px-4 font-semibold text-gray-800 text-sm sm:text-base'>Price</th>
                  <th className='text-right py-3 px-2 sm:px-4 font-semibold text-gray-800 text-sm sm:text-base'>Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.line_items?.map((item, index) => (
                  <tr key={index} className='border-b border-gray-100'>
                    <td className='py-3 px-2 sm:px-4 text-gray-700 text-sm sm:text-base'>{item.description || 'Legal Advice'}</td>
                    <td className='py-3 px-2 sm:px-4 text-gray-600 text-sm sm:text-base'>{formatBillingType(invoice.billing_type)}</td>
                    <td className='py-3 px-2 sm:px-4 text-right text-gray-700 text-sm sm:text-base'>{formatCurrency(item.unit_price)}</td>
                    <td className='py-3 px-2 sm:px-4 text-right text-gray-700 text-sm sm:text-base'>{formatCurrency(item.item_total || (item.quantity * item.unit_price))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Invoice Summary */}
          <div className='flex justify-center sm:justify-end mb-4'>
            <div className='bg-[#1983D5] text-white p-4 sm:p-6 rounded-lg w-72 sm:w-80'>
              <div className='flex justify-between items-center mb-2'>
                <span className='text-white/90 text-sm sm:text-base'>Subtotal:</span>
                <span className='text-sm sm:text-base'>{formatCurrency(invoice.subtotal_amount)}</span>
              </div>
              <div className='flex justify-between items-center mb-2'>
                <span className='text-white/90 text-sm sm:text-base'>TAX:</span>
                <span className='text-sm sm:text-base'>{formatCurrency(invoice.tax_amount)}</span>
              </div>
              <div className='border-t border-white/20 pt-2 mt-2'>
                <div className='flex justify-between items-center'>
                  <span className='text-base sm:text-lg font-semibold'>Invoice Total:</span>
                  <span className='text-base sm:text-lg font-bold'>{formatCurrency(invoice.total_amount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;
