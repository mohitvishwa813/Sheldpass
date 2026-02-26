import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Zap, Globe, Github, Twitter, Linkedin } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-indigo-500/30">
            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                        <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
                            <Shield className="text-white" size={24} />
                        </div>
                        <span className="text-xl font-bold tracking-tight">Shield Pass</span>
                    </Link>
                    <div className="flex items-center space-x-6">
                        <Link to="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Sign In</Link>
                        <Link to="/login" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-sm font-bold transition-all hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-40 pb-20 px-6 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-600/10 blur-[120px] rounded-full -z-10"></div>
                <div className="max-w-7xl mx-auto text-center">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-8">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                        <span>v2.0 is now live</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.1]">
                        The Next Generation of <br />
                        <span className="bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent">Digital Security.</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl mb-12 leading-relaxed">
                        Securely store, manage, and access your digital credentials from anywhere. Built with military-grade encryption and a focus on premium user experience.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-white text-gray-950 rounded-2xl font-bold text-lg hover:bg-indigo-50 transition-all shadow-xl active:scale-95">
                            Start Securing Now
                        </Link>
                        <button className="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white border border-gray-800 rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all active:scale-95">
                            View Documentation
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: <Lock size={32} />, title: "End-to-End Encryption", desc: "Your data is encrypted before it even leaves your device, ensuring only you can see it." },
                        { icon: <Zap size={32} />, title: "Instant Sync", desc: "Access your vault seamlessly across all your devices with real-time cloud synchronization." },
                        { icon: <Globe size={32} />, title: "Universal Access", desc: "A beautifully crafted web interface that works flawlessly across all modern browsers." }
                    ].map((feature, i) => (
                        <div key={i} className="p-8 bg-gray-900 border border-gray-800 rounded-3xl hover:border-indigo-500/50 transition-all group">
                            <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center text-indigo-500 mb-6 group-hover:scale-110 transition-transform">
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                            <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-900 pt-20 pb-10 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <Link to="/" className="flex items-center space-x-3 hover:opacity-60 transition-opacity">
                        <Shield className="text-gray-500" size={24} />
                        <span className="text-xl font-bold text-gray-300">Shield Pass</span>
                    </Link>
                    <div className="flex space-x-8">
                        <Github className="text-gray-500 hover:text-white transition-colors cursor-pointer" />
                        <Twitter className="text-gray-500 hover:text-white transition-colors cursor-pointer" />
                        <Linkedin className="text-gray-500 hover:text-white transition-colors cursor-pointer" />
                    </div>
                    <p className="text-gray-500 text-sm">© 2026 Shield Pass. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
