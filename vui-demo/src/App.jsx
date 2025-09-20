import { MicrophoneIcon } from "@heroicons/react/24/solid";
import { useState, useEffect, useRef, useCallback } from "react";
import "./index.css";
import { TypeAnimation } from "react-type-animation";
import Assistant from "./components/assistant";

export default function App() {
  const [listening, setListening] = useState(false);
  const [userSpeech, setUserSpeech] = useState("");
  const [assistantSpeech, setAssistantSpeech] = useState("");
  const [voices, setVoices] = useState([]);
  const [interimSpeech, setInterimSpeech] = useState("");

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
      const res = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: transcript }),
      });
      const data = await res.json();
      const reply = data.reply;
      setAssistantSpeech(reply);
      speakFriendly(reply);
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-[#FFFFF0] space-y-8 relative">
      <Assistant></Assistant>
      {/* Assistant response */}
      {assistantSpeech ? (
        <p className="text-lg text-gray-800 font-medium whitespace-pre-wrap transition-opacity duration-500">
          {assistantSpeech}
        </p>
      ) : !listening ? (
        <div>
          <p className="text-2xl mt-4 mb-4 font-medium text-gray-900 transition-opacity duration-500">
            Hi! What can I help you with today?
          </p>
          <TypeAnimation
            className="text-m text-gray-700"
            sequence={[
              "Ask me about AI...",
              1000,
              "Try giving me a command!",
              1000,
              "Or just say hello!",
              1000,
            ]}
            speed={50}
            repeat={Infinity}
          />
        </div>
      ) : null}

      {/* Microphone button */}
      <div
        onClick={toggleListening}
        className={`relative w-16 h-16 mt-12 mb-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 shadow-xl hover:shadow-2xl ${
          listening
            ? "bg-gradient-to-br from-[#4F75FF] to-[#305CDE] scale-110"
            : "bg-gradient-to-br from-[#305CDE] to-[#4F75FF] hover:scale-105"
        }`}
      >
        {listening && <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping"></span>}
        <MicrophoneIcon className="w-8 h-8 text-white" />
      </div>

      {/* User speech display */}
      {!listening && !userSpeech && <p className="text-gray-500 transition-opacity duration-500">Click the microphone to start speaking</p>}
      {listening && (
        <p className="text-gray-700 font-medium mt-4 transition-opacity duration-500">
          {userSpeech} <span className="opacity-50">{interimSpeech}</span>
        </p>
      )}
      {!listening && userSpeech && (
        <p className="text-lg text-gray-700 mt-4 transition-opacity duration-500">{userSpeech}</p>
      )}
    </div>
  );
}