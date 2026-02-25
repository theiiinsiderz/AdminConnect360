type BrandLogoProps = {
  className?: string
  showText?: boolean
}

export default function BrandLogo({ className = '', showText = false }: BrandLogoProps) {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`.trim()}>
      <svg viewBox="0 0 230 150" aria-hidden="true" className="h-14 w-auto">
        <rect x="14" y="18" width="202" height="114" rx="22" fill="#F5F5F5" />

        <path
          d="M14 74 C44 58, 82 52, 125 56 C152 59, 176 69, 198 84 C207 90, 214 98, 216 108 L216 132 L14 132 Z"
          fill="#050505"
        />

        <path d="M16 84 C72 74, 132 74, 184 86 C197 89, 208 95, 216 104" stroke="#F5F5F5" strokeWidth="8" fill="none" />

        <path
          d="M28 124 C62 113, 96 108, 132 108 C165 108, 190 114, 210 124 C190 126, 165 129, 139 133 C96 139, 58 142, 26 143 Z"
          fill="#0A0A0A"
        />

        <path d="M160 36 h42 a6 6 0 0 1 0 12 h-42 a6 6 0 0 1 0 -12 Z" fill="#050505" />
        <path d="M170 56 h28 a5 5 0 0 1 0 10 h-28 a5 5 0 0 1 0 -10 Z" fill="#050505" />
        <circle cx="198" cy="76" r="5" fill="#050505" />
      </svg>

      {showText && (
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.33em] text-amber-200/80">Carcard</p>
          <p className="mt-1 text-base font-semibold tracking-tight text-amber-50">Admin Portal</p>
        </div>
      )}
    </div>
  )
}
