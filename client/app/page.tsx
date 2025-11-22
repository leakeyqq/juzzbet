"use client"

import { useState } from "react"
import { BetCard } from "@/components/bet-card"
import { Navbar } from "@/components/navbar"
import { mockBets } from "@/lib/mock-data"
import type { Bet } from "@/lib/types"
import { Plus } from "lucide-react"

export default function Home() {
  const [bets, setBets] = useState<Bet[]>(mockBets)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [selectedCurrency, setSelectedCurrency] = useState<"All" | "USD" | "KES" | "NGN">("All")
  const [showCreateOptions, setShowCreateOptions] = useState(false)

  // Mock current user balance
  const currentUser = {
    id: "user-1",
    xHandle: "@yourhandle",
    xUsername: "Your Name",
    xProfileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=user1",
    balance: {
      USD: 1500,
      KES: 150000,
      NGN: 650000,
    },
  }

  const handleVote = (betId: string, vote: "yes" | "no", userId: string, amount: number) => {
    setBets(
      bets.map((bet) => {
        if (bet.id === betId) {
          const updatedBet = { ...bet }
          if (vote === "yes") {
            updatedBet.noBets = updatedBet.noBets.filter((b) => b.userId !== userId)
            if (!updatedBet.yesBets.find((b) => b.userId === userId)) {
              updatedBet.yesBets.push({ userId })
            }
          } else {
            updatedBet.yesBets = updatedBet.yesBets.filter((b) => b.userId !== userId)
            if (!updatedBet.noBets.find((b) => b.userId === userId)) {
              updatedBet.noBets.push({ userId })
            }
          }
          return updatedBet
        }
        return bet
      }),
    )
  }

  const filteredBets = selectedCurrency === "All" ? bets : bets.filter((bet) => bet.currency === selectedCurrency)

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        isLoggedIn={isLoggedIn}
        onLogin={() => {
          setIsLoggedIn(true)
          console.log("[v0] User logged in with X")
        }}
        onLogout={() => setIsLoggedIn(false)}
        selectedCurrency={selectedCurrency}
        onCurrencyChange={setSelectedCurrency}
        currentUser={currentUser}
      />

      {/* <div className="bg-background border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-muted-foreground">Filter:</span>
          <div className="flex gap-2 flex-wrap">
            {(["All", "USD", "KES", "NGN"] as const).map((curr) => (
              <button
                key={curr}
                onClick={() => setSelectedCurrency(curr)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedCurrency === curr
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
          {curr === "USD" && <img src="/usd-flag.png" alt="USD" className="w-4 h-4 rounded-full" />}
          {curr === "KES" && <img src="/cKES_transparent.png" alt="KES" className="w-4 h-4 rounded-full" />}
          {curr === "NGN" && <img src="/ngn-flag.png" alt="NGN" className="w-4 h-4 rounded-full" />}
          {curr === "All" && <img src="/all-currencies.png" alt="All" className="w-4 h-4 rounded-full" />}

                {curr}
              </button>
            ))}
          </div>
        </div>
      </div> */}


<div className="bg-background border-b border-border px-4 py-3">
  <div className="flex items-center gap-2">
    <span className="text-sm font-semibold text-muted-foreground">Filter:</span>
    <div className="flex gap-2 flex-wrap">
      {(["All", "USD", "KES", "NGN"] as const).map((curr) => (
        <button
          key={curr}
          onClick={() => setSelectedCurrency(curr)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
            selectedCurrency === curr
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground hover:bg-muted/80"
          }`}
        >
          <span className="flex items-center gap-1.5">
            {curr === "USD" && <img src="/cUSD.png" alt="USD" className="w-4 h-4 rounded-full" />}
            {curr === "KES" && <img src="/cKES.png" alt="KES" className="w-4 h-4 rounded-full" />}
            {curr === "NGN" && <img src="/cNGN.png" alt="NGN" className="w-4 h-4 rounded-full" />}
            {/* {curr === "All" && <img src="/all-currencies.png" alt="All" className="w-4 h-4 rounded-full" />} */}
            {curr === "All"}

            {curr}
          </span>
        </button>
      ))}
    </div>
  </div>
</div>


      <div className="pb-24 px-4 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-max">
          {filteredBets.map((bet) => (
            <div key={bet.id}>
              <BetCard bet={bet} onVote={handleVote} />
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => {
            if (isLoggedIn) {
              setShowCreateOptions(!showCreateOptions)
            } else {
              alert("Please login with X to create a bet")
            }
          }}
          className="w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:opacity-90 transition-all flex items-center justify-center hover:scale-110"
          aria-label="Create bet"
        >
          <Plus className="w-6 h-6" />
        </button>

        {showCreateOptions && isLoggedIn && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowCreateOptions(false)} />
            <div className="absolute right-0 bottom-16 bg-card border border-border rounded-lg shadow-xl z-50 w-56">
              <a
                href="/my-bets?tab=created"
                className="block px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors border-b border-border"
                onClick={() => setShowCreateOptions(false)}
              >
                View created bets
              </a>
              <a
                href="/create"
                className="block px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                onClick={() => setShowCreateOptions(false)}
              >
                Create a new bet
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
