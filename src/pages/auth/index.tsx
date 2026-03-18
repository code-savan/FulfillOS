import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Box, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { useStore } from '@/store';


export default function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useStore((state) => state.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      const success = login(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid credentials. Use demo@fulfillos.com / password123');
      }
      setIsLoading(false);
    }, 500);
  };

  const fillDemoCredentials = () => {
    setEmail('demo@fulfillos.com');
    setPassword('password123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <nav className="border-b border-black">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 hover:opacity-70 transition-opacity"
          >
            <Box className="w-6 h-6" />
            <span className="text-lg font-semibold tracking-tight">FulfillOS</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Login Panel */}
          <div className="border-2 border-black bg-white">
            <div className="border-b border-black px-6 py-4">
              <h1 className="text-xl font-bold">System Access</h1>
              <p className="text-sm text-gray-500 mt-1">Enter credentials to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex items-start gap-2 p-3 bg-gray-100 border border-black text-sm"
                >
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 text-sm"
                  placeholder="Enter email"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 text-sm pr-12"
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-500" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-3 bg-black text-white hover:bg-gray-800 transition-colors text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    Access System
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Demo Credentials */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 border border-black bg-gray-50"
          >
            <div className="px-4 py-3 border-b border-black bg-gray-100">
              <span className="text-sm font-medium">Demo Credentials</span>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Email:</span>
                <code className="font-mono bg-white px-2 py-1 border border-gray-300">demo@fulfillos.com</code>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Password:</span>
                <code className="font-mono bg-white px-2 py-1 border border-gray-300">password123</code>
              </div>
              <button
                onClick={fillDemoCredentials}
                className="w-full mt-3 px-4 py-2 border border-black hover:bg-black hover:text-white transition-colors text-xs font-medium"
              >
                Auto-fill Demo Credentials
              </button>
            </div>
          </motion.div>

          <p className="mt-6 text-center text-sm text-gray-500">
            <button
              onClick={() => navigate('/')}
              className="hover:underline"
            >
              Return to landing page
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
