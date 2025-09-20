const AssistantSpeechDisplay = ({ assistantSpeech, thinking }) => {
  if (assistantSpeech) {
    return (
      <p className="text-lg text-gray-800 font-medium whitespace-pre-wrap transition-opacity duration-500">
        {assistantSpeech}
      </p>
    );
  }

  if (thinking) {
    return <p className="text-gray-600 italic mt-4">Thinking...</p>;
  }

  return null;
};

export default AssistantSpeechDisplay;
