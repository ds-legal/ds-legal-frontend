import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MdArrowBackIosNew } from "react-icons/md";
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import Nav from '../../components/ui/Nav';
import toast from 'react-hot-toast';
import { getFirmSettings, updateFirmSettings } from '../../api/firm_api';

const FirmInfo = () => {
  const navigate = useNavigate();
  const [showDays, setShowDays] = useState(false);
  const [selectedDay, setSelectedDay] = useState(1);
  const [authorized, setAuthorized] = useState(true);
  const [reminderType, setReminderType] = useState('both');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    firm_name: '',
    firm_email: '',
    firm_address: '',
    firm_state: '',
    firm_postal_code: '',
    firm_phone: '',
    firm_logo_url: '',
    business_description: '',
    default_currency: 'USD',
    default_vat_rate: 0,
    invoice_number_prefix: 'DS',
    reminder_preference_email: true,
    reminder_preference_app: true,
    reminder_days_before: 1
  });

  const reminderTypes = [
    { id: 'email', label: 'Email' },
    { id: 'application', label: 'Application' },
    { id: 'both', label: 'Both' }
  ];

  const currencies = [
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'GBP', label: 'GBP - British Pound' },
    { value: 'NGN', label: 'NGN - Nigerian Naira' },
    { value: 'CAD', label: 'CAD - Canadian Dollar' },
    { value: 'AUD', label: 'AUD - Australian Dollar' }
  ];

  // Fetch firm settings on component mount
  useEffect(() => {
    const fetchFirmSettings = async () => {
      try {
        setInitialLoading(true);
        const response = await getFirmSettings();
        
        if (response?.success && response?.data) {
          const firmData = response.data;
          setFormData({
            firm_name: firmData.firm_name || '',
            firm_email: firmData.firm_email || '',
            firm_address: firmData.firm_address || '',
            firm_state: firmData.firm_state || '',
            firm_postal_code: firmData.firm_postal_code || '',
            firm_phone: firmData.firm_phone || '',
            firm_logo_url: firmData.firm_logo_url || '',
            business_description: firmData.business_description || '',
            default_currency: firmData.default_currency || 'USD',
            default_vat_rate: firmData.default_vat_rate || 0,
            invoice_number_prefix: firmData.invoice_number_prefix || 'DS',
            reminder_preference_email: firmData.reminder_preference_email ?? true,
            reminder_preference_app: firmData.reminder_preference_app ?? true,
            reminder_days_before: firmData.reminder_days_before || 1
          });
          
          // Update reminder type based on preferences
          if (firmData.reminder_preference_email && firmData.reminder_preference_app) {
            setReminderType('both');
          } else if (firmData.reminder_preference_email) {
            setReminderType('email');
          } else if (firmData.reminder_preference_app) {
            setReminderType('application');
          }
          
          setSelectedDay(firmData.reminder_days_before || 1);
        }
      } catch (error) {
        console.error('Error fetching firm settings:', error);
        toast.error('Failed to load firm settings');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchFirmSettings();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSelectDay = (day) => {
    setSelectedDay(day);
    setShowDays(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.firm_name.trim()) {
      toast.error('Firm name is required');
      return;
    }
    if (!formData.firm_email.trim()) {
      toast.error('Email is required');
      return;
    }
    if (!formData.firm_address.trim()) {
      toast.error('Address is required');
      return;
    }

    setLoading(true);
    
    try {
      // Prepare data for API
      const apiData = {
        ...formData,
        reminder_preference_email: reminderType === 'email' || reminderType === 'both',
        reminder_preference_app: reminderType === 'application' || reminderType === 'both',
        reminder_days_before: selectedDay
      };
      
      const response = await updateFirmSettings(apiData);
      
      if (response?.success) {
        // Store firm info in localStorage for invoice creation
        localStorage.setItem('firmInfo', JSON.stringify({
          ...formData,
          authorized,
          reminderType,
          reminderDays: selectedDay
        }));
        
        toast.success('Firm information saved successfully!');
        navigate('/createInvoice');
      } else {
        throw new Error(response?.message || 'Failed to save firm settings');
      }
    } catch (error) {
      console.error('Error saving firm settings:', error);
      toast.error(error.message || 'Failed to save firm information');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <>
        <Nav />
        <div className='lg:w-[80%] w-[90%] mx-auto my-10'>
          <div className='flex justify-center items-center h-64'>
            <div className='text-lg'>Loading firm information...</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Nav />
      <div className='lg:w-[80%] w-[90%] mx-auto my-10'>
        {/* Header with Back button and Create Invoice button */}
        <div className='flex justify-between items-center mb-6'>
          <Link to="/invoices" className='flex items-center gap-1 text-[14px] text-[#667185] font-[500]'>
            <MdArrowBackIosNew className='text-[15px]' />
            <h3>Back</h3>
          </Link>
        </div>

        {/* Main Form Container */}
        <div className='bg-white shadow-lg lg:w-[70%] w-full mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10 rounded-md'>
          <h2 className='text-[24px] font-[600] mb-2 text-[#212121]'>Firm Information</h2>
          <hr className='mb-6 bg-[#E9E9E9]' />
          <form onSubmit={handleSubmit} className='space-y-6'>

            {/* Firm Name */}
            <div>
              <h4 className='text-[14px] mb-2 font-[500] text-[#101928]'>Firm's name</h4>
              <input 
                type='text' 
                value={formData.firm_name}
                onChange={(e) => handleInputChange('firm_name', e.target.value)}
                className='w-full rounded-[6px] px-4 border-[#D0D5DD] py-4 border-2' 
              />
            </div>

            {/* Email */}
            <div>
              <h4 className='text-[14px] mb-2 font-[500] text-[#101928]'>Email</h4>
              <input 
                type='email' 
                value={formData.firm_email}
                onChange={(e) => handleInputChange('firm_email', e.target.value)}
                className='w-full rounded-[6px] px-4 border-[#D0D5DD] py-4 border-2' 
              />
            </div>

            {/* Address */}
            <div>
              <h4 className='text-[14px] mb-2 font-[500] text-[#101928]'>Address</h4>
              <input 
                type='text' 
                value={formData.firm_address}
                onChange={(e) => handleInputChange('firm_address', e.target.value)}
                className='w-full rounded-[6px] px-4 border-[#D0D5DD] py-4 border-2' 
              />
            </div>

            {/* State and Postal Code */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div>
                <h4 className='text-[14px] mb-2 font-[500] text-[#101928]'>State</h4>
                <input 
                  type='text' 
                  value={formData.firm_state}
                  onChange={(e) => handleInputChange('firm_state', e.target.value)}
                  className='w-full rounded-[6px] px-4 border-[#D0D5DD] py-4 border-2' 
                />
              </div>
              <div>
                <h4 className='text-[14px] mb-2 font-[500] text-[#101928]'>Postal code</h4>
                <input 
                  type='text' 
                  value={formData.firm_postal_code}
                  onChange={(e) => handleInputChange('firm_postal_code', e.target.value)}
                  className='w-full rounded-[6px] px-4 border-[#D0D5DD] py-4 border-2' 
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <h4 className='text-[14px] mb-2 font-[500] text-[#101928]'>Phone number</h4>
              <input 
                type='tel' 
                value={formData.firm_phone}
                onChange={(e) => handleInputChange('firm_phone', e.target.value)}
                className='w-full rounded-[6px] px-4 border-[#D0D5DD] py-4 border-2' 
              />
            </div>

            {/* Business Description */}
            <div>
              <h4 className='text-[14px] mb-2 font-[500] text-[#101928]'>Business Description</h4>
              <textarea 
                value={formData.business_description}
                onChange={(e) => handleInputChange('business_description', e.target.value)}
                rows={3}
                className='w-full rounded-[6px] px-4 border-[#D0D5DD] py-4 border-2' 
                placeholder='Describe your business...'
              />
            </div>

            {/* Currency and VAT Rate */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div>
                <h4 className='text-[14px] mb-2 font-[500] text-[#101928]'>Default Currency</h4>
                <select 
                  value={formData.default_currency}
                  onChange={(e) => handleInputChange('default_currency', e.target.value)}
                  className='w-full px-4 border-[#D0D5DD] py-4 border-2 rounded-[6px]'
                >
                  {currencies.map(currency => (
                    <option key={currency.value} value={currency.value}>
                      {currency.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <h4 className='text-[14px] mb-2 font-[500] text-[#101928]'>Default VAT Rate (%)</h4>
                <input 
                  type='number' 
                  value={formData.default_vat_rate}
                  onChange={(e) => handleInputChange('default_vat_rate', parseFloat(e.target.value) || 0)}
                  min='0'
                  max='100'
                  step='0.1'
                  className='w-full rounded-[6px] px-4 border-[#D0D5DD] py-4 border-2' 
                />
              </div>
            </div>

            {/* Invoice Number Prefix */}
            <div>
              <h4 className='text-[14px] mb-2 font-[500] text-[#101928]'>Invoice Number Prefix</h4>
              <input 
                type='text' 
                value={formData.invoice_number_prefix}
                onChange={(e) => handleInputChange('invoice_number_prefix', e.target.value)}
                className='w-full rounded-[6px] px-4 border-[#D0D5DD] py-4 border-2' 
                placeholder='e.g., DS, INV, etc.'
              />
            </div>

            {/* Reminder Section */}
            <div className='space-y-4'>
              <h3 className='text-[#101928] text-[16px] font-[500]'>Reminder</h3>
              
              {/* Reminder Type */}
              <div>
                <h4 className='text-[14px] mb-2 font-[500] text-[#101928]'>Reminder Type</h4>
                <div className='flex flex-wrap gap-2'>
                  {reminderTypes.map((type) => (
                    <button
                      key={type.id}
                      type='button'
                      onClick={() => setReminderType(type.id)}
                      className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        reminderType === type.id
                          ? 'bg-gray-200 text-[#101928] border-2 border-gray-300'
                          : 'bg-white text-[#667185] border-2 border-[#D0D5DD] hover:border-gray-300'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reminder Timing */}
              <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4'>
                <span className='text-[#101928] text-[14px] font-[500]'>Before</span>
                <div className='flex items-center gap-2'>
                  <input 
                    type='number' 
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(parseInt(e.target.value) || 1)}
                    min='1'
                    max='31'
                    className='w-16 rounded-[6px] px-2 border-[#D0D5DD] py-2 border-2 text-center'
                  />
                  <div className='relative'>
                    <button
                      type='button'
                      onClick={() => setShowDays(!showDays)}
                      className='rounded-[6px] px-3 py-2 border-[#D0D5DD] border-2 text-sm flex items-center gap-1'
                    >
                      Days
                      {showDays ? <FiChevronUp className='text-xs' /> : <FiChevronDown className='text-xs' />}
                    </button>
                    {showDays && (
                      <div className='absolute z-10 bg-white border-2 border-[#D0D5DD] mt-1 w-full max-h-40 overflow-y-auto rounded-md shadow-lg'>
                        {Array.from({ length: 31 }, (_, i) => (
                          <button
                            key={i}
                            type='button'
                            className='w-full text-left px-3 py-2 hover:bg-gray-100 text-sm'
                            onClick={() => handleSelectDay(i + 1)}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Next Button */}
            <div className="flex justify-center">
              <button 
                type='submit'
                disabled={loading}
                className="w-full sm:w-auto bg-[#1983D5] text-white px-8 py-4 font-medium hover:bg-[#156bb2] transition-all duration-200 text-[14px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 rounded-[6px]"
              >
                {loading ? 'Saving...' : 'Next'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default FirmInfo
