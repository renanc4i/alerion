import React, { useState, useEffect } from 'react';
import { FaPlus, FaFilter, FaDownload, FaEdit, FaTrashAlt, FaEye, FaCamera, FaTimes, FaSearch, FaCheckSquare, FaSquare, FaArrowLeft, FaArrowRight, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import './ControleServicos.css';

const STATUS_OPTIONS = ['Pendente', 'Concluído', 'Atrasado'];
const SENTIDO_OPTIONS = ['Norte', 'Sul', 'Leste', 'Oeste'];
const FAIXA_OPTIONS = ['Bordo Direito', 'Bordo Esquerdo', 'Central'];
const ITEMS_PER_PAGE_OPTIONS = [20, 50, 100];

const ControleServicos = () => {
    const [activeTab, setActiveTab] = useState('apontamentos');
    const [apontamentos, setApontamentos] = useState([]);
    const [ordensServico, setOrdensServico] = useState([]);
    const [modalAberto, setModalAberto] = useState(false);
    const [filtroTexto, setFiltroTexto] = useState('');
    const [apontamentoSelecionado, setApontamentoSelecionado] = useState(null);
    const [ordemServicoSelecionada, setOrdemServicoSelecionada] = useState(null);
    const [apontamentosSelecionados, setApontamentosSelecionados] = useState([]);
    const [ordensServicoSelecionadas, setOrdensServicoSelecionadas] = useState([]);
    const [filtrosAtivos, setFiltrosAtivos] = useState({
        status: '',
        empresa: '',
        dataInicio: '',
        dataFim: ''
    });
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [itemsPorPagina, setItemsPorPagina] = useState(20);
    const [ordenacao, setOrdenacao] = useState({ campo: null, direcao: 'asc' });
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
        status: 'Pendente',
        dataCriacao: new Date().toISOString().split('T')[0],
        prazo: '',
        dataExecucao: '',
        observacoes: '',
        evidencias: []
    });

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            // Aqui você implementaria as chamadas reais à API
            const mockApontamentos = [
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
            ];

            const mockOrdensServico = [
                {
                    codigo: 'OS-001',
                    ordemServico: 'Manutenção BR-101',
                    responsavel: 'João Silva',
                    empresa: 'Construta',
                    equipe: 'Alpha',
                    dataInicial: '20/10/2023',
                    dataFinal: '30/10/2023',
                    conclusao: 20
                }
            ];

            setApontamentos(mockApontamentos);
            setOrdensServico(mockOrdensServico);
        } catch (erro) {
            console.error('Erro ao carregar dados:', erro);
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setPaginaAtual(1);
        setApontamentosSelecionados([]);
        setOrdensServicoSelecionadas([]);
    };

    const handleSelecionarTodos = (items, setSelected) => {
        const selected = items.map(item => item.codigo);
        if (selected.length === items.length) {
            setSelected([]);
        } else {
            setSelected(selected);
        }
    };

    const handleSelecionarItem = (codigo, selected, setSelected) => {
        if (selected.includes(codigo)) {
            setSelected(selected.filter(id => id !== codigo));
        } else {
            setSelected([...selected, codigo]);
        }
    };

    const handleOrdenacao = (campo) => {
        setOrdenacao(prev => ({
            campo,
            direcao: prev.campo === campo && prev.direcao === 'asc' ? 'desc' : 'asc'
        }));
    };

    const ordenarDados = (dados) => {
        if (!ordenacao.campo) return dados;

        return [...dados].sort((a, b) => {
            const aValue = a[ordenacao.campo];
            const bValue = b[ordenacao.campo];

            if (ordenacao.direcao === 'asc') {
                return aValue > bValue ? 1 : -1;
            }
            return aValue < bValue ? 1 : -1;
        });
    };

    const getDadosPaginados = (dados) => {
        const inicio = (paginaAtual - 1) * itemsPorPagina;
        const fim = inicio + itemsPorPagina;
        return dados.slice(inicio, fim);
    };

    const getTotalPaginas = (dados) => {
        return Math.ceil(dados.length / itemsPorPagina);
    };

    const renderCabecalhoTabela = (tipo) => {
        if (tipo === 'apontamentos') {
            return (
                <div className="tabela-cabecalho">
                    <span className="checkbox-column">
                        <input
                            type="checkbox"
                            checked={apontamentosSelecionados.length === apontamentos.length}
                            onChange={() => handleSelecionarTodos(apontamentos, setApontamentosSelecionados)}
                        />
                    </span>
                    <span onClick={() => handleOrdenacao('codigo')}>
                        Código {ordenacao.campo === 'codigo' && (ordenacao.direcao === 'asc' ? <FaSortUp /> : <FaSortDown />)}
                    </span>
                    <span onClick={() => handleOrdenacao('prazo')}>
                        Prazo {ordenacao.campo === 'prazo' && (ordenacao.direcao === 'asc' ? <FaSortUp /> : <FaSortDown />)}
                    </span>
                    <span onClick={() => handleOrdenacao('rodovia')}>
                        Rodovia {ordenacao.campo === 'rodovia' && (ordenacao.direcao === 'asc' ? <FaSortUp /> : <FaSortDown />)}
                    </span>
                    <span onClick={() => handleOrdenacao('kmInicial')}>
                        KM Inicial {ordenacao.campo === 'kmInicial' && (ordenacao.direcao === 'asc' ? <FaSortUp /> : <FaSortDown />)}
                    </span>
                    <span onClick={() => handleOrdenacao('kmFinal')}>
                        KM Final {ordenacao.campo === 'kmFinal' && (ordenacao.direcao === 'asc' ? <FaSortUp /> : <FaSortDown />)}
                    </span>
                    <span onClick={() => handleOrdenacao('faixa')}>
                        Faixa {ordenacao.campo === 'faixa' && (ordenacao.direcao === 'asc' ? <FaSortUp /> : <FaSortDown />)}
                    </span>
                    <span onClick={() => handleOrdenacao('empresa')}>
                        Empresa {ordenacao.campo === 'empresa' && (ordenacao.direcao === 'asc' ? <FaSortUp /> : <FaSortDown />)}
                    </span>
                    <span onClick={() => handleOrdenacao('equipe')}>
                        Equipe {ordenacao.campo === 'equipe' && (ordenacao.direcao === 'asc' ? <FaSortUp /> : <FaSortDown />)}
                    </span>
                    <span onClick={() => handleOrdenacao('classe')}>
                        Categoria {ordenacao.campo === 'classe' && (ordenacao.direcao === 'asc' ? <FaSortUp /> : <FaSortDown />)}
                    </span>
                    <span onClick={() => handleOrdenacao('status')}>
                        Status {ordenacao.campo === 'status' && (ordenacao.direcao === 'asc' ? <FaSortUp /> : <FaSortDown />)}
                    </span>
                    <span onClick={() => handleOrdenacao('dataExecucao')}>
                        Data Execução {ordenacao.campo === 'dataExecucao' && (ordenacao.direcao === 'asc' ? <FaSortUp /> : <FaSortDown />)}
                    </span>
                    <span>Foto</span>
                </div>
            );
        } else {
            return (
                <div className="tabela-cabecalho">
                    <span className="checkbox-column">
                        <input
                            type="checkbox"
                            checked={ordensServicoSelecionadas.length === ordensServico.length}
                            onChange={() => handleSelecionarTodos(ordensServico, setOrdensServicoSelecionadas)}
                        />
                    </span>
                    <span onClick={() => handleOrdenacao('codigo')}>
                        Código {ordenacao.campo === 'codigo' && (ordenacao.direcao === 'asc' ? <FaSortUp /> : <FaSortDown />)}
                    </span>
                    <span onClick={() => handleOrdenacao('ordemServico')}>
                        Ordem de Serviço {ordenacao.campo === 'ordemServico' && (ordenacao.direcao === 'asc' ? <FaSortUp /> : <FaSortDown />)}
                    </span>
                    <span onClick={() => handleOrdenacao('responsavel')}>
                        Responsável {ordenacao.campo === 'responsavel' && (ordenacao.direcao === 'asc' ? <FaSortUp /> : <FaSortDown />)}
                    </span>
                    <span onClick={() => handleOrdenacao('empresa')}>
                        Empresa {ordenacao.campo === 'empresa' && (ordenacao.direcao === 'asc' ? <FaSortUp /> : <FaSortDown />)}
                    </span>
                    <span onClick={() => handleOrdenacao('equipe')}>
                        Equipe {ordenacao.campo === 'equipe' && (ordenacao.direcao === 'asc' ? <FaSortUp /> : <FaSortDown />)}
                    </span>
                    <span onClick={() => handleOrdenacao('dataInicial')}>
                        Data Inicial {ordenacao.campo === 'dataInicial' && (ordenacao.direcao === 'asc' ? <FaSortUp /> : <FaSortDown />)}
                    </span>
                    <span onClick={() => handleOrdenacao('dataFinal')}>
                        Data Final {ordenacao.campo === 'dataFinal' && (ordenacao.direcao === 'asc' ? <FaSortUp /> : <FaSortDown />)}
                    </span>
                    <span onClick={() => handleOrdenacao('conclusao')}>
                        Conclusão {ordenacao.campo === 'conclusao' && (ordenacao.direcao === 'asc' ? <FaSortUp /> : <FaSortDown />)}
                    </span>
                </div>
            );
        }
    };

    const renderPaginacao = (totalPaginas) => {
        return (
            <div className="paginacao">
                <div className="items-por-pagina">
                    <span>Itens por página:</span>
                    <select 
                        value={itemsPorPagina} 
                        onChange={(e) => {
                            setItemsPorPagina(Number(e.target.value));
                            setPaginaAtual(1);
                        }}
                    >
                        {ITEMS_PER_PAGE_OPTIONS.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>
                <div className="navegacao-paginas">
                    <button 
                        onClick={() => setPaginaAtual(prev => Math.max(1, prev - 1))}
                        disabled={paginaAtual === 1}
                    >
                        <FaArrowLeft />
                    </button>
                    <span>Página {paginaAtual} de {totalPaginas}</span>
                    <button 
                        onClick={() => setPaginaAtual(prev => Math.min(totalPaginas, prev + 1))}
                        disabled={paginaAtual === totalPaginas}
                    >
                        <FaArrowRight />
                    </button>
                </div>
            </div>
        );
    };

    const validarFormulario = () => {
        const erros = [];
        
        if (!novoApontamento.codigo) erros.push('Código é obrigatório');
        if (!novoApontamento.rodovia) erros.push('Rodovia é obrigatória');
        if (!novoApontamento.kmInicial) erros.push('KM Inicial é obrigatório');
        if (!novoApontamento.kmFinal) erros.push('KM Final é obrigatório');
        if (!novoApontamento.prazo) erros.push('Prazo é obrigatório');
        
        if (novoApontamento.kmFinal < novoApontamento.kmInicial) {
            erros.push('KM Final não pode ser menor que KM Inicial');
        }

        return erros;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const erros = validarFormulario();
        
        if (erros.length > 0) {
            alert(erros.join('\n'));
            return;
        }

        try {
            // Aqui você implementaria a chamada real à API
            setApontamentos([...apontamentos, novoApontamento]);
            setModalAberto(false);
            resetarFormulario();
        } catch (erro) {
            console.error('Erro ao salvar apontamento:', erro);
            alert('Erro ao salvar apontamento. Tente novamente.');
        }
    };

    const resetarFormulario = () => {
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
            status: 'Pendente',
            dataCriacao: new Date().toISOString().split('T')[0],
            prazo: '',
            dataExecucao: '',
            observacoes: '',
            evidencias: []
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNovoApontamento(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltrosAtivos(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const filtrarApontamentos = () => {
        return apontamentos.filter(apontamento => {
            const matchTexto = apontamento.codigo.toLowerCase().includes(filtroTexto.toLowerCase()) ||
                             apontamento.rodovia.toLowerCase().includes(filtroTexto.toLowerCase());
            
            const matchStatus = !filtrosAtivos.status || apontamento.status === filtrosAtivos.status;
            const matchEmpresa = !filtrosAtivos.empresa || apontamento.empresa === filtrosAtivos.empresa;
            
            return matchTexto && matchStatus && matchEmpresa;
        });
    };

    const exportarDados = () => {
        const dados = filtrarApontamentos();
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
        a.download = 'apontamentos.csv';
        a.click();
        window.URL.revokeObjectURL(url);
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
        return status.toLowerCase().replace(' ', '-');
    };

    return (
        <div className="controle-servicos">
            <div className="cabecalho">
                <h2>Controle de Serviços</h2>
                <div className="tabs">
                    <button 
                        className={`tab ${activeTab === 'apontamentos' ? 'active' : ''}`}
                        onClick={() => handleTabChange('apontamentos')}
                    >
                        Apontamentos
                    </button>
                    <button 
                        className={`tab ${activeTab === 'ordens-servico' ? 'active' : ''}`}
                        onClick={() => handleTabChange('ordens-servico')}
                    >
                        Ordem de Serviço
                    </button>
                </div>
            </div>
            
            <div className="top-bar">
                <div className="search-bar">
                    <FaSearch className="search-icon" />
                    <input 
                        type="text" 
                        placeholder={`Buscar ${activeTab === 'apontamentos' ? 'apontamento' : 'ordem de serviço'}...`}
                        value={filtroTexto} 
                        onChange={(e) => setFiltroTexto(e.target.value)} 
                    />
                </div>
                <div className="actions">
                    <button className="filter-btn" onClick={() => setModalAberto(true)}>
                        <FaFilter /> Filtros
                    </button>
                    <button className="download-btn" onClick={exportarDados}>
                        <FaDownload /> Exportar
                    </button>
                    {activeTab === 'apontamentos' && (
                        <button className="criar-apontamento" onClick={() => setModalAberto(true)}>
                            <FaPlus /> Novo Apontamento
                        </button>
                    )}
                </div>
            </div>

            <div className="tabela-container">
                {renderCabecalhoTabela(activeTab)}
                <div className="lista-items">
                    {activeTab === 'apontamentos' ? (
                        getDadosPaginados(ordenarDados(apontamentos)).map((apontamento) => (
                            <div 
                                key={apontamento.codigo} 
                                className="item-row"
                                onClick={() => setApontamentoSelecionado(apontamento)}
                            >
                                <span className="checkbox-column">
                                    <input
                                        type="checkbox"
                                        checked={apontamentosSelecionados.includes(apontamento.codigo)}
                                        onChange={(e) => {
                                            e.stopPropagation();
                                            handleSelecionarItem(apontamento.codigo, apontamentosSelecionados, setApontamentosSelecionados);
                                        }}
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
                                <span className={`status ${getStatusClass(apontamento.status)}`}>
                                    {apontamento.status}
                                </span>
                                <span>{apontamento.dataExecucao || ''}</span>
                                <span className="evidencias">
                                    <FaCamera /> {apontamento.evidencias.length}
                                </span>
                            </div>
                        ))
                    ) : (
                        getDadosPaginados(ordenarDados(ordensServico)).map((ordem) => (
                            <div 
                                key={ordem.codigo} 
                                className="item-row"
                                onClick={() => setOrdemServicoSelecionada(ordem)}
                            >
                                <span className="checkbox-column">
                                    <input
                                        type="checkbox"
                                        checked={ordensServicoSelecionadas.includes(ordem.codigo)}
                                        onChange={(e) => {
                                            e.stopPropagation();
                                            handleSelecionarItem(ordem.codigo, ordensServicoSelecionadas, setOrdensServicoSelecionadas);
                                        }}
                                    />
                                </span>
                                <span>{ordem.codigo}</span>
                                <span>{ordem.ordemServico}</span>
                                <span>{ordem.responsavel}</span>
                                <span>{ordem.empresa}</span>
                                <span>{ordem.equipe}</span>
                                <span>{ordem.dataInicial}</span>
                                <span>{ordem.dataFinal}</span>
                                <span className="conclusao">{ordem.conclusao}%</span>
                            </div>
                        ))
                    )}
                </div>
                {renderPaginacao(getTotalPaginas(activeTab === 'apontamentos' ? apontamentos : ordensServico))}
            </div>

            {apontamentoSelecionado && (
                <div className="modal-detalhes">
                    <div className="modal-content">
                        <button className="fechar-modal" onClick={() => setApontamentoSelecionado(null)}>
                            <FaTimes />
                        </button>
                        <h3>Detalhes do Apontamento</h3>
                        <div className="detalhes-grid">
                            <div className="detalhe-item">
                                <strong>Código:</strong>
                                <span>{apontamentoSelecionado.codigo}</span>
                            </div>
                            <div className="detalhe-item">
                                <strong>Rodovia:</strong>
                                <span>{apontamentoSelecionado.rodovia}</span>
                            </div>
                            <div className="detalhe-item">
                                <strong>KM Inicial:</strong>
                                <span>{apontamentoSelecionado.kmInicial}</span>
                            </div>
                            <div className="detalhe-item">
                                <strong>KM Final:</strong>
                                <span>{apontamentoSelecionado.kmFinal}</span>
                            </div>
                            <div className="detalhe-item">
                                <strong>Faixa:</strong>
                                <span>{apontamentoSelecionado.faixa}</span>
                            </div>
                            <div className="detalhe-item">
                                <strong>Empresa:</strong>
                                <span>{apontamentoSelecionado.empresa}</span>
                            </div>
                            <div className="detalhe-item">
                                <strong>Equipe:</strong>
                                <span>{apontamentoSelecionado.equipe}</span>
                            </div>
                            <div className="detalhe-item">
                                <strong>Categoria:</strong>
                                <span>{apontamentoSelecionado.classe}</span>
                            </div>
                            <div className="detalhe-item">
                                <strong>Status:</strong>
                                <span className={`status ${getStatusClass(apontamentoSelecionado.status)}`}>
                                    {apontamentoSelecionado.status}
                                </span>
                            </div>
                            <div className="detalhe-item">
                                <strong>Prazo:</strong>
                                <span className={`prazo ${getPrazoClass(apontamentoSelecionado.prazo)}`}>
                                    {apontamentoSelecionado.prazo}
                                </span>
                            </div>
                            <div className="detalhe-item">
                                <strong>Data de Execução:</strong>
                                <span>{apontamentoSelecionado.dataExecucao}</span>
                            </div>
                        </div>
                        <div className="acoes-detalhes">
                            <button className="btn-editar">
                                <FaEdit /> Editar
                            </button>
                            <button className="btn-excluir">
                                <FaTrashAlt /> Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {modalAberto && (
                <div className="modal-criar-apontamento">
                    <div className="modal-content">
                        <button className="fechar-modal" onClick={() => {
                            setModalAberto(false);
                            resetarFormulario();
                        }}>
                            <FaTimes />
                        </button>
                        <h3>Novo Apontamento</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Código *</label>
                                    <input 
                                        type="text" 
                                        name="codigo" 
                                        value={novoApontamento.codigo} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Rodovia *</label>
                                    <input 
                                        type="text" 
                                        name="rodovia" 
                                        value={novoApontamento.rodovia} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label>KM Inicial *</label>
                                    <input 
                                        type="text" 
                                        name="kmInicial" 
                                        value={novoApontamento.kmInicial} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label>KM Final *</label>
                                    <input 
                                        type="text" 
                                        name="kmFinal" 
                                        value={novoApontamento.kmFinal} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Sentido</label>
                                    <select 
                                        name="sentido" 
                                        value={novoApontamento.sentido} 
                                        onChange={handleChange}
                                    >
                                        <option value="">Selecione...</option>
                                        {SENTIDO_OPTIONS.map(sentido => (
                                            <option key={sentido} value={sentido}>{sentido}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Faixa</label>
                                    <select 
                                        name="faixa" 
                                        value={novoApontamento.faixa} 
                                        onChange={handleChange}
                                    >
                                        <option value="">Selecione...</option>
                                        {FAIXA_OPTIONS.map(faixa => (
                                            <option key={faixa} value={faixa}>{faixa}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Empresa</label>
                                    <input 
                                        type="text" 
                                        name="empresa" 
                                        value={novoApontamento.empresa} 
                                        onChange={handleChange} 
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Equipe</label>
                                    <input 
                                        type="text" 
                                        name="equipe" 
                                        value={novoApontamento.equipe} 
                                        onChange={handleChange} 
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Categoria</label>
                                    <input 
                                        type="text" 
                                        name="classe" 
                                        value={novoApontamento.classe} 
                                        onChange={handleChange} 
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Status</label>
                                    <select 
                                        name="status" 
                                        value={novoApontamento.status} 
                                        onChange={handleChange}
                                    >
                                        {STATUS_OPTIONS.map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Prazo *</label>
                                    <input 
                                        type="date" 
                                        name="prazo" 
                                        value={novoApontamento.prazo} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Data de Execução</label>
                                    <input 
                                        type="date" 
                                        name="dataExecucao" 
                                        value={novoApontamento.dataExecucao} 
                                        onChange={handleChange} 
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>Observações</label>
                                    <textarea 
                                        name="observacoes" 
                                        value={novoApontamento.observacoes} 
                                        onChange={handleChange}
                                        rows="4"
                                    />
                                </div>
                            </div>
                            <div className="form-actions">
                                <button type="button" className="btn-cancelar" onClick={() => {
                                    setModalAberto(false);
                                    resetarFormulario();
                                }}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-salvar">
                                    Salvar Apontamento
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ControleServicos;
