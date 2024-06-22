// CourseModalContent.tsx

import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

interface CourseModalContentProps {
  course: {
    course_name: string;
    instructor_name: string;
    description: string;
    enrollment_status: string;
    course_duration: string;
    schedule: string;
    location: string;
    prerequisites: string;
    syllabus: any;
  };
  onClose: () => void;
  onEnroll: () => void;
}

const CourseModalContent: React.FC<CourseModalContentProps> = ({ course, onClose, onEnroll }) => {
  const [showEnrollForm, setShowEnrollForm] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentAge, setStudentAge] = useState<number | undefined>(undefined);
  const [studentEmail, setStudentEmail] = useState('');

  const handleEnrollNow = () => {
    setShowEnrollForm(true);
  };

  const handleEnrollFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const { error } = await supabase.from('students').insert([
        { course_name: course.course_name, student_name: studentName, age: studentAge, email: studentEmail }
      ]);

      if (error) {
        throw error;
      }

      alert('Enrollment successful!');
      setShowEnrollForm(false);
      onEnroll(); // Refresh courses after enrollment
    } catch (error) {
      console.error('Error enrolling student:', error);
      alert('Failed to enroll. Please try again.');
    }
  };

  return (
    <div>
      <h2>{course.course_name}</h2>
      <p><strong>Instructor:</strong> {course.instructor_name}</p>
      <p><strong>Description:</strong> {course.description}</p>
      <p><strong>Enrollment Status:</strong> {course.enrollment_status}</p>
      <p><strong>Duration:</strong> {course.course_duration}</p>
      <p><strong>Schedule:</strong> {course.schedule}</p>
      <p><strong>Location:</strong> {course.location}</p>
      <p><strong>Pre-requisites:</strong> {course.prerequisites}</p>
      <p><strong>Syllabus:</strong> {JSON.stringify(course.syllabus)}</p>
      <button className="modal-back-button" onClick={onClose}>Back</button>
      <button className="modal-enroll-button" onClick={handleEnrollNow}>Enroll Now</button>

      {showEnrollForm && (
        <form onSubmit={handleEnrollFormSubmit}>
          <label>
            Student Name:
            <input type="text" value={studentName} onChange={(e) => setStudentName(e.target.value)} required />
          </label>
          <label>
            Age:
            <input type="number" value={studentAge || ''} onChange={(e) => setStudentAge(parseInt(e.target.value, 10))} required />
          </label>
          <label>
            Email:
            <input type="email" value={studentEmail} onChange={(e) => setStudentEmail(e.target.value)} required />
          </label>
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
};

export default CourseModalContent;
