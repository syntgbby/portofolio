"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminBlogs() {
  const router = useRouter();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Function to fetch blogs based on search query
  const fetchBlogs = async (query = "") => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/blogs/list-view/search?search=${encodeURIComponent(query)}`
      );
      if (!res.ok) throw new Error("Failed to fetch blogs");
      const fetchedData = await res.json();
      setBlogs(fetchedData.data || []);
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  // Function to load all data initially
  const onLoadData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/blogs/list-view/blogs"); // Request for all blogs when no search query is provided
      if (!res.ok) throw new Error("Failed to fetch data");
      const fetchedData = await res.json();
      setData(fetchedData.data);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search input to avoid frequent API calls
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchBlogs(searchQuery);
    }, 300); // 300ms delay

    return () => clearTimeout(delayDebounce); // Cleanup on unmount or query change
  }, [searchQuery]);

  // Load all blogs on component mount
  useEffect(() => {
    onLoadData();
  }, []);

  return (
    <div className="mt-28 p-4">
      <h2 className="text-2xl font-bold mb-6 text-center pt-10 dark:text-white">
        Blogs
      </h2>

      <form className="mb-6 text-right dark:text-white">
        <input
          type="text"
          placeholder="Search by title or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded w-full sm:w-80 mx-auto"
        />
      </form>

      {loading ? (
        <div className="flex justify-center items-center">
          <div
            className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-t-4 border-rose-500 rounded-full"
            role="status"
          >
            <span className="visually-hidden"></span>
          </div>
        </div>
      ) : (
        <>
          {blogs.length > 0 || data.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              {(blogs.length > 0 ? blogs : data).map((item) => (
                <div
                  key={item._id}
                  className="p-4 bg-white border rounded-lg shadow-md flex flex-col"
                >
                  {/* Category */}
                  <div className="text-center mb-4">
                    <span className="bg-rose-100 text-rose-500 text-xs font-semibold py-1 px-3 rounded-full">
                      {item.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold mb-5 text-center">
                    ⋆˙ {item.title}
                  </h3>

                  {/* Sub Title */}
                  <h4 className="text-sm text-gray-500 mb-10 text-center">
                    {item.subTitle}
                  </h4>

                  {/* Content */}
                  <div
                    className="text-sm text-gray-700 mb-4"
                    dangerouslySetInnerHTML={{
                      __html: item.content.slice(0, 250) + "...",
                    }}
                  ></div>

                  {/* See More Button */}
                  <div className="mt-4 text-center">
                    <button
                      onClick={() =>
                        router.push(`/admin/blogs/view/${item._id}`)
                      }
                      className="bg-rose-500 text-white py-2 px-4 rounded-lg hover:bg-rose-300 transition-colors"
                    >
                      See More
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center">No blogs found</p>
          )}
        </>
      )}
    </div>
  );
}
