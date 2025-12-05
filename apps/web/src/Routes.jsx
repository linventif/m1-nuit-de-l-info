import { Route } from '@solidjs/router';
import Navbar from './components/Navbar';
import ChatWidget from './components/ChatWidget';
import Home from './pages/Home';
import About from './pages/About';
import Users from './pages/Users';
import Login from './pages/Login';
import LaserGame from './pages/LaserGame';


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
      <Route path="/login" component={Login} />
      <Route path="/laser-game" component={LaserGame} />

    </Route>
  );
}

export default Routes;
