export default function Me() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6">
      {/* Background-ish circle */}
      <div className="rounded-full bg-[radial-gradient(circle_at_19.72%_-9.17%,#E0E1FE,#FFFFF0)]
 w-45 h-45 flex items-center justify-center">
        {/* Middle circle */}
        <div className="rounded-full bg-[#305CDE] w-36 h-36 flex items-center justify-center">
          {/* Inner circle */}
          <div className="rounded-full bg-[#FFFFF0] w-32 h-32"></div>
        </div>
      </div>
    </div>
  );
}