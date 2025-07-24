import React, { useState, useEffect } from 'react';
import { useTabs } from '../../context/TabContext';
import { FiUser, FiEyeOff, FiUserCheck, FiUserX, FiCheckCircle, FiXCircle, FiTrash2, FiLock, FiAlertTriangle, FiBarChart2, FiRefreshCw, FiShield, FiInfo } from 'react-icons/fi';

const IncognitoBadge = () => {
  const { tabs, activeTabId } = useTabs();
  const [isIncognito, setIsIncognito] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const activeTab = tabs.find(tab => tab.id === activeTabId);

  const toggleIncognitoMode = () => {
    setIsIncognito(!isIncognito);
    // In a real app, this would actually toggle incognito mode
  };

  const getIncognitoIcon = () => {
    return isIncognito ? <FiEyeOff className="text-purple-400" /> : <FiUser className="text-blue-400" />;
  };

  const getIncognitoColor = () => {
    return isIncognito ? 'text-purple-400' : 'text-blue-400';
  };

  const getIncognitoBackground = () => {
    return isIncognito 
      ? 'bg-purple-400/20 border-purple-400/30' 
      : 'bg-blue-400/20 border-blue-400/30';
  };

  const getPrivacyFeatures = () => {
    if (isIncognito) {
      return [
        { feature: 'Browsing History', status: 'Not Saved', icon: <FiXCircle className="text-red-400" /> },
        { feature: 'Cookies', status: 'Deleted on Exit', icon: <FiTrash2 className="text-yellow-400" /> },
        { feature: 'Site Data', status: 'Not Saved', icon: <FiXCircle className="text-red-400" /> },
        { feature: 'Form Data', status: 'Not Saved', icon: <FiXCircle className="text-red-400" /> },
        { feature: 'Downloads', status: 'Saved', icon: <FiCheckCircle className="text-green-400" /> },
        { feature: 'Bookmarks', status: 'Saved', icon: <FiCheckCircle className="text-green-400" /> }
      ];
    } else {
      return [
        { feature: 'Browsing History', status: 'Saved', icon: <FiCheckCircle className="text-green-400" /> },
        { feature: 'Cookies', status: 'Saved', icon: <FiCheckCircle className="text-green-400" /> },
        { feature: 'Site Data', status: 'Saved', icon: <FiCheckCircle className="text-green-400" /> },
        { feature: 'Form Data', status: 'Saved', icon: <FiCheckCircle className="text-green-400" /> },
        { feature: 'Downloads', status: 'Saved', icon: <FiCheckCircle className="text-green-400" /> },
        { feature: 'Bookmarks', status: 'Saved', icon: <FiCheckCircle className="text-green-400" /> }
      ];
    }
  };

  const getPrivacyTips = () => {
    if (isIncognito) {
      return [
        'Your activity is not saved to your device',
        'You\'re still visible to websites you visit',
        'Your activity is still visible to your employer or ISP',
        'Downloads and bookmarks are still saved'
      ];
    } else {
      return [
        'Your browsing history is saved locally',
        'Cookies and site data are stored',
        'Form data and passwords may be saved',
        'Consider incognito mode for sensitive browsing'
      ];
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 backdrop-blur-xl saturate-200 border border-white/40 rounded-2xl shadow-2xl" 
         style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
          {getIncognitoIcon()}
          <span>Privacy Mode</span>
        </h2>
        <button
          onClick={toggleIncognitoMode}
          className={`px-4 py-2 rounded-lg border transition-all duration-200 ${getIncognitoBackground()}`}
        >
          {isIncognito ? <><FiRefreshCw className="inline mr-1" /> Exit Incognito</> : <><FiEyeOff className="inline mr-1" /> Enter Incognito</>}
        </button>
      </div>
      {/* Main Status Badge */}
      <div className={`p-6 rounded-lg border-2 mb-6 ${getIncognitoBackground()}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`text-4xl ${getIncognitoColor()}`}>{getIncognitoIcon()}</div>
            <div>
              <h3 className={`text-xl font-bold ${getIncognitoColor()}`}>{isIncognito ? 'Incognito Mode Active' : 'Regular Browsing Mode'}</h3>
              <p className="text-white/80">{isIncognito ? 'Your browsing activity is not saved to this device' : 'Your browsing activity is saved locally'}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${getIncognitoColor()}`}>{isIncognito ? 'Private' : 'Regular'}</div>
            <div className="text-sm text-white/70">{isIncognito ? 'Enhanced Privacy' : 'Standard Privacy'}</div>
          </div>
        </div>
      </div>
      {/* Privacy Features */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Privacy Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {getPrivacyFeatures().map((feature, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/20">
              <div className="flex items-center space-x-3">
                <span className="text-lg">{feature.icon}</span>
                <span className="text-white font-medium">{feature.feature}</span>
              </div>
              <span className={`text-sm ${feature.status === 'Saved' ? 'text-green-400' : feature.status === 'Not Saved' ? 'text-red-400' : 'text-yellow-400'}`}>{feature.status}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Current Tab Info */}
      {activeTab && (
        <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-2">Current Tab</h3>
          <div className="text-white">{activeTab.url || 'No URL'}</div>
          <div className="text-sm text-white/70 mt-1">{isIncognito ? 'This page will not be saved to your browsing history' : 'This page will be saved to your browsing history'}</div>
        </div>
      )}
      {/* Privacy Tips */}
      <div className="mb-6 p-4 bg-yellow-400/20 border border-yellow-400/30 rounded-lg flex items-center gap-2">
        <FiInfo className="inline text-yellow-200" />
        <h4 className="text-md font-semibold text-yellow-200 mb-2">{isIncognito ? 'Incognito Mode Tips' : 'Regular Mode Tips'}</h4>
        <ul className="text-sm text-yellow-100 space-y-1">
          {getPrivacyTips().map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </div>
      {/* Detailed Privacy Information */}
      <div className="mb-6">
        <button onClick={() => setShowDetails(!showDetails)} className="w-full p-4 bg-white/5 rounded-lg border border-white/20 hover:bg-white/10 transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-white font-medium">{showDetails ? 'Hide' : 'Show'} Detailed Privacy Information</span>
            <span className="text-white">{showDetails ? '▲' : '▼'}</span>
          </div>
        </button>
        {showDetails && (
          <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/20">
            <h4 className="text-md font-semibold text-white mb-3">What {isIncognito ? 'Incognito' : 'Regular'} Mode Does:</h4>
            {isIncognito ? (
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <FiXCircle className="text-green-400" />
                  <div>
                    <div className="text-white font-medium">Does NOT save:</div>
                    <div className="text-sm text-white/70">Browsing history, cookies, site data, form information</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FiAlertTriangle className="text-yellow-400" />
                  <div>
                    <div className="text-white font-medium">Still visible to:</div>
                    <div className="text-sm text-white/70">Websites you visit, your employer, your internet service provider</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FiDownload className="text-blue-400" />
                  <div>
                    <div className="text-white font-medium">Still saves:</div>
                    <div className="text-sm text-white/70">Downloads, bookmarks, and files you create</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <FiDownload className="text-blue-400" />
                  <div>
                    <div className="text-white font-medium">Saves locally:</div>
                    <div className="text-sm text-white/70">Browsing history, cookies, site data, form information, passwords</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FiAlertTriangle className="text-yellow-400" />
                  <div>
                    <div className="text-white font-medium">Privacy considerations:</div>
                    <div className="text-sm text-white/70">Data is stored on your device and may be accessible to other users</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FiLock className="text-green-400" />
                  <div>
                    <div className="text-white font-medium">Enhanced features:</div>
                    <div className="text-sm text-white/70">Password autofill, personalized search results, site preferences</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="p-4 bg-white/5 rounded-lg border border-white/20 hover:bg-white/10 transition-all duration-200">
          <div className="text-center">
            <FiTrash2 className="text-2xl mb-2 text-blue-400" />
            <div className="text-white font-medium">Clear Browsing Data</div>
            <div className="text-sm text-white/70">Remove saved data</div>
          </div>
        </button>
        <button className="p-4 bg-white/5 rounded-lg border border-white/20 hover:bg-white/10 transition-all duration-200">
          <div className="text-center">
            <FiShield className="text-2xl mb-2 text-blue-400" />
            <div className="text-white font-medium">Privacy Settings</div>
            <div className="text-sm text-white/70">Configure privacy options</div>
          </div>
        </button>
        <button className="p-4 bg-white/5 rounded-lg border border-white/20 hover:bg-white/10 transition-all duration-200">
          <div className="text-center">
            <FiBarChart2 className="text-2xl mb-2 text-blue-400" />
            <div className="text-white font-medium">Privacy Report</div>
            <div className="text-sm text-white/70">View detailed report</div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default IncognitoBadge; 