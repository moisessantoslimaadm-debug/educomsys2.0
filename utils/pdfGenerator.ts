// FIX: A importação do módulo foi removida para usar a variável global 'jspdf'.
import html2canvas from 'html2canvas';
import { Student, Grade, Subject } from '../types';

// Informa ao TypeScript sobre a variável global 'jspdf' injetada pelo script no index.html.
declare const jspdf: any;

const generatePdf = async (reportType: 'boletim' | 'historico' | 'matricula', student: Student, grades: Grade[], subjects: Subject[]) => {
    
    const getSubjectName = (id: string) => subjects.find(s => s.id === id)?.name || 'N/A';
    
    // FIX: Instancia o jsPDF a partir da classe .jsPDF dentro do objeto global 'jspdf'.
    const doc = new jspdf.jsPDF();
    const today = new Date().toLocaleDateString('pt-BR');
    
    // Header
    doc.setFontSize(18);
    doc.text("EDUCONSYS - Sistema de Gestão Educacional", 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text("Escola de Exemplo Municipal", 105, 28, { align: 'center' });
    doc.line(20, 35, 190, 35);

    // Content based on type
    switch(reportType) {
        case 'boletim':
            doc.setFontSize(16);
            doc.text(`Boletim Escolar - ${new Date().getFullYear()}`, 105, 45, { align: 'center' });
            doc.setFontSize(12);
            doc.text(`Aluno(a): ${student.name}`, 20, 60);
            doc.text(`Turma: ${student.class}`, 140, 60);

            const boletimData = grades.map(g => [getSubjectName(g.subjectId), g.grade.toFixed(1)]);
            
            (doc as any).autoTable({
                startY: 70,
                head: [['Disciplina', 'Nota Final']],
                body: boletimData,
                theme: 'striped',
                headStyles: { fillColor: [0, 82, 204] },
            });
            break;
            
        case 'historico':
             doc.setFontSize(16);
            doc.text('Histórico Escolar', 105, 45, { align: 'center' });
            doc.setFontSize(12);
            doc.text(`Aluno(a): ${student.name}`, 20, 60);
            doc.text(`CPF: ${student.cpf}`, 20, 67);
            doc.text(`Data de Nascimento: ${new Date(student.birthDate).toLocaleDateString('pt-BR')}`, 20, 74);

            let startY = 85;
            student.academicHistory.forEach(year => {
                doc.setFontSize(12);
                doc.text(`Ano Letivo: ${year.year} - Turma: ${year.class}`, 20, startY);
                startY += 7;
                const historyData = year.grades.map(g => [getSubjectName(g.subjectId), g.finalGrade.toFixed(1)]);
                 (doc as any).autoTable({
                    startY: startY,
                    head: [['Disciplina', 'Nota Final']],
                    body: historyData,
                });
                startY = (doc as any).lastAutoTable.finalY + 10;
            });
            break;

        case 'matricula':
            doc.setFontSize(16);
            doc.text('Declaração de Matrícula', 105, 45, { align: 'center' });

            const declarationText = `Declaramos para os devidos fins que o(a) aluno(a) ${student.name}, portador(a) do CPF nº ${student.cpf}, nascido(a) em ${new Date(student.birthDate).toLocaleDateString('pt-BR')}, está regularmente matriculado(a) nesta instituição de ensino, no ano letivo de ${new Date().getFullYear()}, cursando a turma ${student.class}.`;

            doc.setFontSize(12);
            const splitText = doc.splitTextToSize(declarationText, 170);
            doc.text(splitText, 20, 70);
            
            doc.text(`Emitido em: ${today}`, 20, 120);
            
            doc.line(60, 150, 150, 150);
            doc.text("Assinatura da Secretaria", 105, 155, { align: 'center'});
            break;
    }

    // Footer
    doc.line(20, 270, 190, 270);
    doc.setFontSize(10);
    doc.text(`Documento gerado em ${today} por EDUCONSYS.`, 105, 275, { align: 'center' });

    // Open PDF in new tab
    doc.output('dataurlnewwindow');
};

export { generatePdf };