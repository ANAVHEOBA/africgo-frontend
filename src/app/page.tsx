import HeroSection from "@/components/sections/HeroSection"
import FeaturesSection from "@/components/sections/FeaturesSection"
import BenefitsSection from "@/components/sections/BenefitsSection"
import HowItWorksSection from "@/components/sections/HowItWorksSection"
import CTASection from "@/components/sections/CTASection"
import Link from "next/link"

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <BenefitsSection />
      <div className="py-12 bg-black/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <Link 
            href="/stores"
            className="inline-block px-6 py-3 bg-gold-primary text-white rounded-lg hover:bg-gold-secondary transition-colors"
          >
            Find Stores Near You
          </Link>
        </div>
      </div>
      <CTASection />
    </main>
  )
}
