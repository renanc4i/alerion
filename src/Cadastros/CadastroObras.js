import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEdit, faTrash, faFilter } from '@fortawesome/free-solid-svg-icons';
import './CadastroObras.css';

const formatKM = (value) => {
  const numeric = value.replace(/\D/g, '');
  const limited = numeric.slice(0, 6);
  if (limited.length > 3) {
    return `${limited.slice(0, 3)}.${limited.slice(3)}`;
  }
  return limited;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
};

function CadastroObras({ onVoltar }) {
  const [selectedObra, setSelectedObra] = useState(null);
  const [obra, setObra] = useState({
    nomeProjeto: '',
    rodovia: '',
    kmInicial: '',
    kmFinal: '',
    sentido: '',
    dataInicio: '',
    prazoEntrega: '',
    empresaResponsavel: '',
    statusProjeto: '',
    tipoObra: '',
    empresaExecutora: '',
    valorEstimado: '',
    responsavelTecnico: ''
  });

  const [obrasList, setObrasList] = useState(() => {
    const savedObras = localStorage.getItem('obras');
    return savedObras ? JSON.parse(savedObras) : [];
  });

  const [editingIndex, setEditingIndex] = useState(null);

  // Estados para os filtros
  const [showFiltros, setShowFiltros] = useState(false);
  const [filters, setFilters] = useState({
    nomeProjeto: '',
    rodovia: '',
    kmInicial: '',
    kmFinal: '',
    sentido: '',
    empresaResponsavel: '',
    statusProjeto: ''
  });

  useEffect(() => {
    localStorage.setItem('obras', JSON.stringify(obrasList));
  }, [obrasList]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'kmInicial' || name === 'kmFinal') {
      setObra({ ...obra, [name]: formatKM(value) });
    } else if (name === 'valorEstimado') {
      let numericValue = value.replace(/\D/g, '');
      let formattedValue = (Number(numericValue) / 100).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });
      setObra({ ...obra, [name]: formattedValue });
    } else {
      setObra({ ...obra, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingIndex !== null) {
      const updatedList = [...obrasList];
      updatedList[editingIndex] = obra;
      setObrasList(updatedList);
      setEditingIndex(null);
    } else {
      setObrasList([...obrasList, obra]);
    }
    setObra({
      nomeProjeto: '',
      rodovia: '',
      kmInicial: '',
      kmFinal: '',
      sentido: '',
      dataInicio: '',
      prazoEntrega: '',
      empresaResponsavel: '',
      statusProjeto: '',
      tipoObra: '',
      empresaExecutora: '',
      valorEstimado: '',
      responsavelTecnico: ''
    });
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setObra(obrasList[index]);
  };

  const handleDelete = (index) => {
    const updatedList = obrasList.filter((_, i) => i !== index);
    setObrasList(updatedList);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredObras = obrasList.filter((obra) => {
    return (
      (filters.nomeProjeto === '' || obra.nomeProjeto.toLowerCase().includes(filters.nomeProjeto.toLowerCase())) &&
      (filters.rodovia === '' || obra.rodovia.toLowerCase().includes(filters.rodovia.toLowerCase())) &&
      (filters.kmInicial === '' || obra.kmInicial.includes(filters.kmInicial)) &&
      (filters.kmFinal === '' || obra.kmFinal.includes(filters.kmFinal)) &&
      (filters.sentido === '' || obra.sentido.toLowerCase().includes(filters.sentido.toLowerCase())) &&
      (filters.empresaResponsavel === '' || obra.empresaResponsavel.toLowerCase().includes(filters.empresaResponsavel.toLowerCase())) &&
      (filters.statusProjeto === '' || obra.statusProjeto.toLowerCase().includes(filters.statusProjeto.toLowerCase()))
    );
  });

  return (
    <div className="cadastro-container">
      <div className="header-container">
        <button onClick={onVoltar} className="back-button">
          <FontAwesomeIcon icon={faArrowLeft} /> Voltar
        </button>
        <h1 className="title">Cadastro de Obras</h1>
      </div>

      <form onSubmit={handleSubmit} className="form-container">
        {/* Primeira linha do formulário */}
        <div className="form-row">
          <div className="input-group">
            <label>Nome do Projeto</label>
            <input type="text" name="nomeProjeto" value={obra.nomeProjeto} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Rodovia</label>
            <input type="text" name="rodovia" value={obra.rodovia} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>KM Inicial</label>
            <input type="text" name="kmInicial" value={obra.kmInicial} onChange={handleChange} required maxLength={7} />
          </div>
          <div className="input-group">
            <label>KM Final</label>
            <input type="text" name="kmFinal" value={obra.kmFinal} onChange={handleChange} required maxLength={7} />
          </div>
          <div className="input-group">
            <label>Sentido</label>
            <select name="sentido" value={obra.sentido} onChange={handleChange} required>
              <option value="">Selecione...</option>
              <option value="Norte">Norte</option>
              <option value="Sul">Sul</option>
              <option value="Leste">Leste</option>
              <option value="Oeste">Oeste</option>
              <option value="Norte e Sul">Norte e Sul</option>
              <option value="Leste e Oeste">Leste e Oeste</option>
            </select>
          </div>
        </div>

        {/* Segunda linha do formulário */}
        <div className="form-row">
          <div className="input-group">
            <label>Início da Obra</label>
            <input type="date" name="dataInicio" value={obra.dataInicio} onChange={handleChange} />
          </div>
          <div className="input-group">
            <label>Prazo de Entrega</label>
            <input type="date" name="prazoEntrega" value={obra.prazoEntrega} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Empresa Responsável</label>
            <input type="text" name="empresaResponsavel" value={obra.empresaResponsavel} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Status do Projeto</label>
            <select name="statusProjeto" value={obra.statusProjeto} onChange={handleChange} required>
              <option value="">Selecione...</option>
              <option value="Não Iniciado">Não Iniciado</option>
              <option value="Em Andamento">Em Andamento</option>
              <option value="Atrasado">Atrasado</option>
              <option value="Concluído">Concluído</option>
            </select>
          </div>
        </div>

        {/* Terceira linha do formulário */}
        <div className="form-row">
          <div className="input-group">
            <label>Tipo de Obra</label>
            <select name="tipoObra" value={obra.tipoObra} onChange={handleChange} required>
              <option value="">Selecione...</option>
              <option value="Pavimentação">Pavimentação</option>
              <option value="Drenagem">Drenagem</option>
              <option value="Sinalização">Sinalização</option>
              <option value="Construção de Pontes">Construção de Pontes</option>
              <option value="Outros">Outros</option>
            </select>
          </div>
          <div className="input-group">
            <label>Empresa Executora</label>
            <input type="text" name="empresaExecutora" value={obra.empresaExecutora} onChange={handleChange} required />
          </div>
        </div>

        {/* Quarta linha do formulário */}
        <div className="form-row">
          <div className="input-group">
            <label>Valor Estimado da Obra</label>
            <input type="text" name="valorEstimado" value={obra.valorEstimado} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Responsável Técnico</label>
            <input type="text" name="responsavelTecnico" value={obra.responsavelTecnico} onChange={handleChange} required />
          </div>
        </div>

        <button type="submit" className="submit-button">
          {editingIndex !== null ? 'Atualizar Obra' : 'Cadastrar Obra'}
        </button>
      </form>

      {/* Título "Obras Cadastradas" */}
      <h2 className="subtitle">Obras Cadastradas</h2>

      {/* Filtros */}
      <div className="filtros-container">
        <button className="filtro-toggle-button" onClick={() => setShowFiltros(!showFiltros)}>
          <FontAwesomeIcon icon={faFilter} /> Filtros
        </button>
        {showFiltros && (
          <div className="filtros-content">
            <div className="filtro-group">
              <label>Filtrar por Nome do Projeto:</label>
              <input
                type="text"
                name="nomeProjeto"
                value={filters.nomeProjeto}
                onChange={handleFilterChange}
                placeholder="Nome do Projeto"
              />
            </div>
            <div className="filtro-group">
              <label>Filtrar por Rodovia:</label>
              <input
                type="text"
                name="rodovia"
                value={filters.rodovia}
                onChange={handleFilterChange}
                placeholder="Rodovia"
              />
            </div>
            <div className="filtro-group">
              <label>Filtrar por KM Inicial:</label>
              <input
                type="text"
                name="kmInicial"
                value={filters.kmInicial}
                onChange={handleFilterChange}
                placeholder="KM Inicial"
              />
            </div>
            <div className="filtro-group">
              <label>Filtrar por KM Final:</label>
              <input
                type="text"
                name="kmFinal"
                value={filters.kmFinal}
                onChange={handleFilterChange}
                placeholder="KM Final"
              />
            </div>
            <div className="filtro-group">
              <label>Filtrar por Sentido:</label>
              <input
                type="text"
                name="sentido"
                value={filters.sentido}
                onChange={handleFilterChange}
                placeholder="Sentido"
              />
            </div>
            <div className="filtro-group">
              <label>Filtrar por Empresa Responsável:</label>
              <input
                type="text"
                name="empresaResponsavel"
                value={filters.empresaResponsavel}
                onChange={handleFilterChange}
                placeholder="Empresa Responsável"
              />
            </div>
            <div className="filtro-group">
              <label>Filtrar por Status:</label>
              <input
                type="text"
                name="statusProjeto"
                value={filters.statusProjeto}
                onChange={handleFilterChange}
                placeholder="Status do Projeto"
              />
            </div>
          </div>
        )}
      </div>

      {/* Exibição em Cards */}
      {filteredObras.length > 0 ? (
        <div className="cards-container">
          {filteredObras.map((obra, index) => (
            <div key={index} className="card" onClick={() => setSelectedObra(obra)}>
              <h3>{obra.nomeProjeto}</h3>
              <p><strong>Rodovia:</strong> {obra.rodovia}</p>
              <p><strong>KM Inicial:</strong> {obra.kmInicial}</p>
              <p><strong>KM Final:</strong> {obra.kmFinal}</p>
              <p><strong>Sentido:</strong> {obra.sentido}</p>
              <p><strong>Início da Obra:</strong> {formatDate(obra.dataInicio)}</p>
              <p><strong>Prazo de Entrega:</strong> {formatDate(obra.prazoEntrega)}</p>
              <p><strong>Empresa Responsável:</strong> {obra.empresaResponsavel}</p>
              <p><strong>Status:</strong> {obra.statusProjeto}</p>
              <div className="icon-buttons">
                <FontAwesomeIcon
                  icon={faEdit}
                  className="action-icon edit-icon"
                  onClick={(e) => { e.stopPropagation(); handleEdit(index); }}
                  title="Editar"
                />
                <FontAwesomeIcon
                  icon={faTrash}
                  className="action-icon delete-icon"
                  onClick={(e) => { e.stopPropagation(); handleDelete(index); }}
                  title="Excluir"
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Nenhuma obra encontrada.</p>
      )}

      {selectedObra && (
        <div className="modal-overlay" onClick={() => setSelectedObra(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Detalhes da Obra</h2>
            <p><strong>Tipo de Obra:</strong> {selectedObra.tipoObra}</p>
            <p><strong>Valor Estimado:</strong> {selectedObra.valorEstimado}</p>
            <p><strong>Responsável Técnico:</strong> {selectedObra.responsavelTecnico}</p>
            <button onClick={() => setSelectedObra(null)} className="close-button">Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CadastroObras;
