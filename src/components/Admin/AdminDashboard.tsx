import { useState, useEffect } from 'react';
import {
    ShoppingBag,
    Quote,
    DollarSign,
    Zap,
    FileText,
    Plus,
    Activity
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { adminService } from '../../services/adminService';
import { CreateOrderModal } from './CreateOrderModal';

export const AdminDashboard = () => {
    const [stats, setStats] = useState({
        activeOrdersCount: 0,
        pendingQuotesCount: 0,
        rushOrdersCount: 0,
        totalRevenue: 0,
        balanceDue: 0,
        totalOrders: 0
    });
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch stats
            const statsResponse = await adminService.getDashboardStats();
            if (statsResponse.success) {
                setStats(statsResponse.data);
            }

            // Fetch recent orders for activity feed
            const ordersResponse = await adminService.getOrders(1, 4);
            setOrders(ordersResponse.data || []);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const displayStats = [
        {
            label: 'Active Orders',
            value: stats.activeOrdersCount.toString(),
            icon: ShoppingBag,
            color: 'text-amber-500',
            bg: 'bg-amber-500',
        },
        {
            label: 'Pending Quotes',
            value: stats.pendingQuotesCount.toString(),
            icon: Quote,
            color: 'text-blue-500',
            bg: 'bg-blue-500',
        },
        {
            label: 'Total Revenue',
            value: `${stats.totalRevenue.toFixed(2)} Birr`,
            subValue: `Bal: ${stats.balanceDue.toFixed(2)} Birr`,
            icon: DollarSign,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500',
        },
        {
            label: 'Rush Orders',
            value: stats.rushOrdersCount.toString(),
            icon: Zap,
            color: 'text-rose-500',
            bg: 'bg-rose-500',
            isPrimary: true
        },
    ];

    // Map recent orders to activity
    const recentActivity = orders.slice(0, 4).map((order) => ({
        id: order._id,
        type: order.status === 'form_submitted' ? 'New Quote Requested' :
            order.status === 'deposit_paid' ? 'Deposit Confirmed' : 'Order Update',
        client: `${order.clientProfile?.fullName || 'Anonymous'} — ${order.orderType === 'custom_event_dress' ? 'Event Dress' : 'Signature'}`,
        time: new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'VIA TELEGRAM',
        icon: order.status === 'form_submitted' ? FileText : Activity,
        iconColor: order.status === 'form_submitted' ? 'text-blue-500 bg-blue-500/10' : 'text-emerald-500 bg-emerald-500/10',
    }));

    return (
        <div className="space-y-12 animate-in fade-in duration-700 font-sans">
            <div className="flex justify-between items-end border-b border-white/5 pb-8">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight uppercase italic">Analytics Overview</h1>
                    <p className="text-slate-500 mt-2 text-sm font-medium">Performance insights and real-time atelier activity monitor.</p>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center p-20">
                    <div className="size-12 border-4 border-admin-primary border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {displayStats.map((stat, idx) => (
                            <div key={idx} className="bg-[#1c1c1c] border border-white/5 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group hover:border-white/10 transition-colors">
                                {/* Glow Effect */}
                                <div className={cn("absolute right-0 top-0 p-32 rounded-full blur-3xl opacity-5 group-hover:opacity-10 transition-opacity", stat.bg)} />

                                <div className="flex justify-between items-start mb-6 relative z-10">
                                    <div className={cn("size-12 rounded-xl flex items-center justify-center border border-white/5", stat.bg.replace('bg-', 'bg-').replace('500', '900/40'), stat.bg.replace('bg-', 'border-').replace('500', '500/20'))}>
                                        <stat.icon className={cn("size-6", stat.color)} />
                                    </div>
                                </div>

                                <div className="space-y-1 relative z-10">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{stat.label}</p>
                                    <div className="flex items-baseline gap-2">
                                        <h2 className="text-4xl font-black text-white tracking-tighter">{stat.value}</h2>
                                        {stat.subValue && <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">{stat.subValue}</span>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* High Priority Activity */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
                                    <Activity className="size-5 text-admin-primary" />
                                    High Priority Activity
                                </h2>
                            </div>

                            <div className="bg-[#1c1c1c] border border-white/5 rounded-2xl overflow-hidden">
                                {recentActivity.map((activity, idx) => (
                                    <div key={idx} className="p-5 flex items-center gap-5 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors group cursor-pointer">
                                        <div className={cn("size-10 rounded-lg flex items-center justify-center border border-white/5", activity.iconColor)}>
                                            <activity.icon className="size-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-0.5">
                                                <h4 className="text-sm font-bold text-white tracking-tight">{activity.type}</h4>
                                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest bg-[#0f172a] px-2 py-0.5 rounded border border-white/5">{activity.time}</span>
                                            </div>
                                            <p className="text-slate-500 text-xs truncate font-medium">{activity.client}</p>
                                        </div>
                                    </div>
                                ))}
                                {recentActivity.length === 0 && (
                                    <div className="p-10 text-center text-slate-600 text-sm">No recent activity</div>
                                )}
                            </div>
                        </div>

                        {/* Quick Actions / System Status */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-white tracking-tight">Quick Actions</h2>
                            <div className="bg-[#1c1c1c] border border-white/5 rounded-2xl p-6 space-y-4">
                                <button
                                    onClick={() => setIsCreateModalOpen(true)}
                                    className="w-full bg-admin-primary hover:bg-admin-primary/90 text-white p-4 rounded-xl font-bold flex items-center justify-between group transition-all"
                                >
                                    <span className="flex items-center gap-3">
                                        <Plus className="size-5" />
                                        Create New Order
                                    </span>
                                    <div className="bg-white/20 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Plus className="size-4" />
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {isCreateModalOpen && (
                <CreateOrderModal
                    onClose={() => setIsCreateModalOpen(false)}
                    onOrderCreated={() => {
                        fetchData(); // Refresh stats and activity
                        setIsCreateModalOpen(false);
                    }}
                />
            )}
        </div>
    );
};
