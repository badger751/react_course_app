// StudentDashboard.tsx

import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import CourseTile from './CourseTile'; // Assuming CourseTile component is defined

const StudentDashboard: React.FC = () => { 
    
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]); // Adjust type as per your schema
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const { data, error } = await supabase
        .from('students')
        .select('course_enrolled')
        .eq('name', studentName)
        .eq('email', studentEmail);

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        setEnrolledCourses(data);
      } else {
        setEnrolledCourses([]);
        setError('No courses found for the given student details.');
      }
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      setError('Failed to fetch enrolled courses. Please try again.');
    }
  };

  return (
    <div>
      <h1>Student Dashboard</h1>
      <form onSubmit={handleFormSubmit}>
        <label>
          Student Name:
          <input type="text" value={studentName} onChange={(e) => setStudentName(e.target.value)} required />
        </label>
        <label>
          Email:
          <input type="email" value={studentEmail} onChange={(e) => setStudentEmail(e.target.value)} required />
        </label>
        <button type="submit">Submit</button>
      </form>

      {error && <div className="error-message">{error}</div>}

      <div className="course-list">
        {enrolledCourses.map((course: any) => (
          <CourseTile key={course.course_name} course={course.course_name} />
        ))}
      </div>
    </div>
  );
};

export default StudentDashboard;
