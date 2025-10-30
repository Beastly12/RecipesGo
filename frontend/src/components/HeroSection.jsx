import React from "react";
import heroImg from "../assets/heroimg.jpeg";
import useScrollPosition from "../hooks/useScrollPosition";

export default function HeroSection() {
  const scrollY = useScrollPosition();

  const transformValue = Math.min(scrollY / 3, 150);

  const style = {
    backgroundImage: `url(${heroImg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    transform: `translateY(${transformValue}px) translateZ(0)`,
    willChange: "transform",
    transition: "transform 0.1s ease-out",
  };

  return (
    <div className="overflow-hidden h-96 relative">
      <img
        src={heroImg}
        alt="Hero"
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          transform: `translateY(${transformValue}px) translateZ(0)`,
          willChange: "transform",
          transition: "transform 0.1s ease-out",
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
        <h1
          className="text-3xl md:text-4xl font-bold text-white transition-opacity duration-500"
          style={{ opacity: 1 - Math.min(scrollY / 400, 1) }}
        >
          Recipe Inspiration Awaits
        </h1>
      </div>
    </div>
  );
}
