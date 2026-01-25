import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CyberInput from '../components/ui/CyberInput';
import NeonButton from '../components/ui/NeonButton';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login({ email, password });
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 cyber-grid bg-[#FDFBF6] dark:bg-transparent">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="glass-card rounded-2xl p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-gaming font-bold holographic-text mb-2">
              SAMEERA RICE
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Inventory Management System</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <CyberInput
              label="Email"
              type="email"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@sameera.com"
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

            <NeonButton
              type="submit"
              loading={loading}
              className="w-full"
            >
              Login
            </NeonButton>
          </form>

          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            Demo: admin@sameera.com / any password
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
