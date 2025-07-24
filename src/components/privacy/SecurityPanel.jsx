import React, { useState, useEffect } from 'react';
import { useTabs } from '../../context/TabContext';
import { useSettings } from '../../context/SettingsContext';
import GlassPanel from '../settings/GlassPanel';
import { FiLock, FiAlertTriangle, FiShield, FiEyeOff, FiKey, FiInfo, FiCheckCircle, FiXCircle, FiShieldOff, FiAward, FiUserX, FiUserCheck } from 'react-icons/fi';

const SecurityPanel = () => {
  const { tabs, activeTabId } = useTabs();
  const { settings, updateSetting } = useSettings();
  const [securityStatus, setSecurityStatus] = useState({
    isSecure: false,
    protocol: 'http',
    certificate: null,
    warnings: []
  });

  const activeTab = tabs.find(tab => tab.id === activeTabId);
  const currentUrl = activeTab?.url || '';

  // Simulate security status based on URL
  useEffect(() => {
    if (currentUrl) {
      const url = new URL(currentUrl.startsWith('http') ? currentUrl : `https://${currentUrl}`);
      const isSecure = url.protocol === 'https:';
      setSecurityStatus({
        isSecure,
        protocol: url.protocol.replace(':', ''),
        certificate: isSecure ? {
          issuer: 'Let\'s Encrypt',
          validFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          validTo: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
          subject: url.hostname
        } : null,
        warnings: isSecure ? [] : ['Connection is not secure', 'Data may be intercepted']
      });
    }
  }, [currentUrl]);

  const getSecurityIcon = () => {
    if (!currentUrl) return <FiEyeOff className="text-gray-400" />;
    return securityStatus.isSecure ? <FiLock className="text-green-400" /> : <FiAlertTriangle className="text-yellow-400" />;
  };

  const getSecurityColor = () => {
    if (!currentUrl) return 'text-gray-400';
    return securityStatus.isSecure ? 'text-green-400' : 'text-yellow-400';
  };

  const getSecurityText = () => {
    if (!currentUrl) return 'No page loaded';
    return securityStatus.isSecure ? 'Connection is secure' : 'Connection is not secure';
  };

  const getSecurityDescription = () => {
    if (!currentUrl) return 'Load a page to see security information';
    if (securityStatus.isSecure) {
      return 'Your connection to this site is encrypted and secure.';
    }
    return 'This site is not using a secure connection. Your data may be vulnerable.';
  };

  return (
    <GlassPanel className="w-full max-w-2xl mx-auto p-6 shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
        <FiLock />
        <span>Security & Privacy</span>
      </h2>
      {/* Current Page Security Status */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Current Page Security</h3>
        <div className={`p-4 rounded-lg border-2 ${securityStatus.isSecure ? 'border-green-400/50 bg-green-400/10' : 'border-yellow-400/50 bg-yellow-400/10'}`}> 
          <div className="flex items-center space-x-3 mb-3">
            <span className={`text-2xl ${getSecurityColor()}`}>{getSecurityIcon()}</span>
            <div>
              <div className={`font-semibold ${getSecurityColor()}`}>{getSecurityText()}</div>
              <div className="text-sm text-white/70">{currentUrl || 'No URL'}</div>
            </div>
          </div>
          <p className="text-sm text-white/80">{getSecurityDescription()}</p>
          {securityStatus.warnings.length > 0 && (
            <div className="mt-3 p-3 bg-yellow-400/20 border border-yellow-400/30 rounded-lg">
              <div className="text-sm font-medium text-yellow-200 mb-2 flex items-center gap-1"><FiAlertTriangle /> Security Warnings:</div>
              <ul className="text-sm text-yellow-100 space-y-1">
                {securityStatus.warnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      {/* Privacy Settings */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Privacy Protection</h3>
        <div className="space-y-4">
          {/* Tracking Protection */}
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/20">
            <div className="flex items-center space-x-3">
              <FiShield className="text-xl" />
              <div>
                <div className="font-medium text-white">Tracking Protection</div>
                <div className="text-sm text-white/70">Block trackers and fingerprinting</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableTrackingProtection}
                onChange={(e) => updateSetting('enableTrackingProtection', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-400"></div>
            </label>
          </div>
          {/* Third Party Cookies */}
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/20">
            <div className="flex items-center space-x-3">
              <FiAward className="text-xl" />
              <div>
                <div className="font-medium text-white">Block Third-Party Cookies</div>
                <div className="text-sm text-white/70">Prevent cross-site tracking</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.blockThirdPartyCookies}
                onChange={(e) => updateSetting('blockThirdPartyCookies', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-400"></div>
            </label>
          </div>
          {/* Do Not Track */}
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/20">
            <div className="flex items-center space-x-3">
              <FiUserX className="text-xl" />
              <div>
                <div className="font-medium text-white">Send Do Not Track Signal</div>
                <div className="text-sm text-white/70">Request sites not to track you</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableDoNotTrack}
                onChange={(e) => updateSetting('enableDoNotTrack', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-400"></div>
            </label>
          </div>
        </div>
      </div>
      {/* Security Statistics */}
      {/* Removed mock statistics */}
      {/* Certificate Information */}
      {securityStatus.certificate && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Certificate Information</h3>
          <div className="p-4 bg-white/5 rounded-lg border border-white/20 space-y-2">
            <div className="flex justify-between">
              <span className="text-white/70">Issuer:</span>
              <span className="text-white">{securityStatus.certificate.issuer}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Valid From:</span>
              <span className="text-white">{new Date(securityStatus.certificate.validFrom).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Valid Until:</span>
              <span className="text-white">{new Date(securityStatus.certificate.validTo).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Subject:</span>
              <span className="text-white">{securityStatus.certificate.subject}</span>
            </div>
          </div>
        </div>
      )}
      {/* Security Tips */}
      <div className="p-4 bg-blue-400/20 border border-blue-400/30 rounded-lg flex items-center gap-2">
        <FiInfo className="inline text-blue-200" />
        <h4 className="text-md font-semibold text-blue-200 mb-2">Security Tips</h4>
        <ul className="text-sm text-blue-100 space-y-1">
          <li>• Always check for the lock icon before entering sensitive information</li>
          <li>• Be cautious of sites asking for unnecessary permissions</li>
          <li>• Keep your browser and extensions updated</li>
          <li>• Use strong, unique passwords for each site</li>
        </ul>
      </div>
    </GlassPanel>
  );
};

export default SecurityPanel; 