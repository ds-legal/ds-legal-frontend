import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Logo from "../../../assets/logo-color.png";
import { verifyEmailToken } from '../../../api/auth_api';

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
    <div className='h-screen w-full flex items-center justify-center bg-gray-100 px-4'>

      {/* ✅ Loading message */}
      {loading && (
        <div className="text-gray-600">Verifying your token...</div>
      )}

      {/* ✅ Success Modal */}
      {!loading && isVerified && (
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
          <img src={Logo} alt="Logo" className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-600 mb-2">Email Verified!</h2>
          <p className="text-gray-700 mb-6">
            Your email has been successfully verified. You can now log in to your account.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-[#1983D5] text-white rounded-full hover:bg-[#1570B5] transition"
          >
            Proceed to Login
          </button>
        </div>
      )}

      {/* ❌ Failure Modal */}
      {!loading && error && (
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
          <img src={Logo} alt="Logo" className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-600 mb-2">Verification Failed</h2>
          <p className="text-gray-700 mb-6">
            The email verification link is invalid or has expired.
          </p>
          <button
            onClick={() => navigate("/resend-verification")}
            className="px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
          >
            Go Back to Verification Page
          </button>
        </div>
      )}

    </div>
  );
};

export default ApproveMail;
