import React, { useState, useEffect } from 'react'; 
import { FaPlus, FaFilter, FaDownload, FaEdit, FaTrashAlt, FaEye, FaCamera, FaTimes } from 'react-icons/fa';
import './ControleServicos.css';

const ControleServicos = () => {
    const [apontamentos, setApontamentos] = useState([]);
    const [modalAberto, setModalAberto] = useState(false);
    const [filtroTexto, setFiltroTexto] = useState('');
    const [apontamentoSelecionado, setApontamentoSelecionado] = useState(null);
    const [novoApontamento, setNovoApontamento] = useState({
        codigo: '',
        rodovia: '',
        kmInicial: '',
        kmFinal: '',
        sentido: '',
        faixa: '',
        empresa: '',
        equipe: '',
        classe: '',
        status: 'Planejado',
        dataCriacao: new Date().toISOString().split('T')[0],
        prazo: '',
        dataExecucao: ''
    });

    useEffect(() => {
        const mockApontamentos = [
            { codigo: 'VPT-SIN-Ver-2025.01427', prazo: '17/02/2025', rodovia: 'SPA-268/310', kmInicial: '001.150', kmFinal: '001.150', sentido: 'Oeste', faixa: 'Bordo Direito', empresa: 'Fábrica de Placas', equipe: 'Lote 3', classe: 'Implantação', status: 'Executado', dataCriacao: '24/02/2025', dataExecucao: '17/02/2025', evidencias: 3 },
        ];
        setApontamentos(mockApontamentos);
    }, []);

    const abrirDetalhes = (apontamento) => {
        setApontamentoSelecionado(apontamento);
    };

    const fecharDetalhes = () => {
        setApontamentoSelecionado(null);
    };

    const getPrazoClass = (prazo) => {
        const hoje = new Date();
        const dataPrazo = new Date(prazo.split('/').reverse().join('-'));
    
        if (dataPrazo < hoje) return 'vencido';
        const diffDias = Math.ceil((dataPrazo - hoje) / (1000 * 60 * 60 * 24));
    
        if (diffDias > 10) return 'distante';
        if (diffDias <= 10 && diffDias > 3) return 'proximo';
        if (diffDias <= 3 && diffDias >= 0) return 'critico';
    
        return '';
    };
    
    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
            case 'planejado': return 'planejado';
            case 'em andamento': return 'em-andamento';
            case 'executado': return 'executado';
            case 'atrasado': return 'atrasado';
            case 'cancelado': return 'cancelado';
            default: return '';
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNovoApontamento({
            ...novoApontamento,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aqui você pode adicionar validações, se necessário

        setApontamentos([...apontamentos, novoApontamento]);
        // Reseta o formulário
        setNovoApontamento({
            codigo: '',
            rodovia: '',
            kmInicial: '',
            kmFinal: '',
            sentido: '',
            faixa: '',
            empresa: '',
            equipe: '',
            classe: '',
            status: 'Planejado',
            dataCriacao: new Date().toISOString().split('T')[0],
            prazo: '',
            dataExecucao: ''
        });
        setModalAberto(false);
    };

    return (
        <div className="controle-servicos">
            {/* Cabeçalho */}
            <div className="cabecalho">
                <h2>Controle de Apontamentos</h2>
                <div className="linha-azul"></div>
            </div>
            
            {/* Barra de busca e ações */}
            <div className="top-bar">
                <div className="search-bar">
                    <input type="text" placeholder="Buscar apontamento..." value={filtroTexto} onChange={(e) => setFiltroTexto(e.target.value)} />
                </div>
                <div className="actions">
                    <button className="filter-btn"><FaFilter /> Adicionar Filtro</button>
                    <button className="download-btn"><FaDownload /> Baixar</button>
                    <button className="criar-apontamento" onClick={() => setModalAberto(true)}><FaPlus /> Criar Apontamento</button>
                </div>
            </div>

            {/* Cabeçalho da Tabela */}
            <div className="tabela-cabecalho">
                <span>Código</span>
                <span>Prazo</span>
                <span>Rodovia</span>
                <span>Km Inicial</span>
                <span>Km Final</span>
                <span>Faixa</span>
                <span>Empresa</span>
                <span>Equipe</span>
                <span>Categoria</span>
                <span>Status</span>
                <span>Data Execução</span>
                <span>Foto</span>
            </div>

            {/* Lista de Apontamentos */}
            <div className="lista-apontamentos">
                {apontamentos.map((apontamento) => (
                    <div key={apontamento.codigo} className="apontamento-item" onClick={() => abrirDetalhes(apontamento)}>
                        <span>{apontamento.codigo}</span>
                        <span className={`prazo ${getPrazoClass(apontamento.prazo)}`}>{apontamento.prazo}</span>
                        <span>{apontamento.rodovia}</span>
                        <span>{apontamento.kmInicial}</span>
                        <span>{apontamento.kmFinal}</span>
                        <span>{apontamento.faixa}</span>
                        <span>{apontamento.empresa}</span>
                        <span>{apontamento.equipe}</span>
                        <span>{apontamento.classe}</span>
                        <span className={`status ${getStatusClass(apontamento.status)}`}>{apontamento.status}</span>
                        <span>{apontamento.dataExecucao}</span>
                        <span className="foto-icon"><FaCamera /> {apontamento.evidencias || 0}</span>
                    </div>
                ))}
            </div>

            {/* Tela de Detalhes do Apontamento */}
            {apontamentoSelecionado && (
                <div className="detalhes-apontamento">
                    <div className="detalhes-content">
                        <button className="fechar-detalhes" onClick={fecharDetalhes}><FaTimes /></button>
                        <h3>Detalhes do Apontamento</h3>
                        <p><strong>Código:</strong> {apontamentoSelecionado.codigo}</p>
                        <p><strong>Rodovia:</strong> {apontamentoSelecionado.rodovia}</p>
                        <p><strong>KM Inicial:</strong> {apontamentoSelecionado.kmInicial}</p>
                        <p><strong>KM Final:</strong> {apontamentoSelecionado.kmFinal}</p>
                        <p><strong>Faixa:</strong> {apontamentoSelecionado.faixa}</p>
                        <p><strong>Empresa:</strong> {apontamentoSelecionado.empresa}</p>
                        <p><strong>Equipe:</strong> {apontamentoSelecionado.equipe}</p>
                        <p><strong>Categoria:</strong> {apontamentoSelecionado.classe}</p>
                        <p><strong>Status:</strong> {apontamentoSelecionado.status}</p>
                        <p><strong>Prazo:</strong> {apontamentoSelecionado.prazo}</p>
                        <p><strong>Data de Execução:</strong> {apontamentoSelecionado.dataExecucao}</p>
                    </div>
                </div>
            )}

            {/* Modal para Criação de Apontamento */}
            {modalAberto && (
                <div className="modal-criar-apontamento">
                    <div className="modal-content">
                        <button className="fechar-modal" onClick={() => setModalAberto(false)}><FaTimes /></button>
                        <h3>Criar Novo Apontamento</h3>
                        <form onSubmit={handleSubmit}>
                            <label>
                                Código:
                                <input type="text" name="codigo" value={novoApontamento.codigo} onChange={handleChange} required />
                            </label>
                            <label>
                                Rodovia:
                                <input type="text" name="rodovia" value={novoApontamento.rodovia} onChange={handleChange} required />
                            </label>
                            <label>
                                KM Inicial:
                                <input type="text" name="kmInicial" value={novoApontamento.kmInicial} onChange={handleChange} required />
                            </label>
                            <label>
                                KM Final:
                                <input type="text" name="kmFinal" value={novoApontamento.kmFinal} onChange={handleChange} required />
                            </label>
                            <label>
                                Sentido:
                                <input type="text" name="sentido" value={novoApontamento.sentido} onChange={handleChange} />
                            </label>
                            <label>
                                Faixa:
                                <input type="text" name="faixa" value={novoApontamento.faixa} onChange={handleChange} />
                            </label>
                            <label>
                                Empresa:
                                <input type="text" name="empresa" value={novoApontamento.empresa} onChange={handleChange} />
                            </label>
                            <label>
                                Equipe:
                                <input type="text" name="equipe" value={novoApontamento.equipe} onChange={handleChange} />
                            </label>
                            <label>
                                Categoria:
                                <input type="text" name="classe" value={novoApontamento.classe} onChange={handleChange} />
                            </label>
                            <label>
                                Status:
                                <select name="status" value={novoApontamento.status} onChange={handleChange}>
                                    <option value="Planejado">Planejado</option>
                                    <option value="Em Andamento">Em Andamento</option>
                                    <option value="Executado">Executado</option>
                                    <option value="Atrasado">Atrasado</option>
                                    <option value="Cancelado">Cancelado</option>
                                </select>
                            </label>
                            <label>
                                Prazo (dd/mm/aaaa):
                                <input type="text" name="prazo" value={novoApontamento.prazo} onChange={handleChange} required />
                            </label>
                            <label>
                                Data de Execução (dd/mm/aaaa):
                                <input type="text" name="dataExecucao" value={novoApontamento.dataExecucao} onChange={handleChange} />
                            </label>
                            <button type="submit">Salvar Apontamento</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ControleServicos;
