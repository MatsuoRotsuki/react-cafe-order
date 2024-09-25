import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Dashboard from "./features/dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
