import React, { useState, useEffect } from 'react';
import { FiEye, FiEyeOff, FiPlus, FiSearch, FiEdit, FiTrash2, FiShield, FiCopy, FiCheck } from 'react-icons/fi';

const PasswordManager = ({ isOpen, onClose }) => {
  const [passwords, setPasswords] = useState([]);
  const [newPassword, setNewPassword] = useState({
    site: '',
    username: '',
    password: '',
    notes: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPassword, setShowPassword] = useState({});
  const [masterPassword, setMasterPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Initialize with sample data
  useEffect(() => {
    const samplePasswords = [
      {
        id: 1,
        site: 'github.com',
        username: 'developer@example.com',
        password: 'SecurePass123!',
        notes: 'GitHub account for portfolio projects',
        createdAt: new Date('2024-01-15'),
        lastUsed: new Date('2024-01-20')
      },
      {
        id: 2,
        site: 'linkedin.com',
        username: 'professional@example.com',
        password: 'LinkedIn2024!',
        notes: 'Professional networking account',
        createdAt: new Date('2024-01-10'),
        lastUsed: new Date('2024-01-18')
      },
      {
        id: 3,
        site: 'stackoverflow.com',
        username: 'coder@example.com',
        password: 'StackOverflow!2024',
        notes: 'Developer community account',
        createdAt: new Date('2024-01-05'),
        lastUsed: new Date('2024-01-19')
      }
    ];
    setPasswords(samplePasswords);
  }, []);

  const handleAddPassword = () => {
    if (newPassword.site && newPassword.username && newPassword.password) {
      const password = {
        id: Date.now(),
        ...newPassword,
        createdAt: new Date(),
        lastUsed: new Date()
      };
      setPasswords([...passwords, password]);
      setNewPassword({ site: '', username: '', password: '', notes: '' });
      setShowAddForm(false);
    }
  };

  const handleDeletePassword = (id) => {
    setPasswords(passwords.filter(p => p.id !== id));
  };

  const handleCopyPassword = async (password, id) => {
    try {
      await navigator.clipboard.writeText(password);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy password:', err);
    }
  };

  const filteredPasswords = passwords.filter(password =>
    password.site.toLowerCase().includes(searchTerm.toLowerCase()) ||
    password.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    password.notes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generateStrongPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword({ ...newPassword, password });
  };

  const getPasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score <= 2) return { strength: 'Weak', color: 'text-red-400' };
    if (score <= 3) return { strength: 'Fair', color: 'text-yellow-400' };
    if (score <= 4) return { strength: 'Good', color: 'text-blue-400' };
    return { strength: 'Strong', color: 'text-green-400' };
  };

  if (!isOpen) return null;

  if (!isUnlocked) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="glass-strong rounded-2xl p-8 w-96 max-w-md">
          <div className="text-center mb-6">
            <FiShield className="w-12 h-12 mx-auto mb-4 text-blue-400" />
            <h2 className="text-2xl font-bold text-white mb-2">Password Manager</h2>
            <p className="text-gray-300">Enter your master password to unlock</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Master Password"
                value={masterPassword}
                onChange={(e) => setMasterPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onKeyPress={(e) => e.key === 'Enter' && setIsUnlocked(true)}
              />
            </div>
            
            <button
              onClick={() => setIsUnlocked(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Unlock
            </button>
            
            <button
              onClick={onClose}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="glass-strong rounded-2xl p-6 w-11/12 max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <FiShield className="w-8 h-8 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Password Manager</h2>
            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              {passwords.length} passwords
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex space-x-4 mb-6">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search passwords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
          >
            <FiPlus />
            <span>Add Password</span>
          </button>
        </div>

        {showAddForm && (
          <div className="glass rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Add New Password</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Website (e.g., github.com)"
                value={newPassword.site}
                onChange={(e) => setNewPassword({ ...newPassword, site: e.target.value })}
                className="px-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                placeholder="Username/Email"
                value={newPassword.username}
                onChange={(e) => setNewPassword({ ...newPassword, username: e.target.value })}
                className="px-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <div className="relative">
                <input
                  type={showPassword.new ? "text" : "password"}
                  placeholder="Password"
                  value={newPassword.password}
                  onChange={(e) => setNewPassword({ ...newPassword, password: e.target.value })}
                  className="w-full px-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 pr-12"
                />
                <button
                  onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword.new ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              <button
                onClick={generateStrongPassword}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
              >
                Generate Strong Password
              </button>
            </div>
            <input
              type="text"
              placeholder="Notes (optional)"
              value={newPassword.notes}
              onChange={(e) => setNewPassword({ ...newPassword, notes: e.target.value })}
              className="w-full mt-4 px-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {newPassword.password && (
              <div className="mt-2 text-sm">
                <span className="text-gray-300">Strength: </span>
                <span className={getPasswordStrength(newPassword.password).color}>
                  {getPasswordStrength(newPassword.password).strength}
                </span>
              </div>
            )}
            <div className="flex space-x-3 mt-4">
              <button
                onClick={handleAddPassword}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Save Password
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="overflow-y-auto max-h-96">
          <div className="space-y-3">
            {filteredPasswords.map((password) => (
              <div key={password.id} className="glass rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold text-white">{password.site}</h4>
                      <span className="text-xs text-gray-400">
                        {password.lastUsed.toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm mb-1">{password.username}</p>
                    <div className="flex items-center space-x-2">
                      <input
                        type={showPassword[password.id] ? "text" : "password"}
                        value={password.password}
                        readOnly
                        className="bg-transparent border-none text-gray-300 text-sm focus:outline-none"
                      />
                      <button
                        onClick={() => setShowPassword({ ...showPassword, [password.id]: !showPassword[password.id] })}
                        className="text-gray-400 hover:text-white"
                      >
                        {showPassword[password.id] ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                      </button>
                    </div>
                    {password.notes && (
                      <p className="text-gray-400 text-xs mt-1">{password.notes}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleCopyPassword(password.password, password.id)}
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                      title="Copy password"
                    >
                      {copiedId === password.id ? <FiCheck size={16} /> : <FiCopy size={16} />}
                    </button>
                    <button
                      onClick={() => handleDeletePassword(password.id)}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                      title="Delete password"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredPasswords.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <FiShield className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No passwords found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordManager; 