export interface User {
  id: string
  name: string
  handle: string
  avatar?: string
  balance?: Record<"USD" | "KES" | "NGN", number>
}

export interface Bet {
  id: string
  title: string
  description?: string
  creator: User
  image?: string
  currency: "USD" | "KES" | "NGN"
  bettingEndsAt: string
  resolutionDate: string
  yesBets: Array<{ userId: string }>
  noBets: Array<{ userId: string }>
  createdAt: string
  resolved?: boolean
  resolution?: "yes" | "no" | "cancelled"
}

export interface UserBet {
  betId: string
  userId: string
  prediction: "yes" | "no"
  amount: number
  placedAt: string
  resolved: boolean
  won?: boolean
}
