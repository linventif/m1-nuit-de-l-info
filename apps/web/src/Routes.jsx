import { Route } from '@solidjs/router';
import { lazy } from 'solid-js';
import Navbar from './components/Navbar';
import ChatWidget from './components/ChatWidget';
import Home from './pages/Home';
import About from './pages/About';
import Users from './pages/Users';
import Login from './pages/Login'
import Register from './pages/Register';
import LaserGame from './pages/LaserGame';
import SnakeApp from './pages/SnakeApp';
import Profile from './pages/Profile';


function Layout(props) {
  return (
    <div class="min-h-screen bg-base-200">
      <Navbar />
      <main class="container mx-auto p-4">{props.children}</main>
      <ChatWidget />
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
      <Route path="/login" component={Login} />
      <Route path="/profile" component={Profile} />

      <Route path="/register" component={Register} />

      <Route path="/laser-game" component={LaserGame} />
      <Route path="/games/snake" component={SnakeApp} />
    </Route>
  );
}

export default Routes;
