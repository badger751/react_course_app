import React, { useState } from 'react';
import { supabase } from '../supabaseClient'; // Ensure this file exports your Supabase client instance
import './StudentDashboard.css'; // Import the CSS file

const Dashboard: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [courseInfo, setCourseInfo] = useState<any>(null);
  const [completed, setCompleted] = useState<boolean>(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'name') setName(value);
    if (name === 'email') setEmail(value);
  };

  const fetchCourseDetails = async () => {
    try {
      // Fetch student details
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('course_enrolled, completed')
        .eq('name', name)
        .eq('email', email)
        .single();

      if (studentError) throw studentError;

      if (student && student.course_enrolled) {
        setCompleted(student.completed);

        // Fetch course information
        const { data: course, error: courseError } = await supabase
          .from('course_info')
          .select(`
            instructor_name,
            description,
            enrollment_status,
            course_duration,
            schedule,
            location,
            prerequisites,
            syllabus,
            likes
          `)
          .eq('course_name', student.course_enrolled)
          .single();

        if (courseError) throw courseError;

        setCourseInfo(course);
        setError('');
      } else {
        setError('No course enrollment found for the given name and email.');
      }
    } catch (error) {
      
      setCourseInfo(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCourseDetails();
  };

  const markAsCompleted = async () => {
    try {
      const { error } = await supabase
        .from('students')
        .update({ completed: true })
        .eq('name', name)
        .eq('email', email);

      if (error) throw error;

      setCompleted(true);
    } catch (error) {
      
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="submit-button">Submit</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {courseInfo && (
        <div className="course-details">
          <h2>Course Details</h2>
          <p><strong>Instructor Name:</strong> {courseInfo.instructor_name}</p>
          <p><strong>Description:</strong> {courseInfo.description}</p>
          <p><strong>Enrollment Status:</strong> {courseInfo.enrollment_status}</p>
          <p><strong>Course Duration:</strong> {courseInfo.course_duration}</p>
          <p><strong>Schedule:</strong> {courseInfo.schedule}</p>
          <p><strong>Location:</strong> {courseInfo.location}</p>
          <p><strong>Prerequisites:</strong> {courseInfo.prerequisites}</p>
          <p><strong>Syllabus:</strong> {courseInfo.syllabus}</p>
          <p><strong>Likes:</strong> {courseInfo.likes}</p>
          {completed ? (
            <p className="completed-message">You have completed this course.</p>
          ) : (
            <button onClick={markAsCompleted} className="submit-button">Mark as Completed</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
