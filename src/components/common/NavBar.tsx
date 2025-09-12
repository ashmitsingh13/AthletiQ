"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ModeToggle";
import { Menu, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [profileImage, setProfileImage] = useState<string | null>(
    "/defaultImg.png"
  );
  const [displayName, setDisplayName] = useState<string>("User");
  const router = useRouter();

  // Fetch profile image when authenticated
  useEffect(() => {
    let mounted = true;
    async function loadProfile() {
      if (!isAuthenticated || !user) {
        setProfileImage("/defaultImg.png");
        setDisplayName("User");
        return;
      }
      try {
        const res = await fetch(`/api/profile/${user._id}`, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) {
          // fallback to context name
          setProfileImage("/defaultImg.png");
          setDisplayName(user.name || "User");
          return;
        }
        const data = await res.json();
        const prof = data.profile;
        const usr = data.user;
        if (!mounted) return;
        setProfileImage(
          prof?.profileImage || usr?.avatarUrl || "/defaultImg.png"
        );
        setDisplayName(prof?.name || usr?.name || user.name || "User");
      } catch (err) {
        console.error("Failed to load profile:", err);
        setProfileImage("/defaultImg.png");
        setDisplayName(user?.name || "User");
      }
    }
    loadProfile();
    return () => {
      mounted = false;
    };
  }, [isAuthenticated, user]);

  const handleLogout = async () => {
    try {
      await logout(); // context handles redirect to login
      router.replace("/auth/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <header className="w-full border-b border-border bg-background backdrop-blur-md  top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" >
          <span className="flex items-center  gap-2">
            <img className="h-14 w-14 object-contain" src="/logo.png" alt="AthletiQ" />
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 text-lg font-medium">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <Link
            href="/about"
            className="hover:text-primary text-lg"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <Link
            href="/contact"
            className="hover:text-primary text-lg"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>
          {/* == Conditional links for authenticated users == */}
          {isAuthenticated && (
            <>
              <Link
                href="/annexure-a"
                className="hover:text-primary transition-colors"
              >
                Tests
              </Link>
              <Link
                href="/features"
                className="hover:text-primary transition-colors"
              >
                Features
              </Link>
              <Link
                href="/leaderboard"
                className="hover:text-primary transition-colors"
              >
                Leaderboard
              </Link>
              <Link href="/trainer" className="hover:text-primary text-lg">
                Trainer
              </Link>
            </>
          )}
          <Link
            href="/ai-coach"
            className="hover:text-primary transition-colors"
          >
            AI-coach
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
          ) : isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src={profileImage || "/defaultImg.png"}
                    alt={displayName || "User"}
                  />
                  <AvatarFallback>
                    {(displayName || user?.name || "U").charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 mr-4">
                <DropdownMenuItem asChild>
                  <Link href={`/profile/${user._id}`}>Profile</Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 cursor-pointer"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button asChild className="rounded-xl hidden md:inline-flex">
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild className="rounded-xl hidden md:inline-flex">
                <Link href="/auth/signup">Sign up</Link>
              </Button>
            </>
          )}

          <ModeToggle />

          <button
            className="md:hidden p-2 rounded-lg hover:bg-accent"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-sm transition-all duration-300">
          <div className="flex flex-col items-center gap-4 py-6">
            <Link
              href="/"
              className="hover:text-primary text-lg"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>

            <Link
              href="/ai-coach"
              className="hover:text-primary text-lg"
              onClick={() => setIsOpen(false)}
            >
              AI-coach
            </Link>
            {/* == Conditional links for authenticated users (Mobile) == */}
            {isAuthenticated && (
              <>
                <Link
                  href="/annexure-a"
                  className="hover:text-primary text-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Tests
                </Link>
                <Link
                  href="/features"
                  className="hover:text-primary text-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Features
                </Link>
                <Link
                  href="/leaderboard"
                  className="hover:text-primary text-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Leaderboard
                </Link>
                <Link
                  href="/trainer"
                  className="hover:text-primary text-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Trainer
                </Link>
                <Link
                  href="/achievements"
                  className="hover:text-primary text-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Workout
                </Link>
              </>
            )}
            <Link
              href="/about"
              className="hover:text-primary text-lg"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="hover:text-primary text-lg"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>

            {loading ? null : isAuthenticated && user ? (
              <>
                <Button
                  className="rounded-xl w-[150px]"
                  onClick={() => {
                    setIsOpen(false);
                    router.push(`/profile/${user._id}`);
                  }}
                >
                  My Profile
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl w-[150px]"
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                asChild
                className="rounded-xl w-[150px]"
                onClick={() => setIsOpen(false)}
              >
                <Link href="/auth/login">Get Started</Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
