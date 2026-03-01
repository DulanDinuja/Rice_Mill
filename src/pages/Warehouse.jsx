import { useState, useEffect } from 'react';
import GlassCard from '../components/ui/GlassCard';
import { warehouseService } from '../services/warehouseService';
import { Thermometer, Droplets } from 'lucide-react';

const Warehouse = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWarehouses();
  }, []);

  const loadWarehouses = async () => {
    try {
      const response = await warehouseService.getWarehouseStats();
      setWarehouses(response.data || []);
    } catch (error) {
      console.error('Failed to load warehouses:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-gaming font-bold text-gray-900 dark:text-white mb-1 md:mb-2">Warehouses</h1>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">Monitor warehouse capacity and conditions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {loading ? (
          <p className="text-gray-600 dark:text-gray-400">Loading warehouses...</p>
        ) : warehouses.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No warehouses found</p>
        ) : (
          warehouses.map((warehouse, index) => (
            <GlassCard key={index}>
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Warehouse {warehouse.warehouse}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#2E7D32] dark:text-primary-400">
                      {warehouse.capacityPercentage}%
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Capacity</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Current Stock</span>
                    <span className="text-gray-900 dark:text-white font-medium">{warehouse.currentStock} kg</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-dark-surface rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-[#2E7D32] to-[#F9A825] dark:from-primary-500 dark:to-accent-500 h-2 rounded-full transition-all"
                      style={{ width: `${warehouse.capacityPercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Total Capacity</span>
                    <span className="text-gray-900 dark:text-white font-medium">{warehouse.totalCapacity} kg</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <Thermometer className="text-[#F9A825] dark:text-accent-400" size={20} />
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Temperature</p>
                      <p className="text-gray-900 dark:text-white font-medium">{warehouse.temperature}°C</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="text-[#F9A825] dark:text-accent-400" size={20} />
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Humidity</p>
                      <p className="text-gray-900 dark:text-white font-medium">{warehouse.humidity}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
};

export default Warehouse;
