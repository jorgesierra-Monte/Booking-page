import { useState } from 'react'
import './App.css'

import Nav from './components/Nav'
import ProviderHeader from './components/ProviderHeader'
import PromoBanner from './components/PromoBanner'
import SectionSubhead from './components/SectionSubhead'
import RadioGroup from './components/RadioGroup'
import Calendar from './components/Calendar'
import TimeSlots, { TIME_SLOTS } from './components/TimeSlots'
import Checkbox from './components/Checkbox'
import StickyFooter from './components/StickyFooter'

import InputField from './InputField'
import MaskedInputField, { PHONE_CONFIG, DATE_CONFIG } from './MaskedInputField'
import SelectField from './SelectField'

const INSURANCE_OPTIONS = [
  'Aetna', 'Blue Cross Blue Shield', 'Cigna', 'Humana', 'United Healthcare',
  'Kaiser Permanente', 'Anthem', 'Oscar Health', 'Ambetter', 'Other',
]
const SEX_OPTIONS = ['Male', 'Female', 'Non-binary', 'Prefer not to say']
const STATE_OPTIONS = ['California', 'Colorado', 'Florida', 'Illinois', 'New York', 'Texas', 'Washington']
const ADDRESS_OPTIONS = ['123 Market St', '456 Elm Ave', '789 Oak Blvd', 'Enter manually']

const SHORT_WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const AVAILABLE_FROM = new Date(2023, 1, 1) // Feb 1, 2023

function slotStart(slot) {
  // "9:00 am – 9:45 am CST" -> "9:00 AM CST"
  const start = slot.split('–')[0].trim() // "9:00 am"
  return start.replace(/am|pm/i, m => m.toUpperCase()) + ' CST'
}

export default function App() {
  const [appointmentType, setAppointmentType] = useState('virtual')
  const [billingType, setBillingType] = useState('insurance')
  const [selectedDate, setSelectedDate] = useState(new Date(2023, 1, 7))
  const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[0])
  const [agreed, setAgreed] = useState(false)

  const apptLabel = appointmentType === 'virtual' ? 'Virtual' : 'In person'

  const schedule = selectedDate && selectedTime
    ? `${SHORT_WEEKDAYS[selectedDate.getDay()]}, ${SHORT_MONTHS[selectedDate.getMonth()]} ${selectedDate.getDate()} at ${slotStart(selectedTime)}`
    : 'Select a day and time'

  return (
    <div className="app">
      <Nav />

      <main className="content">
        <ProviderHeader />

        {/* Select a day and time */}
        <section className="section">
          <SectionSubhead>Select a day and time</SectionSubhead>
          <RadioGroup
            name="appointment-type"
            options={[{ value: 'virtual', label: 'Virtual' }, { value: 'in-person', label: 'In person' }]}
            value={appointmentType}
            onChange={setAppointmentType}
          />
          <div className="twoCol">
            <Calendar
              selected={selectedDate}
              onSelect={d => { setSelectedDate(d); setSelectedTime(null) }}
              availableFrom={AVAILABLE_FROM}
            />
            <TimeSlots date={selectedDate} selected={selectedTime} onSelect={setSelectedTime} />
          </div>
        </section>

        <PromoBanner
          variant="brown"
          image="/banner-worryfree.png"
          header="Worry-free booking"
          description="It's free to cancel your virtual or in-person appointment up to 24 hours before the appointment begins for any reason."
          linkLabel="Learn more"
        />

        {/* Client information */}
        <section className="section">
          <SectionSubhead>Client information</SectionSubhead>
          <div className="twoCol formGrid">
            <div className="col">
              <SelectField label="Select insurance" options={INSURANCE_OPTIONS} />
              <InputField label="First name *" />
              <InputField label="Last name *" />
              <InputField label="Email *" />
            </div>
            <div className="col">
              <MaskedInputField label="Phone number *" config={PHONE_CONFIG} />
              <MaskedInputField label="Birth date *" config={DATE_CONFIG} />
              <SelectField label="Sex listed on insurance" options={SEX_OPTIONS} />
            </div>
          </div>
        </section>

        {/* Client residential address */}
        <section className="section">
          <SectionSubhead info>Client residential address</SectionSubhead>
          <div className="twoCol formGrid">
            <div className="col">
              <SelectField label="Residential address" options={ADDRESS_OPTIONS} />
              <InputField label="City" />
            </div>
            <div className="col">
              <InputField label="Zip code*" />
              <SelectField label="State" options={STATE_OPTIONS} />
            </div>
          </div>
        </section>

        {/* Insurance options */}
        <section className="section">
          <SectionSubhead>Insurance options</SectionSubhead>
          <RadioGroup
            name="billing-type"
            options={[{ value: 'insurance', label: 'Insurance' }, { value: 'cash', label: 'Cash' }]}
            value={billingType}
            onChange={setBillingType}
          />
          <div className="twoCol">
            <SelectField label="Insurance name" options={INSURANCE_OPTIONS} />
            <InputField label="Member ID*" />
          </div>
          <PromoBanner
            variant="gold"
            image="/banner-covered.png"
            header="Am I covered?"
            description="By submitting this form, you agree to Grow Therapy's Terms of Service and Privacy Policy."
            linkLabel="Learn more"
          />
        </section>

        {/* Billing information */}
        <section className="section">
          <SectionSubhead>Billing information</SectionSubhead>
          <div className="col">
            <InputField label="Member ID*" />
            <p className="helper">
              By providing your card information, you allow Grow Therapy to charge your card for
              future payments in accordance with their terms.
            </p>
          </div>
        </section>

        <hr className="divider" />

        {/* Agreements */}
        <section className="section agreements">
          <SectionSubhead>Agreements</SectionSubhead>
          <Checkbox id="agree" checked={agreed} onChange={setAgreed}>
            I have reviewed and accept Grow Therapy's HIPPA Notice of Privacy Practice, Terms of
            Service, and Website Privacy Policy.*
          </Checkbox>
          <a href="#" className="textLink">Read more</a>
        </section>
      </main>

      <StickyFooter
        price="$144"
        meta={`45 min • ${apptLabel}`}
        schedule={schedule}
        disabled={!selectedDate || !selectedTime}
      />
    </div>
  )
}
