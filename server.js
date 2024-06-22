import express from 'express';
import bodyParser from 'body-parser';
import { createClient } from '@supabase/supabase-js';

const app = express();
const port = 3000;

// Initialize Supabase client
const supabaseUrl = 'https://rnyqgnelempaufwjzjqq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJueXFnbmVsZW1wYXVmd2p6anFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg5NzA5NzMsImV4cCI6MjAzNDU0Njk3M30.9s6r4G7hSuztChTXeBF3Lef7TRAkcOj9udqz3iEO4Lc';
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(bodyParser.json());

// Route to fetch courses from Supabase
app.get('/api/courses', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('course_info')
      .select('*');
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error('Failed to fetch courses', error);
    res.status(500).send('Failed to fetch courses');
  }
});

// Route to enroll a student in a course
app.post('/api/students', async (req, res) => {
  const { name, email, age, course_enrolled } = req.body;
  try {
    const { data, error } = await supabase
      .from('students')
      .insert([
        { name, email, age, course_enrolled }
      ]);
    if (error) throw error;
    res.status(201).send('Student enrolled successfully');
  } catch (error) {
    console.error('Failed to enroll student', error);
    res.status(500).send('Failed to enroll student');
  }
});

// Route to fetch all students from Supabase
app.get('/api/students', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*');
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error('Failed to fetch students', error);
    res.status(500).send('Failed to fetch students');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
