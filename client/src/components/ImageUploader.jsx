import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  Camera, 
  Image as ImageIcon, 
  X, 
  RefreshCw, 
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Video
} from 'lucide-react';

export default function ImageUploader({ onImageSelected, currentImage, isLoading }) {
  const [dragActive, setDragActive] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // High-res agricultural plant disease sample presets for testing
  const samplePresets = [
    {
      title: 'Tomato Early Blight',
      crop: 'Tomato',
      url: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Corn Rust (Fungal)',
      crop: 'Corn / Maize',
      url: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Healthy Apple Foliage',
      crop: 'Apple',
      url: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=800&q=80',
    }
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const validateAndProcessFile = (file) => {
    setErrorMessage(null);

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image size exceeds 5MB limit. Please upload a smaller crop image.');
      return;
    }

    // Validate type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setErrorMessage('Please upload a valid JPG, PNG, or WebP crop image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onImageSelected(reader.result);
      stopCamera();
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  // Camera Live Capture
  const startCamera = async () => {
    setCameraError(null);
    setCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('[Camera Access Error]:', err);
      setCameraError('Unable to access camera. Please check browser permissions or upload an image file.');
      setCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    onImageSelected(dataUrl);
    stopCamera();
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  return (
    <div className="space-y-4">
      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Upload / Camera / Preview Area */}
      <div className="glass-card p-6 relative overflow-hidden">
        
        {/* Active Camera View */}
        {cameraActive ? (
          <div className="relative rounded-2xl overflow-hidden bg-black flex flex-col items-center">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full max-h-96 object-cover rounded-2xl" 
            />
            {/* Visual Laser Scanner */}
            <div className="scanner-laser" />

            <div className="absolute bottom-4 flex items-center gap-4 z-10">
              <button
                type="button"
                onClick={capturePhoto}
                className="agri-btn-primary shadow-xl"
              >
                <Camera className="w-4 h-4" />
                <span>Capture Leaf Photo</span>
              </button>
              <button
                type="button"
                onClick={stopCamera}
                className="agri-btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : currentImage ? (
          /* Image Preview with Diagnostic Scanner Effect */
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex flex-col items-center">
            <img 
              src={currentImage} 
              alt="Crop Leaf Scan" 
              className="w-full max-h-96 object-contain rounded-2xl"
            />

            {/* Glowing animated scanner beam while loading */}
            {isLoading && <div className="scanner-laser" />}

            {/* Overlay controls */}
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => onImageSelected(null)}
                className="p-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 text-slate-300 border border-slate-700/80 backdrop-blur-md transition-colors"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-slate-950/90 w-full border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4" /> Ready for Gemini Multimodal Analysis
              </span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-slate-400 hover:text-white underline"
              >
                Choose different file
              </button>
            </div>
          </div>
        ) : (
          /* Drag and Drop Box */
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 md:p-12 text-center transition-all ${
              dragActive 
                ? 'border-emerald-400 bg-emerald-950/20' 
                : 'border-slate-800 hover:border-slate-700 bg-slate-950/40'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <UploadCloud className="w-8 h-8" />
            </div>

            <h3 className="text-base font-bold text-slate-100">
              Drag & Drop Crop Leaf Photo Here
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Upload a clear close-up photograph of diseased leaves, stem lesions, or affected foliage (JPG/PNG, max 5MB).
            </p>

            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="agri-btn-primary text-xs"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Browse Files</span>
              </button>

              <button
                type="button"
                onClick={startCamera}
                className="agri-btn-secondary text-xs"
              >
                <Camera className="w-4 h-4" />
                <span>Activate Camera</span>
              </button>
            </div>

            {cameraError && (
              <p className="text-rose-400 text-xs mt-3">{cameraError}</p>
            )}
          </div>
        )}

        {/* Sample Presets for Fast Testing */}
        <div className="mt-6 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Or select a benchmark sample:
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {samplePresets.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onImageSelected(sample.url)}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-emerald-500/40 text-left transition-all group"
              >
                <img 
                  src={sample.url} 
                  alt={sample.title} 
                  className="w-12 h-12 rounded-lg object-cover border border-slate-700/60 shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-200 block truncate group-hover:text-emerald-300">
                    {sample.title}
                  </span>
                  <span className="text-[10px] text-slate-400 block truncate">
                    Crop: {sample.crop}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
