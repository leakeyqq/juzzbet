"use client"

import Link from "next/link"
import { useState } from "react"
import type { Bet } from "@/lib/types"
import Image from "next/image"
import { PlaceBetModal } from "./place-bet-modal"
import { CountdownTimer } from "./countdown-timer"
import { Bell, BellOff } from "lucide-react"

interface BetCardProps {
  bet: Bet
  onVote: (betId: string, vote: "yes" | "no", userId: string, amount: number) => void
}

export function BetCard({ bet, onVote }: BetCardProps) {
  const [userVote, setUserVote] = useState<"yes" | "no" | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedVote, setSelectedVote] = useState<"yes" | "no" | null>(null)
  const [notificationEnabled, setNotificationEnabled] = useState(false)
  const currentUserBalance = 2000

  const handleVote = (vote: "yes" | "no") => {
    setSelectedVote(vote)
    setShowModal(true)
  }

  const handlePlaceBet = (amount: number) => {
    const userId = "current-user-123"
    setUserVote(selectedVote)
    onVote(bet.id, selectedVote as "yes" | "no", userId, amount)
    setShowModal(false)
  }

  const creator = bet.creator
  const yesPct =
    bet.yesBets.length + bet.noBets.length > 0
      ? Math.round((bet.yesBets.length / (bet.yesBets.length + bet.noBets.length)) * 100)
      : 50

  return (
    <>
      <Link href={`/bet/${bet.id}`}>
        <div className="bg-card rounded-lg border border-border overflow-hidden cursor-pointer hover:border-primary/50 transition-colors h-full flex flex-col">
          {/* {bet.image && (
            <div className="relative w-full h-32 bg-muted overflow-hidden">
              <Image src={bet.image || "/placeholder.svg"} alt={bet.title} fill className="object-cover" />
              <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs font-semibold">
                {bet.currency}
              </div>
            </div>
          )} */}

          {bet.image && (
  <div className="relative w-full h-32 bg-muted overflow-hidden">
    <Image src={bet.image || "/placeholder.svg"} alt={bet.title} fill className="object-cover" />
    <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1">
      {bet.currency === "USD" && <img src="/cUSD.png" alt="USD" className="w-3 h-3 rounded-full" />}
      {bet.currency === "KES" && <img src="/cKES.png" alt="KES" className="w-3 h-3 rounded-full" />}
      {bet.currency === "NGN" && <img src="/cNGN.png" alt="NGN" className="w-3 h-3 rounded-full" />}
      {bet.currency}
    </div>
  </div>
)}

          {/* Content */}
          <div className="p-4 flex-1 flex flex-col">
            {/* Creator Info */}
            <div className="flex items-center gap-2 mb-2">
              {creator.avatar && (
                <Image
                  src={creator.avatar || "/placeholder.svg"}
                  alt={creator.name}
                  width={24}
                  height={24}
                  className="w-6 h-6 rounded-full"
                />
              )}
              <span className="text-xs text-muted-foreground">
                Created by <span className="text-foreground font-medium">@{creator.handle}</span>
              </span>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setNotificationEnabled(!notificationEnabled)
                }}
                className="p-1 rounded-full hover:bg-muted-foreground/10 transition-colors ml-1"
                title={notificationEnabled ? "Turn off notifications" : "Turn on notifications"}
              >
                {notificationEnabled ? (
                  <Bell className="w-3.5 h-3.5 text-blue-500 fill-blue-500" />
                ) : (
                  <BellOff className="w-3.5 h-3.5 text-muted-foreground" />
                )}
              </button>
            </div>

            {/* Bet Title */}
            <h3 className="text-foreground font-semibold mb-2 text-sm line-clamp-2">{bet.title}</h3>

            <div className="mb-3">
              <CountdownTimer endTime={bet.bettingEndsAt} />
            </div>

            {/* Odds Bar */}
            <div className="mb-3 space-y-2">
              <div className="flex gap-2 h-2 rounded-full overflow-hidden bg-muted">
                <div className="bg-green-500 transition-all" style={{ width: `${yesPct}%` }} />
                <div className="bg-red-500 flex-1" />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span className="text-green-600 font-medium">Yes {yesPct}%</span>
                <span className="text-red-600 font-medium">No {100 - yesPct}%</span>
              </div>
            </div>

            {/* Vote Buttons */}
            <div onClick={(e) => e.preventDefault()} className="flex gap-2 mt-auto">
              <button
                onClick={(e) => {
                  e.preventDefault()
                  handleVote("yes")
                }}
                className={`flex-1 py-2 px-3 rounded-md font-medium text-xs transition-colors ${
                  userVote === "yes" ? "bg-green-500 text-white" : "bg-green-50 text-green-700 hover:bg-green-100"
                }`}
              >
                Yes
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  handleVote("no")
                }}
                className={`flex-1 py-2 px-3 rounded-md font-medium text-xs transition-colors ${
                  userVote === "no" ? "bg-red-500 text-white" : "bg-red-50 text-red-700 hover:bg-red-100"
                }`}
              >
                No
              </button>
            </div>
          </div>
        </div>
      </Link>

      {showModal && (
        <PlaceBetModal
          bet={bet}
          userBalance={currentUserBalance}
          prediction={selectedVote as "yes" | "no"}
          onClose={() => setShowModal(false)}
          onPlaceBet={handlePlaceBet}
        />
      )}
    </>
  )
}
