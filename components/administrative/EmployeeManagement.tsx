import React, { useState, useEffect } from 'react';
import api, { logActivity } from '../../services/api';
import { PlusIcon } from '../icons/Icons';
import { Employee } from '../../types';
import EmployeeModal from './EmployeeModal';
import EmployeeTable from './EmployeeTable';
import Spinner from '../shared/Spinner.tsx';

const EmployeeManagement: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const data = await api.get<Employee[]>('/employees');
                setEmployees(data);
            } catch (error) {
                console.error("Failed to fetch employees:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEmployees();
    }, []);

    const handleOpenModal = () => {
        setEditingEmployee(null);
        setIsModalOpen(true);
    };

    const handleEditEmployee = (emp: Employee) => {
        setEditingEmployee(emp);
        setIsModalOpen(true);
    };

    const handleDeleteEmployee = async (empId: string) => {
        if (window.confirm("Tem certeza que deseja excluir este funcionário?")) {
            try {
                const empName = employees.find(e => e.id === empId)?.name || 'N/A';
                await api.delete(`/employees/${empId}`);
                setEmployees(prev => prev.filter(e => e.id !== empId));
                await logActivity('Exclusão de Funcionário', { employeeId: empId, name: empName });
            } catch (error) {
                console.error("Failed to delete employee:", error);
                alert("Falha ao excluir funcionário.");
            }
        }
    };

    const handleSaveEmployee = async (emp: Employee) => {
        try {
            if (emp.id) {
                const { id, ...empData } = emp;
                const updatedEmployee = await api.put<Employee>(`/employees/${id}`, empData);
                setEmployees(prev => prev.map(e => e.id === id ? { ...updatedEmployee, id } : e));
                await logActivity('Atualização de Funcionário', { employeeId: id, name: emp.name });
            } else {
                const { id, ...empData } = emp;
                const newEmployee = await api.post<Employee>('/employees', empData);
                setEmployees(prev => [...prev, newEmployee]);
                await logActivity('Criação de Funcionário', { employeeId: newEmployee.id, name: emp.name });
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to save employee:", error);
            alert("Falha ao salvar funcionário.");
        }
    };

    if (loading) return <Spinner />;

    return (
        <div>
             <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Gerenciamento de Funcionários</h2>
                    <p className="text-gray-500 dark:text-gray-400">Adicione e gerencie os funcionários da instituição.</p>
                </div>
                <button 
                    onClick={handleOpenModal}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800"
                >
                    <PlusIcon className="w-5 h-5" />
                    <span>Novo Funcionário</span>
                </button>
            </div>
            <EmployeeTable 
                employees={employees}
                onEdit={handleEditEmployee}
                onDelete={handleDeleteEmployee} 
            />
            {isModalOpen && (
                <EmployeeModal
                    employee={editingEmployee}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveEmployee}
                />
            )}
        </div>
    );
};

export default EmployeeManagement;