/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import QRCodeStyling from 'qr-code-styling';
import confetti from 'canvas-confetti';
import { 
  Download, 
  Share2, 
  Copy, 
  Check, 
  QrCode, 
  Info,
  Smartphone,
  ShieldCheck,
  ArrowRight,
  Trash2,
  Sparkles,
  Zap,
  CreditCard,
  ChevronRight,
  X,
  Plus,
  User,
  CheckCircle2,
  IndianRupee,
  MessageSquare,
  Upload,
  Moon,
  Sun,
  Globe,
  Type,
  Mail,
  Phone,
  MessageCircle,
  Wifi,
  Contact,
  MapPin,
  FileText,
  Settings,
  ScanLine,
  Wallet,
  PlusCircle,
  Palette,
  Volume2,
  Vibrate,
  Languages,
  ExternalLink,
  CameraOff,
  Scan,
  Camera,
  RefreshCw,
  Flashlight,
  Image as ImageIcon,
  Search,
  History,
  Briefcase,
  Calendar,
  Instagram,
  Youtube,
  Facebook,
  Link,
  Video,
  Music,
  Lock,
  Shield,
  AppWindow,
  Ticket,
  FileDown,
  FileUp,
  MessageSquareText,
  Map,
  AtSign,
  Smartphone as SmartphoneIcon,
  Send,
  Link2,
  LockKeyhole,
  FileCode,
  FileAudio,
  FileVideo,
  DownloadCloud,
  Tag,
  Eye,
  EyeOff
} from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'motion/react';
import { HexColorPicker } from "react-colorful";
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const QR_GRADIENTS: Record<string, string[]> = {
  instagram: ['#833AB4', '#FD1D1D', '#FCAF45'],
  whatsapp: ['#25D366', '#128C7E'],
  youtube: ['#FF0000', '#FF4E4E'],
  telegram: ['#0088CC', '#34AADC'],
  url: ['#4A90E2', '#6C5CE7'],
  wifi: ['#00C6FF', '#0072FF'],
  email: ['#36D1DC', '#5B86E5'],
  text: ['#8E8E93', '#1C1C1E'],
  vcard: ['#43E97B', '#38F9D7'],
  business: ['#43E97B', '#38F9D7'],
  phone: ['#11998E', '#38EF7D'],
  sms: ['#FC466B', '#3F5EFB'],
  geo: ['#FF7E5F', '#FEB47B'],
  maps: ['#FF7E5F', '#FEB47B'],
  event: ['#F7971E', '#FFD200'],
  calendar: ['#FF9966', '#FF5E62'],
  upi: ['#000000', '#000000'],
  facebook: ['#1877F2', '#0056B3'],
  multilink: ['#6C63FF', '#4A90E2'],
  app: ['#5AC8FA', '#007AFF'],
  coupon: ['#FF9500', '#FFCC00'],
  password: ['#8E8E93', '#1C1C1E'],
  secret: ['#1C1C1E', '#000000'],
  image: ['#FF2D55', '#FF3B30'],
  pdf: ['#FF3B30', '#FF2D55'],
  doc: ['#007AFF', '#5AC8FA'],
  video: ['#5856D6', '#AF52DE'],
  audio: ['#AF52DE', '#5856D6'],
};

const PRESETS = [10, 20, 50, 100, 200, 500, 1000];

const QR_TYPES = [
  { id: 'url', label: 'Website', icon: Globe, color: '#007AFF', desc: 'Link to any website' },
  { id: 'text', label: 'Text', icon: Type, color: '#5856D6', desc: 'Share plain text' },
  { id: 'email', label: 'Email', icon: Mail, color: '#5AC8FA', desc: 'Send an email' },
  { id: 'phone', label: 'Phone', icon: Phone, color: '#4CD964', desc: 'Call a number' },
  { id: 'sms', label: 'SMS', icon: MessageSquareText, color: '#FF2D55', desc: 'Send a message' },
  { id: 'geo', label: 'Location', icon: MapPin, color: '#FF9500', desc: 'Share coordinates' },
  { id: 'maps', label: 'Google Maps', icon: Map, color: '#34C759', desc: 'Pin location on maps' },
  { id: 'wifi', label: 'WiFi', icon: Wifi, color: '#AF52DE', desc: 'Connect to network' },
  { id: 'vcard', label: 'Contact', icon: Contact, color: '#FF3B30', desc: 'Share contact info' },
  { id: 'business', label: 'Business Card', icon: Briefcase, color: '#8E8E93', desc: 'Professional profile' },
  { id: 'event', label: 'Event', icon: Calendar, color: '#FFCC00', desc: 'Add to calendar' },
  { id: 'instagram', label: 'Instagram', icon: Instagram, color: '#E1306C', desc: 'Profile or post' },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, color: '#25D366', desc: 'Direct chat' },
  { id: 'youtube', label: 'YouTube', icon: Youtube, color: '#FF0000', desc: 'Video or channel' },
  { id: 'telegram', label: 'Telegram', icon: Send, color: '#0088CC', desc: 'Channel or chat' },
  { id: 'facebook', label: 'Facebook', icon: Facebook, color: '#1877F2', desc: 'Profile or page' },
  { id: 'multilink', label: 'Multi-link', icon: Link2, color: '#6C63FF', desc: 'Multiple links in one' },
  { id: 'image', label: 'Image', icon: ImageIcon, color: '#FF2D55', desc: 'Share image file' },
  { id: 'pdf', label: 'PDF', icon: FileDown, color: '#FF3B30', desc: 'Share PDF document' },
  { id: 'doc', label: 'Document', icon: FileCode, color: '#007AFF', desc: 'Word, Excel, etc.' },
  { id: 'video', label: 'Video', icon: FileVideo, color: '#5856D6', desc: 'Share video file' },
  { id: 'audio', label: 'Audio', icon: FileAudio, color: '#AF52DE', desc: 'Share audio file' },
  { id: 'password', label: 'Password', icon: LockKeyhole, color: '#8E8E93', desc: 'Secure password' },
  { id: 'secret', label: 'Secret Message', icon: Shield, color: '#000000', desc: 'Encrypted text' },
  { id: 'app', label: 'App Download', icon: DownloadCloud, color: '#5AC8FA', desc: 'App Store / Play Store' },
  { id: 'coupon', label: 'Coupon QR', icon: Tag, color: '#FF9500', desc: 'Discount code' },
  { id: 'upi', label: 'UPI Payment', icon: IndianRupee, color: '#6C63FF', desc: 'Scan & Pay' },
];

const QR_CATEGORIES = [
  {
    id: 'social',
    label: 'Social',
    icon: Share2,
    items: ['instagram', 'whatsapp', 'youtube', 'telegram', 'facebook']
  },
  {
    id: 'utility',
    label: 'Utility',
    icon: Zap,
    items: ['url', 'text', 'email', 'wifi', 'phone', 'sms']
  },
  {
    id: 'business',
    label: 'Business',
    icon: Briefcase,
    items: ['vcard', 'business', 'event', 'geo', 'maps', 'upi']
  },
  {
    id: 'media',
    label: 'Media',
    icon: ImageIcon,
    items: ['image', 'pdf', 'doc', 'video', 'audio']
  },
  {
    id: 'advanced',
    label: 'Advanced',
    icon: Shield,
    items: ['password', 'secret', 'app', 'coupon']
  }
];

const QR_TYPES_MAP = QR_TYPES.reduce((acc, item) => {
  acc[item.id] = item;
  return acc;
}, {} as Record<string, any>);
const DEFAULT_PAYEE_NAME = "";
const DEFAULT_UPI_ID = "";

const playTing = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(1200, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1800, audioCtx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.2);
  } catch (e) {
    console.error("Audio context not supported", e);
  }
};

const ScannerView = ({ isDarkMode, onScan, onReset, scannedResult, showStatus, triggerVibration, scanSoundEnabled }: any) => {
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let isMounted = true;
    const readerId = "reader";

    const startScanner = async () => {
      if (scannedResult) return;
      
      // Small delay to ensure previous instance has released resources
      await new Promise(resolve => setTimeout(resolve, 300));
      if (!isMounted) return;

      const element = document.getElementById(readerId);
      if (!element) return;

      try {
        // Cleanup any existing scanner before starting a new one
        if (scannerRef.current) {
          if (scannerRef.current.isScanning) {
            await scannerRef.current.stop();
          }
          try { scannerRef.current.clear(); } catch (e) {}
          scannerRef.current = null;
        }

        if (!isMounted) return;

        const scanner = new Html5Qrcode(readerId);
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode },
          {
            fps: 10,
            aspectRatio: 1.0
          },
          (decodedText) => {
            if (!isMounted) return;
            if (scanSoundEnabled) {
              playTing();
            }
            triggerVibration();
            onScan(decodedText);
          },
          () => {}
        );
      } catch (err: any) {
        if (isMounted) {
          console.error("Failed to start scanner", err);
          if (err?.name === "NotReadableError" || err?.message?.includes("NotReadableError")) {
            setCameraError("Camera is already in use by another app or tab.");
          } else {
            setCameraError("Camera access denied or source busy");
          }
        }
      }
    };

    startScanner();

    return () => {
      isMounted = false;
      if (scannerRef.current) {
        const scanner = scannerRef.current;
        if (scanner.isScanning) {
          scanner.stop().then(() => {
            try { scanner.clear(); } catch (e) {}
          }).catch(err => {
            // Benign error in React during unmount
            if (!err.message?.includes("removeChild")) {
              console.warn("Failed to stop scanner in cleanup", err);
            }
          });
        } else {
          try { scanner.clear(); } catch (e) {}
        }
      }
    };
  }, [scannedResult, onScan, facingMode, scanSoundEnabled, triggerVibration]);

  const toggleFlash = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        const state = !isFlashOn;
        const track = scannerRef.current.getRunningTrack();
        if (track && 'applyConstraints' in track) {
          const capabilities = track.getCapabilities() as any;
          if (capabilities.torch) {
            await track.applyConstraints({
              advanced: [{ torch: state }]
            } as any);
            setIsFlashOn(state);
            triggerVibration();
          } else {
            showStatus("Flash not supported on this device", "error");
          }
        }
      } catch (err) {
        console.error("Flash error", err);
      }
    }
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === "environment" ? "user" : "environment");
    triggerVibration();
  };

  const handleFileScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const scanner = new Html5Qrcode("reader-hidden");
      const result = await scanner.scanFile(file, true);
      onScan(result);
      showStatus("QR detected from image", "success");
      triggerVibration();
    } catch (err) {
      console.error("File scan error", err);
      showStatus("No QR code found in image", "error");
    }
  };

  const parseUPI = (url: string) => {
    try {
      if (!url.startsWith('upi://pay?')) return null;
      const params = new URLSearchParams(url.split('?')[1]);
      return {
        pa: params.get('pa'),
        pn: params.get('pn'),
        am: params.get('am'),
        cu: params.get('cu'),
        tn: params.get('tn'),
      };
    } catch (e) {
      return null;
    }
  };

  const upiData = scannedResult ? parseUPI(scannedResult) : null;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black overflow-hidden">
      <div id="reader-hidden" className="hidden" />
      
      <div className={cn("relative w-full h-full", scannedResult && "hidden")}>
        <div id="reader" className="w-full h-full object-cover" />
        
        {cameraError && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/90 px-10 text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
              <Info className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-white font-bold mb-2">Camera Error</h3>
            <p className="text-white/60 text-sm mb-8 leading-relaxed">{cameraError}</p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
              className="px-8 py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl"
            >
              Reload App
            </motion.button>
          </div>
        )}
        
        {/* Futuristic Scanner Overlay */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="relative w-[280px] h-[280px]">
            {/* Main Frame */}
            <div className="absolute inset-0 rounded-[40px] border-2 border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.2)]" />
            
            {/* Corner Highlights */}
            <div className="absolute -top-1 -left-1 w-12 h-12 border-t-4 border-l-4 border-cyan-400 rounded-tl-[40px] shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
            <div className="absolute -top-1 -right-1 w-12 h-12 border-t-4 border-r-4 border-cyan-400 rounded-tr-[40px] shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
            <div className="absolute -bottom-1 -left-1 w-12 h-12 border-b-4 border-l-4 border-cyan-400 rounded-bl-[40px] shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
            <div className="absolute -bottom-1 -right-1 w-12 h-12 border-b-4 border-r-4 border-cyan-400 rounded-br-[40px] shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
            
            {/* Animated Scan Line */}
            <motion.div 
              animate={{ 
                top: ['5%', '95%', '5%'],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              className="absolute left-4 right-4 h-[2px] bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,1)] z-10"
            />

            {/* Soft Glow Pulse */}
            <motion.div
              animate={{
                opacity: [0.05, 0.15, 0.05],
                scale: [0.98, 1.02, 0.98]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 bg-cyan-500/10 rounded-[40px]"
            />
          </div>
        </div>

        {/* Top Bar */}
        <div className="absolute top-12 left-0 right-0 flex items-center justify-between px-6 z-20">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onReset}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center text-white border border-white/20"
          >
            <X className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleFlash}
            className={cn(
              "w-10 h-10 rounded-full backdrop-blur-xl flex items-center justify-center border transition-all duration-300",
              isFlashOn 
                ? "bg-cyan-500 border-transparent text-white shadow-[0_0_20px_rgba(6,182,212,0.8)]" 
                : "bg-white/10 border-white/20 text-white"
            )}
          >
            <Flashlight className={cn("w-5 h-5", isFlashOn && "fill-current")} />
          </motion.button>
        </div>

        {/* Bottom Actions */}
        <div className="absolute bottom-16 left-0 right-0 flex flex-col items-center gap-6 px-6 z-20">
          <div className="flex gap-4 w-full max-w-[320px]">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 h-14 rounded-2xl bg-white/5 backdrop-blur-2xl border border-white/10 flex items-center justify-center gap-2 text-white font-bold text-[11px] uppercase tracking-wider shadow-2xl"
            >
              <ImageIcon className="w-4 h-4" /> Gallery
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
              className="flex-1 h-14 rounded-2xl bg-white/5 backdrop-blur-2xl border border-white/10 flex items-center justify-center gap-2 text-white font-bold text-[11px] uppercase tracking-wider shadow-2xl"
            >
              <RefreshCw className="w-4 h-4" /> Rescan
            </motion.button>
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileScan}
          />
        </div>
      </div>

      {/* Result Popup - iOS Style Fade */}
      <AnimatePresence>
        {scannedResult && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-[300] flex items-center justify-center px-6"
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onReset} />
            
            <div className={cn(
              "w-full max-w-sm rounded-[40px] p-8 relative z-10 border overflow-hidden",
              isDarkMode ? "bg-[#151518] border-white/5" : "bg-white border-black/5 shadow-2xl"
            )}>
              <div className="flex flex-col items-center text-center gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-[#3B82F6] to-blue-600 rounded-[28px] flex items-center justify-center shadow-2xl shadow-[#3B82F6]/20">
                  {upiData ? <IndianRupee className="w-10 h-10 text-white" /> : scannedResult.startsWith('http') ? <Globe className="w-10 h-10 text-white" /> : <QrCode className="w-10 h-10 text-white" />}
                </div>
                
                <div className="space-y-2">
                  <h3 className={cn("text-2xl font-black tracking-tight", isDarkMode ? "text-white" : "text-black")}>
                    {upiData ? 'UPI Payment' : scannedResult.startsWith('http') ? 'Website Link' : 'QR Detected'}
                  </h3>
                  <p className={cn("text-[10px] font-bold uppercase tracking-widest opacity-60", isDarkMode ? "text-[#A1A1AA]" : "text-black")}>
                    {upiData ? 'Ready to pay' : 'Content found'}
                  </p>
                </div>

                {upiData ? (
                  <div className={cn(
                    "w-full p-6 rounded-[32px] space-y-4",
                    isDarkMode ? "bg-[#1C1C1F]" : "bg-black/5"
                  )}>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Payee</span>
                      <span className="text-sm font-bold">{upiData.pn || 'Unknown'}</span>
                    </div>
                    {upiData.am && (
                      <div className="flex justify-between items-center pt-4 border-t border-white/5">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Amount</span>
                        <span className="text-2xl font-black text-[#3B82F6]">₹{upiData.am}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={cn(
                    "w-full p-6 rounded-[32px] break-all font-mono text-xs leading-relaxed",
                    isDarkMode ? "bg-[#1C1C1F] text-[#A1A1AA]" : "bg-black/5 text-black/70"
                  )}>
                    {scannedResult}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 w-full">
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      navigator.clipboard.writeText(scannedResult);
                      showStatus("Copied to clipboard");
                      triggerVibration();
                    }}
                    className={cn(
                      "h-14 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all",
                      isDarkMode ? "bg-[#1C1C1F] text-white" : "bg-black/5 text-black"
                    )}
                  >
                    <Copy className="w-4 h-4" /> Copy
                  </motion.button>
                  
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={onReset}
                    className={cn(
                      "h-14 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all",
                      isDarkMode ? "bg-[#1C1C1F] text-white" : "bg-black/5 text-black"
                    )}
                  >
                    <RefreshCw className="w-4 h-4" /> Rescan
                  </motion.button>
                </div>

                {scannedResult.startsWith('http') || upiData ? (
                  <motion.a
                    whileTap={{ scale: 0.96 }}
                    href={scannedResult}
                    target={upiData ? undefined : "_blank"}
                    rel={upiData ? undefined : "noopener noreferrer"}
                    className="w-full h-16 rounded-2xl font-black text-sm uppercase tracking-widest bg-[#3B82F6] text-white flex items-center justify-center gap-2 shadow-xl shadow-[#3B82F6]/20"
                  >
                    {upiData ? 'Pay Now' : 'Open Link'} <ExternalLink className="w-5 h-5" />
                  </motion.a>
                ) : null}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
;
};
const BottomNav = ({ activeTab, setActiveTab, isDarkMode }: any) => {
  const tabs = [
    { id: 'pay', label: 'Pay', icon: CreditCard },
    { id: 'scan', label: 'Scan', icon: Scan },
    { id: 'create', label: 'Create', icon: Plus },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] pointer-events-auto">
      <div className={cn(
        "backdrop-blur-2xl rounded-[24px] p-2 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)] border transition-all duration-500",
        isDarkMode ? "bg-[#151518]/80 border-white/5" : "bg-white/80 border-black/5"
      )}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex flex-col items-center gap-1 flex-1 py-2 rounded-2xl transition-all duration-300 relative tap-active",
                isActive 
                  ? "text-[#3B82F6] bg-[#3B82F6]/10" 
                  : (isDarkMode ? "text-[#A1A1AA] hover:bg-white/5" : "text-[#666666] hover:bg-black/5")
              )}
            >
              <Icon className={cn(
                "w-5 h-5 transition-all duration-300", 
                isActive ? "scale-110 stroke-[2.5]" : "opacity-100 stroke-[2]"
              )} />
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-wider transition-all duration-300",
                isActive ? "opacity-100" : "opacity-60"
              )}>
                {tab.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

interface UpiAccount {
  id: string;
  name: string;
  upiId: string;
}

const SwipeButton = ({ onSwipe, text, isDarkMode, themeColor }: { onSwipe: () => void, text: string, isDarkMode: boolean, themeColor: string }) => {
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [constraints, setConstraints] = useState({ left: 0, right: 0 });

  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      setConstraints({ left: 0, right: containerWidth - 64 }); // 64 is thumb width + padding
    }
  }, []);

  const progressWidth = useTransform(x, (value) => value + 56);
  const opacity = useTransform(x, [0, 100], [1, 0]);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative w-full h-16 rounded-full flex items-center p-1 overflow-hidden transition-all duration-300",
        isDarkMode ? "bg-[#1C1C1F] border border-white/5" : "bg-[#E5E5EA] border border-black/5"
      )}
    >
      {/* Progress Track */}
      <motion.div 
        style={{ width: progressWidth }}
        className="absolute left-0 top-0 bottom-0 rounded-full success-gradient shadow-[0_0_20px_rgba(0,200,83,0.3)]"
      />

      <motion.div 
        style={{ opacity }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
      >
        <span className={cn(
          "text-sm font-bold tracking-tight transition-opacity duration-300",
          isDarkMode ? "text-[#A1A1AA]" : "text-black/40"
        )}>
          {text}
        </span>
      </motion.div>
      
      <motion.div
        drag="x"
        dragConstraints={constraints}
        dragElastic={0.1}
        dragMomentum={false}
        onDragStart={() => {
          if (window.navigator.vibrate) window.navigator.vibrate(10);
        }}
        onDragEnd={(_, info) => {
          if (info.offset.x > 150) {
            if (window.navigator.vibrate) window.navigator.vibrate([20, 10, 20]);
            onSwipe();
          }
          animate(x, 0, { type: "spring", stiffness: 400, damping: 25 });
        }}
        style={{ x }}
        whileTap={{ scale: 0.98 }}
        whileDrag={{ 
          boxShadow: isDarkMode ? "0 0 20px rgba(108, 99, 255, 0.4)" : "0 0 20px rgba(108, 99, 255, 0.2)"
        }}
        className={cn(
          "w-[52px] h-[52px] rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing shadow-xl z-20",
          isDarkMode ? "bg-[#1C1C1F] border border-white/10" : "bg-white"
        )}
      >
        <div className="w-[48px] h-[48px] rounded-full flex items-center justify-center success-gradient shadow-lg">
          <ArrowRight className="w-6 h-6 text-white" />
        </div>
      </motion.div>
    </div>
  );
};

