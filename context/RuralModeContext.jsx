import { createContext, useContext, useState, useEffect } from 'react';

const RuralModeContext = createContext();

export function RuralModeProvider({ children }) {
  const [isRuralMode, setIsRuralMode] = useState(() => {
    const saved = localStorage.getItem('arogyaRuralMode');
    return saved === 'true';
  });

  const [voiceEnabled, setVoiceEnabled] = useState(true);

  useEffect(() => {
    localStorage.setItem('arogyaRuralMode', isRuralMode);
  }, [isRuralMode]);

  const toggleRuralMode = () => setIsRuralMode(prev => !prev);
  const toggleVoice = () => setVoiceEnabled(prev => !prev);

  return (
    <RuralModeContext.Provider value={{ isRuralMode, toggleRuralMode, voiceEnabled, toggleVoice }}>
      <div className={isRuralMode ? 'rural-theme' : ''}>
        {children}
      </div>
    </RuralModeContext.Provider>
  );
}

export const useRuralMode = () => useContext(RuralModeContext);
