import { useEffect, useState, useCallback } from 'react'
import api from '../../../services/api'

interface Vendor {
    id: string
    name: string
}

interface Tag {
    id: string
    code: string
    nickname?: string
    status: string
    domainType: string
    companyId: string
    company?: Vendor
    [key: string]: any // For profile specific fields
}

interface TagManagerProps {
    type: 'CAR' | 'BIKE' | 'PET' | 'KID'
}

interface PaginationMeta {
    total: number
    page: number
    limit: number
    totalPages: number
}

export default function TagManager({ type }: TagManagerProps) {
    const [tags, setTags] = useState<Tag[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingTag, setEditingTag] = useState<Tag | null>(null)
    const [vendors, setVendors] = useState<Vendor[]>([])

    // Filter & Search State
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [vendorFilter, setVendorFilter] = useState('')

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1)
    const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(null)

    // Dynamic form state based on type
    const [formData, setFormData] = useState<any>({})

    const fetchVendors = async () => {
        try {
            const response = await api.get('/admin/vendors')
            setVendors(response.data?.vendors || [])
        } catch (err) {
            console.error('Failed to fetch vendors:', err)
        }
    }

    const fetchTags = useCallback(async () => {
        setIsLoading(true)
        try {
            const params = {
                vendorId: vendorFilter || undefined,
                status: statusFilter || undefined,
                search: searchTerm || undefined,
                page: currentPage,
                limit: 10
            }
            const response = await api.get(`/admin/tags/type/${type}`, { params })

            // Handle pagination metadata (support both 'pagination' and 'meta' keys)
            if (response.data.tags) {
                setTags(response.data.tags)
                setPaginationMeta(response.data.pagination || response.data.meta)
            } else {
                setTags(response.data)
                setPaginationMeta(null)
            }
        } catch (err) {
            console.error('Failed to fetch tags:', err)
            setTags([])
            setPaginationMeta(null)
        } finally {
            setIsLoading(false)
        }
    }, [type, vendorFilter, statusFilter, searchTerm, currentPage])

    useEffect(() => {
        fetchVendors()
    }, [])

    useEffect(() => {
        fetchTags()
    }, [fetchTags])

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [searchTerm, statusFilter, vendorFilter])

    const handleOpenEditModal = (tag: Tag) => {
        setEditingTag(tag)
        const profile = tag[`${type.toLowerCase()}Profile`] || {}
        setFormData({
            nickname: tag.nickname || '',
            status: tag.status,
            ...profile
        })
        setIsModalOpen(true)
    }

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this tag?')) {
            try {
                await api.delete(`/admin/tags/${id}`)
                fetchTags()
            } catch (err) {
                alert('Failed to delete tag')
                console.error(err)
            }
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingTag) return

        try {
            await api.patch(`/admin/tags/${editingTag.id}`, formData)
            setIsModalOpen(false)
            fetchTags()
        } catch (err) {
            alert('Failed to update tag')
            console.error(err)
        }
    }

    const getProfileFields = () => {
        switch (type) {
            case 'CAR':
                return [
                    { name: 'vehicleNumber', label: 'Vehicle Number', type: 'text', required: true },
                    { name: 'vehicleType', label: 'Vehicle Type', type: 'text' },
                ]
            case 'BIKE':
                return [
                    { name: 'vehicleNumber', label: 'Vehicle Number', type: 'text', required: true },
                    { name: 'bikeModel', label: 'Bike Model', type: 'text' },
                ]
            case 'PET':
                return [
                    { name: 'petName', label: 'Pet Name', type: 'text', required: true },
                    { name: 'breedInfo', label: 'Breed Info', type: 'text' },
                ]
            case 'KID':
                return [
                    { name: 'displayName', label: 'Display Name', type: 'text', required: true },
                    { name: 'medicalAlerts', label: 'Medical Alerts', type: 'text' },
                ]
            default:
                return []
        }
    }

    return (
        <section className="space-y-6">
            {/* Header Card */}
            <article className="premium-card p-6 md:p-7">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-amber-200/70">Management</p>
                        <h3 className="mt-2 text-2xl font-semibold tracking-tight text-amber-50">{type} TAGS</h3>
                        <p className="mt-1 text-sm text-zinc-400">Manage products, search by owner, and filter by status or vendor.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex gap-3">
                        {/* Search Bar */}
                        <div className="relative group min-w-[200px]">
                            <input
                                type="text"
                                placeholder="Search owner name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-xl border border-amber-100/10 bg-black/40 px-4 py-2.5 pl-10 text-sm text-amber-50 placeholder:text-zinc-600 focus:border-amber-400/50 focus:outline-none transition-all"
                            />
                            <svg className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500 group-focus-within:text-amber-400/70 transition-colors" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        {/* Status Filter */}
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="rounded-xl border border-amber-100/10 bg-black/40 px-4 py-2.5 text-sm text-amber-50 focus:border-amber-400/50 focus:outline-none transition-all appearance-none pr-10 relative bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207L10%2012L15%207%22%20stroke%3D%22%2371717a%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:20px] bg-[right_10px_center] bg-no-repeat"
                        >
                            <option value="">All Statuses</option>
                            <option value="MINTED">Minted</option>
                            <option value="ACTIVE">Active</option>
                            <option value="SUSPENDED">Suspended</option>
                            <option value="REVOKED">Revoked</option>
                        </select>

                        {/* Vendor Filter */}
                        <select
                            value={vendorFilter}
                            onChange={(e) => setVendorFilter(e.target.value)}
                            className="rounded-xl border border-amber-100/10 bg-black/40 px-4 py-2.5 text-sm text-amber-50 focus:border-amber-400/50 focus:outline-none transition-all appearance-none pr-10 relative bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207L10%2012L15%207%22%20stroke%3D%22%2371717a%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:20px] bg-[right_10px_center] bg-no-repeat"
                        >
                            <option value="">All Vendors</option>
                            {vendors.map(v => (
                                <option key={v.id} value={v.id}>{v.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </article>

            {/* Table View */}
            <article className="premium-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="border-b border-amber-100/10 bg-black/20 text-xs uppercase tracking-wider text-amber-100/60">
                                <th className="px-6 py-4 font-medium">Tag Code</th>
                                <th className="px-6 py-4 font-medium">Company</th>
                                <th className="px-6 py-4 font-medium">Nickname</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Profile Info</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-amber-100/5">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-amber-100/30 animate-pulse">
                                        Loading tags...
                                    </td>
                                </tr>
                            ) : tags.map((tag) => (
                                <tr key={tag.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="font-mono text-amber-200/90">{tag.code}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-zinc-300">{tag.company?.name || '-'}</span>
                                    </td>
                                    <td className="px-6 py-4 text-zinc-300">{tag.nickname || '-'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`premium-chip px-3 py-1 text-[10px] uppercase font-bold tracking-widest ${tag.status === 'ACTIVE' ? 'text-emerald-400 border-emerald-500/20' : 'text-zinc-500 border-zinc-500/20'
                                            }`}>
                                            {tag.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-zinc-400 text-xs">
                                        {type === 'CAR' || type === 'BIKE' ? tag[`${type.toLowerCase()}Profile`]?.vehicleNumber :
                                            type === 'PET' ? tag.petProfile?.petName : tag.kidProfile?.displayName}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleOpenEditModal(tag)}
                                                className="rounded-lg border border-amber-100/10 bg-black/40 p-2 text-amber-100/60 transition hover:bg-amber-100/10 hover:text-amber-100"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(tag.id)}
                                                className="rounded-lg border border-red-500/10 bg-black/40 p-2 text-red-400/60 transition hover:bg-red-500/10 hover:text-red-400"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {!isLoading && tags.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-zinc-500 italic">
                                        No {type.toLowerCase()} tags found matching filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Stats & Controls */}
                {paginationMeta && (
                    <div className="flex items-center justify-between border-t border-amber-100/10 bg-black/20 px-6 py-4">
                        <p className="text-xs text-zinc-500">
                            Showing page <span className="text-amber-100/80 font-medium">{paginationMeta.page}</span> of <span className="text-amber-100/80 font-medium">{paginationMeta.totalPages || 1}</span>
                            <span className="mx-2 opacity-30">|</span>
                            Total <span className="text-amber-100/80 font-medium">{paginationMeta.total}</span> items
                        </p>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => prev - 1)}
                                className="rounded-lg border border-amber-100/10 bg-black/40 px-3 py-1.5 text-xs font-medium text-amber-100/70 hover:bg-amber-100/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                Previous
                            </button>
                            <button
                                type="button"
                                disabled={!paginationMeta.totalPages || currentPage >= paginationMeta.totalPages}
                                onClick={() => setCurrentPage(prev => prev + 1)}
                                className="rounded-lg border border-amber-100/10 bg-black/40 px-3 py-1.5 text-xs font-medium text-amber-100/70 hover:bg-amber-100/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </article>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="premium-surface w-full max-w-lg rounded-3xl p-8 shadow-2xl">
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-amber-50">Edit {type} Tag</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-amber-100">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-medium uppercase tracking-wider text-amber-100/60">Nickname</label>
                                <input
                                    type="text"
                                    value={formData.nickname}
                                    onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                                    className="w-full rounded-xl border border-amber-100/10 bg-black/40 px-4 py-3 text-amber-50 placeholder:text-zinc-600 focus:border-amber-400/50 focus:outline-none"
                                    placeholder="e.g. My daily ride"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium uppercase tracking-wider text-amber-100/60">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full rounded-xl border border-amber-100/10 bg-black/40 px-4 py-3 text-amber-50 focus:border-amber-400/50 focus:outline-none appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207L10%2012L15%207%22%20stroke%3D%22%2371717a%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:20px] bg-[right_15px_center] bg-no-repeat"
                                >
                                    <option value="MINTED">Minted</option>
                                    <option value="ACTIVE">Active</option>
                                    <option value="SUSPENDED">Suspended</option>
                                    <option value="REVOKED">Revoked</option>
                                </select>
                            </div>

                            {getProfileFields().map((field) => (
                                <div key={field.name} className="space-y-2">
                                    <label className="text-xs font-medium uppercase tracking-wider text-amber-100/60">{field.label}</label>
                                    <input
                                        required={field.required}
                                        type={field.type}
                                        value={formData[field.name] || ''}
                                        onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                                        className="w-full rounded-xl border border-amber-100/10 bg-black/40 px-4 py-3 text-amber-50 placeholder:text-zinc-600 focus:border-amber-400/50 focus:outline-none"
                                    />
                                </div>
                            ))}

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 rounded-xl border border-amber-100/10 bg-zinc-900/50 py-3 text-sm font-medium text-amber-100/70 hover:bg-zinc-900"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 rounded-xl bg-linear-to-r from-amber-300 to-yellow-500 py-3 text-sm font-bold uppercase tracking-widest text-black shadow-lg"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    )
}
