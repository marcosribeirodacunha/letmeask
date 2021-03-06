import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { AdminRoom } from "./pages/AdminRoom";

import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";
import { Room } from "./pages/Room";

import './styles/global.scss'

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Switch>
            <Route path='/' exact component={Home} />
            <Route path='/rooms/new' component={NewRoom} />
            <Route path='/rooms/:id' component={Room} />
            <Route path='/admin/rooms/:id' component={AdminRoom} />
          </Switch>
        </AuthProvider>
      </BrowserRouter>
      <Toaster />
    </>
  );
}

export default App;
