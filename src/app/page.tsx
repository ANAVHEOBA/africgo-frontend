import HeroSection from "@/components/sections/HeroSection"
import FeaturesSection from "@/components/sections/FeaturesSection"
import BenefitsSection from "@/components/sections/BenefitsSection"
import HowItWorksSection from "@/components/sections/HowItWorksSection"
import SuccessStoriesSection from "@/components/sections/SuccessStoriesSection"
import CTASection from "@/components/sections/CTASection"
import Link from "next/link"

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <BenefitsSection />
      <HowItWorksSection />
      <SuccessStoriesSection />
      <div className="py-12 bg-black/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Shopping?</h2>
          <Link 
            href="/stores"
            className="inline-block px-6 py-3 bg-gold-primary text-white rounded-lg hover:bg-gold-secondary transition-colors"
          >
            Browse Stores
          </Link>
        </div>
      </div>
      <CTASection />
    </main>
  )
}
