"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import type { User } from "@/lib/types"

interface NavbarProps {
  isLoggedIn: boolean
  onLogout: () => void
  onLogin: () => void
  selectedCurrency: "All" | "USD" | "KES" | "NGN"
  onCurrencyChange: (currency: "All" | "USD" | "KES" | "NGN") => void
  currentUser?: User
}

export function Navbar({
  isLoggedIn,
  onLogout,
  onLogin,
  selectedCurrency,
  onCurrencyChange,
  currentUser,
}: NavbarProps) {
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const currencies: Array<"All" | "USD" | "KES" | "NGN"> = ["All", "USD", "KES", "NGN"]

  const getDisplayBalance = () => {
    if (!currentUser?.balance) return "0"

    if (selectedCurrency === "All") {
      const usd = currentUser.balance.USD || 0
      const kes = currentUser.balance.KES || 0
      const ngn = currentUser.balance.NGN || 0
      return `$${usd.toFixed(0)} · ₭${kes.toFixed(0)} · ₦${ngn.toFixed(0)}`
    }

    const balance = currentUser.balance[selectedCurrency] || 0
    const symbols: Record<string, string> = { USD: "$", KES: "₭", NGN: "₦" }
    return `${symbols[selectedCurrency]}${balance.toFixed(0)}`
  }

  return (
    <div className="sticky top-0 z-20 bg-background border-b border-border">
      <div className="px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-foreground">
          Juzzbet
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn && (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded-md text-sm">
                <span className="text-muted-foreground">Balance:</span>
                <span className="font-semibold text-foreground">{getDisplayBalance()}</span>
              </div>

              <Link
                href="/my-bets"
                className="px-3 py-1.5 text-foreground text-sm font-medium hover:bg-muted rounded-md transition-colors"
              >
                My Bets
              </Link>

              <Link
                href="/wallet"
                className="px-3 py-1.5 text-foreground text-sm font-medium hover:bg-muted rounded-md transition-colors"
              >
                Wallet
              </Link>

              <button
                onClick={onLogout}
                className="px-3 py-1.5 bg-muted text-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Logout
              </button>
            </>
          )}

          {!isLoggedIn && (
            <button
              onClick={onLogin}
              className="px-3 py-1.5 border border-foreground text-foreground rounded-md text-sm font-medium hover:bg-muted transition-colors"
            >
              Login with X
            </button>
          )}
        </div>

        {!isLoggedIn && (
          <button
            onClick={onLogin}
            className="md:hidden px-3 py-1.5 border border-foreground text-foreground rounded-md text-sm font-medium hover:bg-muted transition-colors"
          >
            Login with X
          </button>
        )}

        {isLoggedIn && (
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden text-foreground hover:text-muted-foreground"
          >
            {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        )}
      </div>

      {showMobileMenu && isLoggedIn && (
        <div className="border-t border-border px-4 py-3 space-y-2 md:hidden">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <span className="text-xs font-semibold text-muted-foreground">BALANCE</span>
            <span className="text-foreground font-semibold">{getDisplayBalance()}</span>
          </div>

          <div className="pt-2 space-y-2">
            <Link
              href="/my-bets"
              className="block px-3 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-md"
              onClick={() => setShowMobileMenu(false)}
            >
              My Bets
            </Link>
            <Link
              href="/wallet"
              className="block px-3 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-md"
              onClick={() => setShowMobileMenu(false)}
            >
              Wallet
            </Link>
            <button
              onClick={() => {
                onLogout()
                setShowMobileMenu(false)
              }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-md"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
