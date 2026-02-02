import { X, Phone, MapPin, Calendar, Ruler, Image as ImageIcon, Package, Send, CheckCircle, Truck, Scissors, CreditCard } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface OrderDetailsModalProps {
    orderId: string;
    onClose: () => void;
}

export const OrderDetailsModal = ({ orderId, onClose }: OrderDetailsModalProps) => {
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrder();
    }, [orderId]);

    const fetchOrder = async () => {
        try {
            const response = await adminService.getOrderById(orderId);
            setOrder(response.data);
        } catch (error) {
            console.error('Failed to fetch order:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'form_submitted': return 'bg-slate-500/10 border-slate-500/20 text-slate-400';
            case 'bill_sent': return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
            case 'paid': return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
            case 'in_progress': return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
            case 'ready': return 'bg-purple-500/10 border-purple-500/20 text-purple-400';
            case 'delivered': return 'bg-green-500/10 border-green-500/20 text-green-400';
            default: return 'bg-slate-500/10 border-slate-500/20 text-slate-400';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-[#0f172a] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#1c1c1c]">
                    <div className="flex items-center gap-4">
                        <Package className="size-5 text-admin-primary" />
                        <div>
                            <h2 className="font-bold text-white text-lg">
                                Order {order ? `#KD-${order._id.substring(order._id.length - 4).toUpperCase()}` : 'Loading...'}
                            </h2>
                            {order && (
                                <span className={cn(
                                    "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border mt-1",
                                    getStatusColor(order.status)
                                )}>
                                    {order.status?.replace(/_/g, ' ').toUpperCase()}
                                </span>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)] custom-scrollbar">
                    {loading ? (
                        <div className="flex items-center justify-center p-12">
                            <div className="size-10 border-4 border-admin-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : order ? (
                        <div className="space-y-6">
                            {/* Client Info & Photo */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Client Info */}
                                <div className="bg-[#1c1c1c] border border-white/5 rounded-xl p-5 space-y-4">
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Client Information</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-full bg-admin-primary/10 flex items-center justify-center">
                                                <span className="text-admin-primary font-bold">
                                                    {order.clientProfile?.fullName?.charAt(0) || '?'}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-bold text-white">{order.clientProfile?.fullName}</p>
                                                <p className="text-xs text-slate-500">@{order.telegramId}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-400">
                                            <Phone className="size-4" />
                                            {order.clientProfile?.phoneNumber}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-400">
                                            <MapPin className="size-4" />
                                            {order.clientProfile?.city}
                                        </div>
                                    </div>
                                </div>

                                {/* Inspiration / Collection Photo */}
                                <div className="bg-[#1c1c1c] border border-white/5 rounded-xl p-5">
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                                        {order.collectionId ? 'Collection Item' : 'Inspiration Photo'}
                                    </h3>
                                    {order.inspirationPhoto || (order.collectionId && order.collectionId.image) ? (
                                        <div className="aspect-[4/5] rounded-lg overflow-hidden border border-white/10">
                                            <img
                                                src={order.inspirationPhoto || (order.collectionId.image?.startsWith('http') ? order.collectionId.image : `${API_URL}/media/${order.collectionId.image}`)}
                                                alt={order.collectionId?.title || "Inspiration"}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="aspect-[4/5] rounded-lg border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-slate-600">
                                            <ImageIcon className="size-8 mb-2" />
                                            <span className="text-xs">No photo uploaded</span>
                                        </div>
                                    )}
                                    {order.collectionId && (
                                        <p className="mt-3 text-sm font-bold text-admin-primary">
                                            {order.collectionId.title}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Order Details */}
                            <div className="bg-[#1c1c1c] border border-white/5 rounded-xl p-5">
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Order Details</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <span className="text-xs text-slate-500">Type</span>
                                        <p className="text-sm font-medium text-white capitalize">
                                            {order.orderType?.replace(/_/g, ' ')}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-xs text-slate-500">Occasion</span>
                                        <p className="text-sm font-medium text-white capitalize">{order.occasion}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs text-slate-500">Event Date</span>
                                        <p className="text-sm font-medium text-white">{formatDate(order.eventDate)}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs text-slate-500">Delivery</span>
                                        <p className={cn(
                                            "text-sm font-medium",
                                            order.isRushOrder ? "text-amber-500" : "text-white"
                                        )}>
                                            {formatDate(order.preferredDeliveryDate)}
                                            {order.isRushOrder && <span className="text-xs ml-1">(Rush)</span>}
                                        </p>
                                    </div>
                                </div>
                                {order.colorPreference && (
                                    <div className="mt-4 pt-4 border-t border-white/5">
                                        <span className="text-xs text-slate-500">Color Preference</span>
                                        <p className="text-sm font-medium text-white">{order.colorPreference}</p>
                                    </div>
                                )}
                                {order.bodyConcerns && (
                                    <div className="mt-4 pt-4 border-t border-white/5">
                                        <span className="text-xs text-slate-500">Body Concerns</span>
                                        <p className="text-sm font-medium text-white">{order.bodyConcerns}</p>
                                    </div>
                                )}
                            </div>

                            {/* Measurements */}
                            <div className="bg-[#1c1c1c] border border-white/5 rounded-xl p-5">
                                <div className="flex items-center gap-2 mb-4">
                                    <Ruler className="size-4 text-admin-primary" />
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Measurements (cm)</h3>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {order.measurements && Object.entries(order.measurements).map(([key, value]: [string, any]) => (
                                        <div key={key} className="bg-slate-900/50 rounded-lg p-3">
                                            <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">
                                                {key.replace(/([A-Z])/g, ' $1').trim()}
                                            </span>
                                            <p className="text-lg font-bold text-white">{value} <span className="text-xs font-normal text-slate-500">cm</span></p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Pricing Engine */}
                            <div className="bg-[#1c1c1c] border border-white/5 rounded-xl p-5">
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Pricing Engine</h3>

                                {order.status === 'form_submitted' ? (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs text-slate-500 mb-1 block">Base Price (Birr)</label>
                                            <input
                                                type="number"
                                                placeholder="Enter base price"
                                                className="w-full bg-slate-900 border border-white/10 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-admin-primary transition-colors"
                                                defaultValue={order.basePrice || ''}
                                                id="basePriceInput"
                                            />
                                        </div>
                                        <button
                                            onClick={() => {
                                                const input = document.getElementById('basePriceInput') as HTMLInputElement;
                                                const price = parseFloat(input.value);
                                                if (price > 0) {
                                                    adminService.sendQuote(order._id, price).then(res => {
                                                        if (res.success) {
                                                            setOrder(res.data);
                                                            // Optional: Show success toast
                                                        }
                                                    });
                                                }
                                            }}
                                            className="w-full bg-admin-primary hover:bg-admin-primary/90 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-admin-primary/20 flex items-center justify-center gap-2"
                                        >
                                            <Send className="size-4" />
                                            Send Quote & Notify User
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <span className="text-xs text-slate-500">Base Price</span>
                                                <p className="text-xl font-bold text-white">{order.basePrice?.toLocaleString() || 0} Birr</p>
                                            </div>
                                            <div>
                                                <span className="text-xs text-slate-500">Total</span>
                                                <p className="text-xl font-bold text-admin-primary">{order.totalPrice?.toLocaleString() || 0} Birr</p>
                                            </div>
                                            <div>
                                                <span className="text-xs text-slate-500">Deposit (30%)</span>
                                                <p className="text-xl font-bold text-white">{order.depositAmount?.toLocaleString() || 0} Birr</p>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="pt-6 border-t border-white/5">
                                            {order.status === 'bill_sent' && (
                                                <button
                                                    onClick={() => {
                                                        adminService.confirmDeposit(order._id).then(res => {
                                                            if (res.success) setOrder(res.data);
                                                        });
                                                    }}
                                                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2"
                                                >
                                                    <CreditCard className="size-4" />
                                                    Confirm Deposit Payment
                                                </button>
                                            )}

                                            {order.status === 'paid' && (
                                                <button
                                                    onClick={() => {
                                                        adminService.updateStatus(order._id, 'in_progress').then(res => {
                                                            if (res.success) setOrder(res.data);
                                                        });
                                                    }}
                                                    className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-amber-900/20 flex items-center justify-center gap-2"
                                                >
                                                    <Scissors className="size-4" />
                                                    Start Production
                                                </button>
                                            )}

                                            {order.status === 'in_progress' && (
                                                <button
                                                    onClick={() => {
                                                        adminService.updateStatus(order._id, 'ready').then(res => {
                                                            if (res.success) setOrder(res.data);
                                                        });
                                                    }}
                                                    className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2"
                                                >
                                                    <CheckCircle className="size-4" />
                                                    Mark Ready for Pickup
                                                </button>
                                            )}

                                            {order.status === 'ready' && (
                                                <button
                                                    onClick={() => {
                                                        adminService.updateStatus(order._id, 'delivered').then(res => {
                                                            if (res.success) setOrder(res.data);
                                                        });
                                                    }}
                                                    className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-green-900/20 flex items-center justify-center gap-2"
                                                >
                                                    <Truck className="size-4" />
                                                    Mark Delivered
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Timestamps */}
                            <div className="flex items-center gap-4 text-xs text-slate-500 pt-4 border-t border-white/5">
                                <div className="flex items-center gap-1">
                                    <Calendar className="size-3" />
                                    Created: {formatDate(order.createdAt)}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="size-3" />
                                    Updated: {formatDate(order.updatedAt)}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-slate-500 p-12">
                            Order not found
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
