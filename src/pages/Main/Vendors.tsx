import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import api from '../../services/api'

interface Vendor {
    id: string
    name: string
    logoUrl?: string
    qrDesignUrl?: string
    contactEmail?: string
    createdAt: string
}

export default function Vendors() {
    const [vendors, setVendors] = useState<Vendor[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingVendor, setEditingVendor] = useState<Vendor | null>(null)
    const [isSaving, setIsSaving] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        contactEmail: '',
    })
    const [logoFile, setLogoFile] = useState<File | null>(null)
    const [qrDesignFile, setQrDesignFile] = useState<File | null>(null)

    const fetchVendors = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await api.get('/admin/vendors')
            setVendors(response.data?.vendors || [])
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Failed to load vendors')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchVendors()
    }, [])

    const handleOpenAddModal = () => {
        setEditingVendor(null)
        setFormData({ name: '', contactEmail: '' })
        setLogoFile(null)
        setQrDesignFile(null)
        setError(null)
        setIsModalOpen(true)
    }

    const handleOpenEditModal = (vendor: Vendor) => {
        setEditingVendor(vendor)
        setFormData({
            name: vendor.name,
            contactEmail: vendor.contactEmail || '',
        })
        setLogoFile(null)
        setQrDesignFile(null)
        setError(null)
        setIsModalOpen(true)
    }

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this vendor?')) {
            try {
                await api.delete(`/admin/vendors/${id}`)
                setVendors((prev) => prev.filter((v) => v.id !== id))
            } catch (err: any) {
                setError(err?.response?.data?.message || 'Failed to delete vendor')
            }
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        setError(null)

        try {
            const payload = new FormData()
            payload.append('name', formData.name)
            payload.append('contactEmail', formData.contactEmail)

            if (logoFile) {
                payload.append('logo', logoFile)
            }
            if (qrDesignFile) {
                payload.append('qrDesign', qrDesignFile)
            }

            if (editingVendor) {
                await api.put(`/admin/vendors/${editingVendor.id}`, payload, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                })
            } else {
                await api.post('/admin/vendors', payload, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                })
            }

            await fetchVendors()
            setIsModalOpen(false)
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Failed to save vendor')
        } finally {
            setIsSaving(false)
        }
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

            {error && (
                <p className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
                    {error}
                </p>
            )}

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
                            {!isLoading && vendors.map((vendor) => (
                                <tr key={vendor.id} className="group hover:bg-white/2 transition-colors">
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
                            {isLoading && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-zinc-500 italic">
                                        Loading vendors...
                                    </td>
                                </tr>
                            )}
                            {!isLoading && vendors.length === 0 && (
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
                                    <label className="text-xs font-medium uppercase tracking-wider text-amber-100/60">Logo Image (PNG/JPG)</label>
                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg"
                                        onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                                        className="w-full rounded-xl border border-amber-100/10 bg-black/40 px-4 py-3 text-amber-50 file:mr-3 file:rounded-md file:border-0 file:bg-amber-300 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-black"
                                    />
                                    {!logoFile && editingVendor?.logoUrl && (
                                        <img src={editingVendor.logoUrl} alt="Current vendor logo" className="h-12 w-12 rounded-md border border-amber-100/20 object-cover" />
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium uppercase tracking-wider text-amber-100/60">QR Design Image (PNG/JPG)</label>
                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg"
                                        onChange={(e) => setQrDesignFile(e.target.files?.[0] || null)}
                                        className="w-full rounded-xl border border-amber-100/10 bg-black/40 px-4 py-3 text-amber-50 file:mr-3 file:rounded-md file:border-0 file:bg-amber-300 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-black"
                                    />
                                    {!qrDesignFile && editingVendor?.qrDesignUrl && (
                                        <img src={editingVendor.qrDesignUrl} alt="Current QR design" className="h-12 w-12 rounded-md border border-amber-100/20 object-cover" />
                                    )}
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
                                    disabled={isSaving}
                                    className="flex-1 rounded-xl bg-linear-to-r from-amber-300 to-yellow-500 py-3 text-sm font-bold uppercase tracking-widest text-black shadow-lg hover:brightness-110 active:scale-[0.98] transition-all"
                                >
                                    {isSaving ? 'Saving...' : editingVendor ? 'Update Vendor' : 'Create Vendor'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    )
}
