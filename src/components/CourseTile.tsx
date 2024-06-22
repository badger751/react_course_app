// CourseTile.tsx

import React from 'react';

interface CourseTileProps {
  course: string; // Adjust type as per your schema
}

const CourseTile: React.FC<CourseTileProps> = ({ course }) => {
  return (
    <div className="course-tile">
      <h2 className="course-title">{course}</h2>
      {/* Add more course details if needed */}
    </div>
  );
};

export default CourseTile;
