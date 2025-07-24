import React, { useState } from 'react';
import { FiInfo } from 'react-icons/fi';

const VersionFooter = () => {
  // Minimal browser info (static or from props/env if needed)
  const [browserInfo] = useState({
    version: '1.0.0',
    buildNumber: '1.0.0',
    channel: 'stable',
  });

  return (
    <div className="w-full max-w-full sm:max-w-xl mx-auto p-4 sm:p-8 backdrop-blur-xl saturate-200 border border-white/40 rounded-2xl shadow-2xl mt-6 sm:mt-12" 
         style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}>
      <div className="flex flex-col items-center justify-center space-y-4">
        <FiInfo className="text-4xl text-blue-300 mb-2" />
        <div className="text-2xl font-bold text-white">NoxX Browser</div>
        <div className="text-lg text-white/80">A modern, secure, and elegant browser experience.</div>
        <div className="flex flex-col items-center mt-4 space-y-1">
          <div className="text-white/80">Version <span className="font-semibold text-white">{browserInfo.version}</span></div>
          <div className="text-white/80">Build <span className="font-semibold text-white">{browserInfo.buildNumber}</span></div>
          <div className="text-white/80">Channel <span className="font-semibold text-white">{browserInfo.channel}</span></div>
        </div>
        <div className="text-xs text-white/40 mt-6">© 2025 NoxX Browser Team • All rights reserved.</div>
      </div>
    </div>
  );
};

export default VersionFooter; 