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
    <div className="bg-white shadow-lg rounded-md overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-[#344054]">
              <th className="px-6 py-4 text-left font-medium">Invoice ID</th>
              <th className="px-6 py-4 text-left font-medium">Client Name</th>
              <th className="px-6 py-4 text-left font-medium">Amount</th>
              <th className="px-6 py-4 text-left font-medium">Payment Status</th>
              <th className="px-6 py-4 text-left font-medium">Due Date</th>
              <th className="px-6 py-4 text-left font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{invoice.invoice_number}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{invoice.client_name}</td>
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{formatCurrency(invoice.total_amount, invoice.currency)}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      invoice.status
                    )}`}
                  >
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{formatDate(invoice.due_date)}</td>
                <td className="px-6 py-4">
                  <Link 
                    to={`/invoice-preview/${invoice.id}`}
                    className="px-4 py-2 border-[#1983D5] border-2 rounded-[6px] text-[#1983D5] text-sm font-medium hover:bg-[#1983D5] hover:text-white transition-colors"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden">
        <div className="divide-y divide-gray-200">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{invoice.invoice_number}</h3>
                  <p className="text-sm text-gray-600">{invoice.client_name}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    invoice.status
                  )}`}
                >
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900">{formatCurrency(invoice.total_amount, invoice.currency)}</p>
                  <p className="text-xs text-gray-500">Due: {formatDate(invoice.due_date)}</p>
                </div>
                <Link 
                  to={`/invoice-preview/${invoice.id}`}
                  className="px-4 py-2 border-[#1983D5] border-2 rounded-[6px] text-[#1983D5] text-sm font-medium hover:bg-[#1983D5] hover:text-white transition-colors"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InvoiceTable;
