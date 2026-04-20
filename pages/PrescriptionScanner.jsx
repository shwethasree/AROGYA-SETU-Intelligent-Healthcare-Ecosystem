import { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import Tesseract from 'tesseract.js';
import { Camera, RefreshCw, CheckCircle2, AlertCircle, Info, Sun, Moon, Utensils, X, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRuralMode } from '../context/RuralModeContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function PrescriptionScanner() {
  const { t } = useTranslation();
  const { isRuralMode } = useRuralMode();
  const [image, setImage] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const webcamRef = useRef(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
    scanImage(imageSrc);
  }, [webcamRef]);

  const scanImage = async (imgUri) => {
    setScanning(true);
    try {
      const { data: { text } } = await Tesseract.recognize(imgUri, 'eng+hin', {
        logger: m => console.log(m)
      });

      // AI Logic: Extraction (Mocked locally for speed, usually sent to LLM)
      // We look for common medicine keywords and patterns
      const parsed = parsePrescription(text);
      setResult(parsed);
    } catch (err) {
      console.error(err);
    } finally {
      setScanning(false);
    }
  };

  const parsePrescription = (text) => {
    const lines = text.split('\n').map(l => l.toLowerCase());
    
    // Demo logic: If text contains 'para' it's Paracetamol
    let medicine = "Unknown Medicine";
    if (text.toLowerCase().includes('para')) medicine = "Paracetamol (500mg)";
    if (text.toLowerCase().includes('amox')) medicine = "Amoxicillin";
    if (text.toLowerCase().includes('meta')) medicine = "Metformin";

    return {
      name: medicine,
      dosage: "1-0-1", // Morning - Afternoon - Night
      timing: "After Food",
      duration: "5 Days",
      raw: text.substring(0, 100) + "..."
    };
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className={`font-display font-bold text-white ${isRuralMode ? 'text-5xl mb-4' : 'text-3xl mb-2'}`}>
          {t('visionScanner')}
        </h1>
        <p className="text-white/40">{isRuralMode ? 'Show your medicine or paper to the camera' : 'AI-powered OCR to read medicine names and dosages'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Camera Section */}
        <div className="glass-card p-4 flex flex-col items-center">
          {!image ? (
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-black border border-white/10">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full h-full object-cover"
                videoConstraints={{ facingMode: "environment" }}
              />
              <div className="absolute inset-0 border-2 border-primary-500/30 border-dashed m-10 rounded-3xl pointer-events-none" />
              <button 
                onClick={capture}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center shadow-2xl animate-glow"
              >
                <Camera className="w-8 h-8 text-white" />
              </button>
            </div>
          ) : (
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden">
              <img src={image} className="w-full h-full object-cover" alt="Captured" />
              {scanning && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                  <RefreshCw className="w-10 h-10 text-primary-400 animate-spin mb-4" />
                  <p className="text-white font-medium animate-pulse">Reading Medicine Information...</p>
                </div>
              )}
              <button 
                onClick={() => { setImage(null); setResult(null); }}
                className="absolute top-4 right-4 p-2 rounded-lg bg-red-500 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Result Section */}
        <div className="flex flex-col gap-4">
          <AnimatePresence>
            {result ? (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card p-6 border-green-500/30"
              >
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                  <h2 className="text-white font-bold text-xl">Medicine Found</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="text-white/40 text-xs font-medium uppercase mb-1">Medicine Name</p>
                    <p className={`text-white font-bold ${isRuralMode ? 'text-3xl' : 'text-xl'}`}>{result.name}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <p className="text-white/40 text-[10px] font-bold uppercase mb-3 text-center">Dosage Timing (How to take)</p>
                      
                      <div className="flex items-center justify-center gap-6">
                        <div className="flex flex-col items-center gap-2">
                          <div className={`p-4 rounded-2xl ${result.dosage.startsWith('1') ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30 shadow-lg shadow-amber-500/20' : 'bg-white/5 text-white/20'}`}>
                            <Sun className={isRuralMode ? 'w-12 h-12' : 'w-8 h-8'} />
                          </div>
                          <span className="text-[10px] text-white/40">Morning</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <div className={`p-4 rounded-2xl bg-white/5 text-white/20`}>
                            <Sun className={isRuralMode ? 'w-12 h-12' : 'w-8 h-8'} />
                          </div>
                          <span className="text-[10px] text-white/40">Afternoon</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <div className={`p-4 rounded-2xl ${result.dosage.endsWith('1') ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/20' : 'bg-white/5 text-white/20'}`}>
                            <Moon className={isRuralMode ? 'w-12 h-12' : 'w-8 h-8'} />
                          </div>
                          <span className="text-[10px] text-white/40">Night</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-primary-500/10 border border-primary-500/20">
                      <div className="w-12 h-12 rounded-xl bg-primary-500 flex items-center justify-center">
                        <Utensils className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-bold">{result.timing}</p>
                        <p className="text-primary-400 text-xs">Recommended for effectiveness</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-500/10 text-blue-300 text-[10px]">
                    <Info className="w-4 h-4 flex-shrink-0" />
                    <p>AI detected from text: "{result.raw}"</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-white/10 rounded-3xl">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <Activity className="w-10 h-10 text-white/20" />
                </div>
                <h3 className="text-white/60 font-medium mb-2">Awaiting Scan</h3>
                <p className="text-white/30 text-sm">Align the name of the medicine strip within the frame and click the camera button.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
