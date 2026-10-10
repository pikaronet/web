import ThemeToggle from "./ThemeToggle.js";

export default function Footer() {
    return (
        <footer className="flex justify-between w-full">
            <ThemeToggle></ThemeToggle>
            <a href="https://svpacyberia.com/" target="_blank" referrerPolicy="no-referrer">© 2023 - 2026 svpacyberia</a>
        </footer>
    );
}