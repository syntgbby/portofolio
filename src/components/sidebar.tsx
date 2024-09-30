import { ChevronRight } from "lucide-react";

interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}
function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''} `}>
            <ul>
                <div className="grid grid-cols-2 space-between items-center justify-center">
                    <div>
                        <li><a href="/">Home</a></li>
                    </div>
                    <div className="justify-self-end mr-4 hover:cursor-pointer">
                    <ChevronRight onClick={toggleSidebar}/>
                    </div>
                </div>
                <li><a href="/about">About</a></li>
                <li><a href="/work">Work</a></li>
            </ul>
        </aside>
    );
}

export default Sidebar;