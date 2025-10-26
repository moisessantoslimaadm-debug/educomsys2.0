import React from 'react';
import Modal from '../shared/Modal';
import AnnouncementForm from './AnnouncementForm';
import { Announcement } from '../../types';

interface AnnouncementModalProps {
    announcement: Announcement | null;
    onClose: () => void;
    onSave: (announcement: Announcement) => void;
}

const AnnouncementModal: React.FC<AnnouncementModalProps> = ({ announcement, onClose, onSave }) => {
    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title={announcement ? 'Editar Comunicado' : 'Novo Comunicado'}
        >
            <AnnouncementForm
                announcementToEdit={announcement}
                onSave={onSave}
                onCancel={onClose}
            />
        </Modal>
    );
};

export default AnnouncementModal;