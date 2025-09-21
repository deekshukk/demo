import { useState, useEffect } from 'react';

const UserSpeechDisplay = ({ listening, userSpeech, interimSpeech }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Typewriter effect for user speech
  useEffect(() => {
    if (userSpeech && !listening && currentIndex < userSpeech.length) {
      setIsAnimating(true);
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + userSpeech[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 20); // Faster typing for user speech
      
      return () => clearTimeout(timeout);
    } else if (userSpeech && !listening && currentIndex >= userSpeech.length) {
      setIsAnimating(false);
    }
  }, [userSpeech, listening, currentIndex]);

  // Reset when new speech starts
  useEffect(() => {
    if (userSpeech && !listening) {
      setDisplayedText('');
      setCurrentIndex(0);
    }
  }, [userSpeech, listening]);

  if (!listening && !userSpeech) {
    return null;
  }

  if (listening) {
    return (
      <p className="text-gray-700 font-medium animate-slideInDown">
        {userSpeech} <span className="opacity-50 animate-pulse">{interimSpeech}</span>
      </p>
    );
  }

  if (userSpeech) {
    return (
      <p className="text-lg text-gray-700 animate-slideInDown">
        {displayedText}
        {isAnimating && <span className="animate-blink">|</span>}
      </p>
    );
  }

  return null;
};

export default UserSpeechDisplay;
