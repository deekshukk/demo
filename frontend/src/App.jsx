import { useState, useEffect, useRef, useCallback } from "react";
import "./index.css";
import { TypeAnimation } from "react-type-animation";
import Assistant from "./components/assistant";
import MircophoneButton from "./components/microphone";
import UserSpeechDisplay from "./components/userspeech";
import AssistantSpeechDisplay from './components/assistantspeech';

export default function App() {
  const [listening, setListening] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [userSpeech, setUserSpeech] = useState("");
  const [assistantSpeech, setAssistantSpeech] = useState("");
  const [interimSpeech, setInterimSpeech] = useState("");

  const recognitionRef = useRef(null);

  // set up for speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    // only supported for english for now, can update for more languages 

    recognition.onstart = () => {
      setListening(true);
      setInterimSpeech(""); 
    };

    recognition.onspeechend = () => {
      setListening(false); 
    };

    recognition.onresult = (event) => {
      let interim = "";
      let final = "";
  
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
    
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }
  
      if (final) {
        const cleanTranscript = final.trim();
        setUserSpeech(cleanTranscript);
        respondToUser(cleanTranscript);
      }
  
      setInterimSpeech(interim);
    };

    recognitionRef.current = recognition;

  }, []);

  // speak text
  const speak = useCallback((text) => {
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 1.2;
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  }, [])

  // open ai call
  const respondToUser = async (transcript) => {
    try {
      setAssistantSpeech(""); 
      setThinking(true);
      const res = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: transcript }),
      });
      const data = await res.json();
      const reply = data.reply;
      setAssistantSpeech(reply);
      speak(reply);
      setThinking(false);
    } catch (error) {
      console.error(error);
      const fallback = "Sorry, I couldn't process that. Please try again.";
      setAssistantSpeech(fallback);
      speak(fallback);
      setThinking(false);
    }
  };

  const toggleListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
  
    if (listening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  const showWelcome = !listening && !userSpeech && !assistantSpeech && !thinking;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-[#FFFFF0] space-y-8 relative">
      <div
        className="absolute inset-0 opacity-3"
        style={{
          backgroundImage: "url('/terac.svg')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      />
      <Assistant 
        listening={listening} 
        thinking={thinking} 
        talking={!!assistantSpeech} 
      />

      {showWelcome && (
        <div className="animate-slideInUp">
          <p className="text-2xl mt-4 mb-4 font-medium text-gray-900 animate-fadeIn">
            Hi! What can I help you with today?
          </p>
          <div className="animate-slideInDown">
            <TypeAnimation
              className="text-m text-gray-700"
              sequence={[
                'Why is Terac awesome?',
                1000,
                'How can I streamline my workflows?',
                1000,
                'What else can I ask you?',
                1000,
              ]}
              speed={50}
              repeat={Infinity}
            />
          </div>
        </div>
      )}

      <AssistantSpeechDisplay 
        assistantSpeech={assistantSpeech} 
        thinking={thinking} 
      />

      <MircophoneButton 
          listening={listening} 
          onToggle={toggleListening} 
      />

      <UserSpeechDisplay
        listening={listening}
        userSpeech={userSpeech}
        interimSpeech={interimSpeech}
      />
    </div>
  );
}