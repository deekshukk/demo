const UserSpeechDisplay = ({ listening, userSpeech, interimSpeech }) => {
  if (!listening && !userSpeech) {
    return null;
  }

  if (listening) {
    return (
      <p className="text-gray-700 font-medium transition-opacity duration-700">
        {userSpeech} <span className="opacity-50">{interimSpeech}</span>
      </p>
    );
  }

  if (userSpeech) {
    return (
      <p className="text-lg text-gray-700 transition-opacity duration-700">
        {userSpeech}
      </p>
    );
  }

  return null;
};

export default UserSpeechDisplay;
