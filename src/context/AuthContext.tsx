
import React, { createContext, useState, useContext, ReactNode } from "react";
import { User, AuthContextType } from "@/types";
import { toast } from "sonner";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const isAuthenticated = !!user;

  const login = async (email: string, password: string) => {
    try {
      // In a real app, this would be an API call
      if (email === "demo@example.com" && password === "password") {
        const user = {
          id: "1",
          name: "Demo User",
          email: "demo@example.com"
        };
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        toast.success("Logged in successfully!");
        return;
      }
      
      const registeredUsers = localStorage.getItem("registeredUsers");
      if (registeredUsers) {
        const users = JSON.parse(registeredUsers);
        const foundUser = users.find((u: any) => u.email === email && u.password === password);
        if (foundUser) {
          const loggedInUser = {
            id: foundUser.id,
            name: foundUser.name,
            email: foundUser.email
          };
          setUser(loggedInUser);
          localStorage.setItem("user", JSON.stringify(loggedInUser));
          toast.success("Logged in successfully!");
          return;
        }
      }
      
      throw new Error("Invalid credentials");
    } catch (error) {
      toast.error("Login failed: " + (error instanceof Error ? error.message : "Unknown error"));
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      // In a real app, this would be an API call
      const registeredUsers = localStorage.getItem("registeredUsers");
      let users = registeredUsers ? JSON.parse(registeredUsers) : [];
      
      if (users.some((user: any) => user.email === email)) {
        throw new Error("Email already in use");
      }
      
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password
      };
      
      users.push(newUser);
      localStorage.setItem("registeredUsers", JSON.stringify(users));
      
      const loggedInUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      };
      
      setUser(loggedInUser);
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      toast.success("Registered successfully!");
    } catch (error) {
      toast.error("Registration failed: " + (error instanceof Error ? error.message : "Unknown error"));
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.info("Logged out");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
