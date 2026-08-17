import { useState } from 'react'

import Calendar from '../components/Calendar'
import TimeSlots from '../components/TimeSlots'
import {
  Button,
  Card,
  Check,
  CheckboxRow,
  RadioTiles,
  SelectableGroup,
  SelectField,
  TextField,
  AddMoreLink,
} from './ui'

const RELATIONSHIP_OPTIONS = [
  { value: 'self', label: 'Myself' },
  { value: 'child', label: 'My child' },
  { value: 'other', label: 'Someone else' },
]
const INSURANCE_OPTIONS = [
  'Aetna', 'Blue Cross Blue Shield', 'Cigna', 'Humana', 'United Healthcare',
  'Kaiser Permanente', 'Anthem', 'Oscar Health', 'Ambetter', 'Other',
]
const SEX_OPTIONS = ['Male', 'Female', 'Non-binary', 'Prefer not to say']
const STATE_OPTIONS = ['California', 'Colorado', 'Florida', 'Illinois', 'New York', 'Texas', 'Washington']
const ADDRESS_OPTIONS = ['123 Market St', '456 Elm Ave', '789 Oak Blvd', 'Enter manually']

/* ---------------- Section title (FormSectionTitle) ---------------- */
export function SectionTitle({ children, display, subhead, headerContent }) {
  return (
    <div className="mb-350 flex w-full flex-col gap-100 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="flex min-w-0 flex-col gap-100">
        <h2 className={display ? 'typography-display-small' : 'typography-subhead-serif-default'}>{children}</h2>
        {subhead && <p className="typography-label-default text-text-muted">{subhead}</p>}
      </div>
      {headerContent}
    </div>
  )
}

/* ================= 1. Date & time ================= */
export function DateTimeSection({ state, set }) {
  return (
    <section aria-label="Select a day and time">
      <SectionTitle
        display
        headerContent={
          state.appointmentType === 'in-person' ? (
            <p className="typography-label-default shrink-0 text-text-muted sm:text-right">{state.address}</p>
          ) : null
        }
      >
        Select a day and time
      </SectionTitle>
      <RadioTiles
        name="appointment-type"
        columns={2}
        gap="gap-200"
        value={state.appointmentType}
        onChange={v => set({ appointmentType: v })}
        options={[
          { value: 'virtual', label: 'Virtual' },
          { value: 'in-person', label: 'In person' },
        ]}
        className="mb-650"
      />
      <div className="flex flex-col gap-350 sm:flex-row sm:gap-x-450">
        <div className="sm:min-w-0 sm:flex-1">
          <p className="mb-250 typography-label-emphasis-default text-text-default">Select a day *</p>
          <Calendar
            selected={state.date}
            onSelect={d => set({ date: d, time: null })}
            availableFrom={state.availableFrom}
          />
        </div>
        <div className="sm:min-w-0 sm:flex-1">
          <p className="mb-250 typography-label-emphasis-default text-text-default">Select a time *</p>
          <TimeSlots date={state.date} selected={state.time} onSelect={t => set({ time: t })} />
        </div>
      </div>
    </section>
  )
}

