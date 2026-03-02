'use client'

import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import StepIndicator, { type BookingStep } from './StepIndicator'
import BookingSidebar from './BookingSidebar'
import StepService from './steps/StepService'
import StepDateTime from './steps/StepDateTime'
import StepDetails from './steps/StepDetails'
import StepReview from './steps/StepReview'
import Toast, { type ToastMessage } from '@/components/ui/Toast'
import type { Service, TimeSlot } from '@/types'

interface BookingState {
  currentStep: BookingStep
  selectedService: Service | null
  selectedDate: string | null
  selectedSlot: TimeSlot | null
  availableSlots: TimeSlot[]
  slotsLoading: boolean
  clientName: string
  clientEmail: string
  clientPhone: string
  formErrors: Partial<Record<'clientName' | 'clientEmail' | 'clientPhone', string>>
  checkoutLoading: boolean
}

function getInitialState(
  services: Service[],
  preSelectedServiceId: string | null,
): BookingState {
  const preSelected = preSelectedServiceId
    ? (services.find((s) => s.id === preSelectedServiceId) ?? null)
    : null

  return {
    currentStep: preSelected ? 'datetime' : 'service',
    selectedService: preSelected,
    selectedDate: null,
    selectedSlot: null,
    availableSlots: [],
    slotsLoading: false,
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    formErrors: {},
    checkoutLoading: false,
  }
}

interface BookingFlowProps {
  services: Service[]
  preSelectedServiceId: string | null
}

const STEP_ORDER: BookingStep[] = ['service', 'datetime', 'details', 'review']

let toastCounter = 0
function newToastId() {
  return `toast-${++toastCounter}`
}

