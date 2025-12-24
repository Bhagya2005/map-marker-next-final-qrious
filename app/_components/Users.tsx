"use client";

import useFetch from "../_hooks/useFetch";

type User = {
  id: number;
  name: string;
  email: string;
  phone?:number;
};

export default function Users() {
  const { data, loading, error } = useFetch<User[]>(
    "https://jsonplaceholder.typicode.com/users"
  );
  
  if (loading) {
    return <p>Loading users...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <h2>User List</h2>
      {data && data.length > 0 ? (
        <ul>
          {data.map((user) => (
            <li key={user.id}>
              <strong>{user.name}</strong> — {user.email}
            </li>
          ))}
        </ul>
      ) : (
        <p>No users found</p>
      )}
    </div>
  );
}


