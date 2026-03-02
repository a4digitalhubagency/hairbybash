'use client'

interface StepDetailsProps {
  clientName: string
  clientEmail: string
  clientPhone: string
  formErrors: Partial<Record<'clientName' | 'clientEmail' | 'clientPhone', string>>
  onChange: (field: 'clientName' | 'clientEmail' | 'clientPhone', value: string) => void
  onBlur: (field: 'clientName' | 'clientEmail' | 'clientPhone') => void
  onBack: () => void
}

const inputBase =
  'w-full bg-dark-card border rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/25 outline-none transition-all duration-200 focus:border-gold'

export default function StepDetails({
  clientName,
  clientEmail,
  clientPhone,
  formErrors,
  onChange,
  onBlur,
  onBack,
}: StepDetailsProps) {
  return (
    <div>
      {/* Back link */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-white/40 hover:text-white/80 text-sm mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to date &amp; time
      </button>

      <h2 className="font-(family-name:--font-playfair) font-bold text-2xl md:text-3xl text-white mb-1">
        Your Details
      </h2>
      <p className="text-white/40 text-sm mb-8">
        We&apos;ll use this to send your confirmation and appointment reminders.
      </p>

      <div className="max-w-md space-y-5">
        {/* Full name */}
        <div>
          <label className="block text-white/60 text-xs uppercase tracking-wider mb-2 font-medium">
            Full Name
          </label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => onChange('clientName', e.target.value)}
            onBlur={() => onBlur('clientName')}
            placeholder="Jane Smith"
            autoComplete="name"
            className={`${inputBase} ${
              formErrors.clientName ? 'border-red-500/60' : 'border-white/10'
            }`}
          />
          {formErrors.clientName && (
            <p className="text-red-400 text-xs mt-1.5">{formErrors.clientName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-white/60 text-xs uppercase tracking-wider mb-2 font-medium">
            Email Address
          </label>
          <input
            type="email"
            value={clientEmail}
            onChange={(e) => onChange('clientEmail', e.target.value)}
            onBlur={() => onBlur('clientEmail')}
            placeholder="jane@example.com"
            autoComplete="email"
            className={`${inputBase} ${
              formErrors.clientEmail ? 'border-red-500/60' : 'border-white/10'
            }`}
          />
          {formErrors.clientEmail && (
            <p className="text-red-400 text-xs mt-1.5">{formErrors.clientEmail}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-white/60 text-xs uppercase tracking-wider mb-2 font-medium">
            Phone Number
          </label>
          <input
            type="tel"
            value={clientPhone}
            onChange={(e) => onChange('clientPhone', e.target.value)}
            onBlur={() => onBlur('clientPhone')}
            placeholder="(403) 555-0199"
            autoComplete="tel"
            className={`${inputBase} ${
              formErrors.clientPhone ? 'border-red-500/60' : 'border-white/10'
            }`}
          />
          {formErrors.clientPhone && (
            <p className="text-red-400 text-xs mt-1.5">{formErrors.clientPhone}</p>
          )}
        </div>

        {/* Privacy note */}
        <p className="text-white/25 text-xs leading-relaxed pt-1">
          Your information is used only to manage your appointment and send confirmations.
          We never share your data with third parties.
        </p>
      </div>
    </div>
  )
}
