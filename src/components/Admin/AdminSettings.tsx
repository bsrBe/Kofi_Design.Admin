import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, ShieldCheck, Save, AlertCircle, CheckCircle2, Shield } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { cn } from '../../lib/utils';
import { useEffect } from 'react';

export const AdminSettings = () => {
    // Password State
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [passwordSuccess, setPasswordSuccess] = useState(false);

    // Security Question State
    const [securityData, setSecurityData] = useState({
        secretQuestion: '',
        secretAnswer: ''
    });
    const [securityLoading, setSecurityLoading] = useState(false);
    const [securityError, setSecurityError] = useState<string | null>(null);
    const [securitySuccess, setSecuritySuccess] = useState(false);
    const [isSecurityConfigured, setIsSecurityConfigured] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await adminService.getMe();
                if (response.success && response.admin.secretQuestion) {
                    setIsSecurityConfigured(true);
                }
            } catch (error) {
                console.error('Failed to fetch admin profile:', error);
            }
        };
        fetchProfile();
    }, []);

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError("New passwords don't match");
            return;
        }

        setPasswordLoading(true);
        setPasswordError(null);
        setPasswordSuccess(false);

        try {
            const response = await adminService.changePassword({
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            });
            if (response.success) {
                setPasswordSuccess(true);
                setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                setPasswordError(response.message || 'Failed to update password');
            }
        } catch (err: any) {
            setPasswordError(err.response?.data?.message || 'Error updating password');
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleSecuritySetup = async (e: React.FormEvent) => {
        e.preventDefault();
        setSecurityLoading(true);
        setSecurityError(null);
        setSecuritySuccess(false);

        try {
            const response = await adminService.setupSecurity(securityData);
            if (response.success) {
                setSecuritySuccess(true);
                setIsSecurityConfigured(true);
            } else {
                setSecurityError(response.message || 'Failed to set security question');
            }
        } catch (err: any) {
            setSecurityError(err.response?.data?.message || 'Error setting security question');
        } finally {
            setSecurityLoading(false);
        }
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="border-b border-white/5 pb-8">
                <h1 className="text-4xl font-black text-white tracking-tight uppercase italic">Security & Settings</h1>
                <p className="text-slate-500 mt-2 text-sm font-medium">Protect your atelier command center with enhanced verification.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Change Password */}
                <motion.section
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-[#1c1c1c] border border-white/5 rounded-[2.5rem] p-10 space-y-8 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-32 bg-admin-primary/5 blur-3xl -mr-16 -mt-16 pointer-events-none" />

                    <div className="flex items-center gap-4 relative z-10">
                        <div className="size-12 bg-admin-primary/10 rounded-2xl flex items-center justify-center text-admin-primary">
                            <Lock className="size-6" />
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Access Credentials</h2>
                    </div>

                    <form onSubmit={handlePasswordChange} className="space-y-6 relative z-10">
                        {passwordError && (
                            <div className={cn("p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-sm font-medium")}>
                                <AlertCircle className="size-5 shrink-0" />
                                {passwordError}
                            </div>
                        )}
                        {passwordSuccess && (
                            <div className={cn("p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-500 text-sm font-medium")}>
                                <CheckCircle2 className="size-5 shrink-0" />
                                Password updated successfully
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Current Password</label>
                            <input
                                type="password"
                                value={passwordData.oldPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 text-white text-sm focus:outline-none focus:border-admin-primary transition-all font-medium placeholder:text-white/5"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 text-white text-sm focus:outline-none focus:border-admin-primary transition-all font-medium placeholder:text-white/5"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Confirm New</label>
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 text-white text-sm focus:outline-none focus:border-admin-primary transition-all font-medium placeholder:text-white/5"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={passwordLoading}
                            className="w-full py-4 bg-admin-primary hover:bg-admin-primary/90 text-white rounded-xl font-bold flex items-center justify-center gap-3 transition-all disabled:opacity-50"
                        >
                            {passwordLoading ? (
                                <div className="size-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                            ) : <Save className="size-5" />}
                            Update Password
                        </button>
                    </form>
                </motion.section>

                {/* Security Question */}
                <motion.section
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-[#1c1c1c] border border-white/5 rounded-[2.5rem] p-10 space-y-8 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-32 bg-emerald-500/5 blur-3xl -mr-16 -mt-16 pointer-events-none" />

                    <div className="flex items-center gap-4 relative z-10">
                        <div className="size-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                            <ShieldCheck className="size-6" />
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Recovery Shield</h2>
                    </div>

                    {isSecurityConfigured && !securitySuccess ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-6 relative z-10">
                            <div className="size-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                                <Shield className="size-10" />
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-bold text-white tracking-tight">Shield Active</h3>
                                <p className="text-slate-500 text-sm max-w-[240px] mx-auto font-medium">Your recovery challenge has been securely configured.</p>
                            </div>
                            <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-none flex items-center gap-2">
                                    <div className="size-1 bg-emerald-500 rounded-full animate-pulse" />
                                    Account Protected
                                </span>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSecuritySetup} className="space-y-6 relative z-10">
                            {securityError && (
                                <div className={cn("p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-sm font-medium")}>
                                    <AlertCircle className="size-5 shrink-0" />
                                    {securityError}
                                </div>
                            )}
                            {securitySuccess && (
                                <div className={cn("p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-500 text-sm font-medium")}>
                                    <CheckCircle2 className="size-5 shrink-0" />
                                    Recovery question updated
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Recovery Question</label>
                                <select
                                    value={securityData.secretQuestion}
                                    onChange={(e) => setSecurityData({ ...securityData, secretQuestion: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 text-white text-sm focus:outline-none focus:border-admin-primary transition-all font-medium appearance-none"
                                    required
                                >
                                    <option value="" disabled className="bg-[#1c1c1c]">Select a challenge question</option>
                                    <option value="What was your first childhood pet's name?" className="bg-[#1c1c1c]">What was your first childhood pet's name?</option>
                                    <option value="What city did you first meet your partner?" className="bg-[#1c1c1c]">What city did you first meet your partner?</option>
                                    <option value="What was the name of your first elementary school?" className="bg-[#1c1c1c]">What was the name of your first elementary school?</option>
                                    <option value="What is your mother's maiden name?" className="bg-[#1c1c1c]">What is your mother's maiden name?</option>
                                    <option value="What was your dream job as a child?" className="bg-[#1c1c1c]">What was your dream job as a child?</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Secret Answer</label>
                                <input
                                    type="text"
                                    value={securityData.secretAnswer}
                                    onChange={(e) => setSecurityData({ ...securityData, secretAnswer: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 text-white text-sm focus:outline-none focus:border-admin-primary transition-all font-medium placeholder:text-white/5"
                                    placeholder="Answer (case-insensitive)"
                                    required
                                />
                            </div>

                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                <p className="text-[10px] text-slate-400 leading-relaxed font-medium"> This question will be used to verify your identity if you ever lose access to your account. Choose something only you know.</p>
                            </div>

                            <button
                                type="submit"
                                disabled={securityLoading}
                                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-3 transition-all disabled:opacity-50"
                            >
                                {securityLoading ? (
                                    <div className="size-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                                ) : <Save className="size-5" />}
                                Update Recovery Info
                            </button>
                        </form>
                    )}
                </motion.section>
            </div>
        </div>
    );
};
