import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
    const router = useRouter();

    const login = () => {
        router.push("/login");
    };
    const register = () => {
        router.push("/register");
    };

    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`} style={{ width: '200px', height: '100vh', backgroundColor: '#fff6f7', color: '#000' }} role="navigation" aria-label="Main Sidebar">
            <ul className="text-pink">
                <li className="items-right justify-end font-semibold">
                    <ChevronRight onClick={toggleSidebar} className="text-rose-600 hover:cursor-pointer" />
                </li>
                <li>
                    <a 
                        onClick={login} 
                        style={{ color: '#000' }} 
                        className="hover:text-rose-700 cursor-pointer"
                    >
                        Login
                    </a>
                </li>
                <li>
                    <a 
                        onClick={register} 
                        style={{ color: '#000' }} 
                        className="hover:text-rose-700 cursor-pointer"
                    >
                        Register
                    </a>
                </li>
            </ul>
        </aside>
    );
}

export default Sidebar;
