import React, { useState } from 'react';
import { X, Save, Trash2, AlertTriangle, CheckCircle2, ToggleLeft, ToggleRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ResourceItem, ResourceCategory, ApprovalRequirement } from '../../types/resource';

interface EditResourceModalProps {
  resource: ResourceItem;
  onClose: () => void;
  onSaved: () => void;
}

export const EditResourceModal: React.FC<EditResourceModalProps> = ({
  resource,
  onClose,
  onSaved,
}) => {
  const { editResource, toggleResourceActive, deleteResource } = useAuth();

  const [title, setTitle] = useState(resource.title);
  const [category, setCategory] = useState<ResourceCategory>(resource.category);
  const [description, setDescription] = useState(resource.description);
  const [hourlyRate, setHourlyRate] = useState(resource.pricing.hourlyRate || 0);
  const [dailyRate, setDailyRate] = useState(resource.pricing.dailyRate || 0);
  const [building, setBuilding] = useState(resource.location.building);
  const [room, setRoom] = useState(resource.location.room || '');
  const [imageUrl, setImageUrl] = useState(resource.image);
  const [isActive, setIsActive] = useState(resource.active !== false);
  const [operatorAssistance, setOperatorAssistance] = useState(resource.operatorAssistance);
  const [approvalReq, setApprovalReq] = useState<ApprovalRequirement>(resource.approvalRequirement);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const ok = await editResource(resource.id, {
      title,
      category,
      categoryLabel: category.replace(/-/g, ' ').toUpperCase(),
      description,
      image: imageUrl,
      images: [imageUrl],
      pricing: {
        ...resource.pricing,
        hourlyRate: Number(hourlyRate),
        dailyRate: Number(dailyRate) || undefined,
        currency: '₹',
      },
      location: {
        ...resource.location,
        building,
        room,
      },
      operatorAssistance,
      approvalRequirement: approvalReq,
      approvalLabel:
        approvalReq === 'instant'
          ? 'Instant Access'
          : approvalReq === 'host-approval'
          ? 'Host Approval Required'
          : 'Departmental Sign-Off Required',
    });
    setSaving(false);
    if (ok) {
      setSaved(true);
      setTimeout(() => { setSaved(false); onSaved(); }, 1500);
    } else {
      setError('Failed to save changes. Please try again.');
    }
  };

  const handleToggleActive = async () => {
    const next = !isActive;
    setIsActive(next);
    await toggleResourceActive(resource.id, next);
  };

  const handleDelete = async () => {
    setDeleting(true);
    const result = await deleteResource(resource.id);
    setDeleting(false);
    if (result.success) {
      onSaved();
      onClose();
    } else {
      setError(result.error || 'Cannot delete resource with active bookings.');
      setConfirmDelete(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded shadow-2xl w-full max-w-lg my-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-ivory-300 bg-ivory-50">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-forest-800 block">
              Edit Resource
            </span>
            <span className="text-sm font-bold text-forest-950">{resource.code}</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded flex items-center justify-center hover:bg-ivory-200 text-charcoal-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
          {saved && (
            <div className="p-3 bg-forest-100 border border-forest-300 rounded flex items-center gap-2 font-bold text-forest-900">
              <CheckCircle2 className="w-4 h-4" /> Changes saved successfully.
            </div>
          )}
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-300 rounded text-rose-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Active Toggle */}
          <div className="flex items-center justify-between p-3 bg-ivory-50 border border-ivory-300 rounded">
            <div>
              <span className="font-bold text-forest-950 block">Listing Active</span>
              <span className="text-charcoal-500">
                {isActive ? 'Visible in directory and searchable.' : 'Hidden from directory.'}
              </span>
            </div>
            <button
              type="button"
              onClick={handleToggleActive}
              className="flex items-center gap-1.5 text-forest-900"
              title={isActive ? 'Deactivate listing' : 'Activate listing'}
            >
              {isActive ? (
                <ToggleRight className="w-7 h-7 text-forest-700" />
              ) : (
                <ToggleLeft className="w-7 h-7 text-charcoal-400" />
              )}
              <span className="font-semibold">{isActive ? 'Active' : 'Inactive'}</span>
            </button>
          </div>

          {/* Title */}
          <div>
            <label className="block font-bold text-charcoal-800 mb-1">Equipment / Resource Name</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded focus:border-forest-700 outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block font-bold text-charcoal-800 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ResourceCategory)}
              className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded focus:border-forest-700 outline-none"
            >
              <option value="laboratory-equipment">Laboratory Equipment</option>
              <option value="equipment-tools">Equipment &amp; Tools</option>
              <option value="presentation-projectors">Projectors &amp; Presentation</option>
              <option value="cameras-microphones">Cameras &amp; Microphones</option>
              <option value="arduino-iot-kits">Arduino &amp; IoT Kits</option>
              <option value="cnc-fabrication">CNC &amp; Fabrication Tools</option>
              <option value="spaces-meeting-rooms">Research Spaces &amp; Rooms</option>
              <option value="computers-hardware">Computers &amp; Specialised HW</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold text-charcoal-800 mb-1">Description</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 bg-ivory-100 border border-ivory-300 rounded focus:border-forest-700 outline-none resize-none"
            />
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-charcoal-800 mb-1">Hourly Rate (₹)</label>
              <input
                type="number"
                min={0}
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded focus:border-forest-700 outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-charcoal-800 mb-1">Daily Rate (₹, optional)</label>
              <input
                type="number"
                min={0}
                value={dailyRate}
                onChange={(e) => setDailyRate(Number(e.target.value))}
                className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded focus:border-forest-700 outline-none"
              />
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-charcoal-800 mb-1">Building / Lab</label>
              <input
                type="text"
                required
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded focus:border-forest-700 outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-charcoal-800 mb-1">Room / Bay</label>
              <input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded focus:border-forest-700 outline-none"
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block font-bold text-charcoal-800 mb-1">Primary Image URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded focus:border-forest-700 outline-none"
            />
            {imageUrl && (
              <div className="mt-1.5 w-full h-20 rounded overflow-hidden border border-ivory-300">
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Operator & Approval */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-ivory-50 border border-ivory-200 rounded">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={operatorAssistance}
                  onChange={(e) => setOperatorAssistance(e.target.checked)}
                  className="accent-forest-800"
                />
                <span className="font-semibold text-charcoal-800">Operator assistance available</span>
              </label>
            </div>
            <div>
              <label className="block font-bold text-charcoal-800 mb-1">Approval Requirement</label>
              <select
                value={approvalReq}
                onChange={(e) => setApprovalReq(e.target.value as ApprovalRequirement)}
                className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded focus:border-forest-700 outline-none"
              >
                <option value="instant">Instant Access</option>
                <option value="host-approval">Host Approval Required</option>
                <option value="dept-signoff">Departmental Sign-Off Required</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 bg-forest-900 hover:bg-forest-800 text-ivory-50 font-bold rounded transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-3.5 h-3.5 text-accent-lime" />
              <span>{saving ? 'Saving…' : 'Save Changes'}</span>
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 font-bold rounded transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </form>

        {/* Delete Confirmation Overlay */}
        {confirmDelete && (
          <div className="absolute inset-0 bg-white/95 flex items-center justify-center p-6 rounded">
            <div className="text-center space-y-4 max-w-xs">
              <div className="w-12 h-12 rounded-full bg-rose-100 border border-rose-300 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <h3 className="text-sm font-bold text-forest-950">Delete this resource?</h3>
              <p className="text-xs text-charcoal-600">
                This will permanently remove <strong>{resource.title}</strong> from the directory.
                Resources with active bookings cannot be deleted.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-4 py-2 text-xs bg-white border border-ivory-300 text-charcoal-700 rounded font-semibold hover:bg-ivory-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-4 py-2 text-xs bg-rose-700 hover:bg-rose-800 text-white rounded font-bold"
                >
                  {deleting ? 'Deleting…' : 'Yes, Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
