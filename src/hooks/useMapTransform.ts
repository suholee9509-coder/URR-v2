import { useState, useCallback, useRef } from 'react'
import { SECTION_BBOXES } from '@/components/booking/VenueMap'

const SVG_VIEWBOX = { w: 519.03, h: 566.63 }
const ZOOM_TRANSITION_MS = 600
// Extra multiplier beyond section-fill to zoom deep enough for individual seats
const SEAT_ZOOM_MULTIPLIER = 2.5

interface Transform {
  scale: number
  translateX: number
  translateY: number
}

interface ViewportRect {
  x: number
  y: number
  w: number
  h: number
}

interface UseMapTransformReturn {
  transform: Transform
  isZoomedIn: boolean
  isAnimating: boolean
  viewportRect: ViewportRect
  zoomToSection: (sectionId: string, containerW: number, containerH: number) => Promise<void>
  zoomOut: () => Promise<void>
  pan: (dx: number, dy: number) => void
  panTo: (svgX: number, svgY: number, containerW: number, containerH: number) => void
  handleWheel: (e: React.WheelEvent, containerW: number, containerH: number) => void
}

function clampTranslate(
  tx: number,
  ty: number,
  scale: number,
  containerW: number,
  containerH: number,
): { tx: number; ty: number } {
  // At the given scale, the SVG occupies scale * containerW/containerH
  // We want to keep the SVG content within bounds
  const maxTx = 0
  const minTx = containerW - containerW * scale
  const maxTy = 0
  const minTy = containerH - containerH * scale

  return {
    tx: Math.min(maxTx, Math.max(minTx, tx)),
    ty: Math.min(maxTy, Math.max(minTy, ty)),
  }
}

