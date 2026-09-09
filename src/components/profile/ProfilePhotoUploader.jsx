import React, { useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Camera, Upload, Trash2, Sparkles, Check, RefreshCw } from 'lucide-react';

const PRESET_AVATARS = [
  { label: 'Elena (Default)', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { label: 'Athletic Runner', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' },
  { label: 'Strength Coach', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { label: 'Fitness Yogi', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' },
  { label: 'Crossfit Athlete', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
  { label: 'Wellness Lead', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
];

export function ProfilePhotoUploader() {
  const { user, updateAvatar, removeAvatar } = useAuth();
  const { showToast } = useUI();
  const fileInputRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'NF';

  // Client-side image compressor using HTML5 canvas
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WEBP)', 'warning');
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas for downscaling to max 240x240 for fast localStorage storage
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 240;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to lightweight data URL (JPEG 0.85)
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        updateAvatar(compressedDataUrl);
        setIsProcessing(false);
        showToast('Profile photo updated successfully! 📸');
      };
      img.onerror = () => {
        setIsProcessing(false);
        showToast('Could not process image file', 'warning');
      };
      img.src = event.target?.result;
    };

    reader.onerror = () => {
      setIsProcessing(false);
      showToast('Error reading image file', 'warning');
    };

    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (url, label) => {
    updateAvatar(url);
    showToast(`Avatar preset "${label}" applied! ✨`);
  };

  const handleRemovePhoto = () => {
    removeAvatar();
    showToast('Profile photo removed. Showing fallback initials.', 'info');
  };

  return (
    <div className="space-y-4 p-4 rounded-3xl bg-surface-50 border border-surface-200/80">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
        {/* Avatar Display */}
        <div className="relative group shrink-0">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-md"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-black text-2xl flex items-center justify-center ring-4 ring-white shadow-md">
              {initials}
            </div>
          )}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 p-1.5 bg-brand-primary text-white rounded-full shadow-md hover:bg-brand-600 transition-colors cursor-pointer"
            title="Upload New Photo"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Upload Controls & Actions */}
        <div className="space-y-2 text-center sm:text-left flex-1">
          <div>
            <h4 className="text-sm font-bold text-surface-900">{user.name}</h4>
            <p className="text-xs text-surface-500">
              Upload a custom avatar or choose from curated fitness presets.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              leftIcon={<Upload className="w-3.5 h-3.5" />}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Upload Image'}
            </Button>

            {user.avatar && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemovePhoto}
                leftIcon={<Trash2 className="w-3.5 h-3.5 text-rose-500" />}
                className="text-rose-600 hover:bg-rose-50"
              >
                Remove Photo
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Preset Avatars Gallery */}
      <div className="pt-2 border-t border-surface-200/60">
        <span className="text-[11px] font-bold text-surface-500 uppercase tracking-wider block mb-2">
          Or Select Preset Avatar
        </span>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {PRESET_AVATARS.map((preset, idx) => {
            const isSelected = user.avatar === preset.url;
            return (
              <button
                type="button"
                key={idx}
                onClick={() => handleSelectPreset(preset.url, preset.label)}
                className={`flex flex-col items-center p-1.5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-brand-primary bg-emerald-50/70 ring-2 ring-emerald-500/20 shadow-2xs'
                    : 'border-surface-200/80 bg-white hover:border-surface-300 hover:bg-surface-50'
                }`}
              >
                <img
                  src={preset.url}
                  alt={preset.label}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="text-[10px] font-semibold text-surface-700 mt-1 truncate max-w-full text-center">
                  {preset.label.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
