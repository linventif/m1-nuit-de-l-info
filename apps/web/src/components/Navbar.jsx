import { A } from '@solidjs/router';
import { createSignal, createEffect } from "solid-js";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = createSignal(false);

  createEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  });

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      localStorage.removeItem("token");
      setIsLoggedIn(false);
    } catch (err) {
      console.error("Error al hacer logout:", err);
    }
  };

  return (
    <div class="navbar bg-base-100 shadow-lg">
      <div class="flex-1">
        <A href="/" class="btn btn-ghost text-xl">
          Nuit de l'Info M1
        </A>
      </div>
      <div class="flex-none">
        <ul class="menu menu-horizontal px-1">
          <li>
            <A href="/">Home</A>
          </li>
          <li>
            <A href="/about">About</A>
          </li>
          <li>
            <A href="/users">Users</A>
          </li>
          <li>
            {isLoggedIn() ? (
              <button onClick={handleLogout} class="btn btn-ghost">
                Logout
              </button>
            ) : (
              <A href="/login">Login</A>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
