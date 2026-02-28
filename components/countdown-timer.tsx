"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"

interface CountdownTimerProps {
  targetDate: string
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    function calculate() {
      const now = new Date().getTime()
      const target = new Date(targetDate).getTime()
      const diff = Math.max(0, target - now)

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft({ hours, minutes, seconds })
    }

    calculate()
    const interval = setInterval(calculate, 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  const pad = (n: number) => n.toString().padStart(2, "0")

  return (
    <div className="flex items-center gap-3">
      <Clock className="h-4 w-4 text-gold" />
      <span className="text-xs text-muted-foreground">{"อัพเดทเทียใหม่ใน:"}</span>
      <div className="flex items-center gap-1">
        <TimeUnit value={pad(timeLeft.hours)} label="ชม." />
        <span className="text-gold font-bold text-sm">:</span>
        <TimeUnit value={pad(timeLeft.minutes)} label="นาที" />
        <span className="text-gold font-bold text-sm">:</span>
        <TimeUnit value={pad(timeLeft.seconds)} label="วิ" />
      </div>
    </div>
  )
}

function TimeUnit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="rounded-md bg-navy px-2 py-0.5 font-mono text-sm font-bold text-gold tabular-nums">
        {value}
      </span>
      <span className="text-[9px] text-muted-foreground mt-0.5">{label}</span>
    </div>
  )
}
