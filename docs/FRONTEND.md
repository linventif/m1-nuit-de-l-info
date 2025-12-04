# Frontend Structure Documentation

## 📁 Project Structure

```
apps/web/
├── index.html              # HTML entry point
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── package.json           # Dependencies
└── src/
    ├── index.jsx          # Application entry point
    ├── index.css          # Global styles
    ├── App.jsx            # Root component with routing
    ├── components/        # Reusable components
    │   └── Navbar.jsx
    └── pages/             # Page components
        ├── Home.jsx
        ├── About.jsx
        └── Users.jsx
```

## 🎨 Tech Stack

### SolidJS

- **Version**: ^1.9.3
- **Why**: Reactive UI framework with fine-grained reactivity
- **Features**:
  - No Virtual DOM
  - True reactivity
  - Smaller bundle size
  - JSX syntax

### Tailwind CSS v4

- **Version**: ^4.0.0
- **Why**: Utility-first CSS framework
- **Features**:
  - Rapid development
  - Small production bundle
  - Customizable design system

### DaisyUI v5

- **Version**: ^5.0.0
- **Why**: Component library for Tailwind
- **Features**:
  - Pre-built components
  - Multiple themes
  - Accessible components

### Vite

- **Version**: ^5.4.11
- **Why**: Fast build tool
- **Features**:
  - Lightning-fast HMR
  - Optimized builds
  - Plugin ecosystem

## 🧩 Component Structure

### Creating a Component

```jsx
// src/components/Button.jsx
function Button(props) {
  return (
    <button class={`btn ${props.variant || 'btn-primary'}`} onClick={props.onClick}>
      {props.children}
    </button>
  );
}

export default Button;
```

### Using the Component

```jsx
import Button from '../components/Button';

function MyPage() {
  const handleClick = () => {
    console.log('Clicked!');
  };

  return (
    <Button variant="btn-secondary" onClick={handleClick}>
      Click Me
    </Button>
  );
}
```

## 🔄 State Management

### Using Signals (SolidJS)

```jsx
import { createSignal } from 'solid-js';

function Counter() {
  const [count, setCount] = createSignal(0);

  return (
    <div>
      <p>Count: {count()}</p>
      <button onClick={() => setCount(count() + 1)}>
        Increment
      </button>
    </div>
  );
}
```

### Derived State

```jsx
import { createSignal, createMemo } from 'solid-js';

function UserProfile() {
  const [firstName, setFirstName] = createSignal('John');
  const [lastName, setLastName] = createSignal('Doe');

  // Derived/computed value
  const fullName = createMemo(() => `${firstName()} ${lastName()}`);

  return <h1>{fullName()}</h1>;
}
```

### Effects

```jsx
import { createSignal, createEffect } from 'solid-js';

function DataFetcher() {
  const [data, setData] = createSignal(null);

  createEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(setData);
  });

  return <div>{JSON.stringify(data())}</div>;
}
```

## 🛣️ Routing

### Router Setup

```jsx
// src/App.jsx
import { Router, Route, Routes } from '@solidjs/router';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/users/:id" component={UserDetail} />
      </Routes>
    </Router>
  );
}
```

### Navigation

```jsx
import { A, useNavigate } from '@solidjs/router';

function Navigation() {
  const navigate = useNavigate();

  const goToAbout = () => {
    navigate('/about');
  };

  return (
    <nav>
      {/* Declarative navigation */}
      <A href="/">Home</A>
      <A href="/about">About</A>

      {/* Programmatic navigation */}
      <button onClick={goToAbout}>Go to About</button>
    </nav>
  );
}
```

### Route Parameters

```jsx
import { useParams } from '@solidjs/router';

function UserDetail() {
  const params = useParams();

  return <h1>User ID: {params.id}</h1>;
}
```

## 🎨 Styling

### Tailwind Classes

```jsx
function Card() {
  return (
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">Card Title</h2>
        <p>Card content goes here</p>
        <div class="card-actions justify-end">
          <button class="btn btn-primary">Action</button>
        </div>
      </div>
    </div>
  );
}
```

### DaisyUI Components

```jsx
function UIComponents() {
  return (
    <div>
      {/* Button */}
      <button class="btn btn-primary">Primary</button>

      {/* Alert */}
      <div class="alert alert-success">Success message!</div>

      {/* Badge */}
      <span class="badge badge-secondary">Badge</span>

      {/* Loading */}
      <span class="loading loading-spinner loading-lg"></span>

      {/* Modal */}
      <dialog class="modal">
        <div class="modal-box">
          <h3>Modal Title</h3>
          <p>Modal content</p>
        </div>
      </dialog>
    </div>
  );
}
```

### Custom Styles

```css
/* src/index.css */
@import 'tailwindcss/theme' layer(theme);
@import 'tailwindcss/preflight' layer(base);
@import 'tailwindcss/utilities' layer(utilities);

/* Custom utilities */
@layer utilities {
  .text-gradient {
    @apply bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent;
  }
}
```

## 🌐 API Integration

### Fetching Data

