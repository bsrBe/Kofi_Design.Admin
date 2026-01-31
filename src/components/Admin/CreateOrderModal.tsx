import { useState } from 'react';
import { X, Save, User, Phone, MapPin, Calendar, Ruler, Scissors } from 'lucide-react';
import { adminService } from '../../services/adminService';

interface CreateOrderModalProps {
    onClose: () => void;
    onOrderCreated: () => void;
}

export const CreateOrderModal = ({ onClose, onOrderCreated }: CreateOrderModalProps) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        city: '',
        orderType: 'custom_event_dress',
        occasion: 'party',
        eventDate: '',
        preferredDeliveryDate: '',
        measurements: {
            bust: 0,
            waist: 0,
            hips: 0,
            shoulderWidth: 0,
            dressLength: 0,
            armLength: 0,
            height: 0
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent as keyof typeof prev] as any,
                    [child]: Number(value)
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await adminService.createOrder(formData);
            if (response.success) {
                onOrderCreated();
                onClose();
            }
        } catch (error) {
            console.error('Failed to create order:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#0f172a] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#1c1c1c]/50 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-admin-primary/10 flex items-center justify-center border border-admin-primary/20">
                            <Scissors className="size-5 text-admin-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">New Manual Order</h2>
                            <p className="text-xs text-slate-500">Create an order for a walk-in client</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
                        <X className="size-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    {/* Client Info */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <User className="size-3" /> Client Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs text-slate-400">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-600" />
                                    <input
                                        required
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-admin-primary/50 transition-colors"
                                        placeholder="e.g. Jane Doe"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-slate-400">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-600" />
                                    <input
                                        required
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-admin-primary/50 transition-colors"
                                        placeholder="e.g. +251 911 234 567"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs text-slate-400">City</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-600" />
                                    <input
                                        required
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-admin-primary/50 transition-colors"
                                        placeholder="e.g. Addis Ababa"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-white/5" />

                    {/* Order Details */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Scissors className="size-3" /> Order Specifics
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs text-slate-400">Type</label>
                                <select
                                    name="orderType"
                                    value={formData.orderType}
                                    onChange={handleChange}
                                    className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-admin-primary/50 transition-colors appearance-none"
                                >
                                    <option value="custom_event_dress">Custom Event Dress</option>
                                    <option value="signature_dress">Signature Dress</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-slate-400">Occasion</label>
                                <select
                                    name="occasion"
                                    value={formData.occasion}
                                    onChange={handleChange}
                                    className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-admin-primary/50 transition-colors appearance-none"
                                >
                                    <option value="party">Party</option>
                                    <option value="wedding">Wedding</option>
                                    <option value="graduation">Graduation</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-slate-400">Event Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-600" />
                                    <input
                                        required
                                        type="date"
                                        name="eventDate"
                                        value={formData.eventDate}
                                        onChange={handleChange}
                                        className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-admin-primary/50 transition-colors [color-scheme:dark]"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-slate-400">Delivery Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-600" />
                                    <input
                                        required
                                        type="date"
                                        name="preferredDeliveryDate"
                                        value={formData.preferredDeliveryDate}
                                        onChange={handleChange}
                                        className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-admin-primary/50 transition-colors [color-scheme:dark]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-white/5" />

                    {/* Measurements */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Ruler className="size-3" /> Measurements (cm)
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {['bust', 'waist', 'hips', 'shoulderWidth', 'dressLength', 'armLength', 'height'].map((field) => (
                                <div key={field} className="space-y-2">
                                    <label className="text-xs text-slate-400 capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}</label>
                                    <input
                                        type="number"
                                        name={`measurements.${field}`}
                                        value={formData.measurements[field as keyof typeof formData.measurements]}
                                        onChange={handleChange}
                                        className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-admin-primary/50 transition-colors"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                </form>

                {/* Footer */}
                <div className="p-6 border-t border-white/5 bg-[#1c1c1c]/50 rounded-b-2xl flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-6 py-2.5 rounded-xl text-sm font-bold bg-admin-primary text-white hover:bg-admin-primary/90 transition-all shadow-lg shadow-admin-primary/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating...' : (
                            <>
                                <Save className="size-4" />
                                Create Order
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
