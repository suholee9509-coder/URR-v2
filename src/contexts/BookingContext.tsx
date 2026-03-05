import { createContext, useReducer, useCallback, useEffect, useMemo } from 'react'
import type { ReactNode } from 'react'
import type { Event, EventDate, Section, BookingState, TierLevel, ConfirmationData } from '@/types'
import { mockEvent, getSectionsForDate } from '@/data/mock-events'
import { mockUser } from '@/data/mock-user'
import { MAX_SEATS_PER_TIER } from '@/data/mock-seats'

// --- Types ---
interface BookingInternalState {
  bookingState: BookingState
  event: Event | null
  selectedDateId: string | null
  isLeftPanelExpanded: boolean
  isLoading: boolean
  selectedSectionId: string | null
  selectedSeatIds: string[]
  confirmationData: ConfirmationData | null
  seatTimerSecondsLeft: number | null
}

type BookingAction =
  | { type: 'SET_EVENT'; payload: Event }
  | { type: 'SELECT_DATE'; payload: string }
  | { type: 'TOGGLE_LEFT_PANEL' }
  | { type: 'SET_LEFT_PANEL'; payload: boolean }
  | { type: 'TRANSITION_STATE'; payload: BookingState }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SELECT_SECTION'; payload: string }
  | { type: 'TOGGLE_SEAT'; payload: { seatId: string; maxSeats: number } }
  | { type: 'RESET_BOOKING' }
  | { type: 'SET_CONFIRMATION_DATA'; payload: ConfirmationData }
  | { type: 'SET_SEAT_TIMER'; payload: number }

export interface BookingContextValue {
  bookingState: BookingState
  event: Event | null
  selectedDateId: string | null
  isLeftPanelExpanded: boolean
  isLoading: boolean
  userTier: TierLevel
  selectedDate: EventDate | null
  sectionsForDate: Section[]
  isWindowOpen: boolean
  isSoldOut: boolean
  userWindowOpensAt: string | null
  selectedSectionId: string | null
  selectedSeatIds: string[]
  maxSeats: number
  confirmationData: ConfirmationData | null
  seatTimerSecondsLeft: number | null
  selectDate: (dateId: string) => void
  toggleLeftPanel: () => void
  setLeftPanel: (expanded: boolean) => void
  transitionTo: (nextState: BookingState) => void
  startBooking: () => void
  selectSection: (sectionId: string) => void
  toggleSeat: (seatId: string) => void
  resetBooking: () => void
  setConfirmationData: (data: ConfirmationData) => void
  setSeatTimerSecondsLeft: (seconds: number) => void
}

// --- Initial state ---
const initialState: BookingInternalState = {
  bookingState: 'idle',
  event: null,
  selectedDateId: null,
  isLeftPanelExpanded: true,
  isLoading: true,
  selectedSectionId: null,
  selectedSeatIds: [],
  confirmationData: null,
  seatTimerSecondsLeft: null,
}

// --- Reducer ---
function bookingReducer(state: BookingInternalState, action: BookingAction): BookingInternalState {
  switch (action.type) {
    case 'SET_EVENT':
      return {
        ...state,
        event: action.payload,
        selectedDateId: action.payload.dates[0]?.id ?? null,
        isLoading: false,
      }
    case 'SELECT_DATE':
      return { ...state, selectedDateId: action.payload }
    case 'TOGGLE_LEFT_PANEL':
      return { ...state, isLeftPanelExpanded: !state.isLeftPanelExpanded }
    case 'SET_LEFT_PANEL':
      return { ...state, isLeftPanelExpanded: action.payload }
    case 'TRANSITION_STATE':
      if (action.payload === 'seats-section') {
        return { ...state, bookingState: action.payload, selectedSeatIds: [], selectedSectionId: null }
      }
      return { ...state, bookingState: action.payload }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SELECT_SECTION':
      return { ...state, selectedSectionId: action.payload, selectedSeatIds: [] }
    case 'TOGGLE_SEAT': {
      const { seatId, maxSeats } = action.payload
      const current = state.selectedSeatIds
      if (current.includes(seatId)) {
        return { ...state, selectedSeatIds: current.filter((id) => id !== seatId) }
      }
      if (current.length >= maxSeats) return state
      return { ...state, selectedSeatIds: [...current, seatId] }
    }
    case 'RESET_BOOKING':
      return { ...state, bookingState: 'idle', selectedSectionId: null, selectedSeatIds: [], confirmationData: null, seatTimerSecondsLeft: null }
    case 'SET_CONFIRMATION_DATA':
      return { ...state, confirmationData: action.payload }
    case 'SET_SEAT_TIMER':
      return { ...state, seatTimerSecondsLeft: action.payload }
    default:
      return state
  }
}

