import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CourseList from './components/CourseList';
 // Import StudentDashboard component
import Dashboard from './components/studentDashboard';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <nav>
          <ul>
            <li>
              <Link to="/">Courses</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element= {<CourseList/>} />
          <Route path="/dashboard" Component={Dashboard} />
        </Routes>
      </div>
    </Router>
  );
};


export default App;