export default function BookingFlow({ services, preSelectedServiceId }: BookingFlowProps) {
  const [state, setState] = useState<BookingState>(() =>
    getInitialState(services, preSelectedServiceId),
  )
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  function addToast(message: string, type: ToastMessage['type'] = 'error') {
    setToasts((prev) => [...prev, { id: newToastId(), message, type }])
  }

  function dismissToast(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  // ── Slot fetching ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!state.selectedService || !state.selectedDate) return

    setState((s) => ({ ...s, slotsLoading: true, availableSlots: [], selectedSlot: null }))

    fetch(
      `/api/availability?date=${state.selectedDate}&serviceId=${state.selectedService.id}`,
    )
      .then((r) => {
        if (!r.ok) throw new Error('Failed to fetch availability')
        return r.json() as Promise<{ slots: TimeSlot[] }>
      })
      .then(({ slots }) =>
        setState((s) => ({ ...s, availableSlots: slots, slotsLoading: false })),
      )
      .catch(() => {
        setState((s) => ({ ...s, slotsLoading: false }))
        addToast('Unable to check availability. Please try again.')
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.selectedDate, state.selectedService?.id])

  // ── Step navigation ────────────────────────────────────────────────────────
  function canAdvance(): boolean {
    const { currentStep, selectedService, selectedDate, selectedSlot, clientName, clientEmail, clientPhone } = state
    switch (currentStep) {
      case 'service':  return selectedService !== null
      case 'datetime': return selectedDate !== null && selectedSlot !== null
      case 'details':  return (
        clientName.trim().length >= 2 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail) &&
        clientPhone.replace(/\D/g, '').length >= 10
      )
      case 'review':   return true
    }
  }

  function goNext() {
    const currentIndex = STEP_ORDER.indexOf(state.currentStep)
    if (currentIndex < STEP_ORDER.length - 1) {
      setState((s) => ({ ...s, currentStep: STEP_ORDER[currentIndex + 1] }))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  function goBack() {
    const currentIndex = STEP_ORDER.indexOf(state.currentStep)
    if (currentIndex <= 0) return

    const prevStep = STEP_ORDER[currentIndex - 1]
    setState((s) => {
      if (prevStep === 'service') {
        return { ...s, currentStep: 'service', selectedDate: null, selectedSlot: null, availableSlots: [] }
      }
      if (prevStep === 'datetime') {
        return { ...s, currentStep: 'datetime', selectedSlot: null }
      }
      return { ...s, currentStep: prevStep, formErrors: {} }
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ── Handlers ───────────────────────────────────────────────────────────────
  function handleServiceSelect(service: Service) {
    setState((s) => ({
      ...s,
      selectedService: service,
      selectedDate: s.selectedService?.id === service.id ? s.selectedDate : null,
      selectedSlot: null,
      availableSlots: [],
      currentStep: 'datetime',
    }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleDateChange(date: string) {
    setState((s) => ({ ...s, selectedDate: date, selectedSlot: null, availableSlots: [] }))
  }

  function handleSlotSelect(slot: TimeSlot) {
    setState((s) => ({ ...s, selectedSlot: slot }))
  }

  function handleFieldChange(
    field: 'clientName' | 'clientEmail' | 'clientPhone',
    value: string,
  ) {
    setState((s) => ({
      ...s,
      [field]: value,
      formErrors: { ...s.formErrors, [field]: undefined },
    }))
  }

  function handleFieldBlur(field: 'clientName' | 'clientEmail' | 'clientPhone') {
    const { clientName, clientEmail, clientPhone } = state
    const errors: typeof state.formErrors = {}

    if (field === 'clientName' && clientName.trim().length < 2) {
      errors.clientName = 'Please enter your full name'
    }
    if (field === 'clientEmail' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)) {
      errors.clientEmail = 'Please enter a valid email address'
    }
    if (field === 'clientPhone' && clientPhone.replace(/\D/g, '').length < 10) {
      errors.clientPhone = 'Please enter a valid phone number (10+ digits)'
    }

    setState((s) => ({ ...s, formErrors: { ...s.formErrors, ...errors } }))
  }

  const handleCheckout = useCallback(async () => {
    const { selectedService, selectedDate, selectedSlot, clientName, clientEmail, clientPhone } = state
    if (!selectedService || !selectedDate || !selectedSlot) return

    setState((s) => ({ ...s, checkoutLoading: true }))

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedService.id,
          date: selectedDate,
          startTime: selectedSlot.start,
          endTime: selectedSlot.end,
          clientName,
          clientEmail,
          clientPhone,
        }),
      })

      const data = await res.json() as { url?: string; error?: string }

      if (!res.ok) {
        setState((s) => ({ ...s, checkoutLoading: false }))

        if (res.status === 409) {
          // Slot was taken — bump user back to pick a new time
          setState((s) => ({
            ...s,
            currentStep: 'datetime',
            selectedSlot: null,
            availableSlots: [],
          }))
          addToast(data.error ?? 'That slot was just booked. Please choose another time.')
          return
        }

        addToast(data.error ?? 'Failed to initiate payment. Please try again.')
        return
      }

      if (!data.url) {
        setState((s) => ({ ...s, checkoutLoading: false }))
        addToast('Something went wrong. Please try again.')
        return
      }

      // Redirect to Stripe Checkout — loading spinner stays active intentionally
      window.location.href = data.url
    } catch {
      setState((s) => ({ ...s, checkoutLoading: false }))
      addToast('A network error occurred. Please check your connection and try again.')
    }
  }, [state]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleSidebarContinue() {
    if (state.currentStep === 'review') {
      handleCheckout()
    } else {
      goNext()
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  const stepVariants = {
    enter: { opacity: 0, x: 24 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -24 },
  }

  return (
    <>
      <Toast toasts={toasts} onDismiss={dismissToast} />

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        <StepIndicator currentStep={state.currentStep} />

        <div className="flex flex-col-reverse lg:flex-row gap-8">
          {/* ── Main step content ── */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={state.currentStep}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {state.currentStep === 'service' && (
                  <StepService
                    services={services}
                    selectedService={state.selectedService}
                    onSelect={handleServiceSelect}
                  />
                )}

                {state.currentStep === 'datetime' && state.selectedService && (
                  <StepDateTime
                    service={state.selectedService}
                    selectedDate={state.selectedDate}
                    selectedSlot={state.selectedSlot}
                    availableSlots={state.availableSlots}
                    slotsLoading={state.slotsLoading}
                    onDateChange={handleDateChange}
                    onSlotSelect={handleSlotSelect}
                    onBack={goBack}
                  />
                )}

                {state.currentStep === 'details' && (
                  <StepDetails
                    clientName={state.clientName}
                    clientEmail={state.clientEmail}
                    clientPhone={state.clientPhone}
                    formErrors={state.formErrors}
                    onChange={handleFieldChange}
                    onBlur={handleFieldBlur}
                    onBack={goBack}
                  />
                )}

                {state.currentStep === 'review' &&
                  state.selectedService &&
                  state.selectedDate &&
                  state.selectedSlot && (
                    <StepReview
                      service={state.selectedService}
                      selectedDate={state.selectedDate}
                      selectedSlot={state.selectedSlot}
                      clientName={state.clientName}
                      clientEmail={state.clientEmail}
                      clientPhone={state.clientPhone}
                      checkoutLoading={state.checkoutLoading}
                      onConfirm={handleCheckout}
                      onBack={goBack}
                    />
                  )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Sidebar ── */}
          <div className="lg:w-85 shrink-0">
            <div className="lg:sticky lg:top-28">
              <BookingSidebar
                service={state.selectedService}
                selectedDate={state.selectedDate}
                selectedSlot={state.selectedSlot}
                currentStep={state.currentStep}
                onContinue={handleSidebarContinue}
                isLoading={state.checkoutLoading}
                canContinue={canAdvance()}
              />
            </div>
          </div>
        </div>

        {/* ── Mobile sticky bottom CTA ── */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-dark/95 backdrop-blur-sm border-t border-white/10 z-40">
          <button
            onClick={handleSidebarContinue}
            disabled={!canAdvance() || state.checkoutLoading}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-gold text-black font-semibold text-sm rounded-xl hover:bg-gold-hover transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {state.checkoutLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Processing…
              </>
            ) : (
              <>
                {state.currentStep === 'review' ? 'Pay Deposit to Confirm' : 'Continue'}
                {canAdvance() && <span className="text-black/60">→</span>}
              </>
            )}
          </button>
        </div>
      </div>
    </>
  )
}
