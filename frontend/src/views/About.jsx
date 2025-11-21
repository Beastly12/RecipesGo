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
    <div className="min-h-screen bg-white text-gray-800">
      {/* Header */}
      <header className="w-full shadow-sm bg-white py-5 px-6 flex justify-between items-center">
        <Link to={'/'}>
          <h1 className="text-xl font-bold text-gray-900">Prepify</h1>
        </Link>
        <nav className="space-x-6 text-sm font-medium">
          <a href="/" className="hover:text-[#ff6b6b] transition">
            Home
          </a>
          <a href="/recipes" className="hover:text-[#ff6b6b] transition">
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
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-[#ff6b6b] shadow-md mb-6">
            <ChefHat className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">About Prepify</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're passionate about bringing people together through the love of cooking. Prepify is
            more than just a recipe platform—it's a global community where culinary traditions meet
            modern creativity.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-6">
              To make delicious, diverse recipes accessible to everyone, regardless of experience,
              background, or skill level. Great food connects people—and we want to make that
              connection easier.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-xl bg-gray-100 shadow-sm">
                <div className="text-2xl font-bold text-[#ff6b6b] mb-1">50K+</div>
                <div className="text-sm text-gray-600">Active Cooks</div>
              </div>

              <div className="text-center p-4 rounded-xl bg-gray-100 shadow-sm">
                <div className="text-2xl font-bold text-[#ff9470] mb-1">12K+</div>
                <div className="text-sm text-gray-600">Recipes Shared</div>
              </div>
            </div>
          </div>

          <div className="shadow-lg border-0 rounded-2xl bg-white p-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <Users className="h-8 w-8 text-[#ff6b6b] mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Community First</h3>
                <p className="text-sm text-gray-600">Connecting cooks worldwide</p>
              </div>

              <div className="text-center">
                <Globe className="h-8 w-8 text-[#ff9470] mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Global Flavors</h3>
                <p className="text-sm text-gray-600">Celebrating world cuisines</p>
              </div>

              <div className="text-center">
                <Heart className="h-8 w-8 text-[#ff6b6b] mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Made with Love</h3>
                <p className="text-sm text-gray-600">Every recipe has a story</p>
              </div>

              <div className="text-center">
                <Award className="h-8 w-8 text-[#ff9470] mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Quality Recipes</h3>
                <p className="text-sm text-gray-600">Trusted by home cooks</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            What Makes Us Special
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center bg-white shadow-md hover:shadow-xl transition-all p-6 rounded-2xl">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#ff6b6b]/10 mb-6">
                <Star className="h-8 w-8 text-[#ff6b6b]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Expert Tested</h3>
              <p className="text-gray-600">
                Recipes tested and perfected by passionate home cooks.
              </p>
            </div>

            <div className="text-center bg-white shadow-md hover:shadow-xl transition-all p-6 rounded-2xl">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#ff9470]/10 mb-6">
                <Users className="h-8 w-8 text-[#ff9470]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Vibrant Community</h3>
              <p className="text-gray-600">Share tips, discover cuisines, and learn from others.</p>
            </div>

            <div className="text-center bg-white shadow-md hover:shadow-xl transition-all p-6 rounded-2xl">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#ff6b6b]/10 mb-6">
                <ChefHat className="h-8 w-8 text-[#ff6b6b]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Easy to Follow</h3>
              <p className="text-gray-600">Step-by-step instructions for all cooking levels.</p>
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
                className="px-4 py-2 text-sm font-medium rounded-full bg-gray-100 text-gray-700 shadow-sm"
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
