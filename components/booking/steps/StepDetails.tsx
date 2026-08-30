'use client'

interface StepDetailsProps {
  clientName: string
  clientEmail: string
  clientPhone: string
  blowDryRequested: boolean | null
  formErrors: Partial<Record<'clientName' | 'clientEmail' | 'clientPhone', string>>
  onChange: (field: 'clientName' | 'clientEmail' | 'clientPhone', value: string) => void
  onBlur: (field: 'clientName' | 'clientEmail' | 'clientPhone') => void
  onBlowDryChange: (value: boolean) => void
  onBack: () => void
}

const inputBase =
  'w-full bg-dark-card border rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/25 outline-none transition-all duration-200 focus:border-gold'

export default function StepDetails({
  clientName,
  clientEmail,
  clientPhone,
  blowDryRequested,
  formErrors,
  onChange,
  onBlur,
  onBlowDryChange,
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

        {/* Blow Dry Service */}
        <div className="border border-white/10 rounded-2xl p-5 space-y-3">
          <div>
            <p className="text-white text-sm font-medium leading-snug">
              Blow Dry Service
            </p>
            <p className="text-white/40 text-xs mt-1 leading-relaxed">
              Your hair must be fully detangled and blow dried before your appointment.
              Would you like us to do it for you?
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => onBlowDryChange(true)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                blowDryRequested === true
                  ? 'bg-gold border-gold text-black'
                  : 'bg-transparent border-white/15 text-white/60 hover:border-white/30 hover:text-white/80'
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => onBlowDryChange(false)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                blowDryRequested === false
                  ? 'bg-gold border-gold text-black'
                  : 'bg-transparent border-white/15 text-white/60 hover:border-white/30 hover:text-white/80'
              }`}
            >
              No
            </button>
          </div>

          {/* Both answers carry a fee notice, but only one of them is conditional. */}
          {blowDryRequested === true && (
            <p className="text-gold/80 text-xs leading-relaxed bg-gold/8 border border-gold/20 rounded-xl px-4 py-3">
              A blow dry fee will be added to your service and charged{' '}
              <span className="font-semibold">in person</span> on the day.
            </p>
          )}

          {blowDryRequested === false && (
            <p className="text-white/55 text-xs leading-relaxed bg-white/5 border border-white/10 rounded-xl px-4 py-3">
              Please arrive with your hair fully detangled and blow dried. If it isn&apos;t,
              the blow dry fee will be charged <span className="font-semibold">in person</span> on the day.
            </p>
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
