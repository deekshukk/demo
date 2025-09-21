const Assistant = ({ listening = false, thinking = false, talking = false }) => {
  const getBlobAnimation = () => {
    if (talking) return 'animate-blob-talking';
    if (thinking) return 'animate-blob-thinking';
    if (listening) return 'animate-blob-listening';
    return 'animate-blob-idle';
  };

  const getBlobReverseAnimation = () => {
    return 'animate-blob-idle';
  };

  return (
    <div className="relative inline-block mb-8">
      <div className="relative w-32 h-32 mx-auto">
        <div className={`absolute inset-0 bg-gradient-to-br from-[#305CDE] via-[#4F75FF] to-[#6B8AFF] rounded-full ${getBlobAnimation()} opacity-90`}></div>
        <div className={`absolute inset-2 bg-gradient-to-tr from-[#4F75FF] via-[#305CDE] to-[#8BA5FF] rounded-full ${getBlobReverseAnimation()} opacity-70`}></div>
        <div className="absolute inset-4 bg-gradient-to-br from-white/30 to-transparent rounded-full animate-pulse-slow"></div>
        <div className="absolute -top-2 -right-2 w-3 h-3 bg-[#305CDE] rounded-full animate-float opacity-60"></div>
        <div className="absolute -bottom-1 -left-3 w-2 h-2 bg-[#4F75FF] rounded-full animate-float-delayed opacity-50"></div>
        <div className="absolute top-1/2 -right-4 w-1.5 h-1.5 bg-[#6B8AFF] rounded-full animate-float-slow opacity-40"></div>
      </div>
    </div>
  );
}

export default Assistant;