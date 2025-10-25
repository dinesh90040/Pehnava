import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: "test-user-1",
    email: "test@pehenava.com",
    name: "Test User",
    emailVerified: true,
  });
  const [loading, setLoading] = useState(false);

  const signUp = async (email, password, userData = {}) => {
    // Mock signup - in a real app, this would make an API call
    return { data: { user: { email, ...userData } }, error: null };
  };

  const signIn = async (email, password) => {
    // Mock signin - in a real app, this would make an API call
    setUser({
      id: "test-user-1",
      email: email,
      name: "Test User",
      emailVerified: true,
    });
    return { data: { user: { email } }, error: null };
  };

  const signOut = async () => {
    // Mock signout - in a real app, this would make an API call
    setUser(null);
    return { error: null };
  };

  const resetPassword = async (email) => {
    // Mock reset password - in a real app, this would make an API call
    return { data: { message: "Password reset email sent" }, error: null };
  };

  const updateProfile = async (updates) => {
    // Mock update profile - in a real app, this would make an API call
    setUser((prev) => ({ ...prev, ...updates }));
    return { data: user, error: null };
  };

  const value = {
    user,
    profile: user,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
