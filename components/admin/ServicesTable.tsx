'use client'

import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { formatPrice, formatDuration } from '@/lib/format'
import Toast from '@/components/ui/Toast'
import type { ToastMessage } from '@/components/ui/Toast'
import type { Service } from '@/types'

const PAGE_SIZE = 5
const CATEGORIES = ['Braids', 'Locs', 'Twists', 'Cornrows', 'Kids', 'Other']
const DESC_MAX = 300

const DURATION_OPTIONS = [
  { label: '30 min',      value: 30  },
  { label: '45 min',      value: 45  },
  { label: '1 hr',        value: 60  },
  { label: '1 hr 15 min', value: 75  },
  { label: '1 hr 30 min', value: 90  },
  { label: '1 hr 45 min', value: 105 },
  { label: '2 hr',        value: 120 },
  { label: '2 hr 30 min', value: 150 },
  { label: '3 hr',        value: 180 },
  { label: '3 hr 30 min', value: 210 },
  { label: '4 hr',        value: 240 },
  { label: '4 hr 30 min', value: 270 },
  { label: '5 hr',        value: 300 },
  { label: '5 hr 30 min', value: 330 },
  { label: '6 hr',        value: 360 },
]

// ── Form types ───────────────────────────────────────────────────────────────

interface ServiceForm {
  name: string
  description: string
  price: string
  deposit_percentage: string
  duration_minutes: string
  category: string
  image_url: string
  active: boolean
}

const EMPTY_FORM: ServiceForm = {
  name: '',
  description: '',
  price: '',
  deposit_percentage: '50',
  duration_minutes: '60',
  category: 'Braids',
  image_url: '',
  active: true,
}

function serviceToForm(s: Service): ServiceForm {
  return {
    name: s.name,
    description: s.description ?? '',
    price: (s.price / 100).toFixed(2),
    deposit_percentage: String(s.deposit_percentage),
    duration_minutes: String(s.duration_minutes),
    category: s.category,
    image_url: s.image_url ?? '',
    active: s.active,
  }
}

// ── Toggle switch ────────────────────────────────────────────────────────────

