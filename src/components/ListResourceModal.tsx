import React, { useState } from 'react';
import { X, Info, ArrowRight } from 'lucide-react';
import { ResourceCategory } from '../types/resource';

interface ListResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ListResourceModal: React.FC<ListResourceModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    institution: '',
    department: '',
    title: '',
    category: 'scientific-instruments' as ResourceCategory,
    hourlyRate: '',
    contactEmail: '',
    hasOperator: true,
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-forest-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-ivory-50 border border-ivory-300 w-full max-w-xl rounded shadow-modal overflow-hidden relative my-auto p-5 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-ivory-300">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-forest-800 block">
              Asset Onboarding
            </span>
            <h3 className="text-lg font-bold text-forest-950">
              List an Institutional Resource
            </h3>
          </div>
          <button 
            onClick={handleResetAndClose} 
            className="p-1 text-charcoal-400 hover:text-charcoal-800"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="mb-4 p-3 bg-ivory-100 border border-ivory-300 rounded text-xs text-charcoal-700">
          <strong>Demo only:</strong> This intake form is not connected. Submitting displays a preview only; nothing is sent, saved, or reviewed.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-charcoal-700 font-semibold mb-1">
                Host Institution or University
              </label>
              <input
                type="text"
                required
                placeholder="e.g. IIT Bombay"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-ivory-300 rounded focus:border-forest-700 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-charcoal-700 font-semibold mb-1">
                  Department / Core Facility
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Central Instrumentation Facility"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-ivory-300 rounded focus:border-forest-700 outline-none"
                />
              </div>

              <div>
                <label className="block text-charcoal-700 font-semibold mb-1">
                  Equipment Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as ResourceCategory })}
                  className="w-full px-3 py-2 bg-white border border-ivory-300 rounded focus:border-forest-700 outline-none"
                >
                  <option value="scientific-instruments">Scientific Instruments</option>
                  <option value="fabrication-prototyping">Precision Fabrication</option>
                  <option value="specialized-spaces">Specialized Spaces & Cleanrooms</option>
                  <option value="heavy-computing">High-Density Compute</option>
                  <option value="media-broadcasting">Media & Soundstages</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-charcoal-700 font-semibold mb-1">
                Equipment Model / Facility Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. DSLR camera or projector"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-ivory-300 rounded focus:border-forest-700 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-charcoal-700 font-semibold mb-1">
                  Target Hourly Rate (₹ INR)
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 850"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-ivory-300 rounded focus:border-forest-700 outline-none"
                />
              </div>

              <div>
                <label className="block text-charcoal-700 font-semibold mb-1">
                  Coordinator Email (.edu or org)
                </label>
                <input
                  type="email"
                  required
                  placeholder="facility.coordinator@institute.ac.in"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-ivory-300 rounded focus:border-forest-700 outline-none"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 p-2.5 bg-ivory-100 rounded border border-ivory-300 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.hasOperator}
                onChange={(e) => setFormData({ ...formData, hasOperator: e.target.checked })}
                className="rounded accent-forest-800"
              />
              <span className="text-charcoal-800 font-medium">
                Operator assistance indicated (not independently verified)
              </span>
            </label>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 bg-forest-900 text-ivory-50 font-bold rounded hover:bg-forest-800 transition-colors flex items-center justify-center gap-2"
              >
                <span>Preview Listing (Not Saved)</span>
                <ArrowRight className="w-3.5 h-3.5 text-accent-lime" />
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-6 space-y-3">
            <div className="w-10 h-10 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center mx-auto">
              <Info className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-forest-950">
              Listing Preview — Nothing Saved
            </h4>
            <p className="text-xs text-charcoal-600 leading-relaxed max-w-sm mx-auto">
              This is a local preview of <strong>{formData.title}</strong> only. Nothing was sent or saved, and no compliance review or verification follow-up is configured.
            </p>
            <button
              onClick={handleResetAndClose}
              className="mt-4 px-4 py-2 bg-forest-900 text-ivory-50 rounded text-xs font-semibold"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
