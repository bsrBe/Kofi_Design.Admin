import { useState, useEffect } from 'react';
import {
    Clock,
    CheckCircle,
    Plus,
    Eye,
    Search
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { adminService } from '../../services/adminService';
import { OrderDetailsModal } from './OrderDetailsModal';
import { CreateOrderModal } from './CreateOrderModal';

interface Order {
    id: string; // Display ID e.g., #KD-9923
    dbId: string;
    client: string;
    telegram: string;
    type: string;
    deadline: string;
    isRush: boolean;
    status: string;
    revisions: number;
    totalRevisions: number;
}

export const AdminOrders = () => {
    const [activeFilter, setActiveFilter] = useState<'All' | 'Rush' | 'Pending' | 'Completed'>('All');
    const [orders, setOrders] = useState<Order[]>([]);
    const [totalOrders, setTotalOrders] = useState(0);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [globalStats, setGlobalStats] = useState<any>({});

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await adminService.getDashboardStats();
            if (response.success) {
                setGlobalStats(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    // Real stats from backend
    const stats = {
        urgent: globalStats.rushOrdersCount || 0,
        readyToShip: globalStats.readyOrdersCount || 0
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchOrders();
        }, 300); // Debounce
        return () => clearTimeout(timer);
    }, [page, activeFilter, searchTerm]); // Fetch on changes

    const fetchOrders = async () => {
        setLoading(true);
        try {
            let statusParam = undefined;
            let rushParam = undefined;

            if (activeFilter === 'Rush') rushParam = true;
            else if (activeFilter !== 'All') statusParam = activeFilter;

            const response = await adminService.getOrders(page, limit, statusParam, rushParam);
            const ordersArray = response.data || [];

            // Map backend data to UI structure
            const mappedOrders = ordersArray.map((o: any) => ({
                id: `#KD-${o._id.substring(o._id.length - 4).toUpperCase()}`,
                dbId: o._id,
                client: o.clientProfile?.fullName || 'Anonymous',
                telegram: o.telegramId ? `@${o.telegramId}` : 'No Handle',
                type: o.orderType === 'custom_event_dress' ? 'Evening Dress' : 'Custom Suit', // Map types
                deadline: o.eventDate ? new Date(o.eventDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'TBD',
                isRush: o.rushMultiplier && o.rushMultiplier > 1,
                status: o.status === 'form_submitted' ? 'Pending' :
                    o.status === 'deposit_paid' ? 'In Progress' :
                        o.status === 'shipped' ? 'Shipped' :
                            o.status.replace('_', ' '),
                revisions: o.revisionCount || 0,
                totalRevisions: 3,
            }));

            // Filtering is now handled by backend
            setOrders(mappedOrders);
            setTotalOrders(response.meta?.total || 0);

        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setPage(1); // Reset to page 1 on search
    };

    // Client-side filtration for display (Search only)
    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.telegram.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearch;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
                <div className="space-y-2">
                    <div className="flex items-center gap-4">
                        <h1 className="text-3xl font-bold text-white tracking-tight">Order Management</h1>
                        <span className="bg-admin-primary/20 text-admin-primary text-xs font-bold px-2.5 py-1 rounded-md">
                            {totalOrders} Total
                        </span>
                    </div>
                    <p className="text-slate-500 text-sm">Oversee luxury bespoke commissions and production timelines.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-admin-primary hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
                    >
                        <Plus className="size-4" />
                        <span>New Order</span>
                    </button>
                </div>
            </div>

            {/* Controls & Table Container */}
            <div className="space-y-4">
                {/* Controls Bar */}
                <div className="flex flex-col md:flex-row justify-between gap-4">
                    {/* Filters */}
                    <div className="flex bg-[#0f172a]/50 p-1 rounded-xl border border-white/5 w-fit">
                        {(['All', 'Rush', 'Pending', 'Completed'] as const).map((filter) => (
                            <button
                                key={filter}
                                onClick={() => { setActiveFilter(filter); setPage(1); }}
                                className={cn(
                                    "px-4 py-1.5 rounded-lg text-xs font-medium transition-all",
                                    activeFilter === filter
                                        ? "bg-admin-primary text-white shadow-md"
                                        : "text-slate-500 hover:text-slate-300"
                                )}
                            >
                                {filter === 'All' ? 'All Orders' :
                                    filter === 'Rush' ? 'Rush Orders' :
                                        filter === 'Pending' ? 'Pending Deposit' : filter}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search Order ID or Telegram ID..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-full bg-[#0f172a]/50 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-admin-primary/50 transition-all"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-[#0f172a]/30 border border-white/5 rounded-2xl overflow-hidden min-h-[400px]">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Order ID</th>
                                <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Client</th>
                                <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Type</th>
                                <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Deadline</th>
                                <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Revisions</th>
                                <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="py-20 text-center">
                                        <div className="inline-block size-8 border-2 border-admin-primary border-t-transparent rounded-full animate-spin" />
                                    </td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-20 text-center text-slate-600 text-sm">
                                        No orders found matching "{searchTerm}"
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.dbId} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                {order.isRush && <div className="w-1 h-5 bg-amber-500 rounded-full" />}
                                                <span className="font-bold text-white text-sm">{order.id}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div>
                                                <span className="block text-white text-sm font-bold">{order.client}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-slate-400 text-sm">{order.type}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col">
                                                {/* Logic to show 'Tomorrow' vs Date needed, using Date for now */}
                                                <span className={cn(
                                                    "text-sm font-medium",
                                                    order.isRush ? "text-amber-500" : "text-white"
                                                )}>
                                                    {order.deadline}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="bg-slate-800 text-slate-400 text-xs px-2 py-1 rounded-md font-medium">
                                                {order.revisions}/{order.totalRevisions}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            {order.isRush && order.status !== 'Shipped' ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2d1b0d] border border-amber-500/20 text-amber-500 text-xs font-medium">
                                                    <div className="size-1.5 rounded-full bg-amber-500" />
                                                    Rush
                                                </span>
                                            ) : (
                                                <span className={cn(
                                                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border",
                                                    order.status === 'In Progress' ? "bg-blue-500/10 border-blue-500/20 text-blue-400" :
                                                        order.status === 'Pending' ? "bg-slate-700/30 border-slate-700 text-slate-400" :
                                                            "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                                                )}>
                                                    {order.status}
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => setSelectedOrderId(order.dbId)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors" title="View Details">
                                                    <Eye className="size-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* Footer / Pagination */}
                    <div className="border-t border-white/5 p-4 flex items-center justify-between bg-[#0f172a]/50">
                        <span className="text-slate-500 text-sm">
                            Showing <span className="text-white font-medium">{filteredOrders.length > 0 ? (page - 1) * limit + 1 : 0}</span> to <span className="text-white font-medium">{Math.min(page * limit, totalOrders)}</span> of <span className="text-white font-medium">{totalOrders}</span> results
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-3 py-1.5 text-sm text-slate-400 hover:text-white disabled:opacity-50"
                            >
                                Previous
                            </button>
                            {/* Simple Page Indicator */}
                            <button className="size-8 rounded-lg bg-admin-primary text-white text-sm font-bold flex items-center justify-center">
                                {page}
                            </button>
                            {(page * limit < totalOrders) && (
                                <button className="size-8 rounded-lg border border-white/10 text-slate-400 text-sm font-medium flex items-center justify-center hover:bg-white/5 hover:text-white transition-colors">
                                    {page + 1}
                                </button>
                            )}
                            <button
                                onClick={() => setPage(p => p + 1)}
                                disabled={page * limit >= totalOrders}
                                className="px-3 py-1.5 text-sm text-slate-400 hover:text-white disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    {/* Urgent Production */}
                    <div className="bg-[#1c1c1c] border border-white/5 rounded-2xl p-6 flex items-center gap-5 relative overflow-hidden group">
                        <div className="absolute right-0 top-0 p-32 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-colors" />
                        <div className="size-12 rounded-xl bg-amber-900/40 flex items-center justify-center text-amber-500 relative z-10 border border-amber-500/20">
                            <Clock className="size-6" />
                        </div>
                        <div className="relative z-10">
                            <h4 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Urgent Production</h4>
                            <span className="text-3xl font-bold text-white">{stats.urgent} Orders</span>
                        </div>
                    </div>

                    {/* Ready to Ship */}
                    <div className="bg-[#1c1c1c] border border-white/5 rounded-2xl p-6 flex items-center gap-5 relative overflow-hidden group">
                        <div className="absolute right-0 top-0 p-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors" />
                        <div className="size-12 rounded-xl bg-emerald-900/40 flex items-center justify-center text-emerald-500 relative z-10 border border-emerald-500/20">
                            <CheckCircle className="size-6" />
                        </div>
                        <div className="relative z-10">
                            <h4 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Ready to Ship</h4>
                            <span className="text-3xl font-bold text-white">{stats.readyToShip} Orders</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Details Modal */}
            {selectedOrderId && (
                <OrderDetailsModal
                    orderId={selectedOrderId}
                    onClose={() => setSelectedOrderId(null)}
                />
            )}
            {isCreateModalOpen && (
                <CreateOrderModal
                    onClose={() => setIsCreateModalOpen(false)}
                    onOrderCreated={() => {
                        fetchOrders();
                        // Maybe fetch global stats too?
                        // fetchStats();
                    }}
                />
            )}
        </div>
    );
};
