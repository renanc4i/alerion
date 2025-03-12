import React, { useState } from 'react';
import { FaTimes, FaEdit, FaTrashAlt, FaDownload, FaFilter } from 'react-icons/fa';
import './DetalhesOrdemServico.css';

const DetalhesOrdemServico = ({ ordemServico, onClose, onEdit, onDelete }) => {
    const [apontamentosSelecionados, setApontamentosSelecionados] = useState([]);
    const [filtrosAtivos, setFiltrosAtivos] = useState({
        status: '',
        empresa: '',
        dataInicio: '',
        dataFim: ''
    });

    // Mock de apontamentos vinculados
    const [apontamentosVinculados] = useState([
        {
            codigo: 'VPT-SIN-Ver-2025.01427',
            prazo: '17/02/2025',
            rodovia: 'SPA-268/310',
            kmInicial: '001.150',
            kmFinal: '001.150',
            sentido: 'Oeste',
            faixa: 'Bordo Direito',
            empresa: 'Fábrica de Placas',
            equipe: 'Lote 3',
            classe: 'Implantação',
            status: 'Concluído',
            dataCriacao: '24/02/2025',
            dataExecucao: '17/02/2025',
            evidencias: []
        }
    ]);

    const handleSelecionarTodos = () => {
        if (apontamentosSelecionados.length === apontamentosVinculados.length) {
            setApontamentosSelecionados([]);
        } else {
            setApontamentosSelecionados(apontamentosVinculados.map(ap => ap.codigo));
        }
    };

    const handleSelecionarApontamento = (codigo) => {
        if (apontamentosSelecionados.includes(codigo)) {
            setApontamentosSelecionados(apontamentosSelecionados.filter(id => id !== codigo));
        } else {
            setApontamentosSelecionados([...apontamentosSelecionados, codigo]);
        }
    };

    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltrosAtivos(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const filtrarApontamentos = () => {
        return apontamentosVinculados.filter(apontamento => {
            const matchStatus = !filtrosAtivos.status || apontamento.status === filtrosAtivos.status;
            const matchEmpresa = !filtrosAtivos.empresa || apontamento.empresa === filtrosAtivos.empresa;
            return matchStatus && matchEmpresa;
        });
    };

    const handleExportarSelecionados = () => {
        const dados = apontamentosVinculados.filter(ap => 
            apontamentosSelecionados.includes(ap.codigo)
        );

        const csv = [
            ['Código', 'Prazo', 'Rodovia', 'KM Inicial', 'KM Final', 'Faixa', 'Empresa', 'Equipe', 'Categoria', 'Status', 'Data Execução'],
            ...dados.map(ap => [
                ap.codigo,
                ap.prazo,
                ap.rodovia,
                ap.kmInicial,
                ap.kmFinal,
                ap.faixa,
                ap.empresa,
                ap.equipe,
                ap.classe,
                ap.status,
                ap.dataExecucao
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'apontamentos_selecionados.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="modal-detalhes">
            <div className="modal-content">
                <button className="fechar-modal" onClick={onClose}>
                    <FaTimes />
                </button>
                <h3>Detalhes da Ordem de Serviço</h3>

                <div className="detalhes-grid">
                    <div className="detalhe-item">
                        <strong>Código:</strong>
                        <span>{ordemServico.codigo}</span>
                    </div>
                    <div className="detalhe-item">
                        <strong>Ordem de Serviço:</strong>
                        <span>{ordemServico.ordemServico}</span>
                    </div>
                    <div className="detalhe-item">
                        <strong>Responsável:</strong>
                        <span>{ordemServico.responsavel}</span>
                    </div>
                    <div className="detalhe-item">
                        <strong>Empresa:</strong>
                        <span>{ordemServico.empresa}</span>
                    </div>
                    <div className="detalhe-item">
                        <strong>Equipe:</strong>
                        <span>{ordemServico.equipe}</span>
                    </div>
                    <div className="detalhe-item">
                        <strong>Data Inicial:</strong>
                        <span>{ordemServico.dataInicial}</span>
                    </div>
                    <div className="detalhe-item">
                        <strong>Data Final:</strong>
                        <span>{ordemServico.dataFinal}</span>
                    </div>
                    <div className="detalhe-item">
                        <strong>Conclusão:</strong>
                        <span className="conclusao">{ordemServico.conclusao}%</span>
                    </div>
                </div>

                <div className="acoes-detalhes">
                    <button className="btn-editar" onClick={onEdit}>
                        <FaEdit /> Editar Informações
                    </button>
                    <button className="btn-excluir" onClick={onDelete}>
                        <FaTrashAlt /> Excluir OS
                    </button>
                </div>

                <div className="secao-apontamentos">
                    <div className="secao-header">
                        <h4>Apontamentos Vinculados</h4>
                        <div className="acoes-apontamentos">
                            <button className="btn-filtro" onClick={() => setFiltrosAtivos({})}>
                                <FaFilter /> Limpar Filtros
                            </button>
                            <button 
                                className="btn-download"
                                onClick={handleExportarSelecionados}
                                disabled={apontamentosSelecionados.length === 0}
                            >
                                <FaDownload /> Exportar Selecionados
                            </button>
                        </div>
                    </div>

                    <div className="filtros-apontamentos">
                        <div className="filtro-group">
                            <label>Status:</label>
                            <select 
                                name="status" 
                                value={filtrosAtivos.status}
                                onChange={handleFiltroChange}
                            >
                                <option value="">Todos</option>
                                <option value="Concluído">Concluído</option>
                                <option value="Pendente">Pendente</option>
                                <option value="Atrasado">Atrasado</option>
                            </select>
                        </div>
                        <div className="filtro-group">
                            <label>Empresa:</label>
                            <select 
                                name="empresa" 
                                value={filtrosAtivos.empresa}
                                onChange={handleFiltroChange}
                            >
                                <option value="">Todas</option>
                                <option value="Fábrica de Placas">Fábrica de Placas</option>
                                <option value="Construta">Construta</option>
                            </select>
                        </div>
                    </div>

                    <div className="tabela-apontamentos">
                        <div className="tabela-cabecalho">
                            <span className="checkbox-column">
                                <input
                                    type="checkbox"
                                    checked={apontamentosSelecionados.length === apontamentosVinculados.length}
                                    onChange={handleSelecionarTodos}
                                />
                            </span>
                            <span>Código</span>
                            <span>Prazo</span>
                            <span>Rodovia</span>
                            <span>KM Inicial</span>
                            <span>KM Final</span>
                            <span>Faixa</span>
                            <span>Empresa</span>
                            <span>Equipe</span>
                            <span>Categoria</span>
                            <span>Status</span>
                            <span>Data Execução</span>
                        </div>

                        <div className="lista-apontamentos">
                            {filtrarApontamentos().map((apontamento) => (
                                <div 
                                    key={apontamento.codigo} 
                                    className="apontamento-row"
                                >
                                    <span className="checkbox-column">
                                        <input
                                            type="checkbox"
                                            checked={apontamentosSelecionados.includes(apontamento.codigo)}
                                            onChange={() => handleSelecionarApontamento(apontamento.codigo)}
                                        />
                                    </span>
                                    <span>{apontamento.codigo}</span>
                                    <span className={`prazo ${getPrazoClass(apontamento.prazo)}`}>
                                        {apontamento.prazo}
                                    </span>
                                    <span>{apontamento.rodovia}</span>
                                    <span>{apontamento.kmInicial}</span>
                                    <span>{apontamento.kmFinal}</span>
                                    <span>{apontamento.faixa}</span>
                                    <span>{apontamento.empresa}</span>
                                    <span>{apontamento.equipe}</span>
                                    <span>{apontamento.classe}</span>
                                    <span className={`status ${apontamento.status.toLowerCase()}`}>
                                        {apontamento.status}
                                    </span>
                                    <span>{apontamento.dataExecucao || '-'}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const getPrazoClass = (prazo) => {
    const hoje = new Date();
    const dataPrazo = new Date(prazo.split('/').reverse().join('-'));
    
    if (dataPrazo < hoje) return 'vencido';
    const diffDias = Math.ceil((dataPrazo - hoje) / (1000 * 60 * 60 * 24));
    
    if (diffDias <= 2) return 'critico';
    return 'proximo';
};

export default DetalhesOrdemServico; 