import { createSignal, onMount, For } from 'solid-js';

function Users() {
  const [users, setUsers] = createSignal([]);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  onMount(() => {
    fetchUsers();
  });

  return (
    <div>
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">Users</h1>
        <button class="btn btn-primary" onClick={fetchUsers}>
          Refresh
        </button>
      </div>

      {loading() && (
        <div class="flex justify-center">
          <span class="loading loading-spinner loading-lg"></span>
        </div>
      )}

      {error() && (
        <div class="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Error: {error()}</span>
        </div>
      )}

      {!loading() && !error() && (
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <For each={users()}>
            {(user) => (
              <div class="card bg-base-100 shadow-xl">
                <div class="card-body">
                  <h2 class="card-title">{user.name}</h2>
                  <p>Email: {user.email}</p>
                  <div class="badge badge-secondary">{user.role}</div>
                </div>
              </div>
            )}
          </For>
        </div>
      )}

      {!loading() && !error() && users().length === 0 && (
        <div class="alert alert-warning">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>No users found. Make sure the API is running!</span>
        </div>
      )}
    </div>
  );
}

export default Users;
