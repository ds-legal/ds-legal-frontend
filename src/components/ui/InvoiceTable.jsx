import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllInvoices } from '../../api/invoice_api';
import LoadingSpinner from '../common/LoadingSpinner';

const getStatusColor = (status) => {
  switch (status) {
    case 'overdue':
      return 'bg-[#FFECE5] text-[#AD3307]';
    case 'paid':
      return 'bg-[#E7F6EC] text-[#036B48]';
    case 'pending':
      return 'bg-[#E4E7EC] text-black';
    case 'sent':
      return 'bg-[#E0F2FE] text-[#0369A1]';
    case 'draft':
      return 'bg-[#F3F4F6] text-[#374151]';
    default:
      return 'bg-gray-300 text-black';
  }
};

const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

const InvoiceTable = ({ statusFilter, dateFilter }) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = new URLSearchParams();
        if (dateFilter) {
          params.append('start_date', dateFilter.start);
          params.append('end_date', dateFilter.end);
        }
        
        const response = await getAllInvoices(params.toString());
        
        if (response?.success && response?.data) {
          let filteredInvoices = response.data;
          
          // Frontend filtering for status
          if (statusFilter && statusFilter !== 'all') {
            if (statusFilter === 'paid') {
              // Show only invoices with status: 'paid'
              filteredInvoices = response.data.filter(invoice => invoice.status === 'paid');
            } else if (statusFilter === 'unpaid') {
              // Show only invoices that are NOT paid (pending, sent, draft, overdue, etc.)
              filteredInvoices = response.data.filter(invoice => 
                invoice.status !== 'paid' && 
                ['pending', 'sent', 'draft', 'overdue'].includes(invoice.status)
              );
            }
          } else {
            // Show all invoices when statusFilter is 'all'
            filteredInvoices = response.data;
          }
          
          setInvoices(filteredInvoices);
        } else {
          throw new Error(response?.message || 'Failed to fetch invoices');
        }
      } catch (error) {
        console.error('Error fetching invoices:', error);
        setError('Failed to load invoices');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [statusFilter, dateFilter]);

  if (loading) {
    return (
      <div className="py-8 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500">No invoices found</p>
      </div>
    );
  }

  return (
     <div className="py-4">
      <div className="overflow-x-auto">
        {/* Set a max height and allow vertical scroll */}
        <div className=" overflow-x-auto">
          <table className="w-full  rounded-md text-sm border-gray-100 border-2">
            <thead className="bg-gray-100 shadow sticky top-0 z-10">
              <tr className="text-[#344054]">
                <th className="px-4 py-2 text-left">Invoice ID</th>
                <th className="px-4 py-2 text-left">Client Name</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">Payment Status</th>
                <th className="px-4 py-2 text-left">Due Date</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-t border-gray-300">
                  <td className="px-4 py-2">{invoice.invoice_number}</td>
                  <td className="px-4 py-2">{invoice.client_name}</td>
                  <td className="px-4 py-2">{formatCurrency(invoice.total_amount, invoice.currency)}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        invoice.status
                      )}`}
                    >
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-2">{formatDate(invoice.due_date)}</td>
                  <td className="px-4 py-2">
                    <Link 
                      to={`/invoice-preview/${invoice.id}`}
                      className="px-3 py-1 border-[#1983D5] border-2 rounded-[12px] text-[#1983D5] text-xs hover:bg-[#1983D5] hover:text-white transition-colors"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTable;
