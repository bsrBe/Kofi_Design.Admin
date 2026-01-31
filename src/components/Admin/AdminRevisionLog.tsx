import { useState, useEffect } from 'react';
import {
    History,
    Clock,
    ChevronRight
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { adminService } from '../../services/adminService';

interface AdminRevisionLogProps {
    orderId: string | null;
}

export const AdminRevisionLog = ({ orderId }: AdminRevisionLogProps) => {
    const [revisions, setRevisions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (orderId) {
            fetchRevisions();
        }
    }, [orderId]);

    const fetchRevisions = async () => {
        setLoading(true);
        try {
            const response = await adminService.getRevisions(orderId!);
            setRevisions(response.data || []);
        } catch (error) {
            console.error('Failed to fetch revisions:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!orderId) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
                <div className="size-20 bg-admin-primary/10 rounded-full flex items-center justify-center text-admin-primary">
                    <History className="size-10" />
                </div>
                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">No Revision Data</h2>
                <p className="text-slate-500 max-w-md mx-auto">Please select an order to view its revision history and client modification requests.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
                <span className="hover:text-slate-400 cursor-pointer">Dashboard</span>
                <ChevronRight className="size-3" />
                <span className="text-slate-400">Revision History</span>
            </nav>

            <div className="flex justify-between items-end">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Creative Iterations</h1>
                    <p className="text-slate-500 text-sm font-medium">Track all design modifications, fabric changes, and fitting adjustments for order #{orderId.substring(0, 6).toUpperCase()}.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {loading && (
                    <div className="flex items-center justify-center p-20">
                        <div className="size-12 border-4 border-admin-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                {revisions.length === 0 && !loading && (
                    <div className="bg-admin-card/30 border border-admin-border rounded-2xl p-20 text-center">
                        <p className="text-slate-500 font-bold uppercase tracking-widest">No revisions recorded for this order yet.</p>
                    </div>
                )}

                {revisions.map((rev, idx) => (
                    <div key={rev._id} className="bg-admin-card/40 border border-admin-border rounded-2xl overflow-hidden backdrop-blur-md group hover:border-admin-primary/30 transition-all">
                        <div className="p-8 flex flex-col md:flex-row gap-10">
                            <div className="md:w-64 space-y-6">
                                <div className="space-y-2">
                                    <span className="text-[10px] font-black text-admin-primary uppercase tracking-[0.3em]">Iteration {idx + 1}</span>
                                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">Client Request</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg">
                                        <Clock className="size-3 text-slate-500" />
                                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{new Date(rev.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className={cn(
                                        "status-badge border",
                                        rev.status === 'PENDING' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                    )}>
                                        {rev.status}
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 space-y-6">
                                <div className="bg-black/40 border border-white/5 rounded-xl p-6">
                                    <p className="text-slate-300 text-lg font-medium leading-relaxed italic">"{rev.changesRequested}"</p>
                                </div>

                                {rev.revisionPhotos && rev.revisionPhotos.length > 0 && (
                                    <div className="grid grid-cols-4 gap-4">
                                        {rev.revisionPhotos.map((p: string, i: number) => (
                                            <div key={i} className="aspect-square rounded-lg overflow-hidden border border-slate-800 group-hover:border-slate-700 transition-all">
                                                <img src={p} className="w-full h-full object-cover" alt="Revision attachment" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
