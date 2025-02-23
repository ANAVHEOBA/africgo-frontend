import HeroSection from "@/components/sections/HeroSection"
import FeaturesSection from "@/components/sections/FeaturesSection"
import BenefitsSection from "@/components/sections/BenefitsSection"
import HowItWorksSection from "@/components/sections/HowItWorksSection"
import SuccessStoriesSection from "@/components/sections/SuccessStoriesSection"
import CTASection from "@/components/sections/CTASection"

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <BenefitsSection />
      <HowItWorksSection />
      <SuccessStoriesSection />
      <CTASection />
    </main>
  )
}