function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean
  onChange: () => void
  disabled?: boolean
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 focus-visible:outline-none disabled:opacity-40 disabled:cursor-not-allowed ${
        checked ? 'bg-gold' : 'bg-white/15'
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? 'translate-x-4.5' : 'translate-x-0.75'
        }`}
      />
    </button>
  )
}

// ── Image thumbnail ──────────────────────────────────────────────────────────

function ServiceThumb({ service }: { service: Service }) {
  const [imgError, setImgError] = useState(false)
  const letter = service.name[0]?.toUpperCase() ?? '?'

  if (service.image_url && !imgError) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={service.image_url}
        alt={service.name}
        onError={() => setImgError(true)}
        className="w-10 h-10 rounded-lg object-cover shrink-0 bg-dark-card"
      />
    )
  }
  return (
    <div className="w-10 h-10 rounded-lg bg-gold/15 border border-gold/20 flex items-center justify-center shrink-0">
      <span className="text-gold text-sm font-semibold">{letter}</span>
    </div>
  )
}

// ── Section label ─────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-gold text-[10px] tracking-[0.2em] uppercase font-semibold mb-4">
      {children}
    </p>
  )
}

// ── Input wrapper ─────────────────────────────────────────────────────────────

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-white/50 text-xs mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

const inputCls = 'w-full bg-dark border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-gold/40 transition-colors'
const selectCls = `${inputCls} appearance-none`

// ── Modal ─────────────────────────────────────────────────────────────────────

interface ModalProps {
  editing: Service | null
  form: ServiceForm
  saving: boolean
  deleting: boolean
  onChange: (f: ServiceForm) => void
  onSave: () => void
  onDelete: () => void
  onClose: () => void
  addToast: (message: string, type: ToastMessage['type']) => void
}

function ServiceModal({ editing, form, saving, deleting, onChange, onSave, onDelete, onClose, addToast }: ModalProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [localPreview, setLocalPreview] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const blobUrlRef = useRef<string | null>(null)

  // Guard close — never interrupt an in-flight upload
  function handleClose() {
    if (uploading) return
    onClose()
  }

  // Escape key
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') handleClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploading])

  // Revoke blob URL on unmount
  useEffect(() => {
    return () => {
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current)
    }
  }, [])

  function field(key: keyof ServiceForm, value: string | boolean) {
    onChange({ ...form, [key]: value })
  }

  const descRemaining = DESC_MAX - form.description.length

  async function uploadFile(file: File) {
    if (!file.type.startsWith('image/')) {
      addToast('Please select an image file', 'error')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      addToast('Image must be under 5 MB', 'error')
      return
    }

    // Revoke any previous blob URL
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current)
    }

    // Instant local preview
    const preview = URL.createObjectURL(file)
    blobUrlRef.current = preview
    setLocalPreview(preview)
    setUploading(true)

    try {
      const body = new FormData()
      body.append('file', file)
      const res = await fetch('/api/admin/services/upload', { method: 'POST', body })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Upload failed')
      // Revoke blob — swap to real CDN URL
      URL.revokeObjectURL(preview)
      blobUrlRef.current = null
      onChange({ ...form, image_url: json.url })
      setLocalPreview(null)
    } catch (err) {
      URL.revokeObjectURL(preview)
      blobUrlRef.current = null
      setLocalPreview(null)
      addToast(err instanceof Error ? err.message : 'Upload failed', 'error')
    } finally {
      setUploading(false)
    }
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
    e.target.value = '' // reset so same file can be reselected
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) uploadFile(file)
  }

  function clearImage() {
    setLocalPreview(null)
    onChange({ ...form, image_url: '' })
  }

  const previewSrc = localPreview ?? (form.image_url || null)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={handleClose} aria-hidden />

      {/* Two-panel modal */}
      <div className="relative flex w-full max-w-2xl bg-dark-surface border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh]">

        {/* ── Left panel — preview ─────────────────────────────────────── */}
        <div className="hidden md:flex flex-col w-56 shrink-0 bg-dark border-r border-white/8 p-6">
          {/* Brand mark */}
          <div className="flex items-center gap-2 mb-8">
            <Image
              src="/images/hairbybashlogo-removebg.webp"
              alt="HairbyBash"
              width={22}
              height={22}
              className="w-5 h-5 object-contain opacity-80"
            />
            <span className="text-white/55 text-xs font-medium">HairbyBash</span>
          </div>

          {/* Mode label */}
          <p className="text-gold text-[9px] tracking-[0.25em] uppercase font-semibold mb-2">
            {editing ? 'Editing Service' : 'New Service'}
          </p>

          {/* Service name preview (live) */}
          <h2 className="font-(family-name:--font-playfair) font-bold text-xl text-white leading-snug mb-3 wrap-break-word">
            {form.name || <span className="text-white/20">Service Name</span>}
          </h2>

          {/* Category badge */}
          {form.category && (
            <span className="inline-block self-start px-2.5 py-1 bg-gold/10 border border-gold/20 rounded-full text-gold text-[10px] font-medium mb-3">
              {form.category}
            </span>
          )}

          {/* Last updated — only for edit mode */}
          {editing && (
            <p className="text-gold/60 text-[10px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-gold/60 inline-block" />
              Last updated recently
            </p>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Image preview */}
          <div>
            <div className="w-full h-28 rounded-xl overflow-hidden border border-white/8 bg-dark-card flex items-center justify-center">
              {previewSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewSrc}
                  alt="Preview"
                  className={`w-full h-full object-cover transition-opacity ${uploading ? 'opacity-50' : ''}`}
                />
              ) : (
                <svg className="w-8 h-8 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              )}
            </div>
            <p className="text-white/25 text-[10px] mt-1.5 text-center">Current featured image</p>
          </div>
        </div>

        {/* ── Right panel — form ───────────────────────────────────────── */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

          {/* Header */}
          <div className="flex items-start justify-between px-6 py-5 border-b border-white/8 shrink-0">
            <div>
              <h2 className="text-white font-semibold text-base">
                {editing ? 'Edit Service Details' : 'Add New Service'}
              </h2>
              <p className="text-white/35 text-xs mt-0.5">
                {editing
                  ? 'Update information for this salon service.'
                  : 'Fill in the details for the new service.'}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-white/35 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/8 ml-4 shrink-0"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

            {/* ── General Information ────────────────────────────────── */}
            <div>
              <SectionLabel>General Information</SectionLabel>
              <div className="space-y-4">

                {/* Service Name */}
                <Field label="Service Name" required>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => field('name', e.target.value)}
                    placeholder="e.g. Goddess Braids"
                    className={inputCls}
                  />
                </Field>

                {/* Category */}
                <Field label="Category" required>
                  <div className="relative">
                    <select
                      value={form.category}
                      onChange={(e) => field('category', e.target.value)}
                      className={selectCls}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c} className="bg-[#111]">{c}</option>
                      ))}
                    </select>
                    <svg className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </Field>

                {/* Description */}
                <Field label="Description">
                  <textarea
                    value={form.description}
                    onChange={(e) => field('description', e.target.value.slice(0, DESC_MAX))}
                    placeholder="Describe this service..."
                    rows={4}
                    className={`${inputCls} resize-none`}
                  />
                  <p className={`text-right text-[10px] mt-1 ${descRemaining < 20 ? 'text-red-400' : 'text-white/25'}`}>
                    {descRemaining} characters remaining
                  </p>
                </Field>

              </div>
            </div>

            {/* ── Pricing & Timing ───────────────────────────────────── */}
            <div>
              <SectionLabel>Pricing &amp; Timing</SectionLabel>
              <div className="grid grid-cols-2 gap-4">

                {/* Price */}
                <Field label="Price" required>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-sm">$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={(e) => field('price', e.target.value)}
                      placeholder="150.00"
                      className={`${inputCls} pl-7`}
                    />
                  </div>
                </Field>

                {/* Duration */}
                <Field label="Duration" required>
                  <div className="relative">
                    <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <circle cx="12" cy="12" r="10" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                    </svg>
                    <select
                      value={form.duration_minutes}
                      onChange={(e) => field('duration_minutes', e.target.value)}
                      className={`${selectCls} pl-10`}
                    >
                      {DURATION_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value} className="bg-[#111]">{o.label}</option>
                      ))}
                    </select>
                    <svg className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </Field>

                {/* Deposit % */}
                <Field label="Deposit (%)">
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={form.deposit_percentage}
                      onChange={(e) => field('deposit_percentage', e.target.value)}
                      className={`${inputCls} pr-8`}
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 text-sm">%</span>
                  </div>
                </Field>

                {/* Active */}
                <Field label="Availability">
                  <div className="flex items-center justify-between h-10.5 bg-dark border border-white/10 rounded-xl px-4">
                    <span className="text-white/55 text-sm">{form.active ? 'Active' : 'Hidden'}</span>
                    <Toggle checked={form.active} onChange={() => field('active', !form.active)} />
                  </div>
                </Field>

              </div>
            </div>

            {/* ── Gallery Image ──────────────────────────────────────── */}
            <div>
              <SectionLabel>Gallery Image</SectionLabel>

              {/* Drop zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`border border-dashed rounded-xl overflow-hidden transition-colors ${
                  dragOver ? 'border-gold bg-gold/5' : 'border-gold/30'
                }`}
              >
                {/* Image preview */}
                {previewSrc ? (
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewSrc}
                      alt="Service preview"
                      className={`w-full h-36 object-cover transition-opacity ${uploading ? 'opacity-40' : 'opacity-100'}`}
                    />
                    {uploading && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                        <svg className="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <span className="text-white text-xs font-medium">Uploading…</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-28 text-white/20 gap-2 cursor-pointer hover:text-white/35 transition-colors">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <span className="text-xs">Drop image here or click to upload</span>
                    <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleFileInput} disabled={uploading} />
                  </label>
                )}

                {/* Bottom action bar */}
                <div className="px-3 py-2.5 border-t border-gold/15 flex items-center gap-2">
                  <label className={`flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/8 border border-white/10 rounded-lg text-white/55 hover:text-white text-xs font-medium transition-colors cursor-pointer ${uploading ? 'opacity-40 pointer-events-none' : ''}`}>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    {previewSrc ? 'Replace image' : 'Upload from device'}
                    <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleFileInput} disabled={uploading} />
                  </label>

                  {previewSrc && !uploading && (
                    <button
                      onClick={clearImage}
                      className="px-3 py-1.5 text-red-400/60 hover:text-red-400 text-xs font-medium hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      Remove
                    </button>
                  )}

                  {/* URL fallback */}
                  <input
                    type="url"
                    value={form.image_url}
                    onChange={(e) => { setLocalPreview(null); field('image_url', e.target.value) }}
                    placeholder="Or paste URL…"
                    disabled={uploading}
                    className="ml-auto w-40 bg-dark border border-white/8 rounded-lg px-3 py-1.5 text-white/60 text-xs placeholder-white/20 focus:outline-none focus:border-gold/40 focus:text-white transition-colors disabled:opacity-40"
                  />
                </div>
              </div>
              <p className="text-white/20 text-[10px] mt-1.5">JPEG, PNG, WebP or GIF · max 5 MB</p>
            </div>

          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-white/8 flex items-center gap-3 shrink-0">
            {editing && !confirmDelete && (
              <button
                onClick={() => setConfirmDelete(true)}
                disabled={deleting || saving || uploading}
                className="text-red-400 text-sm font-medium hover:bg-red-500/10 px-3 py-2 rounded-xl transition-colors disabled:opacity-40"
              >
                Delete Service
              </button>
            )}

            {/* Two-step delete confirmation */}
            {editing && confirmDelete && (
              <div className="flex items-center gap-2">
                <span className="text-white/40 text-xs">This can&apos;t be undone.</span>
                <button
                  onClick={() => setConfirmDelete(false)}
                  disabled={deleting}
                  className="px-3 py-1.5 text-white/50 text-xs font-medium hover:text-white hover:bg-white/5 rounded-lg transition-colors disabled:opacity-40"
                >
                  Cancel
                </button>
                <button
                  onClick={onDelete}
                  disabled={deleting}
                  className="px-3 py-1.5 bg-red-500/15 hover:bg-red-500/25 text-red-400 text-xs font-semibold rounded-lg transition-colors disabled:opacity-40"
                >
                  {deleting ? 'Deleting…' : 'Yes, Delete'}
                </button>
              </div>
            )}

            {!confirmDelete && (
              <div className="ml-auto flex items-center gap-3">
                <button
                  onClick={handleClose}
                  disabled={saving || deleting}
                  className="px-4 py-2 text-white/50 text-sm font-medium hover:text-white hover:bg-white/5 rounded-xl transition-colors disabled:opacity-40"
                >
                  Cancel
                </button>
                <button
                  onClick={onSave}
                  disabled={saving || deleting || uploading}
                  className="flex items-center gap-2 px-5 py-2 bg-gold text-black text-sm font-semibold rounded-xl hover:bg-gold-hover transition-colors disabled:opacity-50"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V7l-4-4z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 3v4H7V3M12 12v5m0 0l-2-2m2 2l2-2" />
                  </svg>
                  {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Service'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────────────────

interface Props {
  initialServices: Service[]
}

export default function ServicesTable({ initialServices }: Props) {
  const router = useRouter()
  const [services, setServices] = useState<Service[]>(initialServices)

  // Keep local state in sync when the server re-renders this page (e.g. after router.refresh())
  useEffect(() => { setServices(initialServices) }, [initialServices])

  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [filterOpen, setFilterOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const filterRef = useRef<HTMLDivElement>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [form, setForm] = useState<ServiceForm>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const addToast = useCallback((message: string, type: ToastMessage['type']) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, message, type }])
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  // Close filter dropdown on outside click
  useEffect(() => {
    if (!filterOpen) return
    function handleClick(e: MouseEvent) {
      if (!filterRef.current?.contains(e.target as Node)) {
        setFilterOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [filterOpen])

  // ── Filter + pagination ───────────────────────────────────────────────────

  const filtered = useMemo(() => {
    return services.filter((s) => {
      const matchSearch =
        search === '' ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.category.toLowerCase().includes(search.toLowerCase())
      const matchCat = categoryFilter === 'all' || s.category === categoryFilter
      return matchSearch && matchCat
    })
  }, [services, search, categoryFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
  const start = filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1
  const end = Math.min(safePage * PAGE_SIZE, filtered.length)

  function handleSearch(v: string) { setSearch(v); setPage(1) }
  function handleCategoryFilter(v: string) { setCategoryFilter(v); setPage(1); setFilterOpen(false) }

  // ── Toggle availability ───────────────────────────────────────────────────

  async function handleToggleActive(service: Service) {
    const newActive = !service.active
    setTogglingId(service.id)
    setServices((prev) => prev.map((s) => (s.id === service.id ? { ...s, active: newActive } : s)))

    try {
      const res = await fetch(`/api/admin/services/${service.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: newActive }),
      })
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error(json.error ?? 'Failed to update availability')
      }
    } catch (err) {
      setServices((prev) => prev.map((s) => (s.id === service.id ? { ...s, active: service.active } : s)))
      addToast(err instanceof Error ? err.message : 'Failed to update availability', 'error')
    } finally {
      setTogglingId(null)
    }
  }

  // ── Modal open ────────────────────────────────────────────────────────────

  function openAdd() {
    setEditingService(null)
    setForm(EMPTY_FORM)
    setModalOpen(true)
  }

  function openEdit(service: Service) {
    setEditingService(service)
    setForm(serviceToForm(service))
    setModalOpen(true)
  }

  function closeModal() {
    if (saving || deletingId) return
    setModalOpen(false)
  }

  // ── Save ──────────────────────────────────────────────────────────────────

  async function handleSave() {
    if (!form.name.trim() || !form.category || !form.price || !form.duration_minutes) {
      addToast('Please fill in all required fields', 'error')
      return
    }
    const priceVal = parseFloat(form.price)
    if (isNaN(priceVal) || priceVal < 0) {
      addToast('Please enter a valid price', 'error')
      return
    }
    const depositVal = parseInt(form.deposit_percentage)
    if (isNaN(depositVal) || depositVal < 0 || depositVal > 100) {
      addToast('Deposit must be between 0 and 100', 'error')
      return
    }

    setSaving(true)
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: priceVal,
      deposit_percentage: depositVal,
      duration_minutes: parseInt(form.duration_minutes),
      category: form.category,
      image_url: form.image_url.trim() || null,
      active: form.active,
    }

    try {
      if (editingService) {
        const res = await fetch(`/api/admin/services/${editingService.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) {
          const json = await res.json().catch(() => ({}))
          throw new Error(json.error ?? 'Failed to update service')
        }
        const { service } = await res.json()
        setServices((prev) => prev.map((s) => (s.id === editingService.id ? service : s)))
        addToast(`"${service.name}" updated`, 'success')
        router.refresh()
      } else {
        const res = await fetch('/api/admin/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) {
          const json = await res.json().catch(() => ({}))
          throw new Error(json.error ?? 'Failed to create service')
        }
        const { service } = await res.json()
        setServices((prev) => [service, ...prev])
        addToast(`"${service.name}" created`, 'success')
        setSearch('')
        setCategoryFilter('all')
        setPage(1)
        router.refresh()
      }
      setModalOpen(false)
    } catch (err) {
      addToast(err instanceof Error ? err.message : (editingService ? 'Failed to update service' : 'Failed to create service'), 'error')
    } finally {
      setSaving(false)
    }
  }

  // ── Delete ────────────────────────────────────────────────────────────────

  async function handleDelete() {
    if (!editingService) return
    setDeletingId(editingService.id)

    try {
      const res = await fetch(`/api/admin/services/${editingService.id}`, { method: 'DELETE' })
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error(json.error ?? 'Failed to delete service')
      }
      setServices((prev) => prev.filter((s) => s.id !== editingService.id))
      addToast(`"${editingService.name}" deleted`, 'success')
      setModalOpen(false)
      router.refresh()
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to delete service', 'error')
    } finally {
      setDeletingId(null)
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {modalOpen && (
        <ServiceModal
          editing={editingService}
          form={form}
          saving={saving}
          deleting={!!deletingId}
          onChange={setForm}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={closeModal}
          addToast={addToast}
        />
      )}

      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Service Menu Management</h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage your salon services, pricing, and availability.
            </p>
          </div>
          <button
            onClick={openAdd}
            className="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-gold text-black text-sm font-semibold rounded-xl hover:bg-gold-hover transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add New Service
          </button>
        </div>

        {/* Table card */}
        <div className="bg-dark-card rounded-xl overflow-hidden">

          {/* Search + filter bar */}
          <div className="px-5 py-4 border-b border-white/8 flex items-center gap-3">
            <div className="relative flex-1">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search services by name, category..."
                className="w-full bg-dark-surface border border-white/8 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-white/25 focus:outline-none focus:border-white/20 transition-colors"
              />
            </div>

            {/* Category filter */}
            <div ref={filterRef} className="relative">
              <button
                onClick={() => setFilterOpen((o) => !o)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                  categoryFilter !== 'all'
                    ? 'border-gold/40 bg-gold/10 text-gold'
                    : 'border-white/10 bg-dark-surface text-white/55 hover:text-white hover:border-white/20'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 8h10M11 12h2" />
                </svg>
                {categoryFilter === 'all' ? 'Filter' : categoryFilter}
              </button>

              {filterOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-dark-surface border border-white/10 rounded-xl shadow-xl z-10 overflow-hidden">
                  {['all', ...CATEGORIES].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryFilter(cat)}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        categoryFilter === cat
                          ? 'text-gold bg-gold/10'
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {cat === 'all' ? 'All Categories' : cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Empty state */}
          {filtered.length === 0 ? (
            <div className="px-6 py-16 text-center text-gray-500">
              {services.length === 0
                ? 'No services yet. Add your first service.'
                : 'No services match your search.'}
            </div>
          ) : (
            <>
              {/* Mobile cards */}
              <ul className="sm:hidden divide-y divide-white/5">
                {paginated.map((service) => (
                  <li key={service.id} className="px-4 py-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <ServiceThumb service={service} />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm truncate">{service.name}</p>
                        <p className="text-gray-500 text-xs">{service.category}</p>
                      </div>
                      <button onClick={() => openEdit(service)} className="text-white/30 hover:text-white p-1.5 rounded-lg hover:bg-white/8 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <span className="text-gold font-semibold">{formatPrice(service.price)}</span>
                        <span className="text-gray-500 ml-2">{formatDuration(service.duration_minutes)}</span>
                      </div>
                      <Toggle checked={service.active} onChange={() => handleToggleActive(service)} disabled={togglingId === service.id} />
                    </div>
                  </li>
                ))}
              </ul>

              {/* Desktop table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/8 text-gray-500 text-xs uppercase tracking-wide">
                      <th className="px-6 py-3 text-left font-medium">Service Name</th>
                      <th className="px-6 py-3 text-left font-medium">Price</th>
                      <th className="px-6 py-3 text-left font-medium">Duration</th>
                      <th className="px-6 py-3 text-left font-medium">Availability</th>
                      <th className="px-6 py-3 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {paginated.map((service) => (
                      <tr key={service.id} className="hover:bg-white/2 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <ServiceThumb service={service} />
                            <div>
                              <p className="text-white font-medium">{service.name}</p>
                              <p className="text-gray-500 text-xs">Category: {service.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gold font-semibold">{formatPrice(service.price)}</td>
                        <td className="px-6 py-4 text-white/70">{formatDuration(service.duration_minutes)}</td>
                        <td className="px-6 py-4">
                          <Toggle checked={service.active} onChange={() => handleToggleActive(service)} disabled={togglingId === service.id} />
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => openEdit(service)}
                            title="Edit service"
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/8 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Pagination */}
          {filtered.length > 0 && (
            <div className="px-6 py-4 border-t border-white/8 flex items-center justify-between">
              <span className="text-gray-500 text-sm">
                {`Showing ${start}–${end} of ${filtered.length} service${filtered.length !== 1 ? 's' : ''}`}
              </span>
              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={safePage <= 1}
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 text-white/40 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-7 h-7 flex items-center justify-center rounded-lg text-sm transition-colors ${
                        p === safePage ? 'bg-gold text-black font-semibold' : 'text-white/40 hover:text-white hover:bg-white/8'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safePage >= totalPages}
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 text-white/40 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