```jsx
import { createSignal, onMount } from 'solid-js';

function UsersList() {
  const [users, setUsers] = createSignal([]);
  const [loading, setLoading] = createSignal(true);

  onMount(async () => {
    try {
      const response = await fetch('http://localhost:3001/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  });

  return (
    <div>
      {loading() ? (
        <span class="loading loading-spinner"></span>
      ) : (
        <ul>
          <For each={users()}>
            {(user) => <li>{user.name}</li>}
          </For>
        </ul>
      )}
    </div>
  );
}
```

### Creating Resource

```jsx
import { createResource } from 'solid-js';

function DataComponent() {
  const fetchUsers = async () => {
    const res = await fetch('http://localhost:3001/api/users');
    return res.json();
  };

  const [users] = createResource(fetchUsers);

  return (
    <div>
      {users.loading && <p>Loading...</p>}
      {users.error && <p>Error: {users.error.message}</p>}
      {users() && (
        <ul>
          <For each={users()}>
            {(user) => <li>{user.name}</li>}
          </For>
        </ul>
      )}
    </div>
  );
}
```

### Posting Data

```jsx
async function createUser(userData) {
  const response = await fetch('http://localhost:3001/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error('Failed to create user');
  }

  return response.json();
}

function CreateUserForm() {
  const [name, setName] = createSignal('');
  const [email, setEmail] = createSignal('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUser({ name: name(), email: email() });
      // Reset form
      setName('');
      setEmail('');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name()}
        onInput={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        type="email"
        value={email()}
        onInput={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <button type="submit">Create User</button>
    </form>
  );
}
```

## 📝 Control Flow

### Show Component

```jsx
import { Show } from 'solid-js';

function Conditional() {
  const [loggedIn, setLoggedIn] = createSignal(false);

  return (
    <Show
      when={loggedIn()}
      fallback={<button onClick={() => setLoggedIn(true)}>Log In</button>}
    >
      <button onClick={() => setLoggedIn(false)}>Log Out</button>
    </Show>
  );
}
```

### For Component

```jsx
import { For } from 'solid-js';

function List() {
  const [items, setItems] = createSignal(['Apple', 'Banana', 'Orange']);

  return (
    <ul>
      <For each={items()}>
        {(item, index) => (
          <li>
            {index() + 1}. {item}
          </li>
        )}
      </For>
    </ul>
  );
}
```

### Switch Component

```jsx
import { Switch, Match } from 'solid-js';

function StatusDisplay() {
  const [status, setStatus] = createSignal('loading');

  return (
    <Switch>
      <Match when={status() === 'loading'}>
        <span class="loading loading-spinner"></span>
      </Match>
      <Match when={status() === 'success'}>
        <div class="alert alert-success">Success!</div>
      </Match>
      <Match when={status() === 'error'}>
        <div class="alert alert-error">Error occurred</div>
      </Match>
    </Switch>
  );
}
```

## 🎯 Best Practices

### 1. Component Organization

```
components/
├── common/           # Shared components
│   ├── Button.jsx
│   ├── Input.jsx
│   └── Card.jsx
├── layout/          # Layout components
│   ├── Header.jsx
│   ├── Footer.jsx
│   └── Sidebar.jsx
└── features/        # Feature-specific components
    └── user/
        ├── UserCard.jsx
        └── UserForm.jsx
```

### 2. Props Destructuring

```jsx
// ✅ Good
function Button({ variant = 'primary', onClick, children }) {
  return <button class={`btn btn-${variant}`} onClick={onClick}>{children}</button>;
}

// ❌ Avoid
function Button(props) {
  return <button class={`btn btn-${props.variant}`} onClick={props.onClick}>{props.children}</button>;
}
```

### 3. Memoization

```jsx
// Use createMemo for expensive computations
const expensiveValue = createMemo(() => {
  return items().filter(item => item.active).map(item => item.value);
});
```

### 4. Error Boundaries

```jsx
import { ErrorBoundary } from 'solid-js';

function App() {
  return (
    <ErrorBoundary fallback={(err) => <div>Error: {err.message}</div>}>
      <MyComponent />
    </ErrorBoundary>
  );
}
```

## 📦 Adding New Pages

1. **Create page component** in `src/pages/`:

```jsx
// src/pages/NewPage.jsx
function NewPage() {
  return (
    <div>
      <h1>New Page</h1>
    </div>
  );
}

export default NewPage;
```

2. **Add route** in `src/App.jsx`:

```jsx
import NewPage from './pages/NewPage';

<Route path="/new-page" component={NewPage} />
```

3. **Add navigation** in `src/components/Navbar.jsx`:

```jsx
<li>
  <A href="/new-page">New Page</A>
</li>
```

## 🔗 Resources

- [SolidJS Documentation](https://www.solidjs.com/docs/latest)
- [SolidJS Tutorial](https://www.solidjs.com/tutorial/introduction_basics)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [DaisyUI Documentation](https://daisyui.com/)
- [Vite Documentation](https://vitejs.dev/)
- [@solidjs/router Documentation](https://github.com/solidjs/solid-router)

## 📚 Next Steps

- Return to [main README](../README.md)
- See [Contributing Guidelines](./CONTRIBUTING.md)
- Check [API Documentation](../apps/api/API.md)
