import { A } from '@solidjs/router';

function Navbar() {
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
            <A href="/chat" class="btn btn-ghost text-lg">Chat</A>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
