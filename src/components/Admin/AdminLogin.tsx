import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ShieldAlert, ArrowLeft, Send, CheckCircle2, Diamond } from 'lucide-react';
import { adminService } from '../../services/adminService';

export const AdminLogin = ({ onLoginSuccess }: { onLoginSuccess: () => void }) => {
    const [mode, setMode] = useState<'login' | 'forgot' | 'reset'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [securityQuestion, setSecurityQuestion] = useState('');
    const [secretAnswer, setSecretAnswer] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await adminService.login({ email, password });
            if (response.success) {
                onLoginSuccess();
            } else {
                setError(response.message || 'Login failed');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Unauthorized access. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleFetchQuestion = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await adminService.getSecretQuestion(email);
            if (response.success) {
                setSecurityQuestion(response.secretQuestion);
                setMode('reset');
            } else {
                setError(response.message);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Security question not found for this email');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await adminService.resetPassword({ email, secretAnswer, newPassword });
            if (response.success) {
                setSuccessMsg('Password reset successfully! You can now login.');
                setMode('login');
                setPassword('');
            } else {
                setError(response.message);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Aesthetics */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-admin-primary/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md z-10"
            >
                <div className="bg-[#0b1120] border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-admin-primary to-transparent opacity-50" />

                    <header className="text-center mb-10 space-y-4">
                        <div className="inline-flex size-16 bg-accent-gold/10 rounded-3xl items-center justify-center text-accent-gold mb-2 ring-1 ring-accent-gold/20 shadow-[0_0_20px_rgba(212,175,55,0.15)]">
                            <Diamond className="size-8 fill-current" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">Kofi's Command</h1>
                            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-1">Authorized Personnel Only</p>
                        </div>
                    </header>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500"
                        >
                            <ShieldAlert className="size-5 shrink-0" />
                            <p className="text-xs font-bold leading-tight">{error}</p>
                        </motion.div>
                    )}

                    {successMsg && (mode === 'login') && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="mb-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-500"
                        >
                            <CheckCircle2 className="size-5 shrink-0" />
                            <p className="text-xs font-bold leading-tight">{successMsg}</p>
                        </motion.div>
                    )}

                    {mode === 'login' && (
                        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Admin Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-500 group-focus-within:text-admin-primary transition-colors" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="admin@kofidesign.com"
                                        className="w-full bg-[#0f172a] border border-slate-800 rounded-2xl py-4 pl-12 pr-6 text-white text-sm focus:outline-none focus:border-admin-primary transition-all font-medium placeholder:text-slate-700"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Access Token</label>
                                    <button
                                        type="button"
                                        onClick={() => setMode('forgot')}
                                        className="text-[10px] font-bold text-admin-primary uppercase tracking-widest hover:underline"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-500 group-focus-within:text-admin-primary transition-colors" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••••••"
                                        className="w-full bg-[#0f172a] border border-slate-800 rounded-2xl py-4 pl-12 pr-6 text-white text-sm focus:outline-none focus:border-admin-primary transition-all font-medium placeholder:text-slate-700"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-5 bg-admin-primary disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 shadow-xl shadow-admin-primary/20 hover:scale-[1.02] active:scale-95 transition-all mt-4"
                            >
                                {loading ? (
                                    <div className="size-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                                ) : <LogIn className="size-5" />}
                                {loading ? 'Verifying...' : 'Initiate Login'}
                            </button>
                        </form>
                    )}

                    {mode === 'forgot' && (
                        <form onSubmit={handleFetchQuestion} className="space-y-6 relative z-10">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Identify Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-500 group-focus-within:text-admin-primary transition-colors" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="admin@kofidesign.com"
                                        className="w-full bg-[#0f172a] border border-slate-800 rounded-2xl py-4 pl-12 pr-6 text-white text-sm focus:outline-none focus:border-admin-primary transition-all font-medium placeholder:text-slate-700"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-5 bg-admin-primary disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 shadow-xl shadow-admin-primary/20 transition-all mt-4"
                            >
                                {loading ? (
                                    <div className="size-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                                ) : <Send className="size-5" />}
                                {loading ? 'Checking...' : 'Request Challenge'}
                            </button>

                            <button
                                type="button"
                                onClick={() => setMode('login')}
                                className="w-full flex items-center justify-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
                            >
                                <ArrowLeft className="size-3" />
                                Back to Login
                            </button>
                        </form>
                    )}

                    {mode === 'reset' && (
                        <form onSubmit={handleResetPassword} className="space-y-6 relative z-10">
                            <div className="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-1">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Security Challenge</p>
                                <p className="text-sm font-bold text-white">{securityQuestion}</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Your Secret Answer</label>
                                <input
                                    type="text"
                                    value={secretAnswer}
                                    onChange={(e) => setSecretAnswer(e.target.value)}
                                    placeholder="Enter secret answer"
                                    className="w-full bg-[#0f172a] border border-slate-800 rounded-2xl py-4 px-6 text-white text-sm focus:outline-none focus:border-admin-primary transition-all font-medium"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">New Access Token</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    className="w-full bg-[#0f172a] border border-slate-800 rounded-2xl py-4 px-6 text-white text-sm focus:outline-none focus:border-admin-primary transition-all font-medium"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-5 bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/20 transition-all mt-4"
                            >
                                {loading ? (
                                    <div className="size-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                                ) : <CheckCircle2 className="size-5" />}
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>

                            <button
                                type="button"
                                onClick={() => setMode('login')}
                                className="w-full flex items-center justify-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
                            >
                                <ArrowLeft className="size-3" />
                                Cancel Reset
                            </button>
                        </form>
                    )}

                    <footer className="mt-10 text-center">
                        <p className="text-slate-600 text-[9px] font-medium uppercase tracking-[0.2em]">
                            Property of Kofi Design Studios © 2026
                        </p>
                    </footer>
                </div>
            </motion.div>
        </div>
    );
};
