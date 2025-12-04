import { Route } from '@solidjs/router';
import { lazy } from 'solid-js';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Users from './pages/Users';

function Layout(props) {
  return (
    <div class="min-h-screen bg-base-200">
      <Navbar />
      <main class="container mx-auto p-4">{props.children}</main>
    </div>
  );
}

function Routes() {
  return (
    <Route path="/" component={Layout}>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/users" component={Users} />
      <Route path="/games/quizz" component={lazy(() => import('./pages/games/quizz'))} />
    </Route>
  );
}

export default Routes;
