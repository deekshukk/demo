import { useState, useEffect, useRef, useCallback } from "react";
import "./index.css";
import { TypeAnimation } from "react-type-animation";
import Assistant from "./components/assistant";
import MircophoneButton from "./components/microphone";
import UserSpeechDisplay from "./components/userspeech";
import AssistantSpeechDisplay from './components/assistantspeech';

export default function App() {
  const [listening, setListening] = useState(false);
  const [userSpeech, setUserSpeech] = useState("");
  const [assistantSpeech, setAssistantSpeech] = useState("");
  const [voices, setVoices] = useState([]);
  const [interimSpeech, setInterimSpeech] = useState("");
  const [thinking, setThinking] = useState(false);

  const recognitionRef = useRef(null);

  // Load available voices
  useEffect(() => {
    const synth = window.speechSynthesis;
    const loadVoices = () => setVoices(synth.getVoices());
    loadVoices();
    synth.onvoiceschanged = loadVoices;
  }, []);

  // Initialize speech recognition
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

    recognition.onstart = () => {
      setListening(true);
      setUserSpeech("");
      setAssistantSpeech("");
      setInterimSpeech("");
    };
    recognition.onspeechend = () => {
      recognition.stop();
      setListening(false); 
    };

    recognition.onend = () => setListening(false);

    recognition.onresult = (event) => {
      let interim = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        event.results[i].isFinal ? (finalTranscript += transcript) : (interim += transcript);
      }

      if (finalTranscript) {
        setUserSpeech((prev) => prev + " " + finalTranscript);
        respondToUser(finalTranscript);
      }

      setInterimSpeech(interim);
    };

    recognitionRef.current = recognition;
  }, [voices]);

  // Function to speak text
  const speakFriendly = useCallback(
    (text) => {
      if (!text) return;
      const utterance = new SpeechSynthesisUtterance(text);
      const friendlyVoice = voices.find((v) => v.name.includes("Samantha")) || voices[0];
      if (friendlyVoice) utterance.voice = friendlyVoice;
      utterance.pitch = 1.2;
      utterance.rate = 1;
      window.speechSynthesis.speak(utterance);
    },
    [voices]
  );

  // Function to call backend
  const respondToUser = async (transcript) => {
    try {
      setThinking(true);
      const res = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: transcript }),
      });
      const data = await res.json();
      const reply = data.reply;
      setAssistantSpeech(reply);
      speakFriendly(reply);
      setThinking(false);
    } catch (error) {
      console.error(error);
      const fallback = "Sorry, I couldn't process that.";
      setAssistantSpeech(fallback);
      speakFriendly(fallback);
    }
  };

  const toggleListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    listening ? recognition.stop() : recognition.start();
  };

  const showWelcome = !listening && !userSpeech && !assistantSpeech && !thinking;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-[#FFFFF0] space-y-8 relative">
      <Assistant />

      {showWelcome && (
        <div>
          <p className="text-2xl mt-4 mb-4 font-medium text-gray-900 transition-opacity duration-500">
            Hi! What can I help you with today?
          </p>
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