// Home.js
import Image from "next/image";
import Link from "next/link"; // Import Link for navigation
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="py-10">
      <div className="max-w-6xl mx-auto px-4 md:px-12 xl:px-4 pt-40">
        <div className="flex flex-col md:flex-row items-center justify-center">
          {/* Text Section */}
          <div className="md:w-1/2 flex flex-col justify-center items-center gap-4">
            <h1 className="text-4xl font-serif text-black dark:text-white">
              Hi, My name is Gebby Syntia
            </h1>
            <h1 className="text-4xl font-serif text-black dark:text-white mt-4">
              This is <span className="text-red-700 mb-4">My Portofolio</span>
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
