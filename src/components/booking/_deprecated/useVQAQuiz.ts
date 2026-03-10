import { useReducer, useCallback, useRef, useEffect } from 'react'
import { pickRandomQuestions, type VQAQuestion } from '@/data/mock-vqa'
import { useBooking } from '@/hooks/useBooking'

// ── Types ──────────────────────────────────────────────

type Phase = 'answering' | 'evaluating' | 'result'
type ResultType = 'passed' | 'failed-can-retry' | 'failed-exhausted'

interface VQAState {
  phase: Phase
  questions: VQAQuestion[]
  currentIndex: number
  timeRemaining: number
  selectedIndex: number | null
  isCorrect: boolean | null
  correctCount: number
  attemptsUsed: number
  resultType: ResultType | null
}

type VQAAction =
  | { type: 'SELECT_ANSWER'; index: number }
  | { type: 'TICK' }
  | { type: 'TIMEOUT' }
  | { type: 'ADVANCE' }
  | { type: 'FINISH' }
  | { type: 'RETRY' }

const MAX_ATTEMPTS = 3 // initial + 2 retries
const PASS_THRESHOLD = 2
const TIMER_SECONDS = 30

// ── Reducer ────────────────────────────────────────────

function createInitialState(): VQAState {
  return {
    phase: 'answering',
    questions: pickRandomQuestions(3),
    currentIndex: 0,
    timeRemaining: TIMER_SECONDS,
    selectedIndex: null,
    isCorrect: null,
    correctCount: 0,
    attemptsUsed: 1,
    resultType: null,
  }
}

function reducer(state: VQAState, action: VQAAction): VQAState {
  switch (action.type) {
    case 'SELECT_ANSWER': {
      if (state.phase !== 'answering') return state
      const question = state.questions[state.currentIndex]
      const correct = action.index === question.correctIndex
      return {
        ...state,
        phase: 'evaluating',
        selectedIndex: action.index,
        isCorrect: correct,
        correctCount: state.correctCount + (correct ? 1 : 0),
      }
    }

    case 'TICK': {
      if (state.phase !== 'answering') return state
      return { ...state, timeRemaining: Math.max(0, state.timeRemaining - 1) }
    }

    case 'TIMEOUT': {
      if (state.phase !== 'answering') return state
      return {
        ...state,
        phase: 'evaluating',
        selectedIndex: null,
        isCorrect: false,
      }
    }

    case 'ADVANCE': {
      const nextIndex = state.currentIndex + 1
      if (nextIndex >= state.questions.length) {
        // All questions done — compute result
        const passed = state.correctCount >= PASS_THRESHOLD
        let resultType: ResultType
        if (passed) {
          resultType = 'passed'
        } else if (state.attemptsUsed < MAX_ATTEMPTS) {
          resultType = 'failed-can-retry'
        } else {
          resultType = 'failed-exhausted'
        }
        return { ...state, phase: 'result', resultType }
      }
      return {
        ...state,
        phase: 'answering',
        currentIndex: nextIndex,
        timeRemaining: TIMER_SECONDS,
        selectedIndex: null,
        isCorrect: null,
      }
    }

    case 'FINISH': {
      const passed = state.correctCount >= PASS_THRESHOLD
      let resultType: ResultType
      if (passed) {
        resultType = 'passed'
      } else if (state.attemptsUsed < MAX_ATTEMPTS) {
        resultType = 'failed-can-retry'
      } else {
        resultType = 'failed-exhausted'
      }
      return { ...state, phase: 'result', resultType }
    }

    case 'RETRY': {
      return {
        ...createInitialState(),
        attemptsUsed: state.attemptsUsed + 1,
      }
    }

    default:
      return state
  }
}

// ── Hook ───────────────────────────────────────────────

export function useVQAQuiz() {
  const { transitionTo } = useBooking()
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const advanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Timer — ticks every second during 'answering' phase
  useEffect(() => {
    if (state.phase !== 'answering') {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      return
    }

    timerRef.current = setInterval(() => {
      dispatch({ type: 'TICK' })
    }, 1000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [state.phase, state.currentIndex])

  // Timeout detection
  useEffect(() => {
    if (state.phase === 'answering' && state.timeRemaining <= 0) {
      dispatch({ type: 'TIMEOUT' })
    }
  }, [state.timeRemaining, state.phase])

  // Auto-advance after evaluation (1.5s delay)
  useEffect(() => {
    if (state.phase !== 'evaluating') return

    advanceTimeoutRef.current = setTimeout(() => {
      dispatch({ type: 'ADVANCE' })
    }, 1500)

    return () => {
      if (advanceTimeoutRef.current) {
        clearTimeout(advanceTimeoutRef.current)
        advanceTimeoutRef.current = null
      }
    }
  }, [state.phase, state.currentIndex])

  // Auto-transition to queue after pass (2s delay)
  useEffect(() => {
    if (state.phase !== 'result' || state.resultType !== 'passed') return

    const timeout = setTimeout(() => {
      transitionTo('queue')
    }, 2000)

    return () => clearTimeout(timeout)
  }, [state.phase, state.resultType, transitionTo])

  const selectAnswer = useCallback((index: number) => {
    dispatch({ type: 'SELECT_ANSWER', index })
  }, [])

  const retry = useCallback(() => {
    dispatch({ type: 'RETRY' })
  }, [])

  const exitQuiz = useCallback(() => {
    transitionTo('idle')
  }, [transitionTo])

  const currentQuestion = state.questions[state.currentIndex] ?? null

  return {
    phase: state.phase,
    currentQuestion,
    currentIndex: state.currentIndex,
    totalQuestions: state.questions.length,
    timeRemaining: state.timeRemaining,
    selectedIndex: state.selectedIndex,
    isCorrect: state.isCorrect,
    correctCount: state.correctCount,
    attemptsUsed: state.attemptsUsed,
    maxAttempts: MAX_ATTEMPTS,
    resultType: state.resultType,
    selectAnswer,
    retry,
    exitQuiz,
  }
}
