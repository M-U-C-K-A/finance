//app/(home)/page.tsx LANDING PAGE
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Header } from "@/components/home/header";
import { Hero } from "@/components/home/hero";
import { Case } from "@/components/home/case";
import { Testimonials } from "@/components/home/testimonial";
import { Feature } from "@/components/home/feature";
import { Pricing } from "@/components/home/princing";
import { Stats } from "@/components/home/stats";
import { FAQ } from "@/components/home/faq";
import { Contact } from "@/components/home/contact";
import { Footer } from "@/components/home/footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto">
      <Hero />
      <Case />
      <Feature />
      <Testimonials />
      <Pricing />
      <Stats />
      <FAQ />
      <Contact />
      </main>
      <Footer />
    </>
  );
}
