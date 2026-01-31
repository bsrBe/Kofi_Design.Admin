import { useState, useEffect } from 'react';
import { Users, Phone, MapPin, Instagram, Calendar } from 'lucide-react';
import { cn } from '../../lib/utils';
import { adminService } from '../../services/adminService';

interface Client {
    _id: string;
    telegramId: string;
    fullName: string;
    phoneNumber: string;
    city: string;
    instagramHandle?: string;
    totalOrders: number;
    createdAt: string;
}

export const AdminClients = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ total: 0, pages: 1 });

    useEffect(() => {
        fetchClients();
    }, [page]);

    const fetchClients = async () => {
        setLoading(true);
        try {
            const response = await adminService.getClients(page, 20);
            if (response.success) {
                setClients(response.data || []);
                setPagination(response.pagination || { total: 0, pages: 1 });
            }
        } catch (error) {
            console.error('Failed to fetch clients:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex justify-between items-end border-b border-white/5 pb-8">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight uppercase italic">Client Directory</h1>
                    <p className="text-slate-500 mt-2 text-sm font-medium">
                        {pagination.total} registered clients
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center p-20">
                    <div className="size-12 border-4 border-admin-primary border-t-transparent rounded-full animate-spin" />
                </div>
            ) : clients.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
                    <div className="size-20 bg-admin-primary/10 rounded-full flex items-center justify-center">
                        <Users className="size-10 text-admin-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">No Clients Yet</h2>
                    <p className="text-slate-500 max-w-md">
                        When clients submit orders through the Telegram bot, they'll appear here.
                    </p>
                </div>
            ) : (
                <>
                    {/* Clients Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {clients.map((client) => (
                            <div
                                key={client._id}
                                className="bg-[#1c1c1c] border border-white/5 rounded-2xl p-6 hover:border-admin-primary/30 transition-all group"
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-5">
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 rounded-full bg-gradient-to-br from-admin-primary/20 to-admin-primary/5 flex items-center justify-center border border-admin-primary/20">
                                            <span className="text-lg font-bold text-admin-primary">
                                                {client.fullName.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white text-lg">{client.fullName}</h3>
                                            <p className="text-slate-500 text-xs">@{client.telegramId}</p>
                                        </div>
                                    </div>
                                    <div className={cn(
                                        "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                                        client.totalOrders > 0
                                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                                            : "bg-slate-500/10 text-slate-500 border border-slate-500/20"
                                    )}>
                                        {client.totalOrders} orders
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm">
                                        <Phone className="size-4 text-slate-500" />
                                        <span className="text-slate-300">{client.phoneNumber}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <MapPin className="size-4 text-slate-500" />
                                        <span className="text-slate-300">{client.city}</span>
                                    </div>
                                    {client.instagramHandle && (
                                        <div className="flex items-center gap-3 text-sm">
                                            <Instagram className="size-4 text-slate-500" />
                                            <span className="text-slate-300">@{client.instagramHandle}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3 text-sm pt-2 border-t border-white/5">
                                        <Calendar className="size-4 text-slate-500" />
                                        <span className="text-slate-500 text-xs">Joined {formatDate(client.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                        <div className="flex items-center justify-center gap-2 pt-6">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 text-sm text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                                    const pageNum = i + 1;
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setPage(pageNum)}
                                            className={cn(
                                                "size-8 rounded-lg text-sm font-medium transition-colors",
                                                page === pageNum
                                                    ? "bg-admin-primary text-white"
                                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                                            )}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>
                            <button
                                onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                                disabled={page >= pagination.pages}
                                className="px-4 py-2 text-sm text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
