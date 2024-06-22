import React, { useState, useEffect } from 'react';
import { getCourses } from '../services/courseService';
import Modal from './Modal';
import './CourseList.css'; // Import the CSS file
import './Modal.css'; // Import the CSS file for modal styling
import { supabase } from '../supabaseClient';
import './CourseModalContent';

interface Course {
  course_id: number;
  course_name: string;
  instructor_name: string;
  description: string;
  enrollment_status: string;
  course_duration: string;
  schedule: string;
  location: string;
  prerequisites: string;
  syllabus: any;
}

const CourseModalContent: React.FC<{ course: Course; onClose: () => void; onEnroll: () => void }> = ({ course, onClose, onEnroll }) => {
  const [showEnrollForm, setShowEnrollForm] = useState<boolean>(false);
  const [studentName, setStudentName] = useState<string>('');
  const [studentAge, setStudentAge] = useState<number | undefined>(undefined);
  const [studentEmail, setStudentEmail] = useState<string>('');

  const handleEnrollNow = () => {
    setShowEnrollForm(true);
  };

  const handleEnrollFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    try {
      const { data, error } = await supabase.from('students').insert([
        { course_enrolled: course.course_name, name: studentName, age: studentAge, email: studentEmail }
      ]);

      if (error) {
        throw error;
      }

      alert('Enrollment successful!');
      setShowEnrollForm(false);
      onEnroll(); // Close modal after enrollment
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

const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null); // Correctly typing error state
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const coursesData = await getCourses();
      setCourses(coursesData);
    } catch (error) {
      setError(error as Error); // Ensure error is cast to Error type
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleTileClick = (course: Course) => {
    setSelectedCourse(course);
  };

  const handleCloseModal = () => {
    setSelectedCourse(null);
  };

  const handleEnroll = () => {
    fetchCourses(); // Refresh courses after enrollment
  };

  return (
    <div className="course-list-container">
      <h1>Course Listing</h1>
      <button className="course-button" onClick={() => fetchCourses()} disabled={loading}>
        {loading ? 'Loading...' : 'Refresh Courses'}
      </button>

      {error && <div className="error-message">Error: {error.message}</div>}

      <div className="course-list">
        {!loading && courses.length === 0 && <div>No courses found.</div>}
        {courses.map(course => (
          <div key={course.course_id} className="course-tile" onClick={() => handleTileClick(course)}>
            <h2 className="course-title">{course.course_name}</h2>
            <p className="course-info">Instructor: {course.instructor_name}</p>
            <p className="course-info">Status: {course.enrollment_status}</p>
          </div>
        ))}
      </div>

      <Modal isOpen={selectedCourse !== null} onClose={handleCloseModal}>
        {selectedCourse && <CourseModalContent course={selectedCourse} onClose={handleCloseModal} onEnroll={handleEnroll} />}
      </Modal>
    </div>
  );
};

export default CourseList;
