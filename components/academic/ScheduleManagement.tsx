import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Class, Schedule, Subject } from '../../types';
import Spinner from '../shared/Spinner.tsx';
import Button from '../shared/Button';
import { PlusIcon } from '../icons/Icons';
import ScheduleTable from './ScheduleTable';
import ScheduleModal from './ScheduleModal';

const ScheduleManagement: React.FC = () => {
    const [classes, setClasses] = useState<Class[]>([]);
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [classesData, schedulesData, subjectsData] = await Promise.all([
                    api.get<Class[]>('/classes'),
                    api.get<Schedule[]>('/schedules'),
                    api.get<Subject[]>('/subjects'),
                ]);
                setClasses(classesData);
                setSchedules(schedulesData);
                setSubjects(subjectsData);
            } catch (error) {
                console.error("Failed to fetch schedule data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleOpenModal = () => {
        setEditingSchedule(null);
        setIsModalOpen(true);
    };

    const handleEditSchedule = (schedule: Schedule) => {
        setEditingSchedule(schedule);
        setIsModalOpen(true);
    };

    const handleDeleteSchedule = async (scheduleId: string) => {
        if (window.confirm("Tem certeza que deseja excluir este horário?")) {
            try {
                await api.delete(`/schedules/${scheduleId}`);
                setSchedules(prev => prev.filter(s => s.id !== scheduleId));
            } catch (error) {
                console.error("Failed to delete schedule:", error);
                alert("Falha ao excluir horário.");
            }
        }
    };

    const handleSaveSchedule = async (schedule: Schedule) => {
        try {
            if (schedule.id) {
                const { id, ...data } = schedule;
                const updatedSchedule = await api.put<Schedule>(`/schedules/${id}`, data);
                setSchedules(prev => prev.map(s => s.id === id ? { ...updatedSchedule, id } : s));
            } else {
                const newSchedule = await api.post<Schedule>('/schedules', schedule);
                setSchedules(prev => [...prev, newSchedule]);
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to save schedule:", error);
            alert("Falha ao salvar horário.");
        }
    };

    if (loading) return <Spinner />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                 <div>
                    <h2 className="text-2xl font-bold">Gerenciamento de Horários</h2>
                    <p className="text-gray-500 dark:text-gray-400">Crie e organize os horários de aula das turmas.</p>
                </div>
                <Button onClick={handleOpenModal}>
                    <PlusIcon className="w-5 h-5 mr-2" />
                    <span>Novo Horário</span>
                </Button>
            </div>

            <ScheduleTable 
                schedules={schedules}
                classes={classes}
                subjects={subjects}
                onEdit={handleEditSchedule}
                onDelete={handleDeleteSchedule}
            />

            {isModalOpen && (
                <ScheduleModal
                    schedule={editingSchedule}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveSchedule}
                    classes={classes}
                    subjects={subjects}
                />
            )}
        </div>
    );
};

export default ScheduleManagement;