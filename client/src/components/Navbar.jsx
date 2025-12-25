import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Update user state on location change to catch login/logout events
    useEffect(() => {
        const token = localStorage.getItem("token");
        const name = localStorage.getItem("name");
        if (token && name) {
            setUser({ name });
        } else {
            setUser(null);
        }
        setIsMenuOpen(false); // Close menu on route change
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("name");
        setUser(null);
        navigate("/");
    };

    // Make navbar transparent on Login, Register, Characters pages
    // We can basically say it's transparent on all these main pages
    const isTransparentPage = ["/", "/register", "/characters"].includes(location.pathname);

    return (
        <nav className={`${isTransparentPage ? 'absolute w-full bg-transparent border-transparent' : 'bg-netflix-black/90 backdrop-blur-md border-b border-white/5 sticky top-0 shadow-lg shadow-black/40'} z-50 transition-all duration-300`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    {/* Logo */}
                    <Link to={user ? "/characters" : "/"} className="text-3xl font-stranger font-black text-netflix-red tracking-wide hover:text-red-600 transition-colors flex-shrink-0 text-glow drop-shadow-glow">
                        HAWKINS<span className="text-white">VERSE</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6">
                        {user ? (
                            <>
                                <span className="text-gray-400 font-medium">
                                    Welcome, <span className="text-white">{user.name}</span>
                                </span>
                                <Link
                                    to="/characters"
                                    className="text-gray-400 hover:text-white font-medium transition-colors"
                                >
                                    Characters
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 border border-red-600/20 hover:border-red-600"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link
                                    to="/"
                                    className="text-gray-400 hover:text-white font-medium transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-400 hover:text-white p-2 focus:outline-none"
                        >
                            <span className="sr-only">Open main menu</span>
                            {!isMenuOpen ? (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            ) : (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-netflix-black border-t border-white/5">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {user ? (
                            <>
                                <div className="block px-3 py-2 text-base font-medium text-gray-400">
                                    Welcome, <span className="text-white">{user.name}</span>
                                </div>
                                <Link
                                    to="/characters"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                                >
                                    Characters
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-500 hover:text-white hover:bg-red-600/20 transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-red-500 hover:text-white hover:bg-red-600/20 transition-colors"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
