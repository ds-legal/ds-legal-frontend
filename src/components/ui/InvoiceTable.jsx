import React from 'react';

const invoices = [
  {
    id: 'INV001',
    clientName: 'John Doe',
    amount: '$1,000',
    paymentStatus: 'Overdue',
    dueDate: '2025-05-20',
  },
  {
    id: 'INV002',
    clientName: 'Jane Smith',
    amount: '$500',
    paymentStatus: 'Paid',
    dueDate: '2025-05-10',
  },
  {
    id: 'INV003',
    clientName: 'Alice Johnson',
    amount: '$750',
    paymentStatus: 'Upcoming',
    dueDate: '2025-05-30',
  },
  {
    id: 'INV003',
    clientName: 'Alice Johnson',
    amount: '$750',
    paymentStatus: 'Upcoming',
    dueDate: '2025-05-30',
  },
  {
    id: 'INV004',
    clientName: 'Michael Lee',
    amount: '$2,300',
    paymentStatus: 'Paid',
    dueDate: '2025-05-05',
  },
  {
    id: 'INV005',
    clientName: 'Linda White',
    amount: '$1,200',
    paymentStatus: 'Overdue',
    dueDate: '2025-05-15',
  },
  {
    id: 'INV006',
    clientName: 'David Kim',
    amount: '$980',
    paymentStatus: 'Upcoming',
    dueDate: '2025-06-01',
  },
  {
    id: 'INV007',
    clientName: 'Emma Brown',
    amount: '$3,400',
    paymentStatus: 'Paid',
    dueDate: '2025-05-08',
  },
  {
    id: 'INV008',
    clientName: 'Daniel Green',
    amount: '$660',
    paymentStatus: 'Overdue',
    dueDate: '2025-05-18',
  },
  {
    id: 'INV009',
    clientName: 'Sophia Turner',
    amount: '$890',
    paymentStatus: 'Upcoming',
    dueDate: '2025-06-05',
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case 'Overdue':
      return 'bg-[#FFECE5] text-[#AD3307]';
    case 'Paid':
      return 'bg-[#E7F6EC] text-[#036B48]';
    case 'Upcoming':
      return 'bg-[#E4E7EC] text-black';
    default:
      return 'bg-gray-300 text-black';
  }
};

const InvoiceTable = () => {
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
                  <td className="px-4 py-2">{invoice.id}</td>
                  <td className="px-4 py-2">{invoice.clientName}</td>
                  <td className="px-4 py-2">{invoice.amount}</td>
                  <td className="px-4 py-2">
                    <button
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        invoice.paymentStatus
                      )}`}
                    >
                      {invoice.paymentStatus}
                    </button>
                  </td>
                  <td className="px-4 py-2">{invoice.dueDate}</td>
                  <td className="px-4 py-2">
                    <button className="px-3 py-1 border-[#1983D5] border-2 rounded-[12px] text-[#1983D5] text-xs">
                      View
                    </button>
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
