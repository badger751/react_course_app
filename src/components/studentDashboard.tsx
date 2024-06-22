// StudentDashboard.tsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import CourseTile from './CourseTile'; // Assuming CourseTile component is defined
import './StudentDashboard.css'; // Import CSS for styling

interface StudentData {
  name: string;
  age: number;
  email: string;
  course_enrolled: string;
}

const StudentDashboard: React.FC = () => {
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [courseDetails, setCourseDetails] = useState<any[]>([]);

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const { data: studentData, error: studentError } = await supabase
        .from<StudentData>('students')
        .select('course_enrolled')
        .eq('name', studentName)
        .eq('email', studentEmail);

      if (studentError) {
        throw studentError;
      }

      if (studentData && studentData.length > 0) {
        setEnrolledCourses(studentData.map((student) => student.course_enrolled));
        setError(null);

        const { data: coursesData, error: coursesError } = await supabase
          .from('course_info')
          .select('*')
          .in('course_name', enrolledCourses);

        if (coursesError) {
          throw coursesError;
        }

        if (coursesData) {
          setCourseDetails(coursesData);
        } else {
          setCourseDetails([]);
          setError('No course details found.');
        }
      } else {
        setEnrolledCourses([]);
        setCourseDetails([]);
        setError('No courses found for the given student details.');
      }
    } catch (error) {
      console.error('Error fetching enrolled courses:', error.message);
      setError('Failed to fetch enrolled courses. Please try again.');
    }
  };

  return (
    <div className="dashboard-container">
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
        {enrolledCourses.length === 0 && <div>No courses found.</div>}
        {courseDetails.map((course) => (
          <CourseTile key={course.course_id} course={course} />
        ))}
      </div>

      <Link to="/" className="back-to-course-list">Back to Course List</Link>
    </div>
  );
};

export default StudentDashboard;
