import React from 'react';
import { ChefHat, Users, Heart, Star, Globe, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AboutLoading } from '../components/AboutloadingSkeleton';

const About = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <AboutLoading />;

  return (
    <div className="min-h-screen bg-white text-gray-800 dark:bg-[#1a1a1a] dark:text-[#fafafa]">
      {/* Header */}
      <header className="w-full shadow-sm bg-white py-5 px-6 flex justify-between items-center dark:bg-[#111]/80">
        <Link to={'/'}>
          <h1 className="text-xl font-bold text-gray-900 dark:text-[#ff6b6b]">Prepify</h1>
        </Link>
        <nav className="space-x-6 text-sm font-medium">
          <a href="/" className="hover:text-[#ff6b6b] transition dark:hover:text-[#ff6b6b]">
            Home
          </a>
          <a href="/recipes" className="hover:text-[#ff6b6b] transition dark:hover:text-[#ff6b6b]">
            Recipes
          </a>
          <a href="/about" className="text-[#ff6b6b] font-semibold">
            About
          </a>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-[#ff6b6b] shadow-md mb-6 dark:bg-[#ff6b6b]">
            <ChefHat className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 dark:text-gray-100">
            About Prepify
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed dark:text-gray-300">
            We're passionate about bringing people together through the love of cooking. Prepify is
            more than just a recipe platform—it's a global community where culinary traditions meet
            modern creativity.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 dark:text-gray-100">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 mb-6 dark:text-gray-300">
              To make delicious, diverse recipes accessible to everyone, regardless of experience,
              background, or skill level. Great food connects people—and we want to make that
              connection easier.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-xl bg-gray-100 shadow-sm dark:bg-gray-800">
                <div className="text-2xl font-bold text-[#ff6b6b] mb-1">50K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Active Cooks</div>
              </div>

              <div className="text-center p-4 rounded-xl bg-gray-100 shadow-sm dark:bg-gray-800">
                <div className="text-2xl font-bold text-[#ff6b6b] mb-1">12K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Recipes Shared</div>
              </div>
            </div>
          </div>

          <div className="shadow-lg border-0 rounded-2xl bg-white p-8 dark:bg-gray-900">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <Users className="h-8 w-8 text-[#ff6b6b] mx-auto mb-3 dark:text-[#ff6b6b]" />
                <h3 className="font-semibold text-gray-900 mb-2 dark:text-[#ff6b6b]">
                  Community First
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Connecting cooks worldwide
                </p>
              </div>

              <div className="text-center">
                <Globe className="h-8 w-8 text-[#ff9470] mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2 dark:text-gray-100">
                  Global Flavors
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Celebrating world cuisines
                </p>
              </div>

              <div className="text-center">
                <Heart className="h-8 w-8 text-[#ff6b6b] mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2 dark:text-gray-100">
                  Made with Love
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Every recipe has a story</p>
              </div>

              <div className="text-center">
                <Award className="h-8 w-8 text-[#ff9470] mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2 dark:text-gray-100">
                  Quality Recipes
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Trusted by home cooks</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12 dark:text-gray-100">
            What Makes Us Special
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center bg-white shadow-md hover:shadow-xl transition-all p-6 rounded-2xl dark:bg-gray-900">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#ff6b6b]/10 mb-6">
                <Star className="h-8 w-8 text-[#ff6b6b]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 dark:text-gray-100">
                Expert Tested
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Recipes tested and perfected by passionate home cooks.
              </p>
            </div>

            <div className="text-center bg-white shadow-md hover:shadow-xl transition-all p-6 rounded-2xl dark:bg-gray-900">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#ff9470]/10 mb-6">
                <Users className="h-8 w-8 text-[#ff9470]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 dark:text-gray-100">
                Vibrant Community
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Share tips, discover cuisines, and learn from others.
              </p>
            </div>

            <div className="text-center bg-white shadow-md hover:shadow-xl transition-all p-6 rounded-2xl dark:bg-gray-900">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#ff6b6b]/10 mb-6">
                <ChefHat className="h-8 w-8 text-[#ff6b6b]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 dark:text-gray-100">
                Easy to Follow
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Step-by-step instructions for all cooking levels.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Values</h2>

          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {[
              'Inclusivity',
              'Authenticity',
              'Sustainability',
              'Innovation',
              'Community',
              'Quality',
              'Accessibility',
              'Diversity',
            ].map((value) => (
              <span
                key={value}
                className="px-4 py-2 text-sm font-medium rounded-full bg-gray-100 text-gray-700 shadow-sm dark:bg-gray-800 dark:text-gray-300"
              >
                {value}
              </span>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
