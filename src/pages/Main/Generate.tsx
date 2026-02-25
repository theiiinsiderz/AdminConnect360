import { useEffect, useState } from 'react'
import api from '../../services/api'

interface Vendor {
  id: string
  name: string
  logoUrl?: string
  qrDesignUrl?: string
}

type DomainType = 'CAR' | 'BIKE' | 'PET' | 'KID'

export default function Generate() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [selectedVendorId, setSelectedVendorId] = useState('')
  const [selectedDomainType, setSelectedDomainType] = useState<DomainType>('CAR')
  const [quantity, setQuantity] = useState(100)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadingVendors, setLoadingVendors] = useState(true)

  useEffect(() => {
    const fetchVendors = async () => {
      setLoadingVendors(true)
      try {
        const response = await api.get('/admin/vendors')
        setVendors(response.data?.vendors || [])
        if (response.data?.vendors?.length > 0) {
          setSelectedVendorId(response.data.vendors[0].id)
        }
      } catch (err) {
        console.error('Failed to fetch vendors:', err)
        setError('Failed to load vendors')
      } finally {
        setLoadingVendors(false)
      }
    }
    fetchVendors()
  }, [])

  const handleGenerate = async () => {
    if (!selectedVendorId) {
      setError('Please select a vendor')
      return
    }
    setIsGenerating(true)
    setError(null)
    try {
      const response = await api.post('/admin/generate',
        { quantity, vendorId: selectedVendorId, domainType: selectedDomainType },
        { responseType: 'blob' }
      )

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      const vendor = vendors.find(v => v.id === selectedVendorId)
      const vendorName = vendor?.name.replace(/\s+/g, '_') || 'tags'
      link.setAttribute('download', `${vendorName}_tags_${quantity}_${new Date().getTime()}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err: any) {
      console.error('Generation failed:', err)
      const responseData = err?.response?.data

      if (responseData instanceof Blob) {
        const text = await responseData.text()
        try {
          const parsed = JSON.parse(text)
          setError(parsed?.message || 'Failed to generate tags. Please try again.')
        } catch {
          setError(text || 'Failed to generate tags. Please try again.')
        }
      } else {
        setError(responseData?.message || 'Failed to generate tags. Please try again.')
      }
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <article className="premium-card p-6 md:p-7">
      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-amber-200/70">Workflow</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-amber-50">Batch Tag Generation</h3>
            <p className="mt-3 max-w-2xl text-sm text-zinc-300">
              Select a vendor, specify quantity, and generate a printable PDF with branded QR code tags.
            </p>
          </div>
          <span className={`premium-chip px-4 py-2 text-xs ${isGenerating ? 'text-amber-300 animate-pulse' : 'text-amber-100/85'}`}>
            {isGenerating ? 'Generating...' : 'Ready'}
          </span>
        </div>

        <div className="grid max-w-md gap-5">
          <label className="block space-y-2">
            <span className="text-xs font-medium uppercase tracking-[0.22em] text-amber-100/80">Select Vendor *</span>
            {loadingVendors ? (
              <div className="flex items-center rounded-xl border border-amber-100/20 bg-black/40 px-4 py-3">
                <span className="text-sm text-amber-50/50">Loading vendors...</span>
              </div>
            ) : vendors.length > 0 ? (
              <select
                value={selectedVendorId}
                onChange={(e) => setSelectedVendorId(e.target.value)}
                className="w-full rounded-xl border border-amber-100/20 bg-black/40 px-4 py-3 text-base text-amber-50 focus:border-amber-400/50 focus:outline-none transition-colors"
              >
                <option value="">-- Select a vendor --</option>
                {vendors.map((vendor) => (
                  <option key={vendor.id} value={vendor.id}>
                    {vendor.name}
                  </option>
                ))}
              </select>
            ) : (
              <div className="flex items-center rounded-xl border border-amber-100/20 bg-black/40 px-4 py-3">
                <span className="text-sm text-red-300">No vendors found. Create one first.</span>
              </div>
            )}
          </label>

          <label className="block space-y-2">
            <span className="text-xs font-medium uppercase tracking-[0.22em] text-amber-100/80">Domain Type *</span>
            <select
              value={selectedDomainType}
              onChange={(e) => setSelectedDomainType(e.target.value as DomainType)}
              className="w-full rounded-xl border border-amber-100/20 bg-black/40 px-4 py-3 text-base text-amber-50 focus:border-amber-400/50 focus:outline-none transition-colors"
            >
              <option value="CAR">🚗 Vehicle (CAR)</option>
              <option value="BIKE">🏍️ Motorcycle (BIKE)</option>
              <option value="PET">🐕 Pet (PET)</option>
              <option value="KID">🧒 Child (KID)</option>
            </select>
          </label>

          <label className="block space-y-2">
            <span className="text-xs font-medium uppercase tracking-[0.22em] text-amber-100/80">Tag Quantity</span>
            <div className="flex items-center rounded-xl border border-amber-100/20 bg-black/40 px-4">
              <input
                type="number"
                min="1"
                max="10000"
                value={quantity}
                onChange={(e) => setQuantity(Math.min(10000, Math.max(1, parseInt(e.target.value) || 0)))}
                className="w-full border-0 bg-transparent py-3 text-base tracking-wide text-amber-50 placeholder:text-amber-50/35 focus:outline-none"
              />
            </div>
            <p className="text-[10px] text-zinc-500 italic">Max 10,000 tags per batch</p>
          </label>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || quantity < 1 || !selectedVendorId || loadingVendors}
            className="w-full rounded-xl bg-linear-to-r from-amber-300 to-yellow-500 px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isGenerating ? 'Processing Batch...' : 'Generate Printable PDF'}
          </button>

          {error && (
            <p className="rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-center text-sm text-red-300">
              {error}
            </p>
          )}
        </div>
      </div>
    </article>
  )
}
