package com.example.scholartrack.service;

import com.example.scholartrack.entity.Student;
import com.example.scholartrack.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public Student createStudent(Student student) {
        return studentRepository.save(student);
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Optional<Student> getStudentById(Long id) {
        return studentRepository.findById(id);
    }

    public Student updateStudent(Long id, Student student) {

        Student existingStudent = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        existingStudent.setName(student.getName());
        existingStudent.setEmail(student.getEmail());
        existingStudent.setPhone(student.getPhone());
        existingStudent.setIncome(student.getIncome());
        existingStudent.setMarks(student.getMarks());
        existingStudent.setCourse(student.getCourse());
        existingStudent.setYear(student.getYear());

        return studentRepository.save(existingStudent);
    }

    public void deleteStudent(Long id) {

        if (!studentRepository.existsById(id)) {
            throw new RuntimeException("Student not found");
        }

        studentRepository.deleteById(id);
    }
}