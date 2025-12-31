//what I learn ? 
//some small methods like to trim() email and converted into lowwercase
//router.push() -> for navigate user  [useRouter()]

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type User = {
  id: string;
  email: string;
  password: string;
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    const normalizedEmail = email.trim().toLowerCase();

    const users: User[] = JSON.parse(
      localStorage.getItem("users") || "[]"
    );

    const user = users.find(
      (u) =>
        u.email === normalizedEmail &&
        u.password === password
    );

    if (!user) {
      alert("Invalid credentials");
      return;
    }

    localStorage.setItem(
      "currentUser",
      JSON.stringify(user)
    );

    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-white p-8 rounded-xl w-96 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Login
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
          onClick={handleLogin}
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Login
        </button>

        <p className="mt-4 text-center text-sm">
          New user?{" "}
          <Link
            href="/sign-up"
            className="text-blue-600 underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
