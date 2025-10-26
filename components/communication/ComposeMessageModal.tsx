import React, { useState } from 'react';
import Modal from '../shared/Modal';
import Select from '../shared/Select';
import Input from '../shared/Input';
import TextArea from '../shared/TextArea';
import Button from '../shared/Button';
import { User, Message } from '../../types';

interface ComposeMessageModalProps {
    onClose: () => void;
    onSend: (message: Omit<Message, 'id' | 'timestamp' | 'read' | 'from'>) => void;
    users: User[];
}

const ComposeMessageModal: React.FC<ComposeMessageModalProps> = ({ onClose, onSend, users }) => {
    const [to, setTo] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!to || !subject || !body) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
        onSend({ to, subject, body });
    };

    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title="Nova Mensagem"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <Select
                    label="Para:"
                    id="to"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    required
                >
                    <option value="" disabled>Selecione um destinatário</option>
                    {users.map(user => (
                        <option key={user.id} value={user.name}>{user.name} ({user.role})</option>
                    ))}
                </Select>
                <Input
                    label="Assunto:"
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                />
                <TextArea
                    label="Mensagem:"
                    id="body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={8}
                    required
                />
                 <div className="flex justify-end space-x-3 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
                    <Button type="submit">Enviar</Button>
                </div>
            </form>
        </Modal>
    );
};

export default ComposeMessageModal;