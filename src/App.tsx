import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CourseList from './components/CourseList';
import StudentDashboard from './components/studentDashboard'; // Import StudentDashboard component

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<CourseList />} />
          <Route path="/dashboard" element={<StudentDashboard />} /> {/* Add StudentDashboard route */}
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;