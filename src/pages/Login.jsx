import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, CreditCard, Phone, ShieldCheck, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CyberInput from '../components/ui/CyberInput';
import NeonButton from '../components/ui/NeonButton';
import toast from 'react-hot-toast';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const codeInputRefs = useRef([]);
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register, verifyRegistration } = useAuth();
  const navigate = useNavigate();

  const startResendTimer = () => {
    setResendTimer(120); // 2 minutes
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleCodeChange = (index, value) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    if (!/^\d*$/.test(value)) return;

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      codeInputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  const handleCodePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newCode = [...verificationCode];
    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i];
    }
    setVerificationCode(newCode);
    if (pastedData.length === 6) {
      codeInputRefs.current[5]?.focus();
    }
  };

  const handleVerifyCode = async () => {
    const code = verificationCode.join('');
    if (code.length !== 6) {
      toast.error('Please enter the complete 6-digit code');
      return;
    }

    setVerificationLoading(true);
    try {
      const result = await verifyRegistration(pendingEmail, code);
      if (result.success) {
        toast.success('Account verified successfully! Please login.');
        setShowVerification(false);
        setIsRegister(false);
        setVerificationCode(['', '', '', '', '', '']);
        // Pre-fill email for login
        setEmailOrUsername(pendingEmail);
      }
    } catch (error) {
      let errorMsg = 'Verification failed';
      if (error.response?.data) {
        errorMsg = typeof error.response.data === 'string' ? error.response.data : error.response.data.message || errorMsg;
      } else if (error.message) {
        errorMsg = error.message;
      }
      toast.error(errorMsg);
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0) return;

    setLoading(true);
    try {
      const result = await register({ name, email: pendingEmail, password, confirmPassword, idNumber, mobileNumber });
      if (result.requiresVerification) {
        toast.success('New verification code sent!');
        startResendTimer();
        setVerificationCode(['', '', '', '', '', '']);
      }
    } catch (error) {
      toast.error('Failed to resend code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegister) {
        if (password !== confirmPassword) {
          toast.error('Passwords do not match');
          setLoading(false);
          return;
        }

        // Show loading toast for registration (email sending takes time)
        const loadingToast = toast.loading('Sending verification email... Please wait.');

        try {
          const result = await register({ name, email, password, confirmPassword, idNumber, mobileNumber });
          toast.dismiss(loadingToast);

          if (result.requiresVerification) {
            setPendingEmail(email);
            setShowVerification(true);
            startResendTimer();
            toast.success('Verification code sent to your email!');
          } else {
            toast.success('Registration successful!');
            navigate('/');
          }
        } catch (regError) {
          toast.dismiss(loadingToast);
          throw regError;
        }
      } else {
        await login({ emailOrUsername, password });
        toast.success('Login successful!');
        navigate('/');
      }
    } catch (error) {
      // Log the full error for debugging
      console.log('Full error object:', error);
      console.log('Error response:', error.response);
      console.log('Error response data:', error.response?.data);
      console.log('Error code:', error.code);

      // Handle different error response formats
      let errorMsg = 'An error occurred';

      // Check for timeout error
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        errorMsg = 'Request timed out. The server is taking too long to respond. Please try again.';
      } else if (error.response?.data) {
        const data = error.response.data;
        if (typeof data === 'string') {
          errorMsg = data;
        } else if (data.message) {
          errorMsg = data.message;
        } else if (data.error) {
          errorMsg = data.error;
        }
      } else if (error.message) {
        errorMsg = error.message;
      }

      console.log('Final error message:', errorMsg);

      toast.error(errorMsg, {
        duration: 4000,
        style: {
          background: '#ef4444',
          color: '#fff',
          padding: '16px',
          borderRadius: '12px',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center p-4 cyber-grid bg-[#FDFBF6] dark:bg-transparent">
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-md"
        >
          <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="text-right">
              <div className="flex items-center justify-end mr-[15px] sm:mr-[25px] md:mr-[35px] gap-0 mb-2">
                <img
                    src="/logo.png"
                    alt="Sameera Rice Logo"
                    className="w-[140px] h-[140px] sm:w-[170px] sm:h-[170px] md:w-[198px] md:h-[198px] lg:w-[200px] lg:h-[210px] object-contain flex-shrink-0"
                />
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-['Brush_Script_MT'] font-normal italic tracking-tight whitespace-nowrap drop-shadow-lg animate-signature-color scale-x-85 scale-y-90 -ml-[50px] sm:-ml-[60px] md:-ml-[69px] mt-[25px] sm:mt-[32px] md:mt-[38px]" style={{ lineHeight: '1.8' }}>
                  ameera Rice
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mr-[75px]">Inventory Management System</p>
            </div>

            {showVerification ? (
                /* Email Verification UI */
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                  {/* Step indicator */}
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">✓</div>
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Register</span>
                    </div>
                    <div className="w-8 h-0.5 bg-emerald-500"></div>
                    <div className="flex items-center gap-1">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">2</div>
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Verify Email</span>
                    </div>
                    <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
                    <div className="flex items-center gap-1">
                      <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 text-gray-500 flex items-center justify-center text-xs font-bold">3</div>
                      <span className="text-xs text-gray-400 font-medium">Login</span>
                    </div>
                  </div>

                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                      <ShieldCheck className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Verify Your Email</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      We've sent a 6-digit verification code to
                    </p>
                    <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full inline-block">{pendingEmail}</p>
                  </div>

                  {/* 6-digit code input boxes */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
                      Enter Verification Code
                    </label>
                    <div className="flex justify-center gap-2 sm:gap-3">
                      {verificationCode.map((digit, index) => (
                          <input
                              key={index}
                              ref={(el) => (codeInputRefs.current[index] = el)}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => handleCodeChange(index, e.target.value)}
                              onKeyDown={(e) => handleCodeKeyDown(index, e)}
                              onPaste={index === 0 ? handleCodePaste : undefined}
                              className="w-11 h-14 sm:w-12 sm:h-14 text-center text-2xl font-bold border-2 rounded-xl
                        bg-white dark:bg-gray-800
                        border-gray-300 dark:border-gray-600
                        focus:border-emerald-500 dark:focus:border-emerald-400
                        focus:ring-4 focus:ring-emerald-500/20
                        text-gray-800 dark:text-white
                        transition-all duration-200 outline-none
                        shadow-sm hover:shadow-md"
                          />
                      ))}
                    </div>
                  </div>

                  {/* Timer and resend */}
                  <div className="text-center py-2">
                    {resendTimer > 0 ? (
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-4 py-2 inline-block">
                          <p className="text-sm text-amber-700 dark:text-amber-400">
                            ⏱️ Code expires in{' '}
                            <span className="font-bold">
                        {Math.floor(resendTimer / 60)}:{(resendTimer % 60).toString().padStart(2, '0')}
                      </span>
                          </p>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={handleResendCode}
                            disabled={loading}
                            className="flex items-center justify-center gap-2 mx-auto px-4 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-lg transition-all"
                        >
                          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                          Resend Verification Code
                        </button>
                    )}
                  </div>

                  {/* Verify button */}
                  <button
                      type="button"
                      onClick={handleVerifyCode}
                      disabled={verificationLoading || verificationCode.join('').length !== 6}
                      className={`w-full py-3 px-4 rounded-xl font-semibold text-white text-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-2
                  ${verificationCode.join('').length === 6
                          ? 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 hover:shadow-xl transform hover:-translate-y-0.5'
                          : 'bg-gray-400 cursor-not-allowed'}`}
                  >
                    {verificationLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Verifying...
                        </>
                    ) : (
                        <>
                          <ShieldCheck className="w-5 h-5" />
                          Verify & Complete Registration
                        </>
                    )}
                  </button>

                  {/* Back to login */}
                  <button
                      type="button"
                      onClick={() => {
                        setShowVerification(false);
                        setIsRegister(false);
                        setVerificationCode(['', '', '', '', '', '']);
                      }}
                      className="w-full py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors flex items-center justify-center gap-1"
                  >
                    ← Back to Login
                  </button>
                </motion.div>
            ) : (
                /* Login/Register Form */
                <>
                  {/* Tab Switcher */}
                  <div className="flex bg-gray-100 dark:bg-gray-800/50 rounded-xl p-1 mb-4">
                    <button
                        type="button"
                        onClick={() => setIsRegister(false)}
                        className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
                            !isRegister
                                ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-md'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                    >
                      🔐 Login
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsRegister(true)}
                        className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
                            isRegister
                                ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-md'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                    >
                      ✨ Register
                    </button>
                  </div>

                  {/* Title based on mode */}
                  <div className="text-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {isRegister ? 'Create Your Account' : 'Welcome Back!'}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {isRegister ? 'Fill in your details to get started' : 'Enter your credentials to continue'}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {isRegister && (
                        <CyberInput
                            label="Full Name"
                            type="text"
                            icon={User}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your full name"
                            required
                        />
                    )}

                    {isRegister && (
                        <CyberInput
                            label="NIC / ID Number"
                            type="text"
                            icon={CreditCard}
                            value={idNumber}
                            onChange={(e) => setIdNumber(e.target.value)}
                            placeholder="Enter your NIC number"
                            required
                        />
                    )}

                    {isRegister && (
                        <CyberInput
                            label="Mobile Number"
                            type="tel"
                            icon={Phone}
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value)}
                            placeholder="07X XXX XXXX"
                            required
                        />
                    )}

                    <CyberInput
                        label={isRegister ? "Email Address" : "Username"}
                        type={isRegister ? "email" : "text"}
                        icon={Mail}
                        value={isRegister ? email : emailOrUsername}
                        onChange={(e) => isRegister ? setEmail(e.target.value) : setEmailOrUsername(e.target.value)}
                        placeholder={isRegister ? "you@example.com" : "Enter username"}
                        required
                    />

                    <CyberInput
                        label="Password"
                        type="password"
                        icon={Lock}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                    />

                    {isRegister && (
                        <CyberInput
                            label="Confirm Password"
                            type="password"
                            icon={Lock}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter your password"
                            required
                        />
                    )}

                    {/* Main Action Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3.5 px-4 rounded-xl font-semibold text-white text-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-2
                    ${loading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : isRegister
                                ? 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 hover:shadow-xl transform hover:-translate-y-0.5'
                                : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 hover:shadow-xl transform hover:-translate-y-0.5'
                        }`}
                    >
                      {loading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            {isRegister ? 'Sending Verification Email...' : 'Logging in...'}
                          </>
                      ) : (
                          <>
                            {isRegister ? (
                                <>
                                  <Mail className="w-5 h-5" />
                                  Register & Send Verification Email
                                </>
                            ) : (
                                <>
                                  <Lock className="w-5 h-5" />
                                  Login to Dashboard
                                </>
                            )}
                          </>
                      )}
                    </button>

                    {/* Info text for registration */}
                    {isRegister && (
                        <p className="text-xs text-center text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg px-3 py-2">
                          📧 A verification code will be sent to your email address
                        </p>
                    )}
                  </form>

                  {/* Switch mode link */}
                  <div className="text-center pt-2 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {isRegister ? (
                          <>
                            Already have an account?{' '}
                            <button
                                type="button"
                                onClick={() => setIsRegister(false)}
                                className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              Login here
                            </button>
                          </>
                      ) : (
                          <>
                            Don't have an account?{' '}
                            <button
                                type="button"
                                onClick={() => setIsRegister(true)}
                                className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                            >
                              Register now
                            </button>
                          </>
                      )}
                    </p>
                  </div>
                </>
            )}
          </div>
        </motion.div>
      </div>
  );
};

export default Login;
