export function QueuePromotionOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-30 bg-white/80 backdrop-blur-sm rounded-lg">
      <div className="text-center space-y-3 animate-in fade-in zoom-in-95 duration-300">
        <span className="text-5xl block">🎉</span>
        <h2 className="text-xl font-bold text-foreground">
          순서가 되었습니다!
        </h2>
        <p className="text-sm text-muted-foreground">
          좌석을 선택하세요
        </p>
      </div>
    </div>
  )
}
