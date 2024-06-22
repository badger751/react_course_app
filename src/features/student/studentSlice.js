// src/features/student/studentSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../supabaseClient';

interface StudentData {
  name: string;
  age: number;
  email: string;
  course_enrolled: string;
}

interface CourseData {
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

interface StudentState {
  studentName: string;
  studentEmail: string;
  enrolledCourses: string[];
  courseDetails: CourseData[];
  error: string | null;
  loading: boolean;
}

const initialState: StudentState = {
  studentName: '',
  studentEmail: '',
  enrolledCourses: [],
  courseDetails: [],
  error: null,
  loading: false,
};

export const fetchEnrolledCourses = createAsyncThunk(
  'student/fetchEnrolledCourses',
  async (student: { name: string; email: string }) => {
    const { data: studentData, error: studentError } = await supabase
      .from<StudentData>('students')
      .select('course_enrolled')
      .eq('name', student.name)
      .eq('email', student.email);

    if (studentError) {
      throw studentError;
    }

    if (studentData && studentData.length > 0) {
      const courseNames = studentData.map((student) => student.course_enrolled);

      const { data: coursesData, error: coursesError } = await supabase
        .from<CourseData>('course_info')
        .select('*')
        .in('course_name', courseNames);

      if (coursesError) {
        throw coursesError;
      }

      return coursesData;
    } else {
      throw new Error('No courses found for the given student details.');
    }
  }
);

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    setStudentName: (state, action: PayloadAction<string>) => {
      state.studentName = action.payload;
    },
    setStudentEmail: (state, action: PayloadAction<string>) => {
      state.studentEmail = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEnrolledCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEnrolledCourses.fulfilled, (state, action: PayloadAction<CourseData[]>) => {
        state.loading = false;
        state.courseDetails = action.payload;
        state.error = null;
      })
      .addCase(fetchEnrolledCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch enrolled courses. Please try again.';
      });
  },
});

export const { setStudentName, setStudentEmail } = studentSlice.actions;

export default studentSlice.reducer;
