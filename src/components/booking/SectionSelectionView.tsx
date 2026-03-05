import { useState, useCallback } from 'react'
import { useBooking } from '@/hooks/useBooking'
import { SectionMap } from './SectionMap'
import { SectionListInteractive } from './SectionListInteractive'
import { SectionMapLegend } from './SectionMapLegend'

export function SectionSelectionView() {
  const { selectSection, transitionTo, selectedSectionId } = useBooking()
  const [hoveredSectionId, setHoveredSectionId] = useState<string | null>(null)

  const handleSectionClick = useCallback(
    (sectionId: string) => {
      selectSection(sectionId)
      transitionTo('seats-individual')
    },
    [selectSection, transitionTo],
  )

  return (
    <div className="h-full flex flex-col p-6 gap-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold">구역 선택</h2>
        <p className="text-sm text-muted-foreground mt-1">
          원하는 구역을 선택하면 좌석을 고를 수 있어요
        </p>
      </div>

      {/* Content: Map + List side-by-side */}
      <div className="flex-1 min-h-0 flex gap-6">
        {/* Left: Interactive map (60%) */}
        <div className="flex-[3] min-h-0">
          <SectionMap
            interactive
            selectedSectionId={selectedSectionId}
            onSectionClick={handleSectionClick}
            onSectionHover={setHoveredSectionId}
            externalHoveredId={hoveredSectionId}
          />
        </div>

        {/* Right: Section list (40%) */}
        <div className="flex-[2] overflow-y-auto">
          <SectionListInteractive
            hoveredSectionId={hoveredSectionId}
            onSectionHover={setHoveredSectionId}
            onSectionClick={handleSectionClick}
            selectedSectionId={selectedSectionId}
          />
        </div>
      </div>

      {/* Legend */}
      <SectionMapLegend />
    </div>
  )
}
