// src/services/courseService.ts
import { supabase } from '../supabaseClient';

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

export const getCourses = async (): Promise<Course[]> => {
  try {
    const { data, error } = await supabase
      .from('course_info')
      .select('*');
    
    if (error) {
      console.error('Error fetching courses:', error.message, error.details);
      throw new Error('Failed to fetch courses from database');
    }

    console.log('Fetched courses:', data);
    return data as Course[];
  } catch (error) {
    console.error('Unexpected error fetching courses:', error);
    throw error;
  }
};
