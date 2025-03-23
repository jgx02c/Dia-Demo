import React from 'react';
import { demoScript } from '@/data/demo-script';

export const DemoScript: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-semibold text-[#dcddde] mb-2">{demoScript.title}</h2>
          <div className="text-[#b9bbbe] space-y-2">
            {demoScript.subtitle.split('\n').map((line, index) => (
              <p key={index} className="flex items-center space-x-2">
                <span>{line}</span>
              </p>
            ))}
          </div>
        </div>

        {/* Case Details */}
        <div>
          <div className="mb-4">
            <h3 className="text-[#dcddde] font-medium">Case Details</h3>
            <div className="mt-2 space-y-1 text-sm text-[#b9bbbe]">
              <p><strong>Case:</strong> {demoScript.caseDetails.name}</p>
              <p><strong>Date:</strong> {demoScript.caseDetails.date}</p>
              <p><strong>Location:</strong> {demoScript.caseDetails.location}</p>
              <p><strong>Time:</strong> {demoScript.caseDetails.time}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-[#dcddde] font-medium mb-2">Present</h3>
            <ul className="space-y-1 text-sm text-[#b9bbbe]">
              {demoScript.participants.map((participant, index) => (
                <li key={index}>{participant}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Dialogue */}
        <div className="space-y-4">
          {demoScript.dialogue.map((line, index) => (
            <div key={index} className="space-y-1">
              {line.speaker === "Narrator" ? (
                <p className="text-[#72767d] italic text-sm">{line.text}</p>
              ) : (
                <>
                  <p className="text-[#dcddde] font-medium">{line.speaker}:</p>
                  <p className="text-[#b9bbbe] text-sm">{line.text}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 