import AccountTypeSelector from "@/components/auth/AccountTypeSelector"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-dark-primary">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-primary via-transparent to-dark-primary opacity-80" />
        <div className="hero-glow" />
      </div>

      <div className="container mx-auto px-4 pt-32 pb-20 relative z-10">
        <AccountTypeSelector />
      </div>
    </div>
  )
} 