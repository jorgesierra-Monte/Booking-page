import { useEffect, useMemo, useState } from 'react'

import { Avatar, Button, CircleCheck, Tag } from './ui'
import { ColorSwitcher } from './ColorSwitcher'
import {
  CancellationSection,
  ClientDetailsSection,
  CostEstimateSection,
  DateTimeSection,
} from './sections'

const SHORT_WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const PROVIDER_ADDRESS = '1535 E Olive Ave, Fresno, CA 93728'
const PROGRESS_BAR_HEIGHT = 56 // reserve for the fixed progress bar

function slotStart(slot) {
  const start = slot.split('–')[0].trim()
  return start.replace(/am|pm/i, m => m.toUpperCase()) + ' CST'
}

/* ---------------- Provider header ---------------- */
function BookingPageHeader() {
  return (
    <section className="w-full">
      <div className="flex w-full flex-wrap items-center gap-6 sm:py-450">
        <Avatar src="/provider-avatar.png" alt="Daunte Henderson" size="xl" />
        <div className="flex w-full flex-1">
          <div className="flex min-w-0 flex-col gap-100">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <h1 className="typography-subhead-serif-default">Daunte Henderson</h1>
              <span className="typography-body-small text-text-muted">(he/him)</span>
            </div>
            <Tag className="my-2 self-start">
              <CircleCheck className="h-4 w-4" /> Grow Verified
            </Tag>
            <a href="#" className="typography-label-small block max-w-fit text-text-default underline underline-offset-4">
              View profile
            </a>
          </div>
          <div className="hidden grow flex-col items-end justify-start sm:flex">
            <span
              className="lowercase leading-none"
              style={{ color: '#7c2a8f', fontFamily: 'var(--font-season-sans)', fontWeight: 700, fontSize: '22px' }}
            >
              aetna
              <sup style={{ fontSize: '9px', verticalAlign: 'super' }}>®</sup>
            </span>
            <span className="typography-body-small mt-100 font-medium text-text-default">Accepting Aetna</span>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------- Progress bar ---------------- */
function ProgressBar({ items, activeId }) {
  return (
    <ol className="flex w-full items-start gap-2 pb-2 pt-1.5">
      {items.map((item, i) => {
        const isInView = item.id === activeId
        const isFilled = item.status === 'completed'
        const isFirst = i === 0
        const isLast = i === items.length - 1
        return (
          <li key={item.id} className="flex min-w-0 flex-1 flex-col items-center gap-1">
            <div
              className={['h-2 w-full rounded-full', isFilled ? 'bg-surface-inverse' : 'bg-surface-subtle'].join(' ')}
            />
            <span
              className={[
                'typography-body-xsmall w-full truncate text-center',
                isInView ? 'font-semibold text-text-default' : isFilled ? 'text-text-default' : 'text-text-muted',
              ].join(' ')}
            >
              {item.title}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

/* ---------------- Step wrapper ---------------- */
function Step({ children, isFirst, isLast, isActive, buttonLabel, onContinue }) {
  return (
    <>
      <section
        className={['relative flex flex-col py-550', isFirst && 'pt-450', isLast && 'pb-0'].filter(Boolean).join(' ')}
      >
        {children}
        {isActive && buttonLabel && (
          <div className="mt-550 flex justify-center">
            <Button onClick={onContinue} className="w-full md:w-[200px]">
              {buttonLabel}
            </Button>
          </div>
        )}
      </section>
    </>
  )
}

/* ---------------- Sticky footer ---------------- */
function StickyFooter({ schedule, apptLabel, enabled }) {
  return (
    <footer className="w-full bg-surface-emphasis px-350 py-150 sm:px-550 sm:py-250">
      <div className="m-auto flex w-full max-w-[768px] flex-row items-center justify-between gap-4">
        <div className="flex flex-col">
          <div className="flex flex-wrap items-end">
            <span className="typography-subhead-default pr-300">$144</span>
            <span className="typography-body-emphasis-default text-text-default">Session length: 60 min</span>
            <span className="typography-body-small mx-1 text-text-default" aria-hidden="true">•</span>
            <span className="typography-body-emphasis-default text-text-default">
              {apptLabel === 'Virtual' ? 'Virtual' : `In-person: ${PROVIDER_ADDRESS}`}
            </span>
          </div>
          <span className="typography-body-small text-text-muted">{schedule}</span>
        </div>
        <div className="flex-none">
          <Button disabled={!enabled}>Book now</Button>
        </div>
      </div>
    </footer>
  )
}

/* Fresh default form state — used on load and to reset every component when the
   color option changes (returns new Date objects each call). */
const makeInitialState = () => ({
  appointmentType: 'in-person',
  billingType: 'insurance',
  date: new Date(2023, 1, 7),
  time: null,
  estimated: false,
  agree: { terms: false, sms: false },
  address: PROVIDER_ADDRESS,
  availableFrom: new Date(2023, 1, 1),
})

const THEME_STORAGE_KEY = 'booking-color-option'
const applyTheme = theme => {
  const root = document.documentElement
  if (theme) root.dataset.theme = theme
  else delete root.dataset.theme
}

/* ---------------- Page (app-shell layout) ---------------- */
export default function BookingPage() {
  const [state, setState] = useState(makeInitialState)
  const set = patch => setState(s => ({ ...s, ...patch }))

  const steps = useMemo(
    () => [
      { id: 'dateTime', title: 'Time', inBar: true, button: null, render: () => <DateTimeSection state={state} set={set} /> },
      { id: 'cancellation', title: null, inBar: false, button: 'Continue', render: () => <CancellationSection /> },
      { id: 'clientDetails', title: 'Details', inBar: true, button: 'Continue', render: () => <ClientDetailsSection /> },
      { id: 'costEstimate', title: 'Cost estimate', inBar: true, button: null, render: () => <CostEstimateSection state={state} set={set} /> },
    ],
    [state],
  )

  const [activeIndex, setActiveIndex] = useState(0)
  const advance = () => setActiveIndex(i => Math.min(i + 1, steps.length - 1))

  // Color-option (theme) ownership. Restore the saved option on mount, and on every
  // switch reset all components to their default state so each option is compared fresh.
  const [theme, setTheme] = useState(() =>
    typeof window === 'undefined' ? null : localStorage.getItem(THEME_STORAGE_KEY) || null,
  )
  useEffect(() => {
    applyTheme(theme)
  }, [])
  const selectTheme = next => {
    setTheme(next)
    applyTheme(next)
    if (next) localStorage.setItem(THEME_STORAGE_KEY, next)
    else localStorage.removeItem(THEME_STORAGE_KEY)
    setState(makeInitialState())
    setActiveIndex(0)
  }

  // Auto-advance out of the date/time step once a slot is chosen.
  useEffect(() => {
    if (activeIndex === 0 && state.date && state.time) {
      const t = setTimeout(() => setActiveIndex(1), 260)
      return () => clearTimeout(t)
    }
  }, [activeIndex, state.date, state.time])

  const visible = steps.slice(0, activeIndex + 1)
  const activeStepId = steps[activeIndex].id

  const barItems = useMemo(() => {
    const barSteps = steps.filter(s => s.inBar)
    return barSteps.map(s => {
      const idx = steps.findIndex(x => x.id === s.id)
      return { id: s.id, title: s.title, status: idx < activeIndex ? 'completed' : 'upcoming' }
    })
  }, [steps, activeIndex])
  // Which bar item is "in view": nearest bar step at/least below the active index.
  const barActiveId = useMemo(() => {
    const barSteps = steps.filter(s => s.inBar)
    let current = barSteps[0]?.id
    for (const s of barSteps) if (steps.findIndex(x => x.id === s.id) <= activeIndex) current = s.id
    return current
  }, [steps, activeIndex])

  const apptLabel = state.appointmentType === 'virtual' ? 'Virtual' : 'In person'
  const schedule =
    state.date && state.time
      ? `${SHORT_WEEKDAYS[state.date.getDay()]}, ${SHORT_MONTHS[state.date.getMonth()]} ${state.date.getDate()} at ${slotStart(state.time)}`
      : 'Select a day and time'
  const onLastStep = activeIndex === steps.length - 1

  return (
    <div className="min-h-svh bg-surface-default">
      <ColorSwitcher active={theme} onSelect={selectTheme} />
      {/* Content fills at least the viewport so the footer sits below the fold —
          it's only revealed by scrolling to the very end of the page. */}
      <main
        className="mx-auto min-h-svh w-full max-w-[800px] px-4 pt-450"
        style={{ paddingBottom: onLastStep ? 0 : PROGRESS_BAR_HEIGHT }}
      >
        <div className="w-full bg-surface-default sm:p-0">
          <BookingPageHeader />
          <div className="w-full max-w-full">
            <div className="relative flex w-full flex-col">
              {visible.map((step, i) => (
                <Step
                  key={step.id}
                  isFirst={i === 0}
                  isLast={i === visible.length - 1}
                  isActive={step.id === activeStepId}
                  buttonLabel={step.button}
                  onContinue={advance}
                >
                  {step.render()}
                </Step>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Price footer appears only on the final (Cost estimate) step */}
      {onLastStep && (
        <div style={{ paddingBottom: PROGRESS_BAR_HEIGHT }}>
          <StickyFooter schedule={schedule} apptLabel={apptLabel} enabled={onLastStep} />
        </div>
      )}

      {/* Progress bar: always fixed at the very bottom of the screen */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-surface-default">
        <div className="mx-auto max-w-[800px] px-4 pb-2 pt-1.5">
          <ProgressBar items={barItems} activeId={barActiveId} />
        </div>
      </div>
    </div>
  )
}
