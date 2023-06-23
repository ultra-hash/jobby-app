import {Switch, Route, Redirect} from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './components/Home'
import Login from './components/Login'
import Jobs from './components/Jobs'
import JobDetails from './components/JobDetails'
import NotFound from './components/NotFound'
import './App.css'

// Replace your code here
const App = () => (
  <Switch>
    <Route path="/login" exact component={Login} />
    <ProtectedRoute path="/" exact component={Home} />
    <ProtectedRoute path="/jobs" exact component={Jobs} />
    <ProtectedRoute path="/jobs/:id" exact component={JobDetails} />
    <Route path="/not-found" exact component={NotFound} />
    <Redirect to="/not-found" />
  </Switch>
)

export default App
