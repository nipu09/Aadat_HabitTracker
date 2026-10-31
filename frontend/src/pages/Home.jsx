import React from "react";

import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import Button from "../components/ui/Button";
import FeatureCard from "../components/common/FeatureCard";
import Footer from "../components/layout/Footer";


const Home = () => {
  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-5 md:px-8">
        {/* Hero Section */}
        <section className="grid grid-cols-1 items-center gap-10 py-12 md:grid-cols-2 md:gap-12 md:py-20">
          {/* Hero Content */}

          <div>
            <span className="inline-block rounded-full bg-mint px-3 py-1 text-xs uppercase tracking-wide text-link">
              Progress, not perfection
            </span>

            <h1 className="mt-5 font-display text-5xl leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Grow at your own pace.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted sm:text-lg">
              No rush. No pressure. Just you, showing up every day. Aadat makes
              it easier to build gentle routines and celebrate your progress.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button to="/signup" size="lg">
                Create your account
              </Button>

              <Button to="/login" variant="secondary" size="lg">
                Log in
              </Button>
            </div>
          </div>

          {/* Heatmap Preview Card */}
          <img className="" src="/heatmap.png" />
        </section>

        {/* Features Section */}
        <section id="features" className="scroll-mt-6 py-12">
          <h2 className="font-display text-3xl leading-tight tracking-tight sm:text-4xl">
            A calmer way to grow.
          </h2>

          <p className="mt-3 max-w-lg text-muted">
            Gentle tools to help you build habits that last.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <FeatureCard title="Daily rhythm">
              Simple routines. A gentler flow to your day.
            </FeatureCard>

            <FeatureCard title="Habit activity">
              A year of small steps, beautifully in view.
            </FeatureCard>

            <FeatureCard title="Growing streaks">
              Celebrate your streaks. Return to your habits, one day at a time.
            </FeatureCard>
          </div>
        </section>

        {/* Call to Action */}
        <section
          id="how-it-works"
          className="my-12 scroll-mt-6 rounded-[28px] bg-lilac px-6 py-16 text-center sm:px-10"
        >
          <h2 className="font-display text-3xl leading-tight tracking-tight sm:text-4xl">
            Start growing today.
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink/80 sm:text-base">
            Create a free account and add your first habit in under a minute.
          </p>

          <div className="mt-6">
            <Button to="/signup" variant="light" size="lg">
              Create your account
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
