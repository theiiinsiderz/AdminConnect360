import { useState } from 'react'

interface Vendor {
    id: string
    name: string
    logoUrl?: string
    qrDesignUrl?: string
    contactEmail?: string
    createdAt: string
}

const MOCK_VENDORS: Vendor[] = [
    {
        id: '1',
        name: 'TechCorp Solutions',
        contactEmail: 'contact@techcorp.com',
        logoUrl: 'https://placehold.co/100x100?text=TC',
        createdAt: new Date().toISOString(),
    },
    {
        id: '2',
        name: 'Green Energy Ltd',
        contactEmail: 'info@greenenergy.com',
        logoUrl: 'https://placehold.co/100x100?text=GE',
        createdAt: new Date().toISOString(),
    },
]

export default function Vendors() {
    const [vendors, setVendors] = useState<Vendor[]>(MOCK_VENDORS)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingVendor, setEditingVendor] = useState<Vendor | null>(null)

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        contactEmail: '',
        logoUrl: '',
        qrDesignUrl: '',
    })

    const handleOpenAddModal = () => {
        setEditingVendor(null)
        setFormData({ name: '', contactEmail: '', logoUrl: '', qrDesignUrl: '' })
        setIsModalOpen(true)
    }

    const handleOpenEditModal = (vendor: Vendor) => {
        setEditingVendor(vendor)
        setFormData({
            name: vendor.name,
            contactEmail: vendor.contactEmail || '',
            logoUrl: vendor.logoUrl || '',
            qrDesignUrl: vendor.qrDesignUrl || '',
        })
        setIsModalOpen(true)
    }

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this vendor?')) {
            setVendors((prev) => prev.filter((v) => v.id !== id))
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (editingVendor) {
            setVendors((prev) =>
                prev.map((v) => (v.id === editingVendor.id ? { ...v, ...formData } : v))
            )
        } else {
            const newVendor: Vendor = {
                id: Math.random().toString(36).substr(2, 9),
                ...formData,
                createdAt: new Date().toISOString(),
            }
            setVendors((prev) => [...prev, newVendor])
        }
        setIsModalOpen(false)
    }

    return (
        <section className="space-y-6">
            {/* Header Card */}
            <article className="premium-card p-6 md:p-7">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-amber-200/70">Management</p>
                        <h3 className="mt-2 text-2xl font-semibold tracking-tight text-amber-50">Vendors</h3>
                        <p className="mt-2 text-sm text-zinc-300">Manage sponsored companies and their QR branding details.</p>
                    </div>
                    <button
                        onClick={handleOpenAddModal}
                        className="premium-action rounded-xl bg-linear-to-r from-amber-300 to-yellow-500 px-6 py-2.5 text-sm font-semibold text-black shadow-[0_8px_20px_rgba(245,158,11,0.2)]"
                    >
                        + Add New Vendor
                    </button>
                </div>
            </article>

            {/* Table View */}
            <article className="premium-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="border-b border-amber-100/10 bg-black/20 text-xs uppercase tracking-wider text-amber-100/60">
                                <th className="px-6 py-4 font-medium">Vendor</th>
                                <th className="px-6 py-4 font-medium">Contact Email</th>
                                <th className="px-6 py-4 font-medium">Created At</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-amber-100/5">
                            {vendors.map((vendor) => (
                                <tr key={vendor.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 overflow-hidden rounded-lg border border-amber-100/20 bg-black/40">
                                                {vendor.logoUrl ? (
                                                    <img src={vendor.logoUrl} alt={vendor.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-xs text-amber-100/30">
                                                        N/A
                                                    </div>
                                                )}
                                            </div>
                                            <span className="font-medium text-amber-50">{vendor.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-zinc-300">{vendor.contactEmail || '-'}</td>
                                    <td className="px-6 py-4 text-zinc-400 text-xs">
                                        {new Date(vendor.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleOpenEditModal(vendor)}
                                                className="rounded-lg border border-amber-100/10 bg-black/40 p-2 text-amber-100/60 transition hover:bg-amber-100/10 hover:text-amber-100"
                                                title="Edit"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(vendor.id)}
                                                className="rounded-lg border border-red-500/10 bg-black/40 p-2 text-red-400/60 transition hover:bg-red-500/10 hover:text-red-400"
                                                title="Delete"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {vendors.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-zinc-500 italic">
                                        No vendors found. Add one to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </article>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="premium-surface w-full max-w-lg rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-amber-50">
                                {editingVendor ? 'Edit Vendor' : 'Add New Vendor'}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-zinc-500 hover:text-amber-100 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-medium uppercase tracking-wider text-amber-100/60">Company Name *</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full rounded-xl border border-amber-100/10 bg-black/40 px-4 py-3 text-amber-50 placeholder:text-zinc-600 focus:border-amber-400/50 focus:outline-none transition-colors"
                                    placeholder="e.g. Acme Inc"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium uppercase tracking-wider text-amber-100/60">Contact Email</label>
                                <input
                                    type="email"
                                    value={formData.contactEmail}
                                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                                    className="w-full rounded-xl border border-amber-100/10 bg-black/40 px-4 py-3 text-amber-50 placeholder:text-zinc-600 focus:border-amber-400/50 focus:outline-none transition-colors"
                                    placeholder="contact@company.com"
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium uppercase tracking-wider text-amber-100/60">Logo URL</label>
                                    <input
                                        type="url"
                                        value={formData.logoUrl}
                                        onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                                        className="w-full rounded-xl border border-amber-100/10 bg-black/40 px-4 py-3 text-amber-50 placeholder:text-zinc-600 focus:border-amber-400/50 focus:outline-none transition-colors"
                                        placeholder="https://..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium uppercase tracking-wider text-amber-100/60">QR Design URL</label>
                                    <input
                                        type="url"
                                        value={formData.qrDesignUrl}
                                        onChange={(e) => setFormData({ ...formData, qrDesignUrl: e.target.value })}
                                        className="w-full rounded-xl border border-amber-100/10 bg-black/40 px-4 py-3 text-amber-50 placeholder:text-zinc-600 focus:border-amber-400/50 focus:outline-none transition-colors"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 rounded-xl border border-amber-100/10 bg-zinc-900/50 py-3 text-sm font-medium text-amber-100/70 hover:bg-zinc-900 hover:text-amber-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 rounded-xl bg-linear-to-r from-amber-300 to-yellow-500 py-3 text-sm font-bold uppercase tracking-widest text-black shadow-lg hover:brightness-110 active:scale-[0.98] transition-all"
                                >
                                    {editingVendor ? 'Update Vendor' : 'Create Vendor'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    )
}
