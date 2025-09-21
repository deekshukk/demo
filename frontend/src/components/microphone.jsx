import { MicrophoneIcon } from "@heroicons/react/24/solid";

const MicrophoneButton = ({ listening, onToggle, showWelcome }) => {
  return (
    <div className="flex flex-col items-center">
      <div
        onClick={onToggle}
        className={`relative w-16 h-16 mt-12 mb-4 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 shadow-xl hover:shadow-2xl ${
          listening
            ? 'bg-gradient-to-br from-[#4F75FF] to-[#305CDE] scale-110'
            : 'bg-gradient-to-br from-[#305CDE] to-[#4F75FF] hover:scale-105'
        }`}
      >
        {listening && (
          <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping" />
        )}
        <MicrophoneIcon className="w-8 h-8 text-white" />
      </div>
      {showWelcome && (
        <p className="text-sm text-gray-600 mb-6 animate-fadeIn">
          Click microphone to start talking
        </p>
      )}
    </div>
  );
};

export default MicrophoneButton;