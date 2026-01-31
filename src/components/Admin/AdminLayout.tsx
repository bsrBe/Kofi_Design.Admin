import {
    ShoppingBag,
    History,
    GalleryHorizontal,
    LogOut,
    Settings,
    Diamond
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface AdminLayoutProps {
    children: React.ReactNode;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    onLogout: () => void;
}

export const AdminLayout = ({ children, activeTab, setActiveTab, onLogout }: AdminLayoutProps) => {
    const managementItems = [
        { id: 'orders', label: 'Orders', icon: ShoppingBag },
        { id: 'revisions', label: 'Revisions', icon: History },
        { id: 'collections', label: 'Collections', icon: GalleryHorizontal },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    const topNavItems = [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'orders_top', label: 'Orders' },
        { id: 'clients', label: 'Clients' },
    ];

    return (
        <div className="flex h-screen bg-admin-bg text-slate-200 overflow-hidden">
            {/* Sidebar - Matching Image 2 */}
            <aside className="w-64 bg-admin-sidebar border-r border-admin-border flex flex-col z-30">
                <div className="p-6 flex items-center gap-3">
                    <div className="size-8 text-accent-gold">
                        <Diamond className="w-full h-full fill-current" />
                    </div>
                    <h1 className="font-bold text-lg tracking-tight text-white whitespace-nowrap uppercase">Kofi's Design</h1>
                </div>

                <div className="flex-1 px-4 py-4">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 mb-4">Management</p>
                    <nav className="space-y-1">
                        {managementItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                    activeTab === item.id
                                        ? "bg-admin-primary/10 text-admin-primary border border-admin-primary/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                                        : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                                )}
                            >
                                <item.icon className="size-4" />
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </div>

            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col relative overflow-hidden">
                {/* Header - Matching Image 0/2/3 */}
                <header className="h-20 border-b border-admin-border flex items-center justify-between px-8 bg-admin-bg/50 backdrop-blur-md z-20">
                    <div className="flex items-center gap-10 flex-1">
                        {/* Top Navigation - Matching Image 0 */}
                        <nav className="hidden lg:flex items-center gap-8">
                            {topNavItems.map((item) => (
                                <button
                                    key={item.id}
                                    className={cn(
                                        "text-sm font-medium transition-colors hover:text-white",
                                        activeTab === item.id ? "text-admin-primary" : "text-slate-400"
                                    )}
                                    onClick={() => setActiveTab(item.id)}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={onLogout}
                            className="p-2 text-red-500/60 hover:text-red-500 rounded-lg hover:bg-red-500/10 transition-all flex items-center gap-2 group"
                            title="Security Exit"
                        >
                            <LogOut className="size-5 group-hover:translate-x-0.5 transition-transform" />
                            <span className="text-[10px] font-bold uppercase tracking-widest hidden xl:block">Logout</span>
                        </button>
                        <div className="h-8 w-px bg-slate-800 mx-2" />
                        <div className="flex items-center gap-3 pl-2">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-white leading-none">Admin Kofi</p>
                            </div>
                            <div className="size-9 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-700 p-0.5 overflow-hidden ring-2 ring-admin-primary/20">
                                <img
                                    src="https://ui-avatars.com/api/?name=Admin+Kofi&background=3b82f6&color=fff"
                                    alt="User"
                                    className="size-full rounded-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto custom-scrollbar bg-admin-bg">
                    <div className="p-8 max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};
