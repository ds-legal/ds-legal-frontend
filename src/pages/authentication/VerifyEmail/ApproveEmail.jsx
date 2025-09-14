import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyEmailToken } from '../../../api/auth_api';
import LogoColor from '../../../components/common/LogoColor';

const ApproveMail = () => {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryToken = params.get('token');

    if (queryToken) {
      setToken(queryToken);

      const verifyToken = async () => {
        try {
          const res = await verifyEmailToken(queryToken);
          if (res.status_code === 200) {
            setIsVerified(true);
          } else {
            setError(true);
          }
        } catch (err) {
          setError(true);
        } finally {
          setLoading(false);
        }
      };

      verifyToken();
    } else {
      setLoading(false);
    }
  }, [location.search]);

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4 py-4 sm:py-8'>
      {/* Loading message */}
      {loading && (
        <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-sm border text-center max-w-sm sm:max-w-md w-full">
          <div className="text-gray-600 text-sm sm:text-base">Verifying your token...</div>
        </div>
      )}

      {/* Success Modal */}
      {!loading && isVerified && (
        <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-sm border text-center max-w-sm sm:max-w-md w-full">
          <div className="flex justify-center mb-4 sm:mb-6 auth-logo">
            <LogoColor />
          </div>
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-2">Password successfully reset</h2>
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-blue-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-blue-700 transition mt-4 sm:mt-6 text-sm sm:text-base"
          >
            Continue
          </button>
        </div>
      )}

      {/* Failure Modal */}
      {!loading && error && (
        <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-sm border text-center max-w-sm sm:max-w-md w-full">
          <div className="flex justify-center mb-4 sm:mb-6 auth-logo">
            <LogoColor />
          </div>
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-500 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-2">Verification Failed</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
            The email verification link is invalid or has expired.
          </p>
          <button
            onClick={() => navigate("/verifyEmail")}
            className="w-full bg-red-500 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-red-600 transition text-sm sm:text-base"
          >
            Go Back to Verification Page
          </button>
        </div>
      )}
    </div>
  );
};

export default ApproveMail;
