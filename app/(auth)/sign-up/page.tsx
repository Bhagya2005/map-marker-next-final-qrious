"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type User = {
  id: string;
  email: string;
  password: string;
};

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleRegister = () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!isValidEmail(normalizedEmail)) {
      alert("Please enter a valid email");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    const users: User[] = JSON.parse(
      localStorage.getItem("users") || "[]"
    );

    const exists = users.find(
      (u) => u.email === normalizedEmail
    );

    if (exists) {
      alert("User already exists");
      return;
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      email: normalizedEmail,
      password,
    };

    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));

    alert("Registered successfully");
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-white p-8 rounded-xl w-96 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Register
        </h2>

        <input
          className="w-full p-2 border rounded mb-4"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-2 border rounded mb-4"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Sign Up
        </button>

          <p className="mt-4 text-center text-sm">
          Already Registerd?{" "}
          <Link
            href="/login"
            className="text-blue-600 underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
