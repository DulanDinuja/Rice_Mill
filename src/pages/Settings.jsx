import GlassCard from '../components/ui/GlassCard';
import NeonButton from '../components/ui/NeonButton';
import { useTheme } from '../context/ThemeContext';

const Settings = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-gaming font-bold text-white dark:text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-400 dark:text-gray-600">Configure your system preferences</p>
      </div>

      <GlassCard>
        <h3 className="text-xl font-semibold text-white dark:text-gray-900 mb-6">General Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-white/10 dark:border-gray-300">
            <div>
              <p className="text-white dark:text-gray-900 font-medium">Dark Mode</p>
              <p className="text-sm text-gray-400 dark:text-gray-600">Enable dark theme</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={isDark}
                onChange={toggleTheme}
              />
              <div className="w-11 h-6 bg-gray-700 dark:bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-gray-700 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
            </label>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-white/10">
            <div>
              <p className="text-white font-medium">Notifications</p>
              <p className="text-sm text-gray-400">Enable push notifications</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
            </label>
          </div>
        </div>
        <div className="mt-6">
          <NeonButton>Save Changes</NeonButton>
        </div>
      </GlassCard>
    </div>
  );
};

export default Settings;
