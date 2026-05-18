// Simple Auth Library for VisionAI Studio
// In a real app, use NextAuth.js or a real database

export const verifyUser = async (email, password) => {
  // Mock verification - in reality, check DB hash
  if (email === "rathin@visionai.com" && password === "admin123") {
    return {
      id: "1",
      name: "Rathin",
      email: "rathin@visionai.com",
      role: "Pro User"
    };
  }
  return null;
};

export const createSession = (user) => {
  // Simulate JWT creation
  return btoa(JSON.stringify(user));
};

export const getSession = (token) => {
  try {
    return JSON.parse(atob(token));
  } catch {
    return null;
  }
};
