import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShieldAlert, CheckCircle2, Lock, Unlock, Sparkles, Award, ArrowRight, RotateCcw, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Link } from 'react-router-dom';

export function BlackoutMysteryGame({ onClose, isModal = false }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedColors, setSelectedColors] = useState([]);
  const [riddleAnswer, setRiddleAnswer] = useState('');
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalError, setTerminalError] = useState(false);
  const [solved, setSolved] = useState(false);

  // Clue 1: Google Color Order (Blue, Red, Yellow, Green)
  const targetColorOrder = ['blue', 'red', 'yellow', 'green'];
  const colors = [
    { id: 'blue', label: 'Blue', hex: '#4285F4' },
    { id: 'red', label: 'Red', hex: '#EA4335' },
    { id: 'yellow', label: 'Yellow', hex: '#FBBC04' },
    { id: 'green', label: 'Green', hex: '#34A853' },
  ];

  const handleColorClick = (colorId) => {
    const newSelection = [...selectedColors, colorId];
    setSelectedColors(newSelection);

    if (newSelection.length === 4) {
      const isCorrect = newSelection.every((val, idx) => val === targetColorOrder[idx]);
      if (isCorrect) {
        setTimeout(() => setCurrentStep(2), 500);
      } else {
        setTimeout(() => setSelectedColors([]), 600);
      }
    }
  };

  // Clue 2: The Event Riddle
  const handleRiddleSelect = (choice) => {
    setRiddleAnswer(choice);
    if (choice === 'BLACKOUT') {
      setTimeout(() => setCurrentStep(3), 500);
    }
  };

  // Clue 3: The Terminal Key
  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    if (terminalInput.trim().toUpperCase() === 'BLACKOUT' || terminalInput.trim().toUpperCase() === 'DETECTIVE') {
      setSolved(true);
      setCurrentStep(4);
    } else {
      setTerminalError(true);
      setTimeout(() => setTerminalError(false), 800);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setSelectedColors([]);
    setRiddleAnswer('');
    setTerminalInput('');
    setSolved(false);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto rounded-3xl overflow-hidden bg-slate-950/95 border border-primary/30 p-6 md:p-8 shadow-2xl backdrop-blur-xl text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-red-400 tracking-wider uppercase font-semibold">CLASSIFIED CASE FILE</span>
              <Badge variant="outline" className="text-[10px] text-yellow-400 border-yellow-400/30">OPERATION BLACKOUT</Badge>
            </div>
            <h3 className="text-xl font-bold font-display text-white">The Campus Detective Mystery</h3>
          </div>
        </div>
        {isModal && onClose && (
          <button onClick={onClose} className="p-2 text-white/60 hover:text-white rounded-lg hover:bg-white/10">
            ✕
          </button>
        )}
      </div>

      {/* Progress Indicators */}
      <div className="flex items-center justify-between mb-8 px-2">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center gap-2 flex-1 last:flex-none">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                currentStep > step || solved
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                  : currentStep === step
                  ? 'bg-primary text-white ring-2 ring-primary/40'
                  : 'bg-white/10 text-white/40'
              }`}
            >
              {currentStep > step || solved ? <CheckCircle2 className="w-4 h-4" /> : `0${step}`}
            </div>
            {step < 3 && (
              <div
                className={`h-0.5 flex-1 mx-2 transition-colors ${
                  currentStep > step || solved ? 'bg-green-500' : 'bg-white/10'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {/* STEP 1 */}
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-5 text-center"
          >
            <div className="inline-flex p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white">Clue 1: The Google Core Protocol</h4>
              <p className="text-sm text-slate-300 mt-1 max-w-md mx-auto">
                The mainframe power tripped at 00:00! Align the 4 Google brand colors in sequence to restore transmission.
              </p>
            </div>

            <div className="flex justify-center gap-3 py-2">
              {colors.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleColorClick(c.id)}
                  style={{ backgroundColor: c.hex }}
                  className="w-14 h-14 rounded-2xl shadow-lg hover:scale-110 active:scale-95 transition-all flex items-center justify-center font-bold text-white/90 border border-white/20"
                >
                  {selectedColors.filter(s => s === c.id).length > 0 && '✓'}
                </button>
              ))}
            </div>

            <p className="text-xs text-slate-400 font-mono">
              Sequence entered: {selectedColors.length}/4{' '}
              {selectedColors.length === 4 && selectedColors.join('-') !== targetColorOrder.join('-') && (
                <span className="text-red-400">Incorrect! Resetting...</span>
              )}
            </p>
          </motion.div>
        )}

        {/* STEP 2 */}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-5 text-center"
          >
            <div className="inline-flex p-3 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
              <Unlock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white">Clue 2: The Midnight Dossier</h4>
              <p className="text-sm text-slate-300 mt-1 max-w-md mx-auto">
                "Where darkness meets breakthrough code, clues turn into algorithms, and hackers compete for the crown. What is the tenure's debut mystery event?"
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
              {['CIPHER-X', 'BLACKOUT', 'NIGHTFALL', 'DARKNET'].map((option) => (
                <button
                  key={option}
                  onClick={() => handleRiddleSelect(option)}
                  className={`p-3.5 rounded-xl font-mono text-sm font-semibold border transition-all ${
                    riddleAnswer === option
                      ? option === 'BLACKOUT'
                        ? 'bg-green-500/20 border-green-500 text-green-300 shadow-md'
                        : 'bg-red-500/20 border-red-500 text-red-300'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 3 */}
        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-5 text-center"
          >
            <div className="inline-flex p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white">Clue 3: Decrypt the Final Master Key</h4>
              <p className="text-sm text-slate-300 mt-1 max-w-md mx-auto">
                Type the codeword <span className="text-yellow-400 font-mono font-bold">BLACKOUT</span> to unlock your detective clearance pass.
              </p>
            </div>

            <form onSubmit={handleTerminalSubmit} className="max-w-xs mx-auto space-y-3">
              <div className={`relative rounded-xl border p-1 transition-all ${terminalError ? 'border-red-500 animate-shake' : 'border-white/20'}`}>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  placeholder="Enter passcode..."
                  className="w-full bg-black/50 rounded-lg px-4 py-2.5 font-mono text-center text-sm tracking-widest text-green-400 uppercase focus:outline-none"
                  autoFocus
                />
              </div>
              <Button type="submit" variant="primary" className="w-full bg-[#4285F4] hover:bg-[#1a73e8]">
                Submit Authorization Key
              </Button>
            </form>
          </motion.div>
        )}

        {/* STEP 4: VICTORY & REWARD */}
        {currentStep === 4 && solved && (
          <motion.div
            key="victory"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 text-center py-2"
          >
            <div className="relative inline-flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-yellow-400 to-amber-500 flex items-center justify-center text-slate-950 shadow-xl shadow-yellow-500/30 animate-bounce">
                <Award className="w-10 h-10" />
              </div>
              <Sparkles className="w-6 h-6 text-yellow-300 absolute -top-1 -right-1 animate-spin" />
            </div>

            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-mono font-bold mb-2">
                VERIFIED GDGC DETECTIVE
              </span>
              <h4 className="text-2xl font-bold font-display text-white">Mystery Cracked! Welcome to BLACKOUT</h4>
              <p className="text-sm text-slate-300 mt-2 max-w-md mx-auto">
                You’ve proven your investigative instincts. You have officially unlocked priority entry into the tenure's debut <span className="text-white font-semibold">BLACKOUT Clue-Hunt & Hackathon</span>!
              </p>
            </div>

            {/* Secret Pass Card */}
            <div className="bg-white/5 border border-dashed border-yellow-500/40 rounded-2xl p-4 max-w-sm mx-auto">
              <div className="text-[11px] font-mono text-yellow-400 uppercase tracking-wider">Fast-Track Passcode</div>
              <div className="text-lg font-mono font-bold text-white tracking-widest mt-1">BLACKOUT-VIP-2024</div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button asChild size="lg" className="w-full sm:w-auto bg-[#4285F4] hover:bg-[#1a73e8] shadow-lg shadow-blue-500/25">
                <Link to="/contact">
                  Register for BLACKOUT <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
              <Button onClick={handleReset} variant="outline" size="sm" className="border-white/20 text-white/80 hover:text-white">
                <RotateCcw className="w-3.5 h-3.5 mr-1" /> Play Again
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
