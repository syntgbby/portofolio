"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DOMPurify from "dompurify"; // Import DOMPurify for sanitizing HTML

export default function AdminBlogs() {
  const router = useRouter();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    onLoadData();
  }, []);

  async function onLoadData() {
    setLoading(true);
    try {
      const res = await fetch("/api/blogs/list-blogs/blogs");
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      setData(data.data);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }

  // Function to truncate content if it exceeds 10 characters
  const truncateContent = (content) => {
    const sanitizedContent = DOMPurify.sanitize(content); // Sanitize the HTML
    return sanitizedContent.length > 250
      ? sanitizedContent.slice(0, 250) + "..."
      : sanitizedContent;
  };

  const onSeeMore = (id) => {
    // Arahkan ke halaman form untuk mengedit item berdasarkan ID
    router.push(`/blogs/${id}`);
  };

  return (
    <>
      <div className="mt-28 p-4">
        <h2 className="text-2xl font-bold mb-6 text-center pt-10 dark:text-white">
          Blogs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {loading ? (
            <p>Loading...</p>
          ) : (
            data.map((item) => (
              <div
                key={item._id}
                className="p-4 bg-white border rounded-lg shadow-md"
              >
                {/* Title centered */}
                <h3 className="text-xl font-semibold mb-5 text-center">
                  ⋆˙ {item.title}
                </h3>

                {/* Subtitle */}
                <h4 className="text-sm text-gray-500 mb-10 text-center">
                  {item.subTitle}
                </h4>

                {/* Shortened Content */}
                <div
                  className="text-sm text-gray-700 mb-4"
                  dangerouslySetInnerHTML={{
                    __html: truncateContent(item.content), // Display truncated content
                  }}
                ></div>

                {/* See More button */}
                <div className="mt-4 sticky bottom-0 bg-white p-4">
                  <div className="text-center">
                    <button
                      onClick={() => onSeeMore(item._id)}
                      className="bg-rose-500 text-white py-2 px-4 rounded-lg hover:bg-rose-300  transition-colors"
                    >
                      See More
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
