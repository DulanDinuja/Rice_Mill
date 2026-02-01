import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, CreditCard, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CyberInput from '../components/ui/CyberInput';
import NeonButton from '../components/ui/NeonButton';
import toast from 'react-hot-toast';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

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
        await register({ name, email, password, idNumber, mobileNumber });
        toast.success('Registration successful!');
      } else {
        await login({ emailOrUsername, password });
        toast.success('Login successful!');
      }
      navigate('/');
    } catch (error) {
      toast.error(isRegister ? 'Registration failed. Please try again.' : 'Login failed. Please try again.');
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

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <CyberInput
                label="Name"
                type="text"
                icon={User}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                required
              />
            )}

            {isRegister && (
              <CyberInput
                label="ID Number"
                type="text"
                icon={CreditCard}
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                placeholder="Your ID Number"
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
                placeholder="+94 XX XXX XXXX"
                required
              />
            )}

            <CyberInput
              label={isRegister ? "Email" : "Username or Email"}
              type={isRegister ? "email" : "text"}
              icon={Mail}
              value={isRegister ? email : emailOrUsername}
              onChange={(e) => isRegister ? setEmail(e.target.value) : setEmailOrUsername(e.target.value)}
              placeholder={isRegister ? "your.email@example.com" : "Username or Email"}
              required
            />

            <CyberInput
              label="Password"
              type="password"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            {isRegister && (
              <CyberInput
                label="Confirm Password"
                type="password"
                icon={Lock}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            )}

            <NeonButton
              type="submit"
              loading={loading}
              className="w-full"
            >
              {isRegister ? 'Register' : 'Login'}
            </NeonButton>
          </form>

          <div className="text-center space-y-2">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            >
              {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
            </button>
            {!isRegister && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Demo: admin / any password
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
