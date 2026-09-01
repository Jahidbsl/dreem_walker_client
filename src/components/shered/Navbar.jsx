"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Home,
  ShoppingBag,
  ShoppingCart,
  Package,
  User,
  Menu,
  X,
  LogOut,
  LogIn,
  UserPlus,
} from "lucide-react";
import ThemeToggle from "../ThemeToggle";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/products", label: "Products", icon: ShoppingBag },
  { href: "/cart", label: "Cart", icon: ShoppingCart, showCount: true },
  { href: "/orders", label: "Orders", icon: Package },
  { href: "/profile", label: "Profile", icon: User },
];

export default function Navbar() {
  const { cartCount } = useCart();

  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkRefs = useRef({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setAuthChecked(true);
    }
  }, []);

  // Check on mount + whenever route changes (covers login -> router.push('/'))
  useEffect(() => {
    checkAuth();
  }, [pathname, checkAuth]);

  // Listen for an explicit "auth:changed" event so login/register/logout
  // can trigger an instant navbar update without waiting for navigation
  useEffect(() => {
    window.addEventListener("auth:changed", checkAuth);
    return () => window.removeEventListener("auth:changed", checkAuth);
  }, [checkAuth]);

  // Move underline to active link
  useEffect(() => {
    const activeEl = linkRefs.current[pathname] || linkRefs.current["/"];
    if (activeEl) {
      setIndicator({
        left: activeEl.offsetLeft,
        width: activeEl.offsetWidth,
        opacity: 1,
      });
    }
  }, [pathname, authChecked]);

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // logout ignore network error, still clear client state
    } finally {
      setUser(null);
      setMobileOpen(false);
      window.dispatchEvent(new Event("auth:changed"));
      router.push("/login");
    }
  };

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 bg-[var(--surface-alt)]/90 backdrop-blur border-b border-[var(--border-color)]">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-lg font-[family-name:var(--font-display)] font-semibold text-[var(--ink)] shrink-0"
        >
          dreem<span className="text-[var(--accent)]">.</span>walker
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex relative items-center gap-1">
          {navLinks.map(({ href, label, icon: Icon, showCount }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                ref={(el) => {
                  linkRefs.current[href] = el;
                }}
                className={`relative flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-md transition-colors ${
                  active
                    ? "text-[var(--ink)]"
                    : "text-[var(--muted)] hover:text-[var(--ink)]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
                {showCount && (
                  <span
                    className={`ml-0.5 text-xs rounded-full px-1.5 py-0.5 ${
                      cartCount > 0
                        ? "bg-[var(--accent)] text-white"
                        : "bg-[var(--border-color)] text-[var(--muted)]"
                    }`}
                  >
                    {cartCount}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Sliding underline indicator */}
          <span
            className="absolute -bottom-[1px] h-[2px] bg-[var(--accent)] rounded-full transition-all duration-300 ease-out"
            style={{
              left: indicator.left,
              width: indicator.width,
              opacity: indicator.opacity,
            }}
          />
        </div>

        {/* Right side: theme toggle + auth */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          {authChecked &&
            (user ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm font-medium text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 text-sm font-medium text-[var(--muted)] hover:text-[var(--ink)] transition-colors px-3 py-1.5"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-1.5 text-sm font-medium bg-[var(--ink)] text-[var(--surface-alt)] px-3.5 py-1.5 rounded-md hover:opacity-85 transition-opacity"
                >
                  <UserPlus className="w-4 h-4" />
                  Register
                </Link>
              </div>
            ))}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden text-[var(--ink)]"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--border-color)] bg-[var(--surface-alt)] px-4 py-4 space-y-1">
          {navLinks.map(({ href, label, icon: Icon, showCount }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  active
                    ? "bg-[var(--accent-soft)] text-[var(--ink)] border-l-2 border-[var(--accent)]"
                    : "text-[var(--muted)] hover:text-[var(--ink)]"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  {label}
                </span>
                {showCount && (
                  <span
                    className={`text-xs rounded-full px-1.5 py-0.5 ${
                      cartCount > 0
                        ? "bg-[var(--accent)] text-white"
                        : "bg-[var(--border-color)] text-[var(--muted)]"
                    }`}
                  >
                    {cartCount}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-3 mt-3 border-t border-[var(--border-color)] flex items-center justify-between">
            <ThemeToggle />
            {authChecked &&
              (user ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm font-medium text-[var(--muted)]"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-medium text-[var(--muted)]"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-medium bg-[var(--ink)] text-[var(--surface-alt)] px-3 py-1.5 rounded-md"
                  >
                    Register
                  </Link>
                </div>
              ))}
          </div>
        </div>
      )}
    </header>
  );
}