/* ================= 2. Book with confidence ================= */
export function CancellationSection() {
  const items = [
    'Cancel for free up to 24 hours before your appointment, for any reason.',
    'We verify your coverage with trusted partners before your first session.',
    'Your data is protected in accordance with HIPAA.',
  ]
  return (
    <section aria-label="Book with confidence" className="flex flex-col gap-250">
      <div className="flex flex-col items-center gap-350 rounded-medium bg-surface-hover-default p-350 sm:flex-row sm:items-center sm:p-450">
        <div className="flex size-[96px] shrink-0 items-center justify-center rounded-rounded bg-surface-brand text-text-inverse">
          <Check className="h-10 w-10" />
        </div>
        <div className="flex flex-col items-center gap-250 sm:items-start">
          <h2 className="typography-subhead-serif-default">Book with confidence</h2>
          <ul className="flex flex-col gap-150 self-start">
            {items.map(it => (
              <li key={it} className="flex items-start gap-150">
                <Check className="mt-1 h-4 w-4 text-text-default" />
                <span className="typography-body-small">{it}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="typography-body-small text-text-muted">
        By continuing, you agree to Grow Therapy's cancellation policy, Terms of Service, and Privacy Policy.
      </p>
    </section>
  )
}

/* ================= 3. Client details ================= */
export function ClientDetailsSection() {
  const [relationship, setRelationship] = useState('self')
  return (
    <section aria-label="Client information" className="flex flex-col gap-600">
      <div>
        <SectionTitle>Client information</SectionTitle>
        <div className="flex flex-col gap-350">
          <SelectableGroup
            columns={3}
            value={relationship}
            onChange={setRelationship}
            options={RELATIONSHIP_OPTIONS}
          />
          <TextField label="Client's legal first name" placeholder="First name" required />
          <TextField label="Client's legal last name" placeholder="Last name" required />
          <AddMoreLink label="Add a chosen name and pronouns (optional)">
            <div className="flex flex-col gap-350">
              <TextField label="Client's chosen first name" placeholder="Chosen name" />
              <TextField label="Client's pronouns" placeholder="he/him" />
            </div>
          </AddMoreLink>
          <TextField label="Client's email" type="email" placeholder="example@example.com" required />
          <TextField label="Client's mobile phone number" placeholder="xxx-xxx-xxxx" inputMode="tel" mask="phone" required />
          <TextField label="Client's date of birth (mm/dd/yyyy)" placeholder="mm/dd/yyyy" inputMode="numeric" mask="date" required />
          <SelectField label="Client's sex listed on insurance" options={SEX_OPTIONS} required />
        </div>
      </div>

      <div>
        <SectionTitle>Client's residential address</SectionTitle>
        <div className="flex flex-col gap-350">
          <SelectField
            label="Residential address"
            options={ADDRESS_OPTIONS}
            placeholder="Enter client's address"
            required
          />
          <AddMoreLink label="Add Apartment # or Suite (optional)">
            <TextField label="Apartment # or Suite" placeholder="Address Line 2" />
          </AddMoreLink>
          <div className="flex flex-col gap-350">
            <TextField label="City" required />
            <SelectField label="State" options={STATE_OPTIONS} required />
            <TextField label="Zip code" required />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ================= 4. Cost estimate ================= */
export function CostEstimateSection({ state, set }) {
  return (
    <section aria-label="Coverage costs" className="flex flex-col gap-600">
      {/* Payment options */}
      <div className="flex flex-col gap-350">
        <SectionTitle>Coverage costs</SectionTitle>
        <RadioTiles
          name="billing-type"
          columns={1}
          value={state.billingType}
          onChange={v => set({ billingType: v })}
          options={[
            {
              value: 'insurance',
              label: 'Insurance',
              content: (
                <div className="flex flex-col gap-350">
                  <div className="grid gap-350 sm:grid-cols-2">
                    <SelectField label="Insurance name" options={INSURANCE_OPTIONS} placeholder="Carrier name" required />
                    <TextField label="Member ID" required />
                  </div>
                  {state.estimated ? (
                    <Card className="rounded-large shadow-card ring-1 ring-border-subtle">
                      <div className="grid grid-cols-1 gap-x-350 gap-y-100 p-350 sm:grid-cols-2">
                        <p className="typography-label-large">On average, Aetna clients pay $0 – $35.</p>
                        <p className="typography-body-xsmall text-text-muted">
                          Check if this provider is in-network and see your estimated cost.
                        </p>
                      </div>
                    </Card>
                  ) : (
                    <Button use="secondary" className="w-full" onClick={() => set({ estimated: true })}>
                      Verify &amp; estimate cost
                    </Button>
                  )}
                </div>
              ),
            },
            { value: 'cash', label: 'Cash, Out-of-pocket' },
          ]}
        />
      </div>

      {/* Billing */}
      <div className="flex flex-col gap-350">
        <SectionTitle>Billing information</SectionTitle>
        <TextField label="Card number" placeholder="1234 1234 1234 1234" required />
        <TextField label="Expiration" placeholder="MM / YY" required />
        <TextField label="CVC" placeholder="CVC" required />
        <p className="typography-body-xsmall text-text-muted">
          By providing your card information, you allow Grow Therapy to charge your card for future payments in
          accordance with their terms.
        </p>
      </div>

      {/* Agreements */}
      <div className="flex flex-col gap-350">
        <SectionTitle>Agreements</SectionTitle>
        <div className="flex flex-col gap-350">
          <CheckboxRow checked={state.agree.terms} onChange={() => set({ agree: { ...state.agree, terms: !state.agree.terms } })}>
            I agree to Grow Therapy's Terms of Service and Practice Policies and acknowledge the Privacy Notice and
            HIPAA Notice of Privacy Practices. I also agree to the Informed Consent and consent to receive treatment
            through the Grow Therapy platform. *
          </CheckboxRow>
          <CheckboxRow checked={state.agree.sms} onChange={() => set({ agree: { ...state.agree, sms: !state.agree.sms } })}>
            (Optional) I agree to receive marketing and promotional texts from Grow Therapy. This consent isn't
            required to get care. Msg &amp; data rates may apply.
          </CheckboxRow>
        </div>
      </div>

      {/* Footer links + trailing space before the checkout footer (matches product) */}
      <div className="mt-550 flex flex-wrap items-center justify-center gap-x-600 gap-y-200 pb-800">
        <a href="#" className="typography-label-emphasis-default text-text-default underline underline-offset-4">
          Frequently asked questions
        </a>
        <a href="#" className="typography-label-emphasis-default text-text-default underline underline-offset-4">
          Cookie preferences
        </a>
      </div>
    </section>
  )
}
