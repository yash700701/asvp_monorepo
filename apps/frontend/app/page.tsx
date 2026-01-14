import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Header from "@/components/header";
import Hero from "@/components/hero";
import GridCard from "@/components/GridCard";
import PricingSection from "@/components/SubscriptionPlans";
import Footer from "@/components/Footer";

export default async function Page() {
  // const cookieStore = await cookies();
  // const token = cookieStore.get("auth_token")?.value;

  // if (!token) {
  //   redirect("/login");
  // }

  // try {
  //   jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET!);
  // } catch {
  //   redirect("/login");
  // }

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
