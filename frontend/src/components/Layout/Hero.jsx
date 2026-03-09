import React from "react";
import heroImg from "../../assets/ziarra-hero.webp";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative">
      <img
        src={heroImg}
        alt="ziarra"
        className="w-full h-[400px] md:h-[600px] lg:h-[750px] object-cover"
      />
      <div className="absolute  inset-0 bg-black flex bg-opacity-5 items-center justify-center">
        <div className="text-white text-center">
          <Link to="#" className="bg-black text-lg tracking-tighter px-6 py-4">
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
