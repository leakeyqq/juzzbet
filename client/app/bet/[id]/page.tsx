"use client"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { ArrowLeft, Calendar, Bell, BellOff } from "lucide-react"
import { mockBets, mockUsers } from "@/lib/mock-data"
import { PlaceBetModal } from "@/components/place-bet-modal"

export default function BetDetailPage() {
  const params = useParams()
  const router = useRouter()
  const betId = params.id as string
  const [showModal, setShowModal] = useState(false)
  const [selectedVote, setSelectedVote] = useState<"yes" | "no" | null>(null)
  const [notificationUsers, setNotificationUsers] = useState<Set<string>>(new Set())
  const currentUserBalance = 2000

  const bet = mockBets.find((b) => b.id === betId)

  if (!bet) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Bet not found</p>
      </div>
    )
  }

  const handleVoteClick = (vote: "yes" | "no") => {
    setSelectedVote(vote)
    setShowModal(true)
  }

  const handlePlaceBet = (amount: number) => {
    setShowModal(false)
  }

  const yesPct =
    bet.yesBets.length + bet.noBets.length > 0
      ? Math.round((bet.yesBets.length / (bet.yesBets.length + bet.noBets.length)) * 100)
      : 50

  const yesUsers = bet.yesBets.map((b) => mockUsers.find((u) => u.id === b.userId)).filter(Boolean)
  const noUsers = bet.noBets.map((b) => mockUsers.find((u) => u.id === b.userId)).filter(Boolean)

  const bettingEndsDate = new Date(bet.bettingEndsAt)
  const resolutionDateObj = new Date(bet.resolutionDate)
  const bettingEndsString = bettingEndsDate.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
  const resolutionString = resolutionDateObj.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  const toggleNotification = (userId: string) => {
    setNotificationUsers((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(userId)) {
        newSet.delete(userId)
      } else {
        newSet.add(userId)
      }
      return newSet
    })
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background border-b border-border">
          <div className="px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="text-foreground hover:text-muted-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-foreground">Market Details</h1>
          </div>
        </div>

        <div className="pb-6 px-4 pt-4 flex justify-center">
          <div className="w-full max-w-3xl">
            {bet.image && (
              <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4 bg-muted">
                <Image src={bet.image || "/placeholder.svg"} alt={bet.title} fill className="object-cover" />
              </div>
            )}

            {/* Bet Title */}
            <h2 className="text-2xl font-bold text-foreground mb-4">{bet.title}</h2>

            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
              {bet.creator.avatar && (
                <Image
                  src={bet.creator.avatar || "/placeholder.svg"}
                  alt={bet.creator.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full"
                />
              )}
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Created by</p>
                <div className="flex items-center gap-2">
                  <p className="text-foreground font-medium">@{bet.creator.handle}</p>
                  <button
                    onClick={() => toggleNotification(bet.creator.id)}
                    className="p-1 rounded-full hover:bg-muted-foreground/10 transition-colors"
                    title={notificationUsers.has(bet.creator.id) ? "Turn off notifications" : "Turn on notifications"}
                  >
                    {notificationUsers.has(bet.creator.id) ? (
                      <Bell className="w-4 h-4 text-blue-500 fill-blue-500" />
                    ) : (
                      <BellOff className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4 mb-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Currency</span>
                <span className="font-semibold text-foreground">{bet.currency}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Betting Ends
                </span>
                <span className="font-semibold text-foreground text-sm">{bettingEndsString}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Resolution
                </span>
                <span className="font-semibold text-foreground text-sm">{resolutionString}</span>
              </div>
            </div>

            {/* Odds */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-foreground mb-2">Current Odds</h3>
              <div className="flex gap-2 h-3 rounded-full overflow-hidden bg-muted mb-2">
                <div className="bg-green-500" style={{ width: `${yesPct}%` }} />
                <div className="bg-red-500 flex-1" />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-green-600 font-semibold">Yes {yesPct}%</span>
                <span className="text-red-600 font-semibold">No {100 - yesPct}%</span>
              </div>
            </div>

            <div className="flex gap-3 mb-6">
              <button
                onClick={() => handleVoteClick("yes")}
                className="flex-1 py-3 px-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
              >
                Vote YES
              </button>
              <button
                onClick={() => handleVoteClick("no")}
                className="flex-1 py-3 px-4 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
              >
                Vote NO
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Yes Bets Column */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 text-green-600">
                  Bet YES ({yesUsers.length})
                </h3>
                <div className="space-y-2">
                  {yesUsers.map((user) => (
                    <div
                      key={user?.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors border border-border"
                    >
                      {user?.avatar && (
                        <Image
                          src={user.avatar || "/placeholder.svg"}
                          alt={user.name}
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-foreground font-medium text-sm">{user?.name}</p>
                          <button
                            onClick={() => toggleNotification(user?.id || "")}
                            className="p-1 rounded-full hover:bg-muted-foreground/10 transition-colors"
                            title={
                              notificationUsers.has(user?.id || "") ? "Turn off notifications" : "Turn on notifications"
                            }
                          >
                            {notificationUsers.has(user?.id || "") ? (
                              <Bell className="w-4 h-4 text-blue-500 fill-blue-500" />
                            ) : (
                              <BellOff className="w-4 h-4 text-muted-foreground" />
                            )}
                          </button>
                        </div>
                        <p className="text-muted-foreground text-xs">@{user?.handle}</p>
                      </div>
                    </div>
                  ))}
                  {yesUsers.length === 0 && <p className="text-muted-foreground text-sm">No one has bet YES yet</p>}
                </div>
              </div>

              {/* No Bets Column */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 text-red-600">Bet NO ({noUsers.length})</h3>
                <div className="space-y-2">
                  {noUsers.map((user) => (
                    <div
                      key={user?.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors border border-border"
                    >
                      {user?.avatar && (
                        <Image
                          src={user.avatar || "/placeholder.svg"}
                          alt={user.name}
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-foreground font-medium text-sm">{user?.name}</p>
                          <button
                            onClick={() => toggleNotification(user?.id || "")}
                            className="p-1 rounded-full hover:bg-muted-foreground/10 transition-colors"
                            title={
                              notificationUsers.has(user?.id || "") ? "Turn off notifications" : "Turn on notifications"
                            }
                          >
                            {notificationUsers.has(user?.id || "") ? (
                              <Bell className="w-4 h-4 text-blue-500 fill-blue-500" />
                            ) : (
                              <BellOff className="w-4 h-4 text-muted-foreground" />
                            )}
                          </button>
                        </div>
                        <p className="text-muted-foreground text-xs">@{user?.handle}</p>
                      </div>
                    </div>
                  ))}
                  {noUsers.length === 0 && <p className="text-muted-foreground text-sm">No one has bet NO yet</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && selectedVote && (
        <PlaceBetModal
          bet={bet}
          userBalance={currentUserBalance}
          prediction={selectedVote}
          onClose={() => setShowModal(false)}
          onPlaceBet={handlePlaceBet}
        />
      )}
    </>
  )
}
