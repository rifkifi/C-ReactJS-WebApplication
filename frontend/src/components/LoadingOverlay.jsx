import React from "react"

export default function LoadingOverlay({ show = false, text = "Loading…" }) {
  if (!show) return null
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-black/40">
      <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow">
        <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
        <span className="text-slate-800">{text}</span>
      </div>
    </div>
  )
}
