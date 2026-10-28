import React, { useState } from 'react';
import { MapPin, X, Check } from 'lucide-react';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: string;
  onSelectLocation: (loc: string) => void;
}

const POPULAR_LOCATIONS = [
  'Tiruchirappalli, Tamil Nadu (620019)',
  'Chennai, Tamil Nadu (600001)',
  'Coimbatore, Tamil Nadu (641001)',
  'Madurai, Tamil Nadu (625001)',
  'Salem, Tamil Nadu (636001)',
  'Erode, Tamil Nadu (638001)',
  'Bengaluru, Karnataka (560001)',
  'Hyderabad, Telangana (500001)',
];

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  onSelectLocation,
}) => {
  const [customInput, setCustomInput] = useState('');

  if (!isOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      onSelectLocation(customInput.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-cream-300">
        <div className="bg-forest-900 text-cream-100 p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-white">Choose Delivery Location</h3>
              <p className="text-xs text-cream-300">Select your city for fastest dispatch</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-cream-400 hover:text-white hover:bg-forest-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          <form onSubmit={handleCustomSubmit} className="mb-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Enter Pincode or City
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. 620019 or Tiruchirappalli"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-forest-600 text-sm"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-forest-800 hover:bg-forest-900 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                Apply
              </button>
            </div>
          </form>

          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Popular Hubs
          </p>
          <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
            {POPULAR_LOCATIONS.map((loc) => {
              const isSelected = currentLocation === loc;
              return (
                <button
                  key={loc}
                  onClick={() => {
                    onSelectLocation(loc);
                    onClose();
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-forest-100 text-forest-900 font-semibold border border-forest-300'
                      : 'hover:bg-cream-100 text-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <MapPin className={`w-4 h-4 ${isSelected ? 'text-forest-700' : 'text-slate-400'}`} />
                    {loc}
                  </span>
                  {isSelected && <Check className="w-4 h-4 text-forest-700" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
