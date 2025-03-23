import React from 'react';

interface TranscriptionOnboardingProps {
  onComplete: (config: { caseId: string; databaseId: string; instructionId: string }) => void;
  onCancel: () => void;
}

export const TranscriptionOnboarding: React.FC<TranscriptionOnboardingProps> = ({
  onComplete,
  onCancel,
}) => {
  const handleStart = () => {
    onComplete({
      caseId: 'demo-case',
      databaseId: 'demo-db',
      instructionId: 'demo-instruction'
    });
  };

  return (
    <div className="bg-[#2f3136] min-h-screen flex items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-[#36393e] rounded-lg p-8 shadow-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#dcddde] mb-4">Welcome to Dialogica Demo</h1>
          <p className="text-xl text-[#b9bbbe]">Experience the future of legal transcription</p>
        </div>

        {/* Main Content */}
        <div className="space-y-6 mb-8">
          <div className="bg-[#2f3136] rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[#dcddde] mb-3">How It Works</h2>
            <p className="text-[#b9bbbe] leading-relaxed">
              This demo showcases Dialogica&apos;s real-time transcription capabilities. Simply read any text aloud, 
              and watch as our AI instantly transcribes your speech while identifying different speakers and 
              key insights from the conversation.
            </p>
          </div>

          <div className="bg-[#2f3136] rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[#dcddde] mb-3">Features You&apos;ll Experience</h2>
            <ul className="space-y-3 text-[#b9bbbe]">
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#5865f2] flex items-center justify-center text-white">✓</div>
                Real-time speech transcription with speaker identification
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#5865f2] flex items-center justify-center text-white">✓</div>
                Automatic bookmarking of important moments
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#5865f2] flex items-center justify-center text-white">✓</div>
                AI-powered insights and analysis
              </li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-6 py-2 rounded-md text-[#dcddde] hover:bg-[#4f545c] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleStart}
            className="px-6 py-2 bg-[#5865f2] rounded-md text-white hover:bg-[#4752c4] transition-colors"
          >
            Start Demo
          </button>
        </div>
      </div>
    </div>
  );
}; 