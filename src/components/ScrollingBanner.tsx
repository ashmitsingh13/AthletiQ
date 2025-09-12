"use client";
export default function ScrollingBanner() {
  return (
    <div className="w-full overflow-hidden bg-blue-600 py-2 md:py-3">
      <div className="animate-scroll flex whitespace-nowrap">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="flex items-center">
            <span className="text-white mx-2 md:mx-4">❋</span>
            <span className="text-white text-sm md:text-lg font-medium">AI POSTURE ANALYSIS</span>
            <span className="text-white mx-2 md:mx-4">❋</span>
            <span className="text-white text-sm md:text-lg font-medium">SMART FITNESS COACH</span>
            <span className="text-white mx-2 md:mx-4">❋</span>
            <span className="text-white text-sm md:text-lg font-medium">WORKOUT FORM CORRECTION</span>
            <span className="text-white mx-2 md:mx-4">❋</span>
            <span className="text-white text-sm md:text-lg font-medium">REAL-TIME FEEDBACK</span>
            <span className="text-white mx-2 md:mx-4">❋</span>
            <span className="text-white text-sm md:text-lg font-medium">PERSONALIZED TRAINING PLANS</span>
          </div>
        ))}
      </div>
    </div>
  );
}
