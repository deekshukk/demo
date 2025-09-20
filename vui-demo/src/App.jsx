import { MicrophoneIcon } from "@heroicons/react/24/solid";
import { useState, useEffect, useRef, useCallback } from "react";
import "./index.css";
import Assistant from "./components/assistant";
import { TypeAnimation } from "react-type-animation";

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
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setListening(true);
      setUserSpeech("");
      setAssistantSpeech("");
      setInterimSpeech("");
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
      const friendlyVoice =
        voices.find((v) => v.name.includes("Samantha")) ||
        voices.find((v) => v.lang === "en-US") ||
        voices[0];

      if (friendlyVoice) utterance.voice = friendlyVoice;
      utterance.pitch = 1.5;
      utterance.rate = 1;

      window.speechSynthesis.speak(utterance);
    },
    [voices]
  );

  const respondToUser = (transcript) => {
    const userName = "Zac";
    const response = `Hey ${userName}, I got that. Let’s work on it!`;
    setAssistantSpeech(response);
    speakFriendly(response);
  };

  const toggleListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    listening ? recognition.stop() : recognition.start();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-[#FFFFF0] space-y-8 relative">
      <Assistant />

      {assistantSpeech ? (
        <p className="text-lg text-gray-800 font-medium whitespace-pre-wrap transition-opacity duration-500">
          {assistantSpeech}
        </p>
      ) : !listening ? (
        <div>
          <p className="text-2xl mt-4 mb-4 font-medium text-gray-900 transition-opacity duration-500">
            Hi Zac, what can I help you with today?
          </p>

          <TypeAnimation
            className="text-m text-gray-700"
            sequence={[
              "How can I streamline my workflows?",
              1000,
              "Why is Terac awesome?",
              1000,
              "How can I shape the future of AI?",
              1000,
            ]}
            speed={50}
            repeat={Infinity}
          />
        </div>
      ) : null}

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

      {!listening && !userSpeech && <p className="text-gray-500 transition-opacity duration-500">Click the microphone to get started</p>}

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