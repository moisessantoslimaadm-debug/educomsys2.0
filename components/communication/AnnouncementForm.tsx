import React, { useState, useEffect } from 'react';
import { Announcement } from '../../types';
import Input from '../shared/Input';
import TextArea from '../shared/TextArea';
import Button from '../shared/Button';

interface AnnouncementFormProps {
    announcementToEdit: Announcement | null;
    onSave: (announcement: Announcement) => void;
    onCancel: () => void;
}

const AnnouncementForm: React.FC<AnnouncementFormProps> = ({ announcementToEdit, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
    });

    useEffect(() => {
        if (announcementToEdit) {
            setFormData({
                title: announcementToEdit.title,
                content: announcementToEdit.content,
            });
        }
    }, [announcementToEdit]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({...prev, [e.target.name]: e.target.value}));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: announcementToEdit?.id,
            author: announcementToEdit?.author || '',
            date: announcementToEdit?.date || new Date().toISOString(),
            ...formData,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label="Título do Comunicado"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
            />
            <TextArea
                label="Conteúdo"
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={6}
                required
            />
            <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
                <Button type="submit">Salvar Comunicado</Button>
            </div>
        </form>
    );
};

export default AnnouncementForm;