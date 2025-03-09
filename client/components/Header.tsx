"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
function Header() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="bg-gradient-to-r from-[#2C3E50] to-[#34495E] text-white p-4 shadow-md sticky top-0 z-50">
      <nav className="container mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-bold hover:text-[#E74C3C] transition-colors"
        >
          EstatePro
        </Link>
        <div className="flex items-center space-x-6">
          <Link href="/" className="hover:text-[#E74C3C] transition-colors">
            Home
          </Link>
          <Link
            href="/search"
            className="hover:text-[#E74C3C] transition-colors"
          >
            Search
          </Link>
          {isAuthenticated && user ? (
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Avatar>
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-[#E74C3C]">
                    {user?.firstName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <Button
                variant="default"
                className="text-white bg-[#E74C3C] hover:bg-white hover:text-[#E74C3C]"
                onClick={logout}
              >
                Logout
              </Button>
            </div>
          ) : (
            <>
              <Link href="/auth">
                <Button
                  variant="ghost"
                  className="text-white hover:text-[#E74C3C]"
                >
                  Login
                </Button>
              </Link>
              <Link href="/auth">
                <Button className="bg-[#E74C3C] hover:bg-[#C0392B] text-white">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
