import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UseAuth } from '../../store/auth.context';
import toast from 'react-hot-toast';
import LogoColor from '../../components/common/LogoColor';

function GoogleCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { handleGoogleCallback } = UseAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const hasProcessedRef = useRef(false);

    useEffect(() => {
        const handleCallback = async () => {
            // Prevent multiple executions
            if (hasProcessedRef.current) {
                console.log('Callback already processed, skipping...');
                return;
            }
            
            hasProcessedRef.current = true;
            try {
                // Get search params from current URL
                const urlParams = new URLSearchParams(window.location.search);
                const code = urlParams.get('code');
                const state = urlParams.get('state');
                const error = urlParams.get('error');

                if (error) {
                    setError('Google authentication was cancelled or failed');
                    setIsLoading(false);
                    return;
                }

                if (!code) {
                    setError('No authorization code received from Google');
                    setIsLoading(false);
                    return;
                }

                // Verify state parameter for security (with fallback for development)
                const storedState = sessionStorage.getItem('google_oauth_state');
                if (storedState && state !== storedState) {
                    console.warn('State parameter mismatch:', { received: state, stored: storedState });
                    // In development, be more lenient with state validation
                    if (window.location.hostname === 'localhost') {
                        console.log('Development mode: Allowing state mismatch');
                    } else {
                        setError('Invalid state parameter - possible CSRF attack');
                        setIsLoading(false);
                        return;
                    }
                }

                // Clear the stored state (only if we have a state to clear)
                if (storedState) {
                    sessionStorage.removeItem('google_oauth_state');
                }

                const response = await handleGoogleCallback(code, state);
                
                if (response.status_code === 200) {
                    toast.success('Successfully signed in with Google!');
                    
                    // Small delay to ensure auth context is updated before navigation
                    setTimeout(() => {
                        navigate('/dashboard');
                    }, 100);
                } else {
                    setError(response.detail || 'Failed to authenticate with Google');
                }
            } catch (error) {
                console.error('Google callback error:', error);
                setError(error.message || 'Failed to complete Google authentication');
            } finally {
                setIsLoading(false);
            }
        };

        handleCallback();
    }, []); // Empty dependency array to run only once

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <LogoColor />
                    <div className="mt-6">
                        <div className="spinner border-blue-600 mx-auto"></div>
                    </div>
                    <p className="mt-4 text-gray-600">Completing Google authentication...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center max-w-md mx-auto p-6">
                    <LogoColor />
                    <div className="mt-6">
                        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Failed</h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Back to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}

export default GoogleCallback;
