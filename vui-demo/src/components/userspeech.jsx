const UserSpeechDisplay = ({ listening, userSpeech, interimSpeech }) => {
  if (!listening && !userSpeech) {
    return null;
  }

  if (listening) {
    return (
      <p className="text-gray-700 font-medium mt-4 transition-opacity duration-500">
        {userSpeech} <span className="opacity-50">{interimSpeech}</span>
      </p>
    );
  }

  if (userSpeech) {
    return (
      <p className="text-lg text-gray-700 mt-4 transition-opacity duration-500">
        {userSpeech}
      </p>
    );
  }

  return null;
};

export default UserSpeechDisplay;
