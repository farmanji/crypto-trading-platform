import React from 'react'
import { Link } from 'react-router-dom'

const ScrollPrice = ({ infiniteTicker }) => {
  return (
    <div className="w-full h-9 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800/50 flex items-center overflow-hidden relative">
      <div className="flex whitespace-nowrap items-center animate-[marquee_30s_linear_infinite] hover:[animation-play-state:paused]">
        {infiniteTicker.map((tick, index) => (
          <div key={index} className="flex items-center text-xs tracking-wide">
            <div className="flex items-center gap-1.5 px-5">
              <Link to={`/trades/${tick.id}`}>
                <b className="text-slate-700 dark:text-slate-200 font-bold cursor-pointer hover:text-amber-500 dark:hover:text-amber-400 transition-colors">{tick.symbol}</b>
              </Link>
              <span className="text-slate-500 dark:text-slate-400 font-mono">{tick.price}</span>
              <span className={`flex items-center font-medium font-mono text-[11px] ${tick.isUp ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'}`}>
                {tick.isUp ? '▲' : '▼'} {tick.change}
              </span>
            </div>
            <span className="text-slate-300 dark:text-slate-700 text-sm pointer-events-none">•</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ScrollPrice