const QR_BOTTOM_SHEET_CATEGORIES = [
  { id: 'square', label: 'Classic' },
  { id: 'rounded', label: 'Rounded' },
  { id: 'dots', label: 'Dots' }
];

const LogoImage = ({ src, alt, fallback, isDarkMode }: { src: string, alt: string, fallback: string, isDarkMode: boolean }) => {
  const [error, setError] = useState(false);
  
  if (error) {
    return <span className="text-[10px] font-bold text-[#8E8E93]">{fallback}</span>;
  }
  
  return (
    <img 
      src={src} 
      alt={alt} 
      className={cn("h-7 object-contain opacity-95 transition-all", isDarkMode && "brightness-110 contrast-125")} 
      onError={() => setError(true)}
      referrerPolicy="no-referrer"
    />
  );
};const QRBottomSheet = ({ 
  isOpen, 
  onClose, 
  qrData, 
  isDarkMode, 
  qrContainerCallback, 
  generatedAmount, 
  generatedNote,
  handleDownload, 
  handleShare, 
  displayName, 
  upiId, 
  captureRef, 
  qrType, 
  showSuccess,
  renderKey,
  qrStyle,
  setQrStyle,
  isQrLoading,
  showWatermark
}: any) => {
  const getDomain = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch (e) {
      return url;
    }
  };

  const isFile = ['image', 'pdf', 'doc', 'video', 'audio'].includes(qrType);
  const isQrToQr = qrType === 'qr-to-qr';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 overflow-y-auto scrollbar-hide">
          {/* Backdrop with Blur & Dim */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl"
          />

          {/* Container for everything */}
          <motion.div 
            initial={{ y: 100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-[360px] z-10 flex flex-col items-center gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Style Selector */}
            <div className={cn(
              "rounded-full p-1 flex shadow-2xl border",
              isDarkMode ? "bg-[#1C1C1F] border-white/5" : "bg-white border-black/5"
            )}>
              {QR_BOTTOM_SHEET_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setQrStyle(cat.id as any)}
                  className={cn(
                    "px-6 py-2 rounded-full text-[10px] font-black tracking-[0.15em] transition-all",
                    qrStyle === cat.id 
                      ? (isDarkMode ? "bg-white text-black shadow-lg" : "bg-black text-white shadow-md")
                      : (isDarkMode ? "text-[#A1A1AA] hover:bg-white/5" : "text-[#8E8E93] hover:bg-black/5")
                  )}
                >
                  {cat.label.toUpperCase()}
                </button>
              ))}
            </div>

            {/* The Card */}
            <div 
              ref={captureRef}
              className={cn(
                "w-full rounded-[32px] p-8 flex flex-col items-center relative overflow-hidden",
                isDarkMode 
                  ? "bg-[#0B0B0D] shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/5" 
                  : "bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-black/5"
              )}
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              {/* Close Button Inside Card */}
              <button 
                onClick={onClose}
                className={cn(
                  "absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors z-30",
                  isDarkMode ? "bg-white/5 text-white/40 hover:bg-white/10" : "bg-black/5 text-black/40 hover:bg-black/10"
                )}
              >
                <X className="w-4 h-4" />
              </button>

              {/* Success Overlay */}
              <AnimatePresence>
                {showSuccess && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={cn(
                      "absolute inset-0 z-20 flex flex-col items-center justify-center p-8 text-center",
                      isDarkMode ? "bg-[#0B0B0D]" : "bg-white"
                    )}
                  >
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.1 }}
                      className="w-20 h-20 rounded-full bg-[#34C759] flex items-center justify-center mb-6"
                    >
                      <Check className="w-10 h-10 text-white stroke-[3]" />
                    </motion.div>
                    <h2 className={cn("text-2xl font-black mb-2", isDarkMode ? "text-white" : "text-black")}>Payment Received!</h2>
                    <p className="text-sm text-[#A1A1AA] mb-8 font-medium">The transaction was successful.</p>
                    <button 
                      onClick={onClose}
                      className="w-full max-w-[200px] h-[50px] rounded-[14px] bg-[#3B82F6] text-white font-bold text-sm active:opacity-80 transition-opacity"
                    >
                      Done
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* QR Code Container */}
              <div id="qr-container" className={cn(
                "w-full aspect-square max-w-[240px] flex items-center justify-center mb-6 rounded-3xl overflow-hidden relative transition-all duration-300 ease-in-out",
                isDarkMode ? "bg-white/5 p-4" : "bg-white p-0"
              )}>
                <div 
                  ref={qrContainerCallback}
                  key={`qr-sheet-${qrData}-${renderKey}`}
                  className={cn(
                    "w-full h-full flex items-center justify-center transition-all duration-200 bg-white rounded-2xl overflow-hidden",
                    isQrLoading ? "opacity-0 scale-90" : "opacity-100 scale-100"
                  )}
                />

                {/* Watermark Overlay */}
                {showWatermark && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
                    <div className="watermark-text select-none text-[10px] uppercase tracking-[0.3em] font-black opacity-10 rotate-[-45deg]">
                      Navneet
                    </div>
                  </div>
                )}

                {isQrLoading && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-white/5 flex items-center justify-center"
                  >
                    <div className="w-full h-full animate-pulse bg-gradient-to-br from-white/5 to-white/10" />
                  </motion.div>
                )}
              </div>
              
              <div className="text-center w-full space-y-1">
                {qrType === 'upi' ? (
                  <>
                    {upiId && (
                      <p className="text-[10px] text-[#A1A1AA] font-black mb-1 opacity-40 uppercase tracking-widest">
                        {upiId}
                      </p>
                    )}
                    <h3 className={cn("text-[20px] font-black tracking-tight", isDarkMode ? "text-white" : "text-black")}>
                      {displayName}
                    </h3>
                    {generatedAmount && (
                      <p className={cn("text-[36px] font-black leading-tight pt-1", isDarkMode ? "text-white" : "text-black")}>
                        ₹{generatedAmount}
                      </p>
                    )}
                  </>
                ) : isQrToQr ? (
                  null
                ) : (
                  <>
                    <p className="text-[10px] text-[#A1A1AA] font-black mb-1 uppercase tracking-widest opacity-40">
                      {isFile ? qrType.toUpperCase() : (qrType === 'url' ? getDomain(qrData) : qrType?.toUpperCase())}
                    </p>
                    <h3 className={cn("text-[18px] font-black tracking-tight", isDarkMode ? "text-white" : "text-black")}>
                      {displayName || (qrType === 'url' ? 'Link' : qrType?.toUpperCase())}
                    </h3>
                  </>
                )}

                {generatedNote && generatedNote !== qrData && (
                  <p className="text-[12px] text-[#A1A1AA] font-bold mt-2 px-6 opacity-60">
                    {generatedNote}
                  </p>
                )}
                
                {qrType === 'upi' && (
                  <div className="pt-6 pb-2 w-full">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-[1px] flex-1 bg-black/5 dark:bg-white/5" />
                      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#A1A1AA] whitespace-nowrap opacity-40">
                        SCAN & PAY
                      </p>
                      <div className="h-[1px] flex-1 bg-black/5 dark:bg-white/5" />
                    </div>
                    
                    {/* Text Logos */}
                    <div className="flex items-center justify-evenly w-full gap-4 mb-4">
                      <span className={cn("text-[11px] font-black tracking-tight", isDarkMode ? "text-white/40" : "text-[#444]")}>GPay</span>
                      <span className={cn("text-[11px] font-black tracking-tight", isDarkMode ? "text-white/40" : "text-[#444]")}>Paytm</span>
                      <span className={cn("text-[11px] font-black tracking-tight", isDarkMode ? "text-white/40" : "text-[#444]")}>PhonePe</span>
                      <span className={cn("text-[11px] font-black tracking-tight", isDarkMode ? "text-white/40" : "text-[#444]")}>UPI</span>
                    </div>
                    
                    <p className="text-[10px] text-[#A1A1AA] font-bold opacity-40">
                      Works with all UPI apps
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Below Card */}
            <div className="w-full space-y-3">
              <div className="flex gap-3">
                <button
                  onClick={() => handleDownload('png')}
                  className={cn(
                    "h-[54px] rounded-[16px] flex-1 font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-xl border",
                    isDarkMode ? "bg-[#1C1C1F] text-white border-white/5 hover:bg-white/5" : "bg-white text-black border-black/5 hover:bg-black/5"
                  )}
                >
                  <Download className="w-4 h-4 text-[#3B82F6]" />
                  Save PNG
                </button>
                <button
                  onClick={() => handleDownload('svg')}
                  className={cn(
                    "h-[54px] rounded-[16px] flex-1 font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-xl border",
                    isDarkMode ? "bg-[#1C1C1F] text-white border-white/5 hover:bg-white/5" : "bg-white text-black border-black/5 hover:bg-black/5"
                  )}
                >
                  <Share2 className="w-4 h-4 text-[#3B82F6]" />
                  Save SVG
                </button>
              </div>
              
              <button
                onClick={handleShare}
                className="h-[54px] w-full rounded-[16px] bg-[#3B82F6] text-white font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-[0_10px_20px_rgba(59,130,246,0.3)] hover:bg-[#2563EB]"
              >
                <Share2 className="w-4 h-4" />
                Share QR
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default function App() {
  // Settings State with LocalStorage Persistence
  const [themeColor, setThemeColor] = useState<string>(() => localStorage.getItem('upi_app_theme_color') || '#6C63FF');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => localStorage.getItem('upi_app_is_dark_mode') === 'true');
  const [upiAccounts, setUpiAccounts] = useState<UpiAccount[]>(() => {
    const saved = localStorage.getItem('upi_app_accounts');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedAccountId, setSelectedAccountId] = useState<string>(() => localStorage.getItem('upi_app_selected_account_id') || '');

  // Settings - Appearance & Voice
  const [currentTheme, setCurrentTheme] = useState<'netflix' | 'gold' | 'midnight' | 'rose-gold' | 'emerald' | 'hotstar' | 'sunset' | 'ocean' | 'forest' | 'royal' | 'fire' | 'custom'>(() => (localStorage.getItem('upi_app_theme_preset') as any) || 'netflix');
  const [customColor, setCustomColor] = useState<string>(() => localStorage.getItem('upi_app_custom_color') || '#6C63FF');
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(() => localStorage.getItem('upi_app_voice_enabled') !== 'false');
  const [voiceLanguage, setVoiceLanguage] = useState<'en-US' | 'hi-IN'>(() => (localStorage.getItem('upi_app_voice_lang') as any) || 'en-US');

  const [qrStyle, setQrStyle] = useState<'square' | 'rounded' | 'dots'>(() => (localStorage.getItem('upi_app_qr_style') as any) || 'square');
  const [scanSoundEnabled, setScanSoundEnabled] = useState<boolean>(() => localStorage.getItem('upi_app_scan_sound') !== 'false');
  const [showWatermark, setShowWatermark] = useState<boolean>(() => localStorage.getItem('upi_app_show_watermark') !== 'false');

  // Persistence Effects
  useEffect(() => { localStorage.setItem('upi_app_theme_color', themeColor); }, [themeColor]);
  useEffect(() => { localStorage.setItem('upi_app_is_dark_mode', String(isDarkMode)); }, [isDarkMode]);
  useEffect(() => { localStorage.setItem('upi_app_accounts', JSON.stringify(upiAccounts)); }, [upiAccounts]);
  useEffect(() => { localStorage.setItem('upi_app_selected_account_id', selectedAccountId); }, [selectedAccountId]);
  useEffect(() => { localStorage.setItem('upi_app_theme_preset', currentTheme); }, [currentTheme]);
  useEffect(() => { localStorage.setItem('upi_app_custom_color', customColor); }, [customColor]);
  useEffect(() => { localStorage.setItem('upi_app_voice_enabled', String(voiceEnabled)); }, [voiceEnabled]);
  useEffect(() => { localStorage.setItem('upi_app_voice_lang', voiceLanguage); }, [voiceLanguage]);
  useEffect(() => { localStorage.setItem('upi_app_qr_style', qrStyle); }, [qrStyle]);
  useEffect(() => { localStorage.setItem('upi_app_scan_sound', String(scanSoundEnabled)); }, [scanSoundEnabled]);
  useEffect(() => { localStorage.setItem('upi_app_show_watermark', String(showWatermark)); }, [showWatermark]);

  // UPI Management Temp States
  const [tempPayeeName, setTempPayeeName] = useState('');
  const [tempUpiId, setTempUpiId] = useState('');
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // UI State
  const [amount, setAmount] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [generatedAmount, setGeneratedAmount] = useState<string | null>(null);
  const [generatedNote, setGeneratedNote] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [qrNote, setQrNote] = useState<string>('');

  const [isUpiSelectorOpen, setIsUpiSelectorOpen] = useState(false);
  const [isQrLoading, setIsQrLoading] = useState(false);
  const [qrReady, setQrReady] = useState(false);
  const [qrError, setQrError] = useState(false);
  const [activeTab, setActiveTab] = useState<'pay' | 'scan' | 'create' | 'settings'>('pay');
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [createType, setCreateType] = useState<string | null>(null);

  useEffect(() => {
    setShowPassword(false);
  }, [createType]);

  const [qrType, setQrType] = useState<string | null>(null);
  const [createInput, setCreateInput] = useState<string>('');
  const [recentQRs, setRecentQRs] = useState<{ id: string, type: string, data: string, date: string }[]>(() => {
    const saved = localStorage.getItem('recentQRs');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('recentQRs', JSON.stringify(recentQRs));
  }, [recentQRs]);

  const addRecentQR = (type: string, data: string) => {
    const newQR = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      data,
      date: new Date().toISOString()
    };
    setRecentQRs(prev => [newQR, ...prev].slice(0, 20));
  };

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Advanced Create States
  const [wifiData, setWifiData] = useState({ ssid: '', password: '', encryption: 'WPA' });
  const [vCardData, setVCardData] = useState({ firstName: '', lastName: '', phone: '', email: '', org: '', title: '' });
  const [geoData, setGeoData] = useState({ lat: '', lng: '' });
  const [emailData, setEmailData] = useState({ to: '', subject: '', body: '' });
  const [smsData, setSmsData] = useState({ phone: '', message: '' });
  const [eventData, setEventData] = useState({ summary: '', location: '', start: '', end: '' });
  const [upiData, setUpiData] = useState({ pa: '', pn: '', am: '', tn: '' });
  
  // QR-to-QR States
  const [createTab, setCreateTab] = useState<'create' | 'qr-to-qr'>('create');
  const [detectedQRData, setDetectedQRData] = useState<string | null>(null);
  const [qrToQrStep, setQrToQrStep] = useState<number>(1);
  const [scanMode, setScanMode] = useState<'normal' | 'qr-to-qr'>('normal');
  
  const qrRef = useRef<HTMLDivElement>(null);
  const qrContainerRef = useRef<HTMLDivElement>(null);
  const captureRef = useRef<HTMLDivElement>(null);
  const qrCodeRef = useRef<QRCodeStyling | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  // Get currently selected account
  const selectedAccount = upiAccounts.find(acc => acc.id === selectedAccountId) || upiAccounts[0] || { upiId: '', name: '' };

  // Initial loading simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Apply theme to body
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary', themeColor);
    root.style.setProperty('--primary-light', `${themeColor}cc`);
    root.style.setProperty('--primary-dark', `${themeColor}ee`);
  }, [themeColor]);

  const getQRData = () => {
    if (activeTab === 'pay') {
      return generatedAmount && selectedAccount?.upiId
        ? `upi://pay?pa=${selectedAccount.upiId}&pn=${encodeURIComponent(selectedAccount.name)}&am=${generatedAmount}&cu=INR${generatedNote ? `&tn=${encodeURIComponent(generatedNote)}` : ''}`
        : null;
    } else if (activeTab === 'create') {
      if (createTab === 'qr-to-qr') {
        return detectedQRData;
      }
      switch (createType) {
        case 'text': return createInput;
        case 'url': return createInput.startsWith('http') ? createInput : `https://${createInput}`;
        case 'email': return `mailto:${emailData.to}${emailData.subject || emailData.body ? '?' : ''}${emailData.subject ? `subject=${encodeURIComponent(emailData.subject)}` : ''}${emailData.subject && emailData.body ? '&' : ''}${emailData.body ? `body=${encodeURIComponent(emailData.body)}` : ''}`;
        case 'phone': return `tel:${createInput}`;
        case 'sms': return `sms:${smsData.phone}${smsData.message ? `?body=${encodeURIComponent(smsData.message)}` : ''}`;
        case 'wifi': return `WIFI:S:${wifiData.ssid};T:${wifiData.encryption};P:${wifiData.password};;`;
        case 'vcard': return `BEGIN:VCARD\nVERSION:3.0\nN:${vCardData.lastName};${vCardData.firstName}\nFN:${vCardData.firstName} ${vCardData.lastName}\nTEL;TYPE=CELL:${vCardData.phone}\nEMAIL:${vCardData.email}\nEND:VCARD`;
        case 'geo': return `geo:${geoData.lat},${geoData.lng}`;
        case 'maps': return `https://www.google.com/maps/search/?api=1&query=${geoData.lat},${geoData.lng}`;
        case 'instagram': return `https://instagram.com/${createInput.replace('@', '')}`;
        case 'whatsapp': return `https://wa.me/${createInput.replace(/[^0-9]/g, '')}`;
        case 'youtube': return createInput.includes('youtube.com') ? createInput : `https://youtube.com/search?q=${encodeURIComponent(createInput)}`;
        case 'telegram': return `https://t.me/${createInput.replace('@', '')}`;
        case 'facebook': return `https://facebook.com/${createInput}`;
        case 'multilink': return createInput.split(',').map(l => l.trim()).join('\n');
        case 'event': return `BEGIN:VEVENT\nSUMMARY:${eventData.summary}\nLOCATION:${eventData.location}\nDTSTART:${eventData.start.replace(/[-:]/g, '')}\nDTEND:${eventData.end.replace(/[-:]/g, '')}\nEND:VEVENT`;
        case 'business': return `BEGIN:VCARD\nVERSION:3.0\nN:;${vCardData.org}\nFN:${vCardData.org}\nORG:${vCardData.org}\nTITLE:${vCardData.title}\nTEL;TYPE=WORK,VOICE:${vCardData.phone}\nEMAIL;TYPE=PREF,INTERNET:${vCardData.email}\nEND:VCARD`;
        case 'app': return createInput.includes('http') ? createInput : `https://play.google.com/store/search?q=${encodeURIComponent(createInput)}`;
        case 'coupon': return `COUPON:${createInput}`;
        case 'password': return `PASSWORD:${createInput}`;
        case 'secret': return `SECRET:${createInput}`;
        case 'upi': return `upi://pay?pa=${upiData.pa}&pn=${encodeURIComponent(upiData.pn)}&am=${upiData.am}&tn=${encodeURIComponent(qrNote || upiData.tn)}&cu=INR`;
        case 'image':
        case 'pdf':
        case 'doc':
        case 'video':
        case 'audio':
          return createInput.startsWith('http') ? createInput : `https://${createInput}`;
        default: return createInput;
      }
    }
    return null;
  };

  const qrData = getQRData();

  const [renderKey, setRenderKey] = useState(0);

  // Callback ref for QR container to ensure reliable appending
  const qrContainerCallback = useCallback((node: HTMLDivElement | null) => {
    qrContainerRef.current = node;
    if (node && qrCodeRef.current && qrReady) {
      node.innerHTML = "";
      
      try {
        qrCodeRef.current.append(node);
        
        // Final check for canvas (The "qrBitmap" equivalent in web)
        const canvas = node.querySelector('canvas');
        if (canvas) {
          // Explicitly set visibility styles as requested
          canvas.style.display = 'block';
          canvas.style.opacity = '1';
          canvas.style.visibility = 'visible';
          canvas.style.width = '100%';
          canvas.style.height = '100%';
        }
      } catch (err) {
        console.error("QR Rendering Error", err);
      }
    }
  }, [qrReady, qrData, isBottomSheetOpen, renderKey]);

  // QR Code Generation Logic (Background-like)
  useEffect(() => {
    if (!qrData) {
      setQrReady(false);
      return;
    }

    const generateQR = async () => {
      setIsQrLoading(true);
      try {
        setQrError(false);
        
        const getDotsOptions = (style: 'square' | 'rounded' | 'dots') => {
          switch (style) {
            case 'dots': return { type: 'dots' as const };
            case 'rounded': return { type: 'rounded' as const };
            case 'square': return { type: 'square' as const };
            default: return { type: 'square' as const };
          }
        };

        const getCornersSquareOptions = (style: 'square' | 'rounded' | 'dots') => {
          switch (style) {
            case 'dots': return { type: 'dot' as const };
            case 'rounded': return { type: 'extra-rounded' as const };
            case 'square': return { type: 'square' as const };
            default: return { type: 'square' as const };
          }
        };

        const getCornersDotOptions = (style: 'square' | 'rounded' | 'dots') => {
          switch (style) {
            case 'dots': return { type: 'dot' as const };
            case 'rounded': return { type: 'dot' as const };
            case 'square': return { type: 'square' as const };
            default: return { type: 'square' as const };
          }
        };

        const options = {
          data: qrData,
          dotsOptions: {
            ...getDotsOptions(qrStyle),
            color: '#000000',
          },
          cornersSquareOptions: {
            ...getCornersSquareOptions(qrStyle),
            color: '#000000',
          },
          cornersDotOptions: {
            ...getCornersDotOptions(qrStyle),
            color: '#000000',
          },
          backgroundOptions: { color: '#FFFFFF' },
          image: undefined,
          qrOptions: {
            typeNumber: 0 as any,
            mode: 'Byte' as any,
            errorCorrectionLevel: 'H' as any
          },
          imageOptions: {
            hideBackgroundDots: true,
            imageSize: 0.4,
            margin: 12,
            crossOrigin: 'anonymous',
          }
        };

        // Force instance re-creation for style changes to ensure smooth rendering
        if (qrCodeRef.current) {
          qrCodeRef.current = null;
        }

        qrCodeRef.current = new QRCodeStyling({
          width: 2048,
          height: 2048,
          type: "canvas",
          margin: 40,
          ...options
        });

        // Smooth transition delay
        await new Promise(resolve => setTimeout(resolve, 150));
        
        if (qrCodeRef.current) {
          setQrReady(true);
          setRenderKey(prev => prev + 1);
          setIsGenerating(false);
          setIsQrLoading(false);
        } else {
          setQrError(true);
          setIsQrLoading(false);
        }
      } catch (err) {
        console.error("QR Generation: Error", err);
        setQrError(true);
        setQrReady(false);
        setIsQrLoading(false);
        showStatus("QR Generation Failed", "error");
      }
    };

    generateQR();
  }, [qrData, qrStyle]);

  // Animation logic disabled for instant show
  useEffect(() => {
    if (qrReady && isGenerating) {
      console.log("Animation Flow: Animation disabled for instant show");
      setIsGenerating(false);
      setIsBottomSheetOpen(true);
      
      playTing();
      triggerVibration();
      showStatus("QR Generated Successfully");
    }
  }, [qrReady, isGenerating]);

  // Initial data setup
  useEffect(() => {
    if (upiAccounts.length === 0) {
      // Initialize with default if empty
      const defaultAcc = {
        id: 'default',
        name: DEFAULT_PAYEE_NAME,
        upiId: DEFAULT_UPI_ID
      };
      setUpiAccounts([defaultAcc]);
      setSelectedAccountId('default');
    }
  }, [upiAccounts.length]);

  const validateUpiId = (id: string) => {
    const upiRegex = /^[\w.-]+@[\w.-]+$/;
    return upiRegex.test(id);
  };

  const addAccount = () => {
    if (!tempPayeeName || !tempUpiId) {
      showStatus("Please fill all fields", "error");
      return;
    }
    if (!validateUpiId(tempUpiId)) {
      showStatus("Invalid UPI ID format", "error");
      return;
    }

    if (editingAccountId) {
      setUpiAccounts(prev => prev.map(acc => 
        acc.id === editingAccountId 
          ? { ...acc, name: tempPayeeName, upiId: tempUpiId } 
          : acc
      ));
      setEditingAccountId(null);
      showStatus("Account updated");
    } else {
      const newAcc: UpiAccount = {
        id: Math.random().toString(36).substr(2, 9),
        name: tempPayeeName,
        upiId: tempUpiId
      };
      setUpiAccounts(prev => [...prev, newAcc]);
      if (upiAccounts.length === 0) {
        setSelectedAccountId(newAcc.id);
      }
      showStatus("New UPI Account added");
    }

    setTempPayeeName('');
    setTempUpiId('');
    setShowAddForm(false);
  };

  const handleEditAccount = (acc: UpiAccount, e: React.MouseEvent) => {
    e.stopPropagation();
    setTempPayeeName(acc.name);
    setTempUpiId(acc.upiId);
    setEditingAccountId(acc.id);
    setShowAddForm(true);
  };

  const deleteAccount = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (upiAccounts.length <= 1) {
      showStatus("At least one account is required", "error");
      return;
    }
    const filtered = upiAccounts.filter(acc => acc.id !== id);
    setUpiAccounts(filtered);
    if (selectedAccountId === id) {
      setSelectedAccountId(filtered[0].id);
    }
    showStatus("Account deleted");
  };

  const showStatus = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMsg({ text, type });
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleGenerate = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      showStatus("Please enter a valid amount", "error");
      return;
    }
    
    // Reset states
    setQrReady(false);
    setQrError(false);
    setIsGenerating(true);
    
    // Set data - this triggers the qrData update and QR generation useEffect
    setGeneratedAmount(amount);
    setGeneratedNote(note);
    setQrType('upi');
    
    if (!selectedAccount?.upiId) {
      showStatus("Please setup your UPI ID in settings", "error");
      return;
    }
    
    // Open bottom sheet
    setIsBottomSheetOpen(true);
    
    // Log generated UPI string (will be updated in next render cycle)
    const nextUpi = `upi://pay?pa=${selectedAccount?.upiId}&pn=${encodeURIComponent(selectedAccount?.name || '')}&am=${amount}&cu=INR${note ? `&tn=${encodeURIComponent(note)}` : ''}`;
    console.log("UPI String Check: Generated UPI Link:", nextUpi);
    
    // Animation start is now handled by the useEffect watching qrReady
  };

  const handlePreset = (val: number) => {
    setAmount(val.toString());
    showStatus(`Amount set to ₹${val}`);
  };

  const handleCopyLink = async () => {
    if (!qrData) return;
    try {
      await navigator.clipboard.writeText(qrData);
      setCopied(true);
      showStatus("Link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      showStatus("Failed to copy link", "error");
    }
  };

  const getBrandingLogo = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Subtle shadow for the logo
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 4;

    // Draw dark circle background
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(50, 50, 45, 0, Math.PI * 2);
    ctx.fill();

    // Reset shadow for text
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Draw "N" in white
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 60px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('N', 50, 52);

    return canvas.toDataURL();
  };

  const getThemeColor = () => {
    if (currentTheme === 'custom') return customColor;
    const themeColors: Record<string, string> = {
      netflix: '#E11D48',
      gold: '#D4AF37',
      midnight: '#10b981',
      'rose-gold': '#B76E79',
      emerald: '#00FF00',
      hotstar: '#1f80e0',
      sunset: '#ff5f6d',
      ocean: '#2193b0',
      forest: '#11998e',
      royal: '#833ab4',
      fire: '#f12711'
    };
    return themeColors[currentTheme] || '#E11D48';
  };

  const generateQRImageBlob = async (): Promise<Blob | null> => {
    try {
      if (!qrCodeRef.current || !qrData) {
        console.error("generateQRImageBlob: qrCodeRef or qrData is null");
        return null;
      }

      // 1. Create Canvas (High Resolution)
      const width = 1024;
      const height = 1400;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      // 2. Background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);

      // 2.1 Draw Premium Border (GPay Style)
      const borderThickness = 24;
      const borderRadius = 60;
      const borderPadding = borderThickness / 2;

      // Create Conic Gradient for the border to flow smoothly around edges
      // We center it and start from top (-90 degrees or 1.5 * PI)
      const gradient = ctx.createConicGradient(Math.PI * 1.5, width / 2, height / 2);
      gradient.addColorStop(0, '#4285F4');    // Blue
      gradient.addColorStop(0.25, '#34A853'); // Green
      gradient.addColorStop(0.5, '#FBBC05');  // Yellow
      gradient.addColorStop(0.75, '#EA4335'); // Red
      gradient.addColorStop(1, '#4285F4');    // Back to Blue

      ctx.strokeStyle = gradient;
      ctx.lineWidth = borderThickness;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Helper to draw rounded rectangle
      const drawRoundedRect = (x: number, y: number, w: number, h: number, r: number) => {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.arcTo(x + w, y, x + w, y + r, r);
        ctx.lineTo(x + w, y + h - r);
        ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
        ctx.lineTo(x + r, y + h);
        ctx.arcTo(x, y + h, x, y + h - r, r);
        ctx.lineTo(x, y + r);
        ctx.arcTo(x, y, x + r, y, r);
        ctx.closePath();
      };

      drawRoundedRect(borderPadding, borderPadding, width - borderThickness, height - borderThickness, borderRadius);
      ctx.stroke();

      // 2.2 Corner Dots (Minimal GPay Enhancement)
      const dotSize = 10;
      const dotMargin = borderThickness + 30;
      const colors = ['#4285F4', '#34A853', '#FBBC05', '#EA4335'];
      
      const drawDot = (x: number, y: number, color: string) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, dotSize, 0, Math.PI * 2);
        ctx.fill();
      };

      drawDot(dotMargin, dotMargin, colors[0]); // Top Left
      drawDot(width - dotMargin, dotMargin, colors[1]); // Top Right
      drawDot(width - dotMargin, height - dotMargin, colors[2]); // Bottom Right
      drawDot(dotMargin, height - dotMargin, colors[3]); // Bottom Left

      // 3. Draw QR Code
      const qrBlob = await qrCodeRef.current.getRawData('png');
      if (!qrBlob) return null;
      
      const qrImage = new Image();
      const qrUrl = URL.createObjectURL(qrBlob);
      await new Promise((resolve, reject) => {
        qrImage.onload = resolve;
        qrImage.onerror = reject;
        qrImage.src = qrUrl;
      });
      
      const qrSize = 640;
      const qrX = (width - qrSize) / 2;
      const qrY = 180;
      ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);
      URL.revokeObjectURL(qrUrl);

      // 4. Text Rendering
      await document.fonts.ready;
      ctx.textAlign = 'center';
      ctx.fillStyle = '#000000';
      
      let currentY = qrY + qrSize + 120;

      // Get Domain helper
      const getDomain = (url: string) => {
        try {
          const domain = new URL(url).hostname;
          return domain.replace('www.', '');
        } catch (e) {
          return url;
        }
      };

      // Title Logic
      let title = 'QR Code';
      const type = qrType || (activeTab === 'pay' ? 'upi' : 'custom');
      
      if (activeTab === 'pay') {
        title = selectedAccount?.name || 'Payment';
      } else if (type === 'upi') {
        title = upiData.pn || 'Payment';
      } else if (type === 'instagram') {
        title = 'Instagram';
      } else if (type === 'whatsapp') {
        title = 'WhatsApp';
      } else if (type === 'telegram') {
        title = 'Telegram';
      } else if (type === 'youtube') {
        title = 'YouTube';
      } else if (type === 'facebook') {
        title = 'Facebook';
      } else if (['image', 'pdf', 'doc', 'video', 'audio'].includes(type)) {
        title = selectedFile?.name || type.toUpperCase();
      } else if (type === 'url') {
        title = getDomain(qrData);
      } else if (type === 'vcard' || type === 'business') {
        title = `${vCardData.firstName} ${vCardData.lastName}`.trim() || vCardData.org || 'Contact';
      } else if (type === 'event') {
        title = eventData.summary || 'Event';
      } else if (type === 'wifi') {
        title = wifiData.ssid || 'Wi-Fi';
      } else if (type === 'phone') {
        title = 'Phone Number';
      } else if (type === 'sms') {
        title = 'SMS';
      } else if (type === 'email') {
        title = 'Email';
      } else if (type === 'geo' || type === 'maps') {
        title = 'Location';
      } else if (type === 'qr-to-qr') {
        title = ''; 
      }

      if (title) {
        ctx.font = 'bold 54px Inter, system-ui, sans-serif';
        ctx.fillText(title, width / 2, currentY);
        currentY += 80;
      }

      // Amount (if UPI)
      const amountToDisplay = activeTab === 'pay' ? amount : (type === 'upi' ? upiData.am : null);
      if (amountToDisplay) {
        ctx.font = 'bold 90px Inter, system-ui, sans-serif';
        ctx.fillText(`₹${amountToDisplay}`, width / 2, currentY);
        currentY += 110;
      }

      // Note
      const noteToDisplay = activeTab === 'pay' ? note : (type === 'upi' ? upiData.tn : qrNote);
      if (noteToDisplay && noteToDisplay !== qrData) {
        ctx.font = '500 36px Inter, system-ui, sans-serif';
        ctx.fillStyle = '#666666';
        ctx.fillText(noteToDisplay, width / 2, currentY);
        currentY += 70;
      }

      // UPI Labels
      if (activeTab === 'pay' || type === 'upi') {
        currentY += 60;
        ctx.font = 'bold 28px Inter, system-ui, sans-serif';
        ctx.fillStyle = '#AAAAAA';
        ctx.fillText('SCAN & PAY', width / 2, currentY);
        currentY += 70;

        ctx.font = 'bold 32px Inter, system-ui, sans-serif';
        ctx.fillStyle = '#444444';
        const labels = ['GPay', 'Paytm', 'PhonePe', 'UPI'];
        const spacing = 200;
        const startX = (width - (labels.length - 1) * spacing) / 2;
        labels.forEach((label, i) => {
          ctx.fillText(label, startX + i * spacing, currentY);
        });
      }

      return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob), 'image/png', 1.0);
      });
    } catch (err) {
      console.error("Failed to generate manual canvas blob", err);
      return null;
    }
  };

  const handleDownload = async (format: 'png' | 'svg' = 'png') => {
    try {
      if (format === 'svg' && qrCodeRef.current) {
        const fileName = qrType === 'upi' || activeTab === 'pay' ? `QR_₹${generatedAmount || '0'}` : `QR_${qrType || 'custom'}`;
        await qrCodeRef.current.download({ name: fileName, extension: 'svg' });
        showStatus("Ultra HD SVG Downloaded!");
        return;
      }

      const blob = await generateQRImageBlob();
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const fileName = qrType === 'upi' || activeTab === 'pay' ? `Premium_QR_₹${generatedAmount || '0'}.png` : `Premium_QR_${qrType || 'custom'}.png`;
      link.download = fileName;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      showStatus("Premium QR Poster Downloaded!");
    } catch (err) {
      showStatus("Download failed", "error");
    }
  };

  const handleShare = async () => {
    if (!qrData) return;
    
    try {
      const blob = await generateQRImageBlob();
      if (!blob) {
        handleCopyLink();
        return;
      }

      const fileName = qrType === 'upi' || activeTab === 'pay' ? `Premium_QR_₹${generatedAmount || '0'}.png` : `Premium_QR_${qrType || 'custom'}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: qrType === 'upi' || activeTab === 'pay' ? 'Premium UPI QR' : 'Premium QR Code',
          text: qrType === 'upi' || activeTab === 'pay' ? `Pay ₹${generatedAmount || '0'} to ${selectedAccount?.name || ''}` : 'Scan this QR code',
        });
      } else {
        // Fallback to copying link if file sharing is not supported
        handleCopyLink();
      }
    } catch (err) {
      console.error("Share failed", err);
      if ((err as Error).name !== 'AbortError') handleCopyLink();
    }
  };

  const speak = (text: string) => {
    if (!voiceEnabled) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = voiceLanguage;
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const handleConfirmPayment = () => {
    if (!generatedAmount) return;
    
    // Trigger Voice
    const amountText = voiceLanguage === 'hi-IN' 
      ? `${generatedAmount} रुपये का भुगतान प्राप्त हुआ` 
      : `Payment of ${generatedAmount} Rupees received`;
    
    speak(amountText);
    
    // Trigger Animation
    setShowSuccess(true);
    
    // Confetti burst
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 300 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    showStatus("Payment Confirmed with Voice Alert");
  };

  const triggerVibration = () => {
    if (vibrationEnabled && "vibrate" in navigator) {
      navigator.vibrate(60);
    }
  };

  return (
    <div className={cn(
      "h-screen w-full flex flex-col items-center transition-all duration-500 relative overflow-hidden premium-bg",
      isDarkMode ? "dark" : ""
    )}>
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="bg-animated-gradient" />
        <div className="bg-glow-1" />
        <div className="bg-glow-2" />
      </div>

      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loading-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              "fixed inset-0 z-[200] flex flex-col items-center justify-center transition-colors duration-500",
              isDarkMode ? "bg-[#0D0D0F]" : "bg-[#F5F5F7]"
            )}
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative w-24 h-24 mb-8"
            >
              <div className={cn(
                "absolute inset-0 blur-2xl rounded-3xl transition-opacity duration-500",
                isDarkMode ? "bg-primary/20 opacity-100" : "bg-primary/10 opacity-50"
              )} />
              <div className={cn(
                "relative w-full h-full rounded-3xl flex items-center justify-center border transition-all duration-300",
                isDarkMode ? "glass border-white/10" : "bg-white/80 backdrop-blur-md border-black/5 shadow-xl shadow-black/5"
              )}>
                <QrCode className="w-12 h-12 text-primary" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center space-y-1"
            >
              <h2 className={cn(
                "text-[22px] font-bold tracking-tight transition-colors duration-300",
                isDarkMode ? "text-white" : "text-[#111827]"
              )}>
                Navneet
              </h2>
              <p className={cn(
                "text-sm font-medium tracking-widest uppercase transition-colors duration-300",
                isDarkMode ? "text-white/40" : "text-[#6B7280]"
              )}>
                Premium UPI
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Toast */}
      <AnimatePresence>
        {statusMsg && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 20, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            className={cn(
              "fixed top-0 left-1/2 z-50 px-6 py-3 rounded-full shadow-2xl font-medium flex items-center gap-2 border transition-all duration-300",
              statusMsg.type === 'success' 
                ? (isDarkMode ? "bg-emerald-900/90 text-emerald-400 border-emerald-500/20" : "bg-emerald-100 text-emerald-700 border-emerald-200")
                : (isDarkMode ? "bg-red-900/90 text-red-400 border-red-500/20" : "bg-red-100 text-red-700 border-red-200")
            )}
          >
            {statusMsg.type === 'success' ? <Check className="w-4 h-4" /> : <Info className="w-4 h-4" />}
            {statusMsg.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header - ONLY on Home/Main screen */}
      {activeTab === 'pay' && (
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[480px] flex items-center justify-between mb-4 relative z-10 px-6 pt-[60px] flex-shrink-0"
        >
          <div className="flex items-center gap-4">
            <div className={cn("w-12 h-12 rounded-2xl shadow-xl flex items-center justify-center overflow-hidden border", isDarkMode ? "bg-[#1C1C1F] border-white/5" : "bg-white border-black/5")}>
              <User className={cn("w-6 h-6", isDarkMode ? "text-[#3B82F6]" : "text-black/60")} />
            </div>
            <div className="flex flex-col">
              <p className={cn("text-[10px] font-bold uppercase tracking-widest opacity-60 mb-0.5", isDarkMode ? "text-[#A1A1AA]" : "text-[#666666]")}>Welcome</p>
              <h1 className={cn(
                "text-xl font-black tracking-tight transition-colors duration-300 leading-tight user-name",
                isDarkMode ? "text-white" : "text-[#111111]"
              )}>
                Navneet
              </h1>
            </div>
          </div>
          <button 
            onClick={() => setIsHistoryOpen(true)}
            className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center border active:scale-90 transition-transform shadow-xl",
              isDarkMode ? "bg-[#1C1C1F] border-white/5" : "bg-white border-black/5"
            )}
          >
            <History className={cn("w-5 h-5", isDarkMode ? "text-[#A1A1AA]" : "text-[#666666]")} />
          </button>
        </motion.header>
      )}

      {/* UPI Selector - REMOVED as per request (only visible in settings now) */}

      <main className="w-full max-w-[480px] relative z-10 flex-1 flex flex-col items-center justify-start overflow-hidden pt-4 pb-[100px]">
        <AnimatePresence mode="wait">
          {activeTab === 'pay' ? (
            <motion.div
              key="pay-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full space-y-4"
            >
              <div className={cn(
                "w-[92%] mx-auto p-10 rounded-[40px] border relative overflow-hidden transition-all duration-500 premium-card",
                isDarkMode ? "bg-[#151518] border-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.5)]" : "bg-white border-black/5 shadow-[0_20px_60px_rgba(0,0,0,0.05)]"
              )}>
                <div className="space-y-10">
                  <div className="text-center space-y-6">
                    <p className={cn("text-[10px] font-bold uppercase tracking-widest opacity-60", isDarkMode ? "text-[#A1A1AA]" : "text-[#8E8E93]")}>Enter Amount</p>
                    <div className="relative flex items-center justify-center">
                      <span className="text-3xl font-black mr-2 text-[#3B82F6]">₹</span>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0"
                        className={cn(
                          "w-full bg-transparent text-center text-[64px] font-black tracking-tighter focus:outline-none leading-none",
                          isDarkMode ? "text-white" : "text-[#000000]"
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="w-full relative">
                      <input
                        type="text"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Add a note (optional)"
                        className={cn(
                          "w-full rounded-[14px] h-[50px] px-8 text-center text-sm font-bold transition-all duration-300 focus:outline-none border",
                          isDarkMode 
                            ? "bg-[#1C1C1F] border-white/5 text-[#E5E5EA] placeholder:text-[#A1A1AA]/50" 
                            : "bg-[#F2F2F7] border-transparent text-black placeholder:text-black/20"
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center gap-3">
                    {PRESETS.map((amt) => (
                      <motion.button
                        key={amt}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => {
                          setAmount(amt.toString());
                          triggerVibration();
                        }}
                        className={cn(
                          "px-6 py-4 rounded-2xl text-xs font-black transition-all duration-300 border tap-active",
                          amount === amt.toString()
                            ? "bg-[#3B82F6] text-white border-transparent shadow-lg shadow-[#3B82F6]/20"
                            : isDarkMode
                              ? "bg-[#1C1C1F] text-[#A1A1AA] border-white/5 hover:bg-white/5"
                              : "bg-white text-[#8E8E93] border-black/5 shadow-sm hover:bg-black/5"
                        )}
                      >
                        ₹{amt}
                      </motion.button>
                    ))}
                  </div>

                  <SwipeButton 
                    onSwipe={handleGenerate}
                    text="Slide to generate QR"
                    isDarkMode={isDarkMode}
                    themeColor={themeColor}
                  />

                  <div className="w-full text-center mt-6">
                    <p className={cn("text-[10px] font-bold uppercase tracking-widest opacity-40", isDarkMode ? "text-white/40" : "text-[#8E8E93]")}>
                      Secure Premium UPI Generation
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : activeTab === 'create' ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full h-full overflow-y-auto px-6 pt-6 pb-32"
          >
            <div className="mb-8 px-2">
              <p className={cn("text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1", isDarkMode ? "text-[#A1A1AA]" : "text-[#666666]")}>Quick Actions</p>
              <h2 className={cn("text-2xl font-black tracking-tight", isDarkMode ? "text-white" : "text-[#111111]")}>Create QR</h2>
              
              {/* Feature Toggle */}
              <div className={cn(
                "flex p-1 rounded-2xl border w-full max-w-[400px]",
                isDarkMode ? "bg-[#1C1C1F] border-white/5" : "bg-[#F2F2F7] border-black/5"
              )}>
                <button
                  onClick={() => setCreateTab('create')}
                  className={cn(
                    "flex-1 py-3 text-[11px] font-black uppercase tracking-[0.15em] rounded-xl transition-all flex items-center justify-center gap-2",
                    createTab === 'create' 
                      ? (isDarkMode ? "bg-[#0B0B0D] text-white shadow-lg border border-white/5" : "bg-[#FFFFFF] text-[#000000] shadow-lg")
                      : "text-[#8E8E93] hover:text-[#3B82F6]"
                  )}
                >
                  <QrCode className="w-3.5 h-3.5" />
                  Create QR
                </button>
                <button
                  onClick={() => setCreateTab('qr-to-qr')}
                  className={cn(
                    "flex-1 py-3 text-[11px] font-black uppercase tracking-[0.15em] rounded-xl transition-all flex items-center justify-center gap-2",
                    createTab === 'qr-to-qr' 
                      ? (isDarkMode ? "bg-[#0B0B0D] text-white shadow-lg border border-white/5" : "bg-[#FFFFFF] text-[#000000] shadow-lg")
                      : "text-[#8E8E93] hover:text-[#3B82F6]"
                  )}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  QR → QR
                </button>
              </div>
            </div>

            {createTab === 'create' ? (
              <div className="space-y-10">
                {QR_CATEGORIES.map((category) => (
                  <div key={category.id}>
                    <div className="flex items-center gap-3 mb-5 px-2">
                      <div className="w-8 h-8 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center">
                        <category.icon className="w-4 h-4 text-[#3B82F6]" />
                      </div>
                      <h3 className={cn("text-[10px] font-black uppercase tracking-[0.2em]", isDarkMode ? "text-[#A1A1AA]" : "text-[#8E8E93]")}>
                        {category.label}
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      {category.items.map((itemId) => {
                        const item = QR_TYPES_MAP[itemId];
                        if (!item) return null;
                        return (
                          <motion.button
                            key={item.id}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setCreateType(item.id);
                              setCreateInput(item.id === 'url' ? 'https://' : '');
                              triggerVibration();
                            }}
                            className={cn(
                              "w-full p-5 rounded-[28px] flex items-center gap-5 text-left transition-all tap-active border premium-card",
                              isDarkMode ? "bg-[#1C1C1F] border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]" : "bg-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)] border-transparent"
                            )}
                          >
                            <div 
                              className="w-14 h-14 rounded-[18px] flex items-center justify-center text-white shadow-xl"
                              style={{ backgroundColor: item.color }}
                            >
                              <item.icon className="w-7 h-7" />
                            </div>
                            <div className="flex-1">
                              <h4 className={cn("text-lg font-black tracking-tight", isDarkMode ? "text-white" : "text-[#000000]")}>
                                {item.label}
                              </h4>
                              <p className={cn("text-xs font-bold tracking-tight", isDarkMode ? "text-[#A1A1AA]" : "text-[#8E8E93]")}>
                                {item.desc}
                              </p>
                            </div>
                            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", isDarkMode ? "bg-white/5" : "bg-black/5")}>
                              <ChevronRight className={cn("w-4 h-4", isDarkMode ? "text-[#A1A1AA]" : "text-[#C7C7CC]") } />
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <div className={cn(
                  "p-8 rounded-[32px] border flex flex-col items-center text-center gap-6",
                  isDarkMode ? "bg-[#1C1C1F] border-white/5" : "bg-white border-black/5 shadow-[0_10px_30px_rgba(0,0,0,0.05)]"
                )}>
                  {qrToQrStep === 1 ? (
                    <>
                      <div className="w-20 h-20 rounded-[28px] bg-[#3B82F6]/10 flex items-center justify-center">
                        <Scan className="w-10 h-10 text-[#3B82F6]" />
                      </div>
                      <div>
                        <h3 className={cn("text-xl font-black tracking-tight mb-2", isDarkMode ? "text-white" : "text-[#000000]")}>QR to QR Rebuild</h3>
                        <p className={cn("text-sm font-bold tracking-tight px-4", isDarkMode ? "text-[#A1A1AA]" : "text-[#8E8E93]")}>Scan any existing QR code to extract its data and rebuild a clean, high-quality version.</p>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setScanMode('qr-to-qr');
                          setActiveTab('scan');
                          triggerVibration();
                        }}
                        className="w-full py-5 rounded-2xl bg-[#3B82F6] text-white font-black text-sm shadow-xl shadow-[#3B82F6]/20 flex items-center justify-center gap-3"
                      >
                        <Camera className="w-5 h-5" />
                        Scan QR to Rebuild
                      </motion.button>
                    </>
                  ) : (
                    <div className="w-full space-y-6">
                      <div className="flex items-center justify-between">
                        <h4 className={cn("text-[10px] font-black uppercase tracking-[0.2em]", isDarkMode ? "text-[#A1A1AA]" : "text-[#8E8E93]")}>Detected Data</h4>
                        <button 
                          onClick={() => {
                            setQrToQrStep(1);
                            setDetectedQRData(null);
                          }}
                          className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3B82F6]"
                        >
                          Rescan
                        </button>
                      </div>
                      
                      <div className={cn(
                        "w-full p-5 rounded-2xl border text-left overflow-y-auto max-h-[120px] scrollbar-hide",
                        isDarkMode ? "bg-[#0B0B0D] border-white/5" : "bg-[#F2F2F7] border-black/5"
                      )}>
                        <p className={cn("text-xs font-mono break-all leading-relaxed", isDarkMode ? "text-[#A1A1AA]" : "text-[#6B7280]")}>
                          {detectedQRData}
                        </p>
                      </div>

                      {qrToQrStep === 2 && (
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            if (detectedQRData) {
                              setQrToQrStep(4);
                              setQrType('qr-to-qr');
                              triggerVibration();
                              showStatus("Clean QR Generated");
                            }
                          }}
                          className="w-full h-[50px] rounded-[14px] bg-[#3B82F6] text-white font-black text-sm shadow-xl shadow-[#3B82F6]/20 flex items-center justify-center gap-3"
                        >
                          <Zap className="w-5 h-5" />
                          Generate Clean QR
                        </motion.button>
                      )}

                      {qrToQrStep >= 4 && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="pt-4 border-t border-black/5 dark:border-white/5"
                        >
                          <div className="flex flex-col items-center gap-6">
                            <div className={cn(
                              "p-4 rounded-3xl shadow-lg border",
                              isDarkMode ? "bg-white/5 border-white/10" : "bg-white border-black/5"
                            )}>
                              <QRCodeCanvas
                                value={detectedQRData || ''}
                                size={160}
                                level="H"
                                includeMargin={false}
                                bgColor={isDarkMode ? "transparent" : "#ffffff"}
                                fgColor={isDarkMode ? "#ffffff" : "#000000"}
                              />
                            </div>
                            
                            <div className="flex gap-3 w-full">
                              <motion.button
                                whileTap={{ scale: 0.96 }}
                                onClick={() => {
                                  setIsBottomSheetOpen(true);
                                }}
                                className={cn(
                                  "flex-1 h-[50px] rounded-[14px] border flex items-center justify-center gap-2 transition-all",
                                  isDarkMode ? "bg-[#1C1C1F] border-white/5 text-white shadow-xl hover:bg-white/5" : "bg-white border-black/5 text-black shadow-sm hover:bg-black/5"
                                )}
                              >
                                <Download className="w-4 h-4 text-[#3B82F6]" />
                                <span className="text-xs font-bold">Save PNG</span>
                              </motion.button>
                              <motion.button
                                whileTap={{ scale: 0.96 }}
                                onClick={() => {
                                  if (navigator.share && detectedQRData) {
                                    navigator.share({
                                      title: 'Rebuilt QR Code',
                                      text: 'Check out this clean QR code rebuilt from data.',
                                      url: window.location.href
                                    }).catch(console.error);
                                  } else {
                                    showStatus("Sharing not supported on this browser", "error");
                                  }
                                }}
                                className={cn(
                                  "flex-1 h-[50px] rounded-[14px] border flex items-center justify-center gap-2 transition-all",
                                  isDarkMode ? "bg-[#1C1C1F] border-white/5 text-white shadow-xl hover:bg-white/5" : "bg-white border-black/5 text-black shadow-sm hover:bg-black/5"
                                )}
                              >
                                <Share2 className="w-4 h-4 text-[#3B82F6]" />
                                <span className="text-xs font-bold">Share</span>
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            <AnimatePresence>
              {createType && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setCreateType(null)}
                    className="absolute inset-0 bg-black/60 backdrop-blur-md"
                  />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className={cn(
                      "relative w-full max-w-[420px] rounded-[32px] p-8 flex flex-col z-10",
                      isDarkMode ? "bg-[#0B0B0D] border border-white/5 shadow-2xl" : "bg-white border border-black/5 shadow-2xl"
                    )}
                  >
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                          style={{ backgroundColor: QR_TYPES_MAP[createType]?.color }}
                        >
                          {React.createElement(QR_TYPES_MAP[createType]?.icon || Zap, { className: "w-5 h-5" })}
                        </div>
                        <h3 className={cn("text-xl font-black tracking-tight", isDarkMode ? "text-white" : "text-[#1C1C1E]")}>
                          {QR_TYPES_MAP[createType]?.label}
                        </h3>
                      </div>
                      <button 
                        onClick={() => setCreateType(null)}
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                          isDarkMode ? "bg-white/5 text-white/40 hover:bg-white/10" : "bg-black/5 text-black/40 hover:bg-black/10"
                        )}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="overflow-y-auto max-h-[60vh] pr-2 scrollbar-hide">
                      <div className="space-y-6">
                        {createType === 'wifi' ? (
                          <div className="space-y-4">
                            <div className="space-y-1">
                              <label className={cn("text-[10px] font-bold uppercase tracking-widest ml-2", isDarkMode ? "text-[#A1A1AA]" : "text-[#8E8E93]")}>Network Name (SSID)</label>
                              <input
                                type="text"
                                value={wifiData.ssid}
                                onChange={(e) => setWifiData({ ...wifiData, ssid: e.target.value })}
                                placeholder="Home WiFi"
                                className={cn(
                                  "w-full rounded-[14px] h-[50px] px-6 text-sm font-bold transition-all duration-300 focus:outline-none",
                                  isDarkMode ? "bg-[#1C1C1F] border border-white/5 text-[#E5E5EA] placeholder:text-[#A1A1AA]/50" : "bg-[#F2F2F7] border-transparent text-black placeholder:text-black/20"
                                )}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className={cn("text-[10px] font-bold uppercase tracking-widest ml-2", isDarkMode ? "text-[#A1A1AA]" : "text-[#8E8E93]")}>Password</label>
                              <div className="relative">
                                <input
                                  type={showPassword ? "text" : "password"}
                                  value={wifiData.password}
                                  onChange={(e) => setWifiData({ ...wifiData, password: e.target.value })}
                                  placeholder="••••••••"
                                  className={cn(
                                    "w-full rounded-[14px] h-[50px] px-6 text-sm font-bold transition-all duration-300 focus:outline-none pr-12",
                                    isDarkMode ? "bg-[#1C1C1F] border border-white/5 text-[#E5E5EA] placeholder:text-[#A1A1AA]/50" : "bg-[#F2F2F7] border-transparent text-black placeholder:text-black/20"
                                  )}
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className={cn(
                                    "absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-all",
                                    isDarkMode ? "hover:bg-white/5 text-white/40" : "hover:bg-black/5 text-[#8E8E93]"
                                  )}
                                >
                                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <label className={cn("text-[10px] font-bold uppercase tracking-widest ml-2", isDarkMode ? "text-[#A1A1AA]" : "text-[#8E8E93]")}>Encryption</label>
                              <div className="flex gap-2">
                                {['WPA', 'WEP', 'nopass'].map((enc) => (
                                  <button
                                    key={enc}
                                    onClick={() => setWifiData({ ...wifiData, encryption: enc })}
                                    className={cn(
                                      "flex-1 py-3 rounded-xl text-xs font-bold border transition-all",
                                      wifiData.encryption === enc 
                                        ? "bg-[#3B82F6] text-white border-[#3B82F6]" 
                                        : isDarkMode ? "bg-white/5 text-white/40 border-white/10 hover:bg-white/10" : "bg-white text-[#8E8E93] border-black/5 hover:bg-black/5"
                                    )}
                                  >
                                    {enc === 'nopass' ? 'None' : enc}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : createType === 'vcard' ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className={cn("text-[10px] font-bold uppercase tracking-widest ml-2", isDarkMode ? "text-[#A1A1AA]" : "text-[#8E8E93]")}>First Name</label>
                                <input
                                  type="text"
                                  value={vCardData.firstName}
                                  onChange={(e) => setVCardData({ ...vCardData, firstName: e.target.value })}
                                  placeholder="John"
                                  className={cn(
                                    "w-full rounded-[14px] h-[50px] px-6 text-sm font-bold transition-all duration-300 focus:outline-none",
                                    isDarkMode ? "bg-[#1C1C1F] border border-white/5 text-[#E5E5EA] placeholder:text-[#A1A1AA]/50" : "bg-[#F2F2F7] border-transparent text-black placeholder:text-black/20"
                                  )}
                                />
                              </div>
                              <div className="space-y-1">
                                <label className={cn("text-[10px] font-bold uppercase tracking-widest ml-2", isDarkMode ? "text-[#A1A1AA]" : "text-[#8E8E93]")}>Last Name</label>
                                <input
                                  type="text"
                                  value={vCardData.lastName}
                                  onChange={(e) => setVCardData({ ...vCardData, lastName: e.target.value })}
                                  placeholder="Doe"
                                  className={cn(
                                    "w-full rounded-[14px] h-[50px] px-6 text-sm font-bold transition-all duration-300 focus:outline-none",
                                    isDarkMode ? "bg-[#1C1C1F] border border-white/5 text-[#E5E5EA] placeholder:text-[#A1A1AA]/50" : "bg-[#F2F2F7] border-transparent text-black placeholder:text-black/20"
                                  )}
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className={cn("text-[10px] font-bold uppercase tracking-widest ml-2", isDarkMode ? "text-[#A1A1AA]" : "text-[#8E8E93]")}>Phone</label>
                                <input
                                  type="tel"
                                  value={vCardData.phone}
                                  onChange={(e) => setVCardData({ ...vCardData, phone: e.target.value })}
                                  placeholder="+91..."
                                  className={cn(
                                    "w-full rounded-[14px] h-[50px] px-6 text-sm font-bold transition-all duration-300 focus:outline-none",
                                    isDarkMode ? "bg-[#1C1C1F] border border-white/5 text-[#E5E5EA] placeholder:text-[#A1A1AA]/50" : "bg-[#F2F2F7] border-transparent text-black placeholder:text-black/20"
                                  )}
                                />
                              </div>
                              <div className="space-y-1">
                                <label className={cn("text-[10px] font-bold uppercase tracking-widest ml-2", isDarkMode ? "text-[#A1A1AA]" : "text-[#8E8E93]")}>Email</label>
                                <input
                                  type="email"
                                  value={vCardData.email}
                                  onChange={(e) => setVCardData({ ...vCardData, email: e.target.value })}
                                  placeholder="john@..."
                                  className={cn(
                                    "w-full rounded-[14px] h-[50px] px-6 text-sm font-bold transition-all duration-300 focus:outline-none",
                                    isDarkMode ? "bg-[#1C1C1F] border border-white/5 text-[#E5E5EA] placeholder:text-[#A1A1AA]/50" : "bg-[#F2F2F7] border-transparent text-black placeholder:text-black/20"
                                  )}
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className={cn("text-[10px] font-bold uppercase tracking-widest ml-2", isDarkMode ? "text-[#A1A1AA]" : "text-[#8E8E93]")}>Organization</label>
                                <input
                                  type="text"
                                  value={vCardData.org}
                                  onChange={(e) => setVCardData({ ...vCardData, org: e.target.value })}
                                  placeholder="Company Name"
                                  className={cn(
                                    "w-full rounded-[14px] h-[50px] px-6 text-sm font-bold transition-all duration-300 focus:outline-none",
                                    isDarkMode ? "bg-[#1C1C1F] border border-white/5 text-[#E5E5EA] placeholder:text-[#A1A1AA]/50" : "bg-[#F2F2F7] border-transparent text-black placeholder:text-black/20"
                                  )}
                                />
                              </div>
                              <div className="space-y-1">
                                <label className={cn("text-[10px] font-bold uppercase tracking-widest ml-2", isDarkMode ? "text-[#A1A1AA]" : "text-[#8E8E93]")}>Job Title</label>
                                <input
                                  type="text"
                                  value={vCardData.title}
                                  onChange={(e) => setVCardData({ ...vCardData, title: e.target.value })}
                                  placeholder="Manager"
                                  className={cn(
                                    "w-full rounded-[14px] h-[50px] px-6 text-sm font-bold transition-all duration-300 focus:outline-none",
                                    isDarkMode ? "bg-[#1C1C1F] border border-white/5 text-[#E5E5EA] placeholder:text-[#A1A1AA]/50" : "bg-[#F2F2F7] border-transparent text-black placeholder:text-black/20"
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                        ) : createType === 'email' ? (
                          <div className="space-y-4">
                            <div className="space-y-1">
                              <label className={cn("text-[10px] font-bold uppercase tracking-widest ml-2", isDarkMode ? "text-[#A1A1AA]" : "text-[#8E8E93]")}>To</label>
                              <input
                                type="email"
                                value={emailData.to}
                                onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
                                placeholder="hello@example.com"
                                className={cn(
                                  "w-full rounded-[14px] h-[50px] px-6 text-sm font-bold transition-all duration-300 focus:outline-none",
                                  isDarkMode ? "bg-[#1C1C1F] border border-white/5 text-[#E5E5EA] placeholder:text-[#A1A1AA]/50" : "bg-[#F2F2F7] border-transparent text-black placeholder:text-black/20"
                                )}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className={cn("text-[10px] font-bold uppercase tracking-widest ml-2", isDarkMode ? "text-[#A1A1AA]" : "text-[#8E8E93]")}>Subject</label>
                              <input
                                type="text"
                                value={emailData.subject}
                                onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                                placeholder="Hello there!"
                                className={cn(
                                  "w-full rounded-[14px] h-[50px] px-6 text-sm font-bold transition-all duration-300 focus:outline-none",
                                  isDarkMode ? "bg-[#1C1C1F] border border-white/5 text-[#E5E5EA] placeholder:text-[#A1A1AA]/50" : "bg-[#F2F2F7] border-transparent text-black placeholder:text-black/20"
                                )}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className={cn("text-[10px] font-bold uppercase tracking-widest ml-2", isDarkMode ? "text-[#A1A1AA]" : "text-[#8E8E93]")}>Body</label>
                              <textarea
                                value={emailData.body}
                                onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
                                placeholder="Write your message..."
                                rows={3}
                                className={cn(
                                  "w-full rounded-[14px] py-4 px-6 text-sm font-bold transition-all duration-300 focus:outline-none resize-none",
                                  isDarkMode ? "bg-[#1C1C1F] border border-white/5 text-[#E5E5EA] placeholder:text-[#A1A1AA]/50" : "bg-[#F2F2F7] border-transparent text-black placeholder:text-black/20"
                                )}
                              />
                            </div>
                          </div>
                        ) : createType === 'sms' ? (
                          <div className="space-y-4">
                            <div className="space-y-1">
                              <label className={cn("text-[10px] font-bold uppercase tracking-widest ml-2", isDarkMode ? "text-[#A1A1AA]" : "text-[#8E8E93]")}>Phone Number</label>
                              <input
                                type="tel"
                                value={smsData.phone}
                                onChange={(e) => setSmsData({ ...smsData, phone: e.target.value })}
                                placeholder="+91 98765 43210"
                                className={cn(
                                  "w-full rounded-[14px] h-[50px] px-6 text-sm font-bold transition-all duration-300 focus:outline-none",
                                  isDarkMode ? "bg-[#1C1C1F] border border-white/5 text-[#E5E5EA] placeholder:text-[#A1A1AA]/50" : "bg-[#F2F2F7] border-transparent text-black placeholder:text-black/20"
                                )}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className={cn("text-[10px] font-bold uppercase tracking-widest ml-2", isDarkMode ? "text-[#A1A1AA]" : "text-[#8E8E93]")}>Message</label>
                              <textarea
                                value={smsData.message}
                                onChange={(e) => setSmsData({ ...smsData, message: e.target.value })}
                                placeholder="Type your message..."
                                rows={3}
                                className={cn(
                                  "w-full rounded-[14px] py-4 px-6 text-sm font-bold transition-all duration-300 focus:outline-none resize-none",
                                  isDarkMode ? "bg-[#1C1C1F] border border-white/5 text-[#E5E5EA] placeholder:text-[#A1A1AA]/50" : "bg-[#F2F2F7] border-transparent text-black placeholder:text-black/20"
                                )}
                              />
                            </div>
                          </div>
                        ) : createType === 'geo' || createType === 'maps' ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className={cn("text-[10px] font-bold uppercase tracking-widest ml-2", isDarkMode ? "text-[#A1A1AA]" : "text-[#8E8E93]")}>Latitude</label>
                                <input
                                  type="number"
                                  step="any"
                                  value={geoData.lat}
                                  onChange={(e) => setGeoData({ ...geoData, lat: e.target.value })}
                                  placeholder="12.9716"
                                  className={cn(
                                    "w-full rounded-[14px] h-[50px] px-6 text-sm font-bold transition-all duration-300 focus:outline-none",
                                    isDarkMode ? "bg-[#1C1C1F] border border-white/5 text-[#E5E5EA] placeholder:text-[#A1A1AA]/50" : "bg-[#F2F2F7] border-transparent text-black placeholder:text-black/20"
                                  )}
                                />
                              </div>
                              <div className="space-y-1">
                                <label className={cn("text-[10px] font-bold uppercase tracking-widest ml-2", isDarkMode ? "text-[#A1A1AA]" : "text-[#8E8E93]")}>Longitude</label>
                                <input
                                  type="number"
                                  step="any"
                                  value={geoData.lng}
                                  onChange={(e) => setGeoData({ ...geoData, lng: e.target.value })}
                                  placeholder="77.5946"
                                  className={cn(
                                    "w-full rounded-[14px] h-[50px] px-6 text-sm font-bold transition-all duration-300 focus:outline-none",
                                    isDarkMode ? "bg-[#1C1C1F] border border-white/5 text-[#E5E5EA] placeholder:text-[#A1A1AA]/50" : "bg-[#F2F2F7] border-transparent text-black placeholder:text-black/20"
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                        ) : createType === 'event' ? (
                          <div className="space-y-4">
                            <div className="space-y-1">
                              <label className={cn("text-[10px] font-bold uppercase tracking-widest ml-2", isDarkMode ? "text-[#A1A1AA]" : "text-[#8E8E93]")}>Event Title</label>
                              <input
                                type="text"
                                value={eventData.summary}
                                onChange={(e) => setEventData({ ...eventData, summary: e.target.value })}
                                placeholder="Birthday Party"
                                className={cn(
                                  "w-full rounded-[14px] h-[50px] px-6 text-sm font-bold transition-all duration-300 focus:outline-none",
                                  isDarkMode ? "bg-[#1C1C1F] border border-white/5 text-[#E5E5EA] placeholder:text-[#A1A1AA]/50" : "bg-[#F2F2F7] border-transparent text-black placeholder:text-black/20"
                                )}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className={cn("text-[10px] font-bold uppercase tracking-widest ml-2", isDarkMode ? "text-[#A1A1AA]" : "text-[#8E8E93]")}>Location</label>
                              <input
                                type="text"
                                value={eventData.location}
                                onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
                                placeholder="Grand Ballroom"
                                className={cn(
                                  "w-full rounded-[14px] h-[50px] px-6 text-sm font-bold transition-all duration-300 focus:outline-none",
                                  isDarkMode ? "bg-[#1C1C1F] border border-white/5 text-[#E5E5EA] placeholder:text-[#A1A1AA]/50" : "bg-[#F2F2F7] border-transparent text-black placeholder:text-black/20"
                                )}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className={cn("text-[10px] font-bold uppercase tracking-widest ml-2", isDarkMode ? "text-[#A1A1AA]" : "text-[#8E8E93]")}>Start Date</label>
                                <input
                                  type="datetime-local"
                                  value={eventData.start}
                                  onChange={(e) => setEventData({ ...eventData, start: e.target.value })}
                                  className={cn(
                                    "w-full rounded-[14px] h-[50px] px-6 text-xs font-bold transition-all duration-300 focus:outline-none",
                                    isDarkMode ? "bg-[#1C1C1F] border border-white/5 text-[#E5E5EA] placeholder:text-[#A1A1AA]/50" : "bg-[#F2F2F7] border-transparent text-black placeholder:text-black/20"
                                  )}
                                />
                              </div>
                              <div className="space-y-1">
                                <label className={cn("text-[10px] font-bold uppercase tracking-widest ml-2", isDarkMode ? "text-[#A1A1AA]" : "text-[#8E8E93]")}>End Date</label>
                                <input
                                  type="datetime-local"
                                  value={eventData.end}
                                  onChange={(e) => setEventData({ ...eventData, end: e.target.value })}
                                  className={cn(
                                    "w-full rounded-[14px] h-[50px] px-6 text-xs font-bold transition-all duration-300 focus:outline-none",
                                    isDarkMode ? "bg-[#1C1C1F] border border-white/5 text-[#E5E5EA] placeholder:text-[#A1A1AA]/50" : "bg-[#F2F2F7] border-transparent text-black placeholder:text-black/20"
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                        ) : createType === 'upi' ? (
                          <div className="space-y-4">
                            <div className="space-y-1">
                              <label className={cn("text-[10px] font-bold uppercase tracking-widest ml-2", isDarkMode ? "text-[#A1A1AA]" : "text-[#8E8E93]")}>UPI ID (VPA)</label>
                              <input
                                type="text"
                                value={upiData.pa}
                                onChange={(e) => setUpiData({ ...upiData, pa: e.target.value })}
                                placeholder="username@bank"
                                className={cn(
                                  "w-full rounded-[14px] h-[50px] px-6 text-sm font-bold transition-all duration-300 focus:outline-none",
                                  isDarkMode ? "bg-[#1C1C1F] border border-white/5 text-[#E5E5EA] placeholder:text-[#A1A1AA]/50" : "bg-[#F2F2F7] border-transparent text-black placeholder:text-black/20"
                                )}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className={cn("text-[10px] font-bold uppercase tracking-widest ml-2", isDarkMode ? "text-[#A1A1AA]" : "text-[#8E8E93]")}>Payee Name</label>
                              <input
                                type="text"
                                value={upiData.pn}
                                onChange={(e) => setUpiData({ ...upiData, pn: e.target.value })}
                                placeholder="John Doe"
                                className={cn(
                                  "w-full rounded-[14px] h-[50px] px-6 text-sm font-bold transition-all duration-300 focus:outline-none",
                                  isDarkMode ? "bg-[#1C1C1F] border border-white/5 text-[#E5E5EA] placeholder:text-[#A1A1AA]/50" : "bg-[#F2F2F7] border-transparent text-black placeholder:text-black/20"
                                )}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className={cn("text-[10px] font-bold uppercase tracking-widest ml-2", isDarkMode ? "text-[#A1A1AA]" : "text-[#8E8E93]")}>Amount (Optional)</label>
                                <input
                                  type="number"
                                  value={upiData.am}
                                  onChange={(e) => setUpiData({ ...upiData, am: e.target.value })}
                                  placeholder="0.00"
                                  className={cn(
                                    "w-full rounded-[14px] h-[50px] px-6 text-sm font-bold transition-all duration-300 focus:outline-none",
                                    isDarkMode ? "bg-[#1C1C1F] border border-white/5 text-[#E5E5EA] placeholder:text-[#A1A1AA]/50" : "bg-[#F2F2F7] border-transparent text-black placeholder:text-black/20"
                                  )}
                                />
                              </div>
                              <div className="space-y-1">
                                <label className={cn("text-[10px] font-bold uppercase tracking-widest ml-2", isDarkMode ? "text-[#A1A1AA]" : "text-[#8E8E93]")}>Note (Optional)</label>
                                <input
                                  type="text"
                                  value={upiData.tn}
                                  onChange={(e) => setUpiData({ ...upiData, tn: e.target.value })}
                                  placeholder="For Coffee"
                                  className={cn(
                                    "w-full rounded-[14px] h-[50px] px-6 text-sm font-bold transition-all duration-300 focus:outline-none",
                                    isDarkMode ? "bg-[#1C1C1F] border border-white/5 text-[#E5E5EA] placeholder:text-[#A1A1AA]/50" : "bg-[#F2F2F7] border-transparent text-black placeholder:text-black/20"
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                        ) : createType === 'image' || createType === 'pdf' || createType === 'doc' || createType === 'video' || createType === 'audio' ? (
                          <div className="space-y-4">
                            <div className="space-y-1">
                              <label className={cn("text-[10px] font-bold uppercase tracking-widest ml-2", isDarkMode ? "text-[#A1A1AA]" : "text-[#8E8E93]")}>
                                Upload {createType.toUpperCase()}
                              </label>
                              <div 
                                onClick={() => fileInputRef.current?.click()}
                                className={cn(
                                "w-full rounded-[14px] p-6 border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all cursor-pointer",
                                isDarkMode ? "bg-[#1C1C1F] border-white/10 hover:border-white/20" : "bg-[#F2F2F7] border-black/5 hover:border-black/10"
                              )}>
                                <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", isDarkMode ? "bg-white/10" : "bg-black/5")}>
                                  <Upload className="w-6 h-6 text-secondary" />
                                </div>
                                <div className="text-center">
                                  <p className="text-sm font-bold">Click to upload</p>
                                  <p className="text-[10px] text-secondary">Max size 100MB</p>
                                </div>
                                <input 
                                  ref={fileInputRef}
                                  type="file" 
                                  className="hidden" 
                                  accept=".jpg,.png,.pdf,.mp4,.mp3,.doc,.docx,.xls,.xlsx"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      if (file.size > 100 * 1024 * 1024) {
                                        showStatus("Max file size is 100MB", "error");
                                        return;
                                      }
                                      setSelectedFile(file);
                                      setCreateInput(file.name);
                                      showStatus(`Selected: ${file.name}`);
                                    }
                                  }}
                                />
                              </div>
                            </div>

                            {selectedFile && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={cn(
                                  "p-4 rounded-xl border flex items-center gap-3",
                                  isDarkMode ? "bg-[#1C1C1F] border-white/10" : "bg-black/5 border-black/5"
                                )}
                              >
                                <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                                  <FileText className="w-5 h-5 text-secondary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-bold truncate">📄 {selectedFile.name}</p>
                                  <p className="text-[10px] opacity-60">Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                                </div>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedFile(null);
                                    setCreateInput('');
                                  }}
                                  className="p-2 hover:bg-red-500/10 rounded-lg text-red-500 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </motion.div>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <label className={cn("text-[10px] font-bold uppercase tracking-widest ml-2", isDarkMode ? "text-[#A1A1AA]" : "text-[#8E8E93]")}>
                              {createType === 'url' ? 'Website URL' : 
                               createType === 'phone' ? 'Phone Number' : 
                               createType === 'instagram' ? 'Username' :
                               createType === 'whatsapp' ? 'Phone Number' :
                               createType === 'youtube' ? 'Video URL or Search' :
                               createType === 'telegram' ? 'Username' :
                               createType === 'facebook' ? 'Profile URL' :
                               createType === 'multilink' ? 'Links (comma separated)' :
                               createType === 'app' ? 'App Name or URL' :
                               createType === 'coupon' ? 'Coupon Code' :
                               createType === 'password' ? 'Password' :
                               createType === 'secret' ? 'Secret Message' :
                               'Content'}
                            </label>
                            <div className="relative">
                              <input
                                type={createType === 'password' && !showPassword ? 'password' : (createType === 'phone' || createType === 'whatsapp' ? 'tel' : 'text')}
                                value={createInput}
                                onChange={(e) => setCreateInput(e.target.value)}
                                placeholder={
                                  createType === 'url' ? 'https://example.com' : 
                                  createType === 'phone' ? '+91 98765 43210' :
                                  createType === 'instagram' ? '@username' :
                                  createType === 'whatsapp' ? '+91...' :
                                  createType === 'youtube' ? 'https://youtube.com/...' :
                                  createType === 'multilink' ? 'google.com, apple.com' :
                                  createType === 'coupon' ? 'SAVE50' :
                                  'Enter details...'
                                }
                                className={cn(
                                  "w-full rounded-[14px] h-[50px] px-6 text-sm font-bold transition-all duration-300 focus:outline-none",
                                  createType === 'password' ? "pr-12" : "",
                                  isDarkMode 
                                    ? "bg-[#1C1C1F] border border-white/5 text-[#E5E5EA] placeholder:text-[#A1A1AA]/50" 
                                    : "bg-[#F2F2F7] border-transparent text-black placeholder:text-black/20"
                                )}
                              />
                              {createType === 'password' && (
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className={cn(
                                    "absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-all",
                                    isDarkMode ? "hover:bg-white/5 text-white/40" : "hover:bg-black/5 text-[#8E8E93]"
                                  )}
                                >
                                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              )}
                            </div>
                          </div>
                        )}

                        {createType !== 'upi' && (
                          <div className="space-y-1">
                            <label className={cn("text-[10px] font-bold uppercase tracking-widest ml-2", isDarkMode ? "text-[#A1A1AA]" : "text-[#8E8E93]")}>
                              Add Note (Optional)
                            </label>
                            <input
                              type="text"
                              value={qrNote}
                              onChange={(e) => setQrNote(e.target.value)}
                              placeholder="Add a note to this QR"
                              className={cn(
                                "w-full rounded-[14px] h-[50px] px-6 text-sm font-bold transition-all duration-300 focus:outline-none",
                                isDarkMode ? "bg-[#1C1C1F] border border-white/5 text-[#E5E5EA] placeholder:text-[#A1A1AA]/50" : "bg-[#F2F2F7] border-transparent text-black placeholder:text-black/20"
                              )}
                            />
                          </div>
                        )}

                        <SwipeButton 
                          onSwipe={() => {
                            const data = getQRData();
                            const isFile = ['image', 'pdf', 'doc', 'video', 'audio'].includes(createType || '');
                            
                            if (isFile && !selectedFile) {
                              showStatus("Please select a file", "error");
                              return;
                            }

                            if (!isFile && (!data || 
                                (createType === 'wifi' && !wifiData.ssid) ||
                                (createType === 'email' && !emailData.to) ||
                                (createType === 'sms' && !smsData.phone) ||
                                (createType === 'vcard' && !vCardData.firstName) ||
                                (createType === 'geo' && !geoData.lat)
                            )) {
                              showStatus("Please fill required fields", "error");
                              return;
                            }

                            const processGeneration = (finalData: string) => {
                              setGeneratedAmount(createType === 'upi' ? upiData.am : (activeTab === 'pay' ? amount : null));
                              setGeneratedNote(createType === 'upi' ? upiData.tn : (activeTab === 'pay' ? note : qrNote));
                              setQrType(createType || (activeTab === 'pay' ? 'upi' : 'custom'));
                              addRecentQR(createType || (activeTab === 'pay' ? 'upi' : 'custom'), finalData);
                              setIsGenerating(true);
                              triggerVibration();
                              playTing();
                              showStatus("Generating QR...");
                              setCreateType(null);
                              setIsBottomSheetOpen(true);
                            };

                            if (isFile && selectedFile) {
                              const reader = new FileReader();
                              reader.onload = function(e) {
                                const fileURL = e.target?.result as string;
                                processGeneration(fileURL);
                              };
                              reader.readAsDataURL(selectedFile);
                            } else {
                              processGeneration(data || '');
                            }
                          }}
                          text="Swipe to Generate QR"
                          isDarkMode={isDarkMode}
                          themeColor={themeColor}
                        />
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
          ) : activeTab === 'settings' ? (
          <motion.div
            key="settings-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              "fixed inset-0 z-[50] flex flex-col pb-24",
              isDarkMode ? "bg-black" : "bg-[#F2F2F7]"
            )}
          >
            {/* iOS Style Header */}
            <div className={cn(
              "h-16 flex items-center justify-between px-6 shrink-0 border-b",
              isDarkMode ? "bg-[#0B0B0D] border-white/5" : "bg-white/80 backdrop-blur-md border-black/5"
            )}>
              <h2 className={cn("text-lg font-black tracking-tight", isDarkMode ? "text-white" : "text-black")}>Settings</h2>
              <div className="w-8 h-8 rounded-full bg-[#3B82F6]/10 flex items-center justify-center">
                <Settings className="w-4 h-4 text-[#3B82F6]" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide py-6 space-y-8">
              {/* PAYMENT ACCOUNTS SECTION */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-6">
                  <p className={cn("text-[10px] font-bold uppercase tracking-widest opacity-60", isDarkMode ? "text-[#A1A1AA]" : "text-[#666666]")}>Payment Accounts</p>
                  <button 
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="text-[#3B82F6] text-sm font-bold flex items-center gap-1 active:opacity-50 transition-opacity"
                  >
                    <Plus className="w-4 h-4" />
                    Add UPI ID
                  </button>
                </div>

                <AnimatePresence>
                  {showAddForm && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-4 overflow-hidden"
                    >
                      <div className={cn(
                        "p-4 rounded-2xl space-y-4 mb-4 border",
                        isDarkMode ? "bg-[#1C1C1F] border-white/5" : "bg-white border-black/5"
                      )}>
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-1">Account Holder Name</label>
                            <input 
                              type="text"
                              placeholder="Navneet Chaudhary"
                              value={tempPayeeName}
                              onChange={(e) => setTempPayeeName(e.target.value)}
                              className={cn(
                                "w-full rounded-[14px] h-[50px] px-4 text-sm font-bold transition-all duration-300 focus:outline-none border",
                                isDarkMode ? "bg-[#0B0B0D] border-white/5 text-white placeholder:text-[#A1A1AA]/50" : "bg-[#F2F2F7] border-transparent text-black placeholder:text-black/20"
                              )}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-1">UPI ID (VPA)</label>
                            <input 
                              type="text"
                              placeholder="8000255149@yapl"
                              value={tempUpiId}
                              onChange={(e) => setTempUpiId(e.target.value)}
                              className={cn(
                                "w-full rounded-[14px] h-[50px] px-4 text-sm font-bold transition-all duration-300 focus:outline-none border",
                                isDarkMode ? "bg-[#0B0B0D] border-white/5 text-white placeholder:text-[#A1A1AA]/50" : "bg-[#F2F2F7] border-transparent text-black placeholder:text-black/20"
                              )}
                            />
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            if (tempPayeeName && tempUpiId) {
                              const newId = Math.random().toString(36).substr(2, 9);
                              setUpiAccounts([...upiAccounts, { id: newId, name: tempPayeeName, upiId: tempUpiId }]);
                              if (upiAccounts.length === 0) setSelectedAccountId(newId);
                              setShowAddForm(false);
                              setTempPayeeName('');
                              setTempUpiId('');
                              showStatus("Account added");
                            }
                          }}
                          className="w-full h-[50px] rounded-[14px] bg-[#3B82F6] text-white font-bold text-sm active:opacity-80 transition-opacity"
                        >
                          Add Account
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className={cn(
                  "mx-4 overflow-hidden rounded-2xl border",
                  isDarkMode ? "bg-[#1C1C1F] border-white/5" : "bg-white border-black/5"
                )}>
                  {upiAccounts.length === 0 ? (
                    <div className="p-8 text-center opacity-40">
                      <Wallet className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-xs font-bold">No accounts added</p>
                    </div>
                  ) : (
                    upiAccounts.map((acc, index) => {
                      const isSelected = selectedAccountId === acc.id;
                      return (
                        <div key={acc.id}>
                          <div 
                            onClick={() => setSelectedAccountId(acc.id)}
                            className="p-4 flex items-center justify-between active:bg-black/5 dark:active:bg-white/5 transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-4 flex-1">
                              <div className={cn(
                                "w-5 h-5 rounded-full flex items-center justify-center border transition-all",
                                isSelected 
                                  ? "bg-[#3B82F6] border-transparent text-white" 
                                  : (isDarkMode ? "border-white/20" : "border-black/10")
                              )}>
                                {isSelected && <Check className="w-3 h-3" />}
                              </div>
                              <div className="flex flex-col flex-1">
                                <span className={cn("text-[15px] font-black", isDarkMode ? "text-white" : "text-black")}>
                                  {acc.name}
                                </span>
                                <span className={cn("text-[12px] font-bold opacity-40", isDarkMode ? "text-white" : "text-black")}>
                                  {acc.upiId}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3 ml-4">
                              {index === 0 && (
                                <span className="text-[9px] font-black text-[#3B82F6] bg-[#3B82F6]/10 px-2 py-0.5 rounded-md tracking-widest">PRIMARY</span>
                              )}
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setUpiAccounts(upiAccounts.filter(a => a.id !== acc.id));
                                  triggerVibration();
                                }}
                                className="p-2 text-black/20 dark:text-white/20 hover:text-red-500 active:opacity-50 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          {index < upiAccounts.length - 1 && (
                            <div className={cn("h-[1px] ml-12", isDarkMode ? "bg-white/5" : "bg-black/5")} />
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* PREFERENCES SECTION */}
              <div className="space-y-2">
                <p className={cn("px-6 text-[10px] font-bold uppercase tracking-widest opacity-60", isDarkMode ? "text-[#A1A1AA]" : "text-[#666666]")}>Preferences</p>
                <div className={cn(
                  "mx-4 overflow-hidden rounded-2xl border",
                  isDarkMode ? "bg-[#1C1C1F] border-white/5" : "bg-white border-black/5"
                )}>
                  {/* Dark Mode */}
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center text-white">
                        <Moon className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className={cn("text-sm font-bold", isDarkMode ? "text-white" : "text-black")}>Dark Mode</span>
                        <span className="text-[10px] opacity-40">Appearance theme</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setIsDarkMode(!isDarkMode)}
                      className={cn(
                        "w-12 h-7 rounded-full relative transition-all duration-300",
                        isDarkMode ? "bg-[#34C759]" : "bg-[#E5E5EA]"
                      )}
                    >
                      <motion.div 
                        animate={{ x: isDarkMode ? 22 : 2 }}
                        className="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-sm"
                      />
                    </button>
                  </div>
                  <div className={cn("h-[1px] ml-14", isDarkMode ? "bg-white/5" : "bg-black/5")} />

                  {/* Scan Sound */}
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center text-white">
                        <Volume2 className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className={cn("text-sm font-bold", isDarkMode ? "text-white" : "text-black")}>Scan Sound</span>
                        <span className="text-[10px] opacity-40">Audio feedback</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setScanSoundEnabled(!scanSoundEnabled)}
                      className={cn(
                        "w-12 h-7 rounded-full relative transition-all duration-300",
                        scanSoundEnabled ? "bg-[#34C759]" : (isDarkMode ? "bg-[#39393D]" : "bg-[#E5E5EA]")
                      )}
                    >
                      <motion.div 
                        animate={{ x: scanSoundEnabled ? 22 : 2 }}
                        className="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-sm"
                      />
                    </button>
                  </div>
                  <div className={cn("h-[1px] ml-14", isDarkMode ? "bg-white/5" : "bg-black/5")} />

                  {/* Haptic Feedback */}
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center text-white">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className={cn("text-sm font-bold", isDarkMode ? "text-white" : "text-black")}>Haptic Feedback</span>
                        <span className="text-[10px] opacity-40">Tactile response</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setVibrationEnabled(!vibrationEnabled)}
                      className={cn(
                        "w-12 h-7 rounded-full relative transition-all duration-300",
                        vibrationEnabled ? "bg-[#34C759]" : (isDarkMode ? "bg-[#39393D]" : "bg-[#E5E5EA]")
                      )}
                    >
                      <motion.div 
                        animate={{ x: vibrationEnabled ? 22 : 2 }}
                        className="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-sm"
                      />
                    </button>
                  </div>
                  <div className={cn("h-[1px] ml-14", isDarkMode ? "bg-white/5" : "bg-black/5")} />

                  {/* Watermark */}
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-gray-500 flex items-center justify-center text-white">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className={cn("text-sm font-bold", isDarkMode ? "text-white" : "text-black")}>Watermark</span>
                        <span className="text-[10px] opacity-40">Branding on QR</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowWatermark(!showWatermark)}
                      className={cn(
                        "w-12 h-7 rounded-full relative transition-all duration-300",
                        showWatermark ? "bg-[#34C759]" : (isDarkMode ? "bg-[#39393D]" : "bg-[#E5E5EA]")
                      )}
                    >
                      <motion.div 
                        animate={{ x: showWatermark ? 22 : 2 }}
                        className="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-sm"
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* DANGER ZONE SECTION */}
              <div className="space-y-2">
                <p className={cn("px-6 text-[10px] font-bold uppercase tracking-widest text-red-500/60")}>Danger Zone</p>
                <div className="mx-4 overflow-hidden rounded-2xl bg-red-500/10 border border-red-500/20">
                  <button 
                    onClick={() => setShowResetConfirm(true)}
                    className="w-full h-[50px] flex items-center gap-3 px-4 text-red-500 active:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span className="text-sm font-bold">Reset Application</span>
                  </button>
                </div>
              </div>

              <div className="px-4 pt-4">
                <button 
                  onClick={() => setActiveTab('pay')}
                  className="w-full py-4 rounded-2xl bg-[#3B82F6] text-white font-bold text-sm active:opacity-80 transition-opacity"
                >
                  Done
                </button>
              </div>
            </div>
          </motion.div>
        ) : activeTab === 'scan' ? (
            <ScannerView 
              isDarkMode={isDarkMode} 
              onScan={(res: string) => {
                if (scanMode === 'qr-to-qr') {
                  setDetectedQRData(res);
                  setQrToQrStep(2);
                  setActiveTab('create');
                  setScanMode('normal');
                  showStatus("QR Data Extracted Successfully");
                } else {
                  setScannedResult(res);
                }
              }}
              onReset={() => {
                setScannedResult(null);
                if (scanMode === 'qr-to-qr') {
                  setActiveTab('create');
                  setScanMode('normal');
                } else {
                  setActiveTab('pay'); // Default back to home
                }
              }}
              scannedResult={scannedResult}
              showStatus={showStatus}
              triggerVibration={triggerVibration}
              scanSoundEnabled={scanSoundEnabled}
            />
          ) : (
            <div className="text-center p-8">
              <p className="text-white/40">Select a tab to continue</p>
            </div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {!isLoading && activeTab !== 'scan' && !isBottomSheetOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 z-[90] pointer-events-none"
          >
            <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} isDarkMode={isDarkMode} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowResetConfirm(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={cn(
                "relative w-full max-w-[320px] rounded-[32px] p-8 flex flex-col items-center text-center z-10",
                isDarkMode ? "bg-[#1C1C1F] border border-white/5" : "bg-white border border-black/5"
              )}
            >
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className={cn("text-xl font-black tracking-tight mb-2", isDarkMode ? "text-white" : "text-black")}>Reset App?</h3>
              <p className={cn("text-sm font-medium mb-8", isDarkMode ? "text-[#A1A1AA]" : "text-[#8E8E93]")}>This will clear all your UPI accounts and settings. This action cannot be undone.</p>
              
              <div className="flex flex-col gap-3 w-full">
                <button 
                  onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                  }}
                  className="w-full h-[50px] rounded-[14px] bg-red-500 text-white font-bold hover:bg-red-600 transition-colors"
                >
                  Yes, Reset
                </button>
                <button 
                  onClick={() => setShowResetConfirm(false)}
                  className={cn(
                    "w-full h-[50px] rounded-[14px] font-bold transition-colors",
                    isDarkMode ? "bg-white/5 text-white hover:bg-white/10" : "bg-black/5 text-black hover:bg-black/10"
                  )}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <QRBottomSheet 
        isOpen={isBottomSheetOpen}
        onClose={() => {
          setIsBottomSheetOpen(false);
          setShowSuccess(false);
          setGeneratedAmount(null);
          setGeneratedNote(null);
        }}
        qrData={qrData}
        isDarkMode={isDarkMode}
        qrContainerCallback={qrContainerCallback}
        qrError={qrError}
        renderKey={renderKey}
        isQrLoading={isQrLoading}
        generatedAmount={generatedAmount}
        generatedNote={generatedNote}
        handleDownload={handleDownload}
        handleShare={handleShare}
        displayName={
          activeTab === 'pay' 
            ? selectedAccount?.name 
            : qrType === 'upi' 
              ? upiData.pn 
              : ['image', 'pdf', 'doc', 'video', 'audio'].includes(qrType)
                ? selectedFile?.name || 'File'
                : qrType === 'vcard' || qrType === 'business'
                  ? `${vCardData.firstName} ${vCardData.lastName}`.trim() || vCardData.org
                  : qrType === 'event'
                    ? eventData.summary
                    : qrType === 'wifi'
                      ? wifiData.ssid
                      : qrType === 'url'
                        ? 'Link'
                        : qrType === 'phone' || qrType === 'whatsapp' || qrType === 'telegram'
                          ? createInput
                          : 'QR Code'
        }
        upiId={
          activeTab === 'pay' 
            ? selectedAccount?.upiId 
            : qrType === 'upi' 
              ? upiData.pa 
              : null
        }
        themeColor={themeColor}
        captureRef={captureRef}
        qrType={qrType}
        qrStyle={qrStyle}
        setQrStyle={setQrStyle}
        showWatermark={showWatermark}
        showSuccess={showSuccess}
      />

      {/* UPI Selector Bottom Sheet */}
      <AnimatePresence>
        {isUpiSelectorOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUpiSelectorOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className={cn(
                "fixed inset-x-0 bottom-0 z-[101] rounded-t-[32px] p-6 pb-12 shadow-2xl max-h-[70vh] overflow-y-auto border-t",
                isDarkMode ? "bg-[#0B0B0D] border-white/5" : "bg-white border-black/5"
              )}
            >
              <div className="w-12 h-1.5 bg-black/5 dark:bg-white/10 rounded-full mx-auto mb-8" />
              <h3 className={cn("text-lg font-black tracking-tight mb-6", isDarkMode ? "text-white" : "text-black")}>Select UPI ID</h3>
              <div className="space-y-3">
                {upiAccounts.map((acc) => (
                  <motion.button
                    key={acc.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedAccountId(acc.id);
                      setIsUpiSelectorOpen(false);
                      triggerVibration();
                    }}
                    className={cn(
                      "w-full p-4 rounded-[16px] flex items-center justify-between transition-all duration-300 border",
                      selectedAccountId === acc.id
                        ? (isDarkMode ? "bg-[#1C1C1F] border-white/10" : "bg-[#F2F2F7] border-black/5")
                        : (isDarkMode ? "bg-transparent border-transparent hover:bg-white/5" : "bg-transparent border-transparent hover:bg-black/5")
                    )}
                  >
                    <div className="flex flex-col items-start">
                      <span className={cn("text-sm font-bold", selectedAccountId === acc.id ? (isDarkMode ? "text-white" : "text-black") : (isDarkMode ? "text-white/60" : "text-black/60"))}>
                        {acc.name}
                      </span>
                      <span className={cn("text-xs font-medium", isDarkMode ? "text-[#A1A1AA]" : "text-[#8E8E93]")}>{acc.upiId}</span>
                    </div>
                    {selectedAccountId === acc.id && (
                      <CheckCircle2 className="w-5 h-5" style={{ color: themeColor }} />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* History Modal */}
      <AnimatePresence>
        {isHistoryOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsHistoryOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className={cn(
                "fixed inset-x-0 bottom-0 z-[101] rounded-t-[32px] p-6 pb-12 shadow-2xl max-h-[80vh] flex flex-col border-t",
                isDarkMode ? "bg-[#0B0B0D] border-white/5" : "bg-white border-black/5"
              )}
            >
              <div className="w-12 h-1.5 bg-black/5 dark:bg-white/10 rounded-full mx-auto mb-8 shrink-0" />
              <div className="flex items-center justify-between mb-6 shrink-0">
                <h3 className={cn("text-xl font-black tracking-tight", isDarkMode ? "text-white" : "text-black")}>Recent QRs</h3>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setRecentQRs([]);
                    triggerVibration();
                  }}
                  className="text-red-500 text-sm font-bold px-4 py-2 rounded-full bg-red-500/10 hover:bg-red-500/20 transition-colors"
                >
                  Clear All
                </motion.button>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {recentQRs.length === 0 ? (
                  <div className="py-12 text-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center mx-auto">
                      <History className={cn("w-8 h-8 opacity-30", isDarkMode ? "text-white" : "text-[#8E8E93]")} />
                    </div>
                    <p className={cn("text-sm font-medium", isDarkMode ? "text-[#A1A1AA]" : "text-[#8E8E93]")}>No recent history</p>
                  </div>
                ) : (
                  recentQRs.map((qr) => (
                    <motion.div
                      key={qr.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "p-4 rounded-2xl flex items-center justify-between transition-all duration-300 border",
                        isDarkMode ? "bg-[#1C1C1F] border-white/5 hover:border-white/10" : "bg-[#F2F2F7] border-transparent hover:border-black/5"
                      )}
                    >
                      <div className="flex items-center gap-4 overflow-hidden">
                        <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center shrink-0">
                          <QrCode className="w-5 h-5 text-[#3B82F6]" />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <span className={cn("text-sm font-bold capitalize", isDarkMode ? "text-white" : "text-black")}>
                            {qr.type} QR
                          </span>
                          <span className={cn("text-[11px] font-medium truncate max-w-[180px]", isDarkMode ? "text-[#A1A1AA]" : "text-[#8E8E93]")}>
                            {qr.data}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            setGeneratedAmount(null);
                            setGeneratedNote(qr.data);
                            setQrType(qr.type);
                            setIsBottomSheetOpen(true);
                            setIsHistoryOpen(false);
                            triggerVibration();
                          }}
                          className="w-8 h-8 rounded-full bg-[#3B82F6]/10 hover:bg-[#3B82F6]/20 transition-colors flex items-center justify-center"
                        >
                          <ArrowRight className="w-4 h-4 text-[#3B82F6]" />
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            setRecentQRs(prev => prev.filter(item => item.id !== qr.id));
                            triggerVibration();
                          }}
                          className="w-8 h-8 rounded-full bg-red-500/10 hover:bg-red-500/20 transition-colors flex items-center justify-center"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
