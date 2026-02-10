"use client";

import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeatureSection";
import { ShowcaseSection } from "@/components/ShowcaseSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    // <div className="relative flex flex-col min-h-screen bg-white dark:bg-black">
    //   <Navbar />
    //   <div className="fixed inset-0 ">
    //     <GridBackgroundDemo />
    //   </div>

    //   {/* Hero Section */}
    //   <HeroHighlight containerClassName="bg-grid-black/[0.2] dark:bg-grid-white/[0.2] relative overflow-hidden z-10">
    //     {isMounted && (
    //       <div className="absolute inset-0 w-full h-full">
    //         <SparklesCore
    //           id="hero-sparkles"
    //           background="transparent"
    //           minSize={0.6}
    //           maxSize={1.4}
    //           particleDensity={100}
    //           className="w-full h-full"
    //           particleColor="#4F46E5"
    //         />
    //       </div>
    //     )}

    //     <div className="flex flex-col items-center justify-center px-4 relative z-30">
    //       <motion.h1
    //         initial={{
    //           opacity: 0,
    //           y: 20,
    //         }}
    //         animate={{
    //           opacity: 1,
    //           y: [20, -5, 0],
    //         }}
    //         transition={{
    //           duration: 0.5,
    //           ease: [0.4, 0.0, 0.2, 1],
    //         }}
    //         className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto "
    //       >
    //         The Ultimate Task Management Solution for <br />
    //         <Highlight className="text-black dark:text-white">
    //           High Performance Teams.
    //         </Highlight>
    //       </motion.h1>

    //       {isMounted && <TypewriterEffectSmooth words={words} />}

    //       <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4 mt-10">
    //         <Link
    //           href="/signup"
    //           className="w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm flex items-center justify-center hover:bg-neutral-800 transition duration-200"
    //         >
    //           Get Started
    //         </Link>
    //         <Link
    //           href="/login"
    //           className="w-40 h-10 rounded-xl bg-white text-black border border-black  text-sm flex items-center justify-center hover:bg-neutral-100 transition duration-200"
    //         >
    //           Learn More
    //         </Link>
    //       </div>
    //     </div>
    //   </HeroHighlight>

    //   {/* Features Section */}
    //   <section className="py-20 bg-neutral-50 dark:bg-neutral-900/50 relative z-10">
    //     <div className="max-w-7xl mx-auto px-4 md:px-8">
    //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
    //         {features.map((feature, index) => (
    //           <div
    //             key={index}
    //             className="p-8 rounded-2xl bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 hover:shadow-xl transition duration-300"
    //           >
    //             <div className="mb-4">{feature.icon}</div>
    //             <h3 className="text-xl font-bold mb-2 text-neutral-800 dark:text-neutral-200">
    //               {feature.title}
    //             </h3>
    //             <p className="text-neutral-600 dark:text-neutral-400">
    //               {feature.description}
    //             </p>
    //           </div>
    //         ))}
    //       </div>
    //     </div>
    //   </section>

    //   {/* Footer */}
    //   <footer className="py-10 border-t border-neutral-200 dark:border-neutral-800">
    //     <div className="max-w-7xl mx-auto px-4 text-center text-neutral-500 dark:text-neutral-400">
    //       <p>© 2026 Todo Admin. All rights reserved.</p>
    //     </div>
    //   </footer>
    // </div>
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <ShowcaseSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
