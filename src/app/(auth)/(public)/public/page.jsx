// Home.js
import Image from "next/image";

export default function AdminPage() {
  return (
    <div className="py-10">
      <div className="max-w-6xl mx-auto px-4 md:px-12 xl:px-4 pt-20">
        <div className="flex flex-col md:flex-row items-center justify-center">
          {/* Logo Section */}
          <div className="md:w-1/2 flex justify-end items-center mr-3">
            <Image
              src="/admin.png"
              alt="Admin"
              width={400}
              height={400}
              className="rounded-lg"
            />
          </div>
          {/* Text Section */}
          <div className="md:w-1/2 flex flex-col justify-center items-start gap-4">
            <h1 className="text-4xl font-serif text-black dark:text-white mt-4">
              This is <span className="text-red-700 mb-4">Member Page</span>
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