// --- Context ---
export const BookingContext = createContext<BookingContextValue | null>(null)

// --- Provider ---
interface BookingProviderProps {
  eventId: string
  children: ReactNode
}

export function BookingProvider({ eventId, children }: BookingProviderProps) {
  const [state, dispatch] = useReducer(bookingReducer, initialState)

  // Simulate loading mock data
  useEffect(() => {
    const timer = setTimeout(() => {
      // In a real app, fetch by eventId. For now, use mock.
      void eventId
      dispatch({ type: 'SET_EVENT', payload: mockEvent })
    }, 400)
    return () => clearTimeout(timer)
  }, [eventId])

  const userTier = mockUser.tier
  const maxSeats = MAX_SEATS_PER_TIER[userTier]

  const selectedDate = useMemo(() => {
    if (!state.event || !state.selectedDateId) return null
    return state.event.dates.find((d) => d.id === state.selectedDateId) ?? null
  }, [state.event, state.selectedDateId])

  const sectionsForDate = useMemo(() => {
    if (!state.selectedDateId) return []
    return getSectionsForDate(state.selectedDateId)
  }, [state.selectedDateId])

  const userWindowOpensAt = useMemo(() => {
    if (!selectedDate) return null
    const window = selectedDate.bookingWindows.find((w) => w.tier === userTier)
    return window?.opensAt ?? null
  }, [selectedDate, userTier])

  const isWindowOpen = useMemo(() => {
    if (!userWindowOpensAt) return false
    return new Date(userWindowOpensAt).getTime() <= Date.now()
  }, [userWindowOpensAt])

  const isSoldOut = useMemo(() => {
    if (sectionsForDate.length === 0) return false
    return sectionsForDate.every((s) => s.remainingSeats === 0)
  }, [sectionsForDate])

  const selectDate = useCallback((dateId: string) => {
    dispatch({ type: 'SELECT_DATE', payload: dateId })
  }, [])

  const toggleLeftPanel = useCallback(() => {
    dispatch({ type: 'TOGGLE_LEFT_PANEL' })
  }, [])

  const setLeftPanel = useCallback((expanded: boolean) => {
    dispatch({ type: 'SET_LEFT_PANEL', payload: expanded })
  }, [])

  const transitionTo = useCallback((nextState: BookingState) => {
    dispatch({ type: 'TRANSITION_STATE', payload: nextState })
  }, [])

  const startBooking = useCallback(() => {
    if (userTier === 'diamond' || userTier === 'gold') {
      dispatch({ type: 'TRANSITION_STATE', payload: 'queue' })
    } else {
      dispatch({ type: 'TRANSITION_STATE', payload: 'vqa' })
    }
  }, [userTier])

  const selectSection = useCallback((sectionId: string) => {
    dispatch({ type: 'SELECT_SECTION', payload: sectionId })
  }, [])

  const toggleSeat = useCallback((seatId: string) => {
    dispatch({ type: 'TOGGLE_SEAT', payload: { seatId, maxSeats } })
  }, [maxSeats])

  const resetBooking = useCallback(() => {
    dispatch({ type: 'RESET_BOOKING' })
  }, [])

  const setConfirmationData = useCallback((data: ConfirmationData) => {
    dispatch({ type: 'SET_CONFIRMATION_DATA', payload: data })
  }, [])

  const setSeatTimerSecondsLeft = useCallback((seconds: number) => {
    dispatch({ type: 'SET_SEAT_TIMER', payload: seconds })
  }, [])

  const value: BookingContextValue = {
    bookingState: state.bookingState,
    event: state.event,
    selectedDateId: state.selectedDateId,
    isLeftPanelExpanded: state.isLeftPanelExpanded,
    isLoading: state.isLoading,
    userTier,
    selectedDate,
    sectionsForDate,
    isWindowOpen,
    isSoldOut,
    userWindowOpensAt,
    selectedSectionId: state.selectedSectionId,
    selectedSeatIds: state.selectedSeatIds,
    maxSeats,
    confirmationData: state.confirmationData,
    seatTimerSecondsLeft: state.seatTimerSecondsLeft,
    selectDate,
    toggleLeftPanel,
    setLeftPanel,
    transitionTo,
    startBooking,
    selectSection,
    toggleSeat,
    resetBooking,
    setConfirmationData,
    setSeatTimerSecondsLeft,
  }

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}
