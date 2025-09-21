import { useState, useEffect } from 'react';

const AssistantSpeechDisplay = ({ assistantSpeech, thinking }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  // typewriter 
  useEffect(() => {
    if (assistantSpeech && currentIndex < assistantSpeech.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + assistantSpeech[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 30); 
      
      return () => clearTimeout(timeout);
    }
  }, [assistantSpeech, currentIndex]);

  // reset 
  useEffect(() => {
    if (assistantSpeech) {
      setDisplayedText('');
      setCurrentIndex(0);
    }
  }, [assistantSpeech]);

  // thinking state
  if (thinking && !assistantSpeech) {
    return (
      <div className="text-gray-600 italic mt-4 animate-slideInUp">
        <span>Thinking</span>
        <span className="animate-typing-dots">
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </span>
      </div>
    );
  }

  // show response
  if (assistantSpeech) {
    return (
      <div className="w-120 h-35 overflow-hidden">
        <p className="text-lg text-gray-800 font-medium whitespace-pre-wrap animate-fadeIn">
          {displayedText}
          <span className="animate-blink">|</span>
        </p>
      </div>
    );
  }

  return null;
};

export default AssistantSpeechDisplay;
