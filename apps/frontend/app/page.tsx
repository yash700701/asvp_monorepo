import Header from "@/components/header";
import Hero from "@/components/hero";
import GridCard from "@/components/GridCard";
import PricingSection from "@/components/SubscriptionPlans";
import Footer from "@/components/Footer";

export default async function Page() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <GridCard />
        <PricingSection />
      </main>
      <Footer />
    </>
  );
}
