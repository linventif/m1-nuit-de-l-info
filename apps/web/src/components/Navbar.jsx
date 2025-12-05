import { A } from '@solidjs/router';

const savedTheme = localStorage.getItem("theme");

if (savedTheme) {
  // Use saved theme
  document.documentElement.dataset.theme = savedTheme;
} else {
  // Use system preference
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.dataset.theme = prefersDark ? "customdark" : "customlight";
}

function Navbar() {
  return (
<<<<<<< HEAD
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
            <A href="/login">Login</A>
          </li>
        </ul>
      </div>
=======
    <div class="navbar bg-transparent shadow-none px-4 py-2 justify-end">
        <label class="flex cursor-pointer gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
          </svg>
          <input
            type="checkbox"
            class="toggle theme-controller"
            checked={document.documentElement.dataset.theme === "customdark"}
            onClick={() => {
              const newTheme =
                document.documentElement.dataset.theme === "customdark"
                  ? "customlight"
                  : "customdark";
              document.documentElement.dataset.theme = newTheme;
              localStorage.setItem("theme", newTheme); // persist
            }}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </label>
>>>>>>> origin/main
    </div>
  );
}

export default Navbar;
