'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Toast, { type ToastMessage } from '@/components/ui/Toast'
import type { Category } from '@/types'

export interface CategoryWithCount extends Category {
  serviceCount: number
}

let toastSeq = 0

interface DraftCategory {
  name: string
  description: string
  active: boolean
}

const EMPTY_DRAFT: DraftCategory = { name: '', description: '', active: true }

export default function CategoriesManager({ initial }: { initial: CategoryWithCount[] }) {
  const router = useRouter()
  const [categories, setCategories] = useState(initial)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<DraftCategory>(EMPTY_DRAFT)
  const [adding, setAdding] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  function addToast(message: string, type: ToastMessage['type'] = 'error') {
    setToasts((prev) => [...prev, { id: `cat-${++toastSeq}`, message, type }])
  }
  const dismiss = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id))

  function refresh() {
    router.refresh()
  }

  async function send(url: string, init: RequestInit): Promise<Record<string, unknown> | null> {
    const res = await fetch(url, init)
    if (res.status === 204) return {}
    const json = await res.json().catch(() => ({}))
    if (!res.ok) {
      addToast(typeof json.error === 'string' ? json.error : 'Something went wrong. Please try again.')
      return null
    }
    return json
  }

  async function handleCreate() {
    if (!draft.name.trim()) return addToast('Give the category a name first.')
    setBusyId('new')
    const json = await send('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draft),
    })
    setBusyId(null)
    if (!json) return
    setCategories((prev) => [...prev, { ...(json.category as Category), serviceCount: 0 }])
    setDraft(EMPTY_DRAFT)
    setAdding(false)
    addToast('Category added.', 'success')
    refresh()
  }

  async function handleSaveEdit(id: string) {
    if (!draft.name.trim()) return addToast('Give the category a name first.')
    setBusyId(id)
    const json = await send(`/api/admin/categories/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draft),
    })
    setBusyId(null)
    if (!json) return
    const updated = json.category as Category
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)))
    setEditingId(null)
    addToast('Category updated.', 'success')
    refresh()
  }

  async function handleToggleActive(category: CategoryWithCount) {
    setBusyId(category.id)
    const json = await send(`/api/admin/categories/${category.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !category.active }),
    })
    setBusyId(null)
    if (!json) return
    setCategories((prev) =>
      prev.map((c) => (c.id === category.id ? { ...c, active: !category.active } : c)),
    )
    refresh()
  }

  async function handleMove(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= categories.length) return
    const a = categories[index]
    const b = categories[target]

    // Optimistic swap — the two PATCHes just persist what the list already shows.
    const next = [...categories]
    next[index] = b
    next[target] = a
    setCategories(next)

    setBusyId(a.id)
    await Promise.all([
      send(`/api/admin/categories/${a.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ display_order: b.display_order }),
      }),
      send(`/api/admin/categories/${b.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ display_order: a.display_order }),
      }),
    ])
    setBusyId(null)
    refresh()
  }

  async function handleDelete(category: CategoryWithCount) {
    if (category.serviceCount > 0) {
      return addToast(
        `${category.name} still holds ${category.serviceCount} ${category.serviceCount === 1 ? 'service' : 'services'}. Move them first, or hide the category instead.`,
      )
    }
    if (!confirm(`Delete "${category.name}"? This cannot be undone.`)) return
    setBusyId(category.id)
    const json = await send(`/api/admin/categories/${category.id}`, { method: 'DELETE' })
    setBusyId(null)
    if (!json) return
    setCategories((prev) => prev.filter((c) => c.id !== category.id))
    addToast('Category deleted.', 'success')
    refresh()
  }

  const inputCls =
    'w-full bg-dark border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-gold/40 transition-colors'

  return (
    <>
      <Toast toasts={toasts} onDismiss={dismiss} />

      <div className="bg-dark-surface border border-white/8 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-white font-semibold text-base">Categories</h2>
          {!adding && (
            <button
              onClick={() => { setAdding(true); setEditingId(null); setDraft(EMPTY_DRAFT) }}
              className="text-gold text-xs font-medium hover:underline"
            >
              + Add category
            </button>
          )}
        </div>
        <p className="text-white/35 text-xs mb-5">
          The order here is the order clients see on the site.
        </p>

        {adding && (
          <div className="mb-4 rounded-xl border border-gold/25 bg-gold/5 p-4 space-y-3">
            <input
              autoFocus
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              placeholder="Category name — e.g. Wigs"
              className={inputCls}
            />
            <input
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              placeholder="Short description shown on the services page (optional)"
              className={inputCls}
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                disabled={busyId === 'new'}
                className="px-4 py-2 rounded-lg bg-gold text-black text-xs font-semibold disabled:opacity-40"
              >
                {busyId === 'new' ? 'Adding…' : 'Add category'}
              </button>
              <button
                onClick={() => { setAdding(false); setDraft(EMPTY_DRAFT) }}
                className="px-4 py-2 rounded-lg border border-white/15 text-white/60 text-xs hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {categories.map((category, i) => {
            const isEditing = editingId === category.id
            const busy = busyId === category.id

            return (
              <div
                key={category.id}
                className={`rounded-xl border px-4 py-3 transition-colors ${
                  category.active ? 'border-white/8 bg-dark' : 'border-white/5 bg-dark/40'
                }`}
              >
                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      autoFocus
                      value={draft.name}
                      onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                      className={inputCls}
                    />
                    <input
                      value={draft.description}
                      onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                      placeholder="Short description (optional)"
                      className={inputCls}
                    />
                    <p className="text-white/30 text-[11px] leading-relaxed">
                      Renaming changes this category&apos;s web address, so any link already shared
                      to the old one will land on the full menu instead.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveEdit(category.id)}
                        disabled={busy}
                        className="px-4 py-2 rounded-lg bg-gold text-black text-xs font-semibold disabled:opacity-40"
                      >
                        {busy ? 'Saving…' : 'Save'}
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-4 py-2 rounded-lg border border-white/15 text-white/60 text-xs hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    {/* Reorder */}
                    <div className="flex flex-col gap-0.5 shrink-0">
                      <button
                        onClick={() => handleMove(i, -1)}
                        disabled={i === 0 || busy}
                        aria-label={`Move ${category.name} up`}
                        className="text-white/25 hover:text-gold disabled:opacity-15 disabled:hover:text-white/25 leading-none text-[10px]"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => handleMove(i, 1)}
                        disabled={i === categories.length - 1 || busy}
                        aria-label={`Move ${category.name} down`}
                        className="text-white/25 hover:text-gold disabled:opacity-15 disabled:hover:text-white/25 leading-none text-[10px]"
                      >
                        ▼
                      </button>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${category.active ? 'text-white' : 'text-white/40'}`}>
                          {category.name}
                        </span>
                        {!category.active && (
                          <span className="text-[10px] uppercase tracking-wider text-white/30 border border-white/15 rounded px-1.5 py-0.5">
                            hidden
                          </span>
                        )}
                      </div>
                      <p className="text-white/30 text-xs mt-0.5 truncate">
                        {category.serviceCount} {category.serviceCount === 1 ? 'service' : 'services'}
                        {category.description ? ` · ${category.description}` : ''}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 text-xs">
                      <button
                        onClick={() => { setEditingId(category.id); setAdding(false); setDraft({ name: category.name, description: category.description ?? '', active: category.active }) }}
                        className="text-white/40 hover:text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleActive(category)}
                        disabled={busy}
                        className="text-white/40 hover:text-white disabled:opacity-40"
                      >
                        {category.active ? 'Hide' : 'Show'}
                      </button>
                      <button
                        onClick={() => handleDelete(category)}
                        disabled={busy}
                        className={`disabled:opacity-40 ${
                          category.serviceCount > 0
                            ? 'text-white/20 cursor-not-allowed'
                            : 'text-red-400/70 hover:text-red-400'
                        }`}
                        title={category.serviceCount > 0 ? 'Move its services out first' : 'Delete category'}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
