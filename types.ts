

export enum UserRole {
    Professor = 'Professor',
    Direcao = 'Direção Escolar',
    Secretaria = 'Secretaria Escolar',
    Responsavel = 'Responsável',
    Aluno = 'Aluno',
    SecretariaMunicipal = 'Secretaria Municipal'
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatarUrl: string;
    studentId?: string; // For Aluno and Responsavel roles
}

export interface AcademicYear {
    year: number;
    class: string;
    grades: {
        subjectId: string;
        finalGrade: number;
    }[];
    attendance: number;
}

export interface Student {
    id?: string;
    name: string;
    cpf: string;
    birthDate: string;
    // Detailed Address
    cep: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    // PCD Info
    isPCD: boolean;
    pcdDetails?: string;
    medicalReportUrl?: string; // Simulates a file upload
    // Academic Info
    guardians: string[];
    class: string; // This would likely be a classId in a real DB
    averageGrade: number;
    attendance: number; // percentage
    status: 'Ativo' | 'Inativo' | 'Transferido' | 'Evadido';
    academicHistory: AcademicYear[];
}

export interface Teacher {
    id?: string;
    name: string;
}

export interface Class {
    id?: string;
    name: string;
    teacherId: string;
    studentIds: string[];
}

export interface Grade {
    studentId: string;
    subjectId: string;
    grade: number;
}

export interface AttendanceRecord {
    studentId: string;
    date: string; // YYYY-MM-DD
    status: 'Presente' | 'Falta';
}

export interface Subject {
    id?: string;
    name: string;
}

export interface LessonPlan {
    id?: string;
    title: string;
    description: string;
    subjectId: string;
    classId: string;
    date: string;
}

export interface Employee {
    id?: string;
    name: string;
    role: 'Professor' | 'Secretaria Escolar' | 'Direção' | 'Coordenação';
    email: string;
    phone: string;
    hireDate: string;
}

export interface Transaction {
    id?: string;
    description: string;
    amount: number;
    type: 'Receita' | 'Despesa';
    date: string;
    category: string;
}

export interface School {
    id?: string;
    name: string;
    city: string;
    studentCount: number;
    averageGrade: number;
}

export interface Announcement {
    id?: string;
    title: string;
    content: string;
    author: string;
    date: string;
}

export interface PortfolioItem {
    id?: string;
    fileName: string;
    studentId: string;
    subject: string;
    uploadDate: string;
    fileUrl: string; // mock url
}

export interface Material {
    id?: string;
    fileName: string;
    classId: string;
    subjectId: string;
    uploadDate: string;
    fileUrl: string;
    uploaderId: string;
}

export interface Schedule {
    id?: string;
    classId: string;
    day: 'Segunda' | 'Terça' | 'Quarta' | 'Quinta' | 'Sexta';
    time: string;
    subjectId: string;
}

export interface Message {
    id?: string;
    from: string;
    to: string;
    subject: string;
    body: string;
    timestamp: string;
    read: boolean;
}

export interface PerformanceData {
    month: string;
    averageGrade: number;
}

export interface ClassInfo {
    id: string;
    name: string;
    studentCount: number;
    averageGrade: number;
}

export interface BehaviorRecord {
    id?: string;
    studentId: string;
    date: string;
    type: 'Positivo' | 'Negativo';
    description: string;
    authorId: string; // teacher's or director's id
}

export interface TransferRecord {
    id?: string;
    studentId: string;
    fromClass: string;
    toClass: string;
    date: string;
    reason: string;
    observations: string;
}

export interface Invoice {
    id?: string;
    studentId: string;
    month: number;
    year: number;
    amount: number;
    dueDate: string;
    status: 'Pago' | 'Pendente' | 'Atrasado';
    paymentUrl: string;
}

export interface Notification {
    id?: string;
    userId: string;
    title: string;
    description: string;
    timestamp: string;
    read: boolean;
}

export interface Enrollment {
    id?: string;
    studentName: string;
    studentCpf: string;
    studentBirthDate: string;
    guardianName: string;
    guardianCpf: string;
    guardianPhone: string;
    desiredClass: string;
    status: 'Pendente' | 'Aprovada' | 'Rejeitada';
    submissionDate: string;
}

export interface ActivityLog {
    id?: string;
    userId: string;
    userName: string;
    action: string;
    details: string;
    timestamp: string;
}

export interface Book {
    id?: string;
    title: string;
    author: string;
    isbn: string;
    coverUrl: string;
    quantity: number;
    available: number;
}

export interface BookLoan {
    id?: string;
    bookId: string;
    studentId: string;
    loanDate: string; // ISO String
    dueDate: string; // ISO String
    returnDate?: string; // ISO String
    status: 'Emprestado' | 'Devolvido';
}

export interface CalendarEvent {
    id?: string;
    title: string;
    start: string; // ISO String YYYY-MM-DD
    end?: string;   // ISO String YYYY-MM-DD for multi-day events
    type: 'Feriado' | 'Prova' | 'Evento' | 'Reunião' | 'Outro';
    description?: string;
}

export interface MedicalRecord {
    id?: string; // Corresponds to studentId
    bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
    allergies: string; // comma-separated or a text field
    chronicConditions: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
}

export interface HealthIncident {
    id?: string;
    studentId: string;
    date: string; // ISO String
    time: string; // HH:mm
    description: string;
    actionsTaken: string;
    reportedById: string; // user id
}
