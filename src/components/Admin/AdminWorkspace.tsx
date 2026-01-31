import { useState, useEffect } from 'react';
import {
    ChevronRight,
    Plus,
    Info
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { adminService } from '../../services/adminService';

interface AdminWorkspaceProps {
    orderId: string | null;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AdminWorkspace = ({ orderId }: AdminWorkspaceProps) => {
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [rushFee, setRushFee] = useState('7 Days (+20%)');

    useEffect(() => {
        if (orderId) {
            fetchOrder();
        }
    }, [orderId]);

    const fetchOrder = async () => {
        setLoading(true);
        try {
            const response = await adminService.getOrderById(orderId!);
            setOrder(response.data);
        } catch (error) {
            console.error('Failed to fetch order details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!orderId) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
                <div className="size-20 bg-admin-primary/10 rounded-full flex items-center justify-center text-admin-primary">
                    <Info className="size-10" />
                </div>
                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">No Order Selected</h2>
                <p className="text-slate-500 max-w-md mx-auto">Please select an order from the management list to view technical specifications and pricing.</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <div className="size-12 border-4 border-admin-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
                        <span>Dashboard</span>
                        <ChevronRight className="size-3" />
                        <span className="text-slate-400">Order Workspace</span>
                    </nav>
                    <div className="flex items-center gap-6">
                        <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">
                            Order #{order?.orderId || order?._id?.substring(0, 6).toUpperCase()} — @{order?.telegramId || 'user'}
                        </h1>
                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                            <div className="size-1.5 bg-emerald-500 rounded-full" />
                            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{order?.status?.replace(/_/g, ' ')}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button className="bg-admin-primary hover:bg-admin-primary/90 text-white px-8 py-3 rounded-xl font-bold tracking-tight transition-all shadow-xl shadow-admin-primary/20">
                        Update Order
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* User Inspiration */}
                <div className="lg:col-span-7 bg-[#0b1120]/50 border border-admin-border rounded-xl p-8 flex flex-col gap-6 backdrop-blur-sm">
                    <div className="flex justify-between items-center">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-xs">User Inspiration (Cloud Proxy)</h2>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {order?.inspirationPhoto ? (
                            <div className="aspect-[3/4] rounded-xl overflow-hidden border border-slate-800 hover:border-slate-600 transition-all group relative cursor-pointer col-span-2">
                                <img src={order.inspirationPhoto?.startsWith('http') ? order.inspirationPhoto : `${API_URL}/media/${order.inspirationFileId || order.inspirationPhoto}`} className="w-full h-full object-cover" alt="Selected Inspiration" />
                            </div>
                        ) : (
                            <div className="aspect-[3/4] rounded-xl border-2 border-dashed border-slate-800 flex flex-col items-center justify-center gap-3 text-slate-600 hover:text-slate-400 hover:border-slate-600 transition-all group bg-slate-900/40">
                                <Info className="size-8 opacity-20" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">No Photo Uploaded</span>
                            </div>
                        )}
                        <div className="aspect-[3/4] rounded-xl border-2 border-dashed border-slate-800 flex flex-col items-center justify-center gap-3 text-slate-600 hover:text-slate-400 hover:border-slate-600 transition-all group bg-slate-900/40">
                            <Plus className="size-5" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Add Photo</span>
                        </div>
                    </div>
                </div>

                {/* Pricing Engine */}
                <div className="lg:col-span-5 bg-[#0b1120]/50 border border-admin-border rounded-xl p-8 flex flex-col gap-8 backdrop-blur-sm">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Pricing Engine</h2>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Base Production Price</p>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</div>
                                <input
                                    type="text"
                                    defaultValue={order?.quote?.amount || "1250"}
                                    className="w-full bg-slate-900 border border-slate-800 rounded-lg py-4 pl-10 pr-4 text-xl font-bold text-white focus:outline-none focus:border-admin-primary/50 transition-all shadow-inner"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Rush Fee Premium</p>
                            <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-xl">
                                {['None', 'Rush +20%', 'Extreme +40%'].map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => setRushFee(option)}
                                        className={cn(
                                            "py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                                            rushFee.includes(option.split(' ')[0])
                                                ? "bg-admin-primary text-white"
                                                : "text-slate-500"
                                        )}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-800 space-y-4">
                        <div className="flex justify-between items-end border-t border-slate-800 pt-4">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-admin-primary uppercase tracking-[0.2em]">Total Calculated</span>
                                <span className="text-5xl font-black text-white tracking-tighter">${order?.quote?.amount || '0'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Technical Specifications */}
            <div className="bg-[#0b1120]/50 border border-admin-border rounded-xl overflow-hidden backdrop-blur-sm shadow-2xl">
                <div className="px-8 py-6 border-b border-admin-border flex justify-between items-center bg-slate-900/40">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Technical Specifications (Captured)</h2>
                </div>

                <table className="w-full text-left">
                    <thead>
                        <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-admin-border bg-slate-900/20 text-xs">
                            <th className="px-10 py-4">Parameter</th>
                            <th className="px-6 py-4">Captured (cm)</th>
                            <th className="px-6 py-4">Tailor Adj</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-admin-border/30">
                        {order?.measurements && Object.entries(order.measurements).map(([key, val]: any) => (
                            <tr key={key} className="hover:bg-white/[0.01] transition-colors">
                                <td className="px-10 py-5 text-sm font-bold text-slate-300 uppercase tracking-widest">{key}</td>
                                <td className="px-6 py-5">
                                    <span className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg text-white font-bold">{val}</span>
                                </td>
                                <td className="px-6 py-5">
                                    <input type="text" placeholder="0.0" className="w-20 bg-transparent border-b border-white/5 text-sm text-slate-500 focus:outline-none focus:border-admin-primary" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-6 border-t border-admin-border/50">
                <div className="space-y-2">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">Client</span>
                    <p className="text-sm font-bold text-slate-300">{order?.clientProfile?.fullName}</p>
                </div>
                <div className="space-y-2">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">Contact</span>
                    <p className="text-sm font-bold text-slate-300">{order?.clientProfile?.phoneNumber}</p>
                </div>
                <div className="space-y-2">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">Telegram</span>
                    <p className="text-sm font-bold text-admin-primary">{order?.telegramId}</p>
                </div>
            </div>
        </div>
    );
};
