import React, { useState, useEffect } from 'react';
import api, { logActivity } from '../../services/api';
import { PlusIcon } from '../icons/Icons';
import { LessonPlan, Subject, Class } from '../../types';
import LessonPlanModal from './LessonPlanModal';
import LessonPlanTable from './LessonPlanTable';
import Spinner from '../shared/Spinner.tsx';

const LessonPlanManagement: React.FC = () => {
    const [plans, setPlans] = useState<LessonPlan[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<LessonPlan | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [plansData, subjectsData, classesData] = await Promise.all([
                    api.get<LessonPlan[]>('/lessonPlans'),
                    api.get<Subject[]>('/subjects'),
                    api.get<Class[]>('/classes'),
                ]);
                setPlans(plansData);
                setSubjects(subjectsData);
                setClasses(classesData);
            } catch (error) {
                console.error("Failed to fetch data for lesson plan management:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleOpenModal = () => {
        setEditingPlan(null);
        setIsModalOpen(true);
    };

    const handleEditPlan = (plan: LessonPlan) => {
        setEditingPlan(plan);
        setIsModalOpen(true);
    };

    const handleDeletePlan = async (planId: string) => {
        if (window.confirm("Tem certeza que deseja excluir este plano de aula?")) {
            try {
                const planTitle = plans.find(p => p.id === planId)?.title || 'N/A';
                await api.delete(`/lessonPlans/${planId}`);
                setPlans(prev => prev.filter(p => p.id !== planId));
                await logActivity('Exclusão de Plano de Aula', { planId, title: planTitle });
            } catch (error) {
                console.error("Failed to delete lesson plan:", error);
                alert("Falha ao excluir plano de aula.");
            }
        }
    };

    const handleSavePlan = async (plan: LessonPlan) => {
        try {
            if (plan.id) {
                const { id, ...planData } = plan;
                const updatedPlan = await api.put<LessonPlan>(`/lessonPlans/${id}`, planData);
                setPlans(prev => prev.map(p => p.id === id ? { ...updatedPlan, id } : p));
                await logActivity('Atualização de Plano de Aula', { planId: id, title: plan.title });
            } else {
                const { id, ...planData } = plan;
                const newPlan = await api.post<LessonPlan>('/lessonPlans', planData);
                setPlans(prev => [...prev, newPlan]);
                await logActivity('Criação de Plano de Aula', { planId: newPlan.id, title: plan.title });
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to save lesson plan:", error);
            alert("Falha ao salvar plano de aula.");
        }
    };

    if (loading) return <Spinner />;

    return (
        <div>
             <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Planos de Aula</h2>
                    <p className="text-gray-500 dark:text-gray-400">Crie e gerencie os planos de aula para suas turmas.</p>
                </div>
                <button 
                    onClick={handleOpenModal}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800"
                >
                    <PlusIcon className="w-5 h-5" />
                    <span>Novo Plano de Aula</span>
                </button>
            </div>
            <LessonPlanTable 
                plans={plans}
                subjects={subjects}
                classes={classes}
                onEdit={handleEditPlan}
                onDelete={handleDeletePlan} 
            />
            {isModalOpen && (
                <LessonPlanModal
                    plan={editingPlan}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSavePlan}
                    subjects={subjects}
                    classes={classes}
                />
            )}
        </div>
    );
};

export default LessonPlanManagement;