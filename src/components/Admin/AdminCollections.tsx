import { useState, useEffect } from 'react';
import {
    Plus,
    Trash2,
    Tag,
    Image as ImageIcon,
    X,
    Save,
    Pencil,
    GalleryHorizontal,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AdminCollections = () => {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    // Form State
    const [title, setTitle] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [currentTag, setCurrentTag] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchCollections();
    }, []);

    const fetchCollections = async () => {
        setLoading(true);
        try {
            const response = await adminService.getCollections();
            setItems(response.data || []);
        } catch (error) {
            console.error('Failed to fetch collections:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const addTag = () => {
        if (currentTag && !tags.includes(currentTag)) {
            setTags([...tags, currentTag]);
            setCurrentTag('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(t => t !== tagToRemove));
    };

    const handleEdit = (item: any) => {
        setEditingItem(item);
        setTitle(item.title);
        setTags(item.tags || []);
        setPreviewUrl(item.image?.startsWith('http') ? item.image : `${API_URL}/media/${item.image}`);
        setIsAdding(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setTitle('');
        setTags([]);
        setSelectedFile(null);
        setPreviewUrl(null);
        setEditingItem(null);
        setIsAdding(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || (!selectedFile && !editingItem)) return;

        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('title', title);
            if (selectedFile) {
                formData.append('photo', selectedFile);
            }
            formData.append('tags', JSON.stringify(tags));

            if (editingItem) {
                await adminService.updateCollectionItem(editingItem._id, formData);
            } else {
                await adminService.addCollectionItem(formData);
            }

            resetForm();
            fetchCollections();
        } catch (error) {
            console.error('Failed to save collection item:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this item?')) return;

        try {
            await adminService.deleteCollectionItem(id);
            fetchCollections();
        } catch (error) {
            console.error('Failed to delete item:', error);
        }
    };

    return (
        <div className="space-y-12 animate-in fade-in duration-700 pb-20">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight uppercase italic flex items-center gap-4">
                        <GalleryHorizontal className="size-10 text-admin-primary" />
                        Collection Manager
                    </h1>
                    <p className="text-slate-500 mt-2 text-sm font-medium">Curate the public portfolio displayed on the client storefront.</p>
                </div>

                <button
                    onClick={() => {
                        if (isAdding) resetForm();
                        else setIsAdding(true);
                    }}
                    className={cn(
                        "px-10 py-4 rounded-xl font-black flex items-center gap-3 transition-all active:scale-95 uppercase tracking-widest text-xs shadow-2xl",
                        isAdding
                            ? "bg-slate-800 text-white hover:bg-slate-700"
                            : "bg-admin-primary text-white hover:bg-blue-600 shadow-admin-primary/20"
                    )}
                >
                    {isAdding ? <X className="size-5" /> : <Plus className="size-5 stroke-[3px]" />}
                    <span>{isAdding ? 'Cancel' : 'Add Masterpiece'}</span>
                </button>
            </header>

            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-[#0b1120] border border-admin-primary/30 rounded-3xl p-10 shadow-2xl overflow-hidden relative"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                            <GalleryHorizontal className="size-40" />
                        </div>

                        <form onSubmit={handleSubmit} className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div className="space-y-8">
                                <div className="space-y-2 text-white">
                                    <h2 className="text-xl font-black uppercase italic tracking-tight">{editingItem ? 'Edit Masterpiece' : 'New Masterpiece'}</h2>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Masterpiece Title</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="e.g., Midnight Silk Evening Gown"
                                        className="w-full bg-[#0f172a] border border-slate-800 rounded-xl py-4 px-6 text-white text-lg focus:outline-none focus:border-admin-primary transition-all font-bold placeholder:text-slate-700"
                                        required
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Discovery Tags</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={currentTag}
                                            onChange={(e) => setCurrentTag(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                            placeholder="Add tag (e.g., Silk, 2024, Evening)"
                                            className="flex-1 bg-[#0f172a] border border-slate-800 rounded-xl py-3 px-6 text-white focus:outline-none focus:border-admin-primary transition-all text-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={addTag}
                                            className="px-6 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all"
                                        >
                                            <Plus className="size-5" />
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {tags.map(tag => (
                                            <span key={tag} className="bg-admin-primary/10 text-admin-primary px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 border border-admin-primary/20">
                                                {tag}
                                                <X className="size-3 cursor-pointer hover:text-white" onClick={() => removeTag(tag)} />
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting || !title || (!selectedFile && !editingItem)}
                                    className="w-full py-5 bg-admin-primary disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 shadow-xl shadow-admin-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                                >
                                    {submitting ? (
                                        <div className="size-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                                    ) : <Save className="size-5" />}
                                    {submitting ? 'Preserving...' : editingItem ? 'Update Masterpiece' : 'Save to Collection'}
                                </button>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Visual Piece</label>
                                <div
                                    className={cn(
                                        "aspect-square rounded-3xl border-2 border-dashed flex flex-col items-center justify-center relative overflow-hidden transition-all group",
                                        previewUrl ? "border-admin-primary/50" : "border-slate-800 hover:border-admin-primary/30"
                                    )}
                                >
                                    {previewUrl ? (
                                        <>
                                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button
                                                    type="button"
                                                    onClick={() => setPreviewUrl(null)}
                                                    className="bg-red-500 p-4 rounded-full text-white hover:scale-110 transition-transform"
                                                >
                                                    <Trash2 className="size-6" />
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="size-20 bg-slate-900 rounded-2xl mb-4 flex items-center justify-center text-slate-700">
                                                <ImageIcon className="size-10" />
                                            </div>
                                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Drag & Drop or</p>
                                            <label className="mt-2 text-admin-primary cursor-pointer font-black text-xs uppercase tracking-widest hover:underline">
                                                Choose File
                                                <input type="file" className="hidden" accept="image/*" onChange={handleFileSelect} />
                                            </label>
                                        </>
                                    )}
                                </div>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {loading ? (
                    Array(8).fill(0).map((_, i) => (
                        <div key={i} className="aspect-[3/4] bg-slate-900/50 rounded-3xl animate-pulse flex flex-col p-6 space-y-4" />
                    ))
                ) : items.length === 0 ? (
                    <div className="col-span-full py-40 flex flex-col items-center justify-center text-center opacity-20">
                        <GalleryHorizontal className="size-24 mb-6" />
                        <h3 className="text-3xl font-black uppercase italic tracking-tighter">Your gallery is empty</h3>
                        <p className="mt-2 font-bold uppercase text-[10px] tracking-widest">Start adding your best works to inspire clients</p>
                    </div>
                ) : (
                    items.map((item) => (
                        <motion.div
                            layout
                            key={item._id}
                            className="group bg-[#0b1120] border border-admin-border rounded-3xl overflow-hidden hover:border-admin-primary/50 transition-all shadow-xl"
                        >
                            <div className="relative aspect-[3/4] overflow-hidden">
                                <img
                                    src={item.image?.startsWith('http') ? item.image : `${API_URL}/media/${item.image}`}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8 gap-3">
                                    <div className="flex gap-2 self-end">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="bg-white/10 hover:bg-white text-white hover:text-black p-3 rounded-xl transition-all"
                                        >
                                            <Pencil className="size-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            className="bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white p-3 rounded-xl transition-all"
                                        >
                                            <Trash2 className="size-5" />
                                        </button>
                                    </div>
                                </div>
                                <div className="absolute top-4 left-4 flex flex-wrap gap-1">
                                    {item.tags?.slice(0, 2).map((tag: any) => (
                                        <span key={tag} className="bg-black/40 backdrop-blur-md px-2 py-1 rounded text-[8px] font-bold text-white uppercase tracking-widest border border-white/5">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="p-6 space-y-2">
                                <h3 className="text-white font-bold text-lg tracking-tight truncate">{item.title}</h3>
                                <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                                    <Tag className="size-3" />
                                    {item.tags?.length || 0} Discovery Tags
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};
