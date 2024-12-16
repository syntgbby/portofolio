"use client"
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function Navbar() {
    const router = useRouter();
    // const [isBlogsDropdownOpen, setIsBlogsDropdownOpen] = useState(false); // State to control the dropdown visibility
    // const [isMessageDropdownOpen, setIsMessageDropdownOpen] = useState(false); // State to control the dropdown visibility  
    // const path = usePathname();


    // const links = [
    //   {
    //     path: "#", // Placeholder for Blogs
    //     text: "Message",
    //     onMouseEnter: () => setIsMessageDropdownOpen(true), // Open dropdown on hover
    //     onMouseLeave: () => setIsMessageDropdownOpen(false), // Close dropdown when mouse leaves
    //   },
    //   {
    //     path: "/admin-page/work",
    //     text: "Work",
    //   },
    //   {
    //     path: "#", // Placeholder for Blogs
    //     text: "Blogs",
    //     onMouseEnter: () => setIsBlogsDropdownOpen(true), // Open dropdown on hover
    //     onMouseLeave: () => setIsBlogsDropdownOpen(false), // Close dropdown when mouse leaves
    //   },
    //   {
    //     path: "#", // Placeholder path for logout
    //     text: "Log Out",
    //     onClick: onLogOut, // Assign the logout function
    //   },
    // ];
  
    return (
          <nav className="w-full bg-black">
            <div className="max-w-5xl mx-auto px-6 md:px-12 xl:px-6">
              <div className="flex flex-wrap items-center justify-between">
                <div>
                  <a href="/admin">Admin Panel</a>
                </div>
                <div>
                  <ul className="flex flex-row gap-6">
                  <li className="mt-1">
                      <a className="btn-link" href="/login">Login</a>
                    </li>
                    <li className="mt-1">
                      <a className="btn-link" href="/blogs">Blogs</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </nav>
    )
}