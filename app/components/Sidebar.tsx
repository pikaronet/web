import React, { useEffect } from 'react';
import { useLocation } from 'react-router';

interface SidebarNavProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Sidebar: React.FC<SidebarNavProps> = ({ isOpen, onClose }) => {
    const location = useLocation();

    // Auto-close sidebar on route/navigation change
    useEffect(() => {
        if (isOpen) {
            onClose();
        }
    }, [location.pathname, location.search]);

    // Allow esc key to close sidebar
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    return (
        <>
            {/* Backdrop overlay */}
            {isOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 z-40"
                    aria-hidden="true"
                />
            )}

            {/* Sidenav Drawer */}
            <aside
                id="mySidenav"
                className={`fixed top-0 left-0 z-40 h-full backdrop-blur-sm border-r border-text/10 shadow-xl transition-transform duration-300 ease-in-out w-full md:w-[30vw] ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="p-6 pt-20 h-full overflow-y-auto">
                    <nav className="flex flex-col justify-around h-full text-4xl">
                        <div className="flex flex-col">
                            <a href="/" target="_blank">spotify</a>
                            <a href="/" target="_blank">bandcamp</a>
                            <a href="/" target="_blank">soundcloud</a>
                            <a href="/" target="_blank">apple music</a>
                        </div>
                        <div className="flex flex-col">
                            <a href="/" target="_blank">youtube</a>
                            <a href="/" target="_blank">instagram</a>
                        </div>
                    </nav>
                </div>
            </aside>
        </>
    );
};