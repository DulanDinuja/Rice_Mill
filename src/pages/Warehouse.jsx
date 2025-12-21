import { useState, useEffect } from 'react';
import GlassCard from '../components/ui/GlassCard';
import { mockWarehouses } from '../services/mock/stockData';
import { Thermometer, Droplets } from 'lucide-react';

const Warehouse = () => {
  const [warehouses, setWarehouses] = useState([]);

  useEffect(() => {
    setWarehouses(mockWarehouses);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-gaming font-bold text-white mb-2">Warehouses</h1>
        <p className="text-gray-400">Monitor warehouse capacity and conditions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {warehouses.map((warehouse) => (
          <GlassCard key={warehouse.id}>
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white">{warehouse.name}</h3>
                  <p className="text-gray-400 text-sm">{warehouse.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary-400">
                    {Math.round((warehouse.currentStock / warehouse.capacity) * 100)}%
                  </p>
                  <p className="text-xs text-gray-400">Capacity</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Current Stock</span>
                  <span className="text-white font-medium">{warehouse.currentStock} kg</span>
                </div>
                <div className="w-full bg-dark-surface rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all"
                    style={{ width: `${(warehouse.currentStock / warehouse.capacity) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Capacity</span>
                  <span className="text-white font-medium">{warehouse.capacity} kg</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <Thermometer className="text-accent-400" size={20} />
                  <div>
                    <p className="text-xs text-gray-400">Temperature</p>
                    <p className="text-white font-medium">{warehouse.temperature}°C</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Droplets className="text-accent-400" size={20} />
                  <div>
                    <p className="text-xs text-gray-400">Humidity</p>
                    <p className="text-white font-medium">{warehouse.humidity}%</p>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default Warehouse;
