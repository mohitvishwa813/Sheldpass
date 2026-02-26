import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
    Plus, Edit2, Trash2, LogOut, Shield, ExternalLink,
    Search, X, Key, User, Globe, FileText, ChevronRight,
    Eye, EyeOff, Settings, CreditCard, Clock, Activity
} from 'lucide-react';

const Dashboard = ({ onLogout }) => {
    const [credentials, setCredentials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showPasswords, setShowPasswords] = useState({});
    const [selectedCred, setSelectedCred] = useState(null);
    const [showSettings, setShowSettings] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [userData, setUserData] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        platfromusernameOrEmail: '',
        platform: '',
        websiteUrl: '',
        password: '',
        description: ''
    });

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.get('/api/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUserData(response.data);
        } catch (err) {
            console.error('Error fetching profile:', err);
        }
    };

    const fetchCredentials = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.get('/api/credentials', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCredentials(response.data);
        } catch (err) {
            console.error('Error fetching credentials:', err);
            if (err.response?.status === 401 || err.response?.status === 403) {
                onLogout();
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCredentials();
        fetchProfile();
    }, []);

    const togglePassword = (e, id) => {
        e.stopPropagation();
        setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            if (editingId) {
                await api.put(`/api/credentials/${editingId}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await api.post('/api/credentials', formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            setShowForm(false);
            setEditingId(null);
            setFormData({ platfromusernameOrEmail: '', platform: '', websiteUrl: '', password: '', description: '' });
            fetchCredentials();
        } catch (err) {
            alert('Error saving credential');
        }
    };

    const handleEdit = (e, cred) => {
        e.stopPropagation();
        setFormData({
            platfromusernameOrEmail: cred.platfromusernameOrEmail,
            platform: cred.platform,
            websiteUrl: cred.websiteUrl,
            password: cred.password,
            description: cred.description || ''
        });
        setEditingId(cred._id);
        setShowForm(true);
        setSelectedCred(null);
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this credential?')) return;
        const token = localStorage.getItem('token');
        try {
            await api.delete(`/api/credentials/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchCredentials();
            setSelectedCred(null);
        } catch (err) {
            alert('Error deleting credential');
        }
    };

    const filteredCredentials = credentials.filter(cred =>
        (cred.platform?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (cred.platfromusernameOrEmail?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 font-sans">
            {/* Header */}
            <header className="bg-gray-900/50 backdrop-blur-md border-b border-gray-800 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                        <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-500/20">
                            <Shield className="text-white" size={24} />
                        </div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                            Shield Pass
                        </h1>
                    </Link>

                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setShowProfile(true)}
                            className="p-2.5 rounded-xl bg-gray-800 border border-gray-700 hover:bg-gray-700 transition-colors"
                        >
                            <User size={20} className="text-gray-400" />
                        </button>
                        <button
                            onClick={() => setShowSettings(true)}
                            className="p-2.5 rounded-xl bg-gray-800 border border-gray-700 hover:bg-gray-700 transition-colors"
                        >
                            <Settings size={20} className="text-gray-400" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Search and Add Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                        <input
                            type="text"
                            placeholder="Search platforms or usernames..."
                            className="w-full bg-gray-900 border border-gray-800 rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-gray-600"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => { setShowForm(true); setEditingId(null); setFormData({ platfromusernameOrEmail: '', platform: '', websiteUrl: '', password: '', description: '' }); }}
                        className="flex items-center justify-center space-x-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95 whitespace-nowrap"
                    >
                        <Plus size={20} />
                        <span className="font-semibold">Add Credential</span>
                    </button>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-center sm:text-left">
                    <div className="bg-gray-900/40 border border-gray-800 p-6 rounded-3xl backdrop-blur-sm">
                        <p className="text-gray-500 text-sm font-medium mb-1 uppercase tracking-wider flex items-center gap-2">
                            <CreditCard size={14} className="text-indigo-400" /> Vault Capacity
                        </p>
                        <p className="text-4xl font-bold text-white">{credentials.length}</p>
                    </div>
                    <div className="bg-gray-900/40 border border-gray-800 p-6 rounded-3xl backdrop-blur-sm">
                        <p className="text-gray-500 text-sm font-medium mb-1 uppercase tracking-wider flex items-center gap-2">
                            <Activity size={14} className="text-emerald-400" /> Secured Assets
                        </p>
                        <p className="text-4xl font-bold text-white">{new Set(credentials.map(c => c.platform)).size}</p>
                    </div>
                    <div className="bg-gray-900/40 border border-gray-800 p-6 rounded-3xl backdrop-blur-sm">
                        <p className="text-gray-500 text-sm font-medium mb-1 uppercase tracking-wider flex items-center gap-2">
                            <Shield size={14} className="text-indigo-400" /> Encryption
                        </p>
                        <p className="text-xl font-bold text-gray-200 uppercase tracking-wide">AES-256 GCM</p>
                    </div>
                </div>

                {/* Credentials List */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-400 font-medium">Decrypting your vault...</p>
                    </div>
                ) : filteredCredentials.length === 0 ? (
                    <div className="text-center py-20 bg-gray-900/30 border border-dashed border-gray-800 rounded-3xl">
                        <Shield className="mx-auto text-gray-700 mb-4" size={48} />
                        <h3 className="text-xl font-semibold mb-2 text-white">No credentials found</h3>
                        <p className="text-gray-500 max-w-sm mx-auto">
                            {searchTerm ? `No results found for "${searchTerm}"` : "Your vault is empty. Secure your first account to get started."}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCredentials.map(cred => (
                            <div
                                key={cred._id}
                                onClick={() => setSelectedCred(cred)}
                                className="group bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-3xl p-6 transition-all duration-300 hover:shadow-2xl cursor-pointer hover:-translate-y-1"
                            >
                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center text-indigo-400 font-black text-xl border border-gray-700 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                        {cred.platform?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="overflow-hidden">
                                        <h3 className="text-lg font-bold truncate text-white uppercase tracking-tight">{cred.platform}</h3>
                                        <p className="text-xs text-gray-500 truncate lowercase">{cred.platfromusernameOrEmail}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-gray-400 group-hover:text-white transition-colors">
                                    <span className="text-xs font-bold uppercase tracking-widest bg-gray-800 px-3 py-1 rounded-full border border-gray-700">View Details</span>
                                    <ChevronRight size={18} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Credential Detail Modal */}
            {selectedCred && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-950/90 backdrop-blur-md" onClick={() => setSelectedCred(null)}></div>
                    <div className="relative w-full max-w-lg bg-gray-900 border border-gray-800 rounded-3xl shadow-[0_0_50px_-12px_rgba(79,70,229,0.3)] overflow-hidden scale-100 transition-all">
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center space-x-4">
                                    <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-indigo-500/20 uppercase">
                                        {selectedCred.platform?.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{selectedCred.platform}</h3>
                                        <div className="flex items-center text-indigo-400 text-xs font-bold uppercase tracking-widest gap-2">
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> Secure Asset
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedCred(null)} className="p-2 text-gray-500 hover:text-white rounded-xl bg-gray-800 hover:bg-gray-700 transition-all">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="bg-gray-950/50 p-4 rounded-2xl border border-gray-800">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black">Username / Email</p>
                                        <User size={12} className="text-indigo-500" />
                                    </div>
                                    <p className="text-lg font-medium text-white">{selectedCred.platfromusernameOrEmail}</p>
                                </div>

                                <div className="bg-gray-950/50 p-4 rounded-2xl border border-gray-800">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black">Password</p>
                                        <Key size={12} className="text-indigo-500" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-2xl font-mono text-white tracking-widest">
                                            {showPasswords[selectedCred._id] ? selectedCred.password : '••••••••'}
                                        </p>
                                        <button
                                            onClick={(e) => togglePassword(e, selectedCred._id)}
                                            className="p-2 text-indigo-400 hover:bg-indigo-400/10 rounded-xl transition-all"
                                        >
                                            {showPasswords[selectedCred._id] ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-gray-950/50 p-4 rounded-2xl border border-gray-800">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black">Website URL</p>
                                        <Globe size={12} className="text-indigo-500" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-300 truncate mr-4">{selectedCred.websiteUrl}</p>
                                        <a href={selectedCred.websiteUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-indigo-400 hover:bg-indigo-400/10 rounded-xl transition-all">
                                            <ExternalLink size={20} />
                                        </a>
                                    </div>
                                </div>

                                {selectedCred.description && (
                                    <div className="p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FileText size={12} className="text-indigo-500" />
                                            <p className="text-[10px] uppercase tracking-widest text-indigo-400 font-black">Description</p>
                                        </div>
                                        <p className="text-sm text-gray-300 italic">"{selectedCred.description}"</p>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={(e) => handleEdit(e, selectedCred)}
                                    className="flex items-center justify-center gap-2 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-2xl font-bold transition-all"
                                >
                                    <Edit2 size={18} /> Edit
                                </button>
                                <button
                                    onClick={(e) => handleDelete(e, selectedCred._id)}
                                    className="flex items-center justify-center gap-2 py-4 bg-red-950/30 hover:bg-red-900/40 text-red-500 rounded-2xl font-bold border border-red-900/20 transition-all"
                                >
                                    <Trash2 size={18} /> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Profile Modal */}
            {showProfile && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm" onClick={() => setShowProfile(false)}></div>
                    <div className="relative w-full max-w-sm bg-gray-900 border border-gray-800 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden scale-100 transition-all text-center">
                        <div className="w-20 h-20 bg-indigo-600/20 rounded-[1.5rem] flex items-center justify-center text-indigo-500 mx-auto mb-6 border border-indigo-500/20">
                            <User size={36} />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-2 leading-none uppercase tracking-tight">User Profile</h3>
                        <p className="text-gray-500 text-sm mb-6 leading-relaxed font-medium">Your account details stored in Shield Pass vault.</p>

                        <div className="space-y-4 text-left mb-8">
                            <div className="bg-gray-950/50 p-4 rounded-2xl border border-gray-800">
                                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-black mb-1">Email Address</p>
                                <p className="text-white font-medium">{userData?.email || 'Loading...'}</p>
                            </div>
                            <div className="bg-gray-950/50 p-4 rounded-2xl border border-gray-800">
                                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-black mb-1">Member Since</p>
                                <p className="text-gray-300">
                                    {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Loading...'}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowProfile(false)}
                            className="w-full py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-2xl font-bold transition-all active:scale-95"
                        >
                            Close Profile
                        </button>
                    </div>
                </div>
            )}

            {/* Logout/Settings Modal */}
            {showSettings && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 text-center">
                    <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm" onClick={() => setShowSettings(false)}></div>
                    <div className="relative w-full max-w-sm bg-gray-900 border border-gray-800 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden scale-100 transition-all">
                        <div className="w-20 h-20 bg-red-950/30 rounded-[1.5rem] flex items-center justify-center text-red-500 mx-auto mb-6 border border-red-900/20">
                            <LogOut size={36} />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-2 leading-none">TERMINATE SESSION?</h3>
                        <p className="text-gray-500 text-sm mb-10 leading-relaxed font-medium">You will need to re-authenticate to access your encrypted vault.</p>

                        <div className="space-y-3">
                            <button
                                onClick={onLogout}
                                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-lg transition-all active:scale-95 flex items-center justify-center gap-2 shadow-xl shadow-red-500/20"
                            >
                                <LogOut size={20} /> Logout Now
                            </button>
                            <button
                                onClick={() => setShowSettings(false)}
                                className="w-full py-4 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-2xl font-bold transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Form Modal (Add/Edit) */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-950/90 backdrop-blur-md" onClick={() => setShowForm(false)}></div>
                    <div className="relative w-full max-w-xl bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 scale-100">
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-600/20 rounded-xl flex items-center justify-center text-indigo-500">
                                        {editingId ? <Edit2 size={20} /> : <Plus size={20} />}
                                    </div>
                                    <h3 className="text-2xl font-black text-white tracking-tight uppercase">
                                        {editingId ? 'Modify Entry' : 'Secure Entry'}
                                    </h3>
                                </div>
                                <button onClick={() => setShowForm(false)} className="p-2 text-gray-500 hover:text-white rounded-xl bg-gray-800 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Platform</label>
                                        <input
                                            type="text" name="platform" required placeholder="AMAZON"
                                            className="w-full bg-gray-950 border border-gray-800 rounded-xl py-4 px-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-white font-bold"
                                            value={formData.platform} onChange={handleInputChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Website URL</label>
                                        <input
                                            type="url" name="websiteUrl" required placeholder="https://amazon.com"
                                            className="w-full bg-gray-950 border border-gray-800 rounded-xl py-4 px-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-white"
                                            value={formData.websiteUrl} onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Username / Email</label>
                                    <input
                                        type="text" name="platfromusernameOrEmail" required placeholder="USER@EXAMPLE.COM"
                                        className="w-full bg-gray-950 border border-gray-800 rounded-xl py-4 px-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-white font-medium"
                                        value={formData.platfromusernameOrEmail} onChange={handleInputChange}
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Password</label>
                                    <input
                                        type="text" name="password" required placeholder="••••••••"
                                        className="w-full bg-gray-950 border border-gray-800 rounded-xl py-4 px-4 font-mono focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-white text-lg tracking-widest"
                                        value={formData.password} onChange={handleInputChange}
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Security Note (Optional)</label>
                                    <textarea
                                        name="description" rows="2" placeholder="ADDITIONAL SECURITY DETAILS..."
                                        className="w-full bg-gray-950 border border-gray-800 rounded-xl py-4 px-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none text-white text-sm"
                                        value={formData.description} onChange={handleInputChange}
                                    ></textarea>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-lg transition-all active:scale-[0.98] shadow-xl shadow-indigo-500/20 uppercase tracking-tighter"
                                    >
                                        {editingId ? 'Update Security Vault' : 'COMMIT TO VAULT'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