export function useMapTransform(): UseMapTransformReturn {
  const [transform, setTransform] = useState<Transform>({
    scale: 1,
    translateX: 0,
    translateY: 0,
  })
  const [isAnimating, setIsAnimating] = useState(false)
  const containerSizeRef = useRef({ w: 0, h: 0 })

  const isZoomedIn = transform.scale > 1.05

  // Compute how much the SVG is scaled to fit the container
  // SVG uses preserveAspectRatio="xMidYMid meet"
  function getSvgFitScale(containerW: number, containerH: number) {
    const scaleX = containerW / SVG_VIEWBOX.w
    const scaleY = containerH / SVG_VIEWBOX.h
    return Math.min(scaleX, scaleY)
  }

  function getSvgOffset(containerW: number, containerH: number) {
    const fitScale = getSvgFitScale(containerW, containerH)
    const renderedW = SVG_VIEWBOX.w * fitScale
    const renderedH = SVG_VIEWBOX.h * fitScale
    return {
      offsetX: (containerW - renderedW) / 2,
      offsetY: (containerH - renderedH) / 2,
      fitScale,
      renderedW,
      renderedH,
    }
  }

  const zoomToSection = useCallback(
    async (sectionId: string, containerW: number, containerH: number) => {
      const bbox = SECTION_BBOXES[sectionId]
      if (!bbox || isAnimating) return

      containerSizeRef.current = { w: containerW, h: containerH }

      const { offsetX, offsetY, fitScale } = getSvgOffset(containerW, containerH)

      // Convert SVG bbox to pixel coords in the container
      const pxX = offsetX + bbox.x * fitScale
      const pxY = offsetY + bbox.y * fitScale
      const pxW = bbox.w * fitScale
      const pxH = bbox.h * fitScale

      // Compute a base scale that fills the viewport with the section,
      // then multiply by SEAT_ZOOM_MULTIPLIER to zoom deep enough for seats
      const baseScale = Math.min(containerW / pxW, containerH / pxH)
      const scale = baseScale * SEAT_ZOOM_MULTIPLIER
      const centerX = pxX + pxW / 2
      const centerY = pxY + pxH / 2

      const tx = containerW / 2 - centerX * scale
      const ty = containerH / 2 - centerY * scale

      setIsAnimating(true)
      setTransform({ scale, translateX: tx, translateY: ty })

      return new Promise<void>((resolve) => {
        setTimeout(() => {
          setIsAnimating(false)
          resolve()
        }, ZOOM_TRANSITION_MS)
      })
    },
    [isAnimating],
  )

  const zoomOut = useCallback(async () => {
    if (isAnimating) return
    setIsAnimating(true)
    setTransform({ scale: 1, translateX: 0, translateY: 0 })
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setIsAnimating(false)
        resolve()
      }, ZOOM_TRANSITION_MS)
    })
  }, [isAnimating])

  const pan = useCallback((dx: number, dy: number) => {
    setTransform((prev) => {
      const { w, h } = containerSizeRef.current
      if (w === 0 || h === 0) {
        return { ...prev, translateX: prev.translateX + dx, translateY: prev.translateY + dy }
      }
      const { tx, ty } = clampTranslate(
        prev.translateX + dx,
        prev.translateY + dy,
        prev.scale,
        w,
        h,
      )
      return { ...prev, translateX: tx, translateY: ty }
    })
  }, [])

  const panTo = useCallback(
    (svgX: number, svgY: number, containerW: number, containerH: number) => {
      containerSizeRef.current = { w: containerW, h: containerH }
      setTransform((prev) => {
        const { offsetX, offsetY, fitScale } = getSvgOffset(containerW, containerH)
        const pxX = offsetX + svgX * fitScale
        const pxY = offsetY + svgY * fitScale
        const tx = containerW / 2 - pxX * prev.scale
        const ty = containerH / 2 - pxY * prev.scale
        const clamped = clampTranslate(tx, ty, prev.scale, containerW, containerH)
        return { ...prev, translateX: clamped.tx, translateY: clamped.ty }
      })
    },
    [],
  )

  const handleWheel = useCallback(
    (e: React.WheelEvent, containerW: number, containerH: number) => {
      containerSizeRef.current = { w: containerW, h: containerH }

      // Extract event values before they're nullified by React's event pooling
      const deltaY = e.deltaY
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
      const cursorX = e.clientX - rect.left
      const cursorY = e.clientY - rect.top

      setTransform((prev) => {
        const delta = deltaY > 0 ? -0.15 : 0.15
        const newScale = Math.min(6, Math.max(1, prev.scale + delta))

        const ratio = newScale / prev.scale
        const tx = cursorX - ratio * (cursorX - prev.translateX)
        const ty = cursorY - ratio * (cursorY - prev.translateY)

        if (newScale <= 1.05) {
          return { scale: 1, translateX: 0, translateY: 0 }
        }

        const clamped = clampTranslate(tx, ty, newScale, containerW, containerH)
        return { scale: newScale, translateX: clamped.tx, translateY: clamped.ty }
      })
    },
    [],
  )

  // Viewport rectangle in SVG coordinates (for minimap)
  const viewportRect: ViewportRect = (() => {
    const { w, h } = containerSizeRef.current
    if (w === 0 || h === 0 || transform.scale <= 1) {
      return { x: 0, y: 0, w: SVG_VIEWBOX.w, h: SVG_VIEWBOX.h }
    }

    const { offsetX, offsetY, fitScale } = getSvgOffset(w, h)
    const visibleX = -transform.translateX / transform.scale
    const visibleY = -transform.translateY / transform.scale
    const visibleW = w / transform.scale
    const visibleH = h / transform.scale

    return {
      x: (visibleX - offsetX) / fitScale,
      y: (visibleY - offsetY) / fitScale,
      w: visibleW / fitScale,
      h: visibleH / fitScale,
    }
  })()

  return {
    transform,
    isZoomedIn,
    isAnimating,
    viewportRect,
    zoomToSection,
    zoomOut,
    pan,
    panTo,
    handleWheel,
  }
}
