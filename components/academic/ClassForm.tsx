
import React, { useState, useEffect } from 'react';
import { Class, Teacher, Student } from '../../types';
import Input from '../shared/Input';
import Select from '../shared/Select';
import Button from '../shared/Button';

interface ClassFormProps {
    classToEdit: Class | null;
    onSave: (cls: Class) => void;
    onCancel: () => void;
    teachers: Teacher[];
    students: Student[];
}

const ClassForm: React.FC<ClassFormProps> = ({ classToEdit, onSave, onCancel, teachers, students }) => {
    const [name, setName] = useState('');
    const [teacherId, setTeacherId] = useState('');
    const [studentIds, setStudentIds] = useState<string[]>([]);

    useEffect(() => {
        if (classToEdit) {
            setName(classToEdit.name);
            setTeacherId(classToEdit.teacherId);
            setStudentIds(classToEdit.studentIds);
        }
    }, [classToEdit]);

    const handleStudentSelect = (studentId: string) => {
        setStudentIds(prev =>
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: classToEdit?.id || '',
            name,
            teacherId,
            studentIds,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label="Nome da Turma"
                id="className"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <Select
                label="Professor Responsável"
                id="teacher"
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                required
            >
                <option value="" disabled>Selecione um professor</option>
                {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                ))}
            </Select>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Alunos
                </label>
                <div className="max-h-60 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-gray-50 dark:bg-gray-700 space-y-2">
                    {students.map(student => (
                        <div key={student.id} className="flex items-center">
                            <input
                                type="checkbox"
                                id={`student-${student.id}`}
                                checked={studentIds.includes(student.id)}
                                onChange={() => handleStudentSelect(student.id)}
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-500 rounded bg-gray-100 dark:bg-gray-600"
                            />
                            <label htmlFor={`student-${student.id}`} className="ml-2 text-sm text-gray-800 dark:text-gray-200">{student.name}</label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
                <Button type="submit">Salvar</Button>
            </div>
        </form>
    );
};

export default ClassForm;
