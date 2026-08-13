import { Link, useLocation } from "react-router";

interface HeaderProps {
    isOpen: boolean;
    onToggle: () => void;
}

export default function Header({ isOpen, onToggle }: HeaderProps) {
    const location = useLocation();

    // Check if current route is discography
    const isDiscography = location.pathname.startsWith("/discography");

    // Dynamic destination path and display text
    const navTo = isDiscography ? "/" : "/discography";
    const navText = isDiscography ? "home" : "discography";

    return (
        <header className="float-right sticky top-0 p-4 z-50">
            <nav>
                <ul className="gap-6 text-right">
                    <li>
                        <button
                            type="button"
                            onClick={onToggle}
                            className="cursor-pointer text-text hover:text-amber-300 transition-colors"
                        >
                            {isOpen ? "close" : "menu"}
                        </button>
                    </li>
                    <li>
                        <Link
                            to={navTo}
                            className="cursor-pointer text-text hover:text-amber-300 transition-colors"
                        >
                            {navText}
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}