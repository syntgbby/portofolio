// Home.js
import Image from "next/image";
import Link from "next/link"; // Import Link for navigation

export default function Home() {
  return (
    <div className="bg-red-300 py-10">
      <div className="max-w-6xl mx-auto px-4 md:px-12 xl:px-4">
        <div className="flex flex-col md:flex-row items-center justify-center">
          {/* Logo Section */}
          <div className="md:w-1/2 flex justify-end items-center mr-8">
            <Image 
              src="/programming_girl.jpeg" 
              alt="Programming Girl" 
              width={300} 
              height={300} 
              className="rounded-lg"
            />
          </div>
          {/* Text Section */}
          <div className="md:w-1/2 flex flex-col justify-center items-start gap-4">
            <h1 className="text-4xl font-serif text-red-700 ">Hi,</h1>
            <h1 className="text-3xl font-serif text-white">
              This is <br/> <span className="text-red-700">Gebby Syntia&apos;s</span> Portfolio
            </h1>
            {/* Button to About Me */}
            <Link href="/about">
              <button className="mt-3 px-6 py-1 bg-rose-700 text-white rounded hover:bg-rose-800 transition duration-300 min-w-50">
                About Me
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}