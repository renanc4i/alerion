import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEdit, faTrash, faFilter } from '@fortawesome/free-solid-svg-icons';
import './CadastroContratos.css';

// Função auxiliar para formatar datas para DD/MM/YYYY
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
};

function MultiSelectDropdown({ options, selectedValues, onChange, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button
        type="button"
        className="dropdown-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedValues.length > 0 ? selectedValues.join(', ') : placeholder}
        <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          {options.map((option) => (
            <label key={option} className="dropdown-option">
              <input
                type="checkbox"
                value={option}
                checked={selectedValues.includes(option)}
                onChange={(e) => {
                  const { value, checked } = e.target;
                  let newValues = [...selectedValues];
                  if (checked) {
                    newValues.push(value);
                  } else {
                    newValues = newValues.filter(v => v !== value);
                  }
                  onChange(newValues);
                }}
              />
              {option}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

function CadastroContratos({ onVoltar }) {
  const [selectedContrato, setSelectedContrato] = useState(null);
  const [contrato, setContrato] = useState({
    numeroContrato: '',
    cliente: '',
    fornecedor: '',
    dataInicio: '',
    dataFim: '',
    valor: '',
    tipoContrato: '',
    objetoContrato: '',
    fiscalContrato: '',
    medicoesPrevistas: '',
    formaPagamento: ''
  });

  const [contratosList, setContratosList] = useState(() => {
    const savedContratos = localStorage.getItem('contratos');
    return savedContratos ? JSON.parse(savedContratos) : [];
  });

  const [filters, setFilters] = useState({
    numeroContrato: '',
    cliente: '',
    fornecedor: '',
    dataInicio: '',
    dataFim: '',
    valor: '',
    tipoContrato: '',
    objetoContrato: '',
    fiscalContrato: '',
    medicoesPrevistas: '',
    formaPagamento: ''
  });

  const [editingIndex, setEditingIndex] = useState(null);
  const [showFiltros, setShowFiltros] = useState(false);

  useEffect(() => {
    localStorage.setItem('contratos', JSON.stringify(contratosList));
  }, [contratosList]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'valor') {
      let numericValue = value.replace(/\D/g, '');
      let formattedValue = (Number(numericValue) / 100).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });
      setContrato({ ...contrato, [name]: formattedValue });
    } else {
      setContrato({ ...contrato, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingIndex !== null) {
      const updatedList = [...contratosList];
      updatedList[editingIndex] = contrato;
      setContratosList(updatedList);
      setEditingIndex(null);
    } else {
      setContratosList([...contratosList, contrato]);
    }
    setContrato({
      numeroContrato: '',
      cliente: '',
      fornecedor: '',
      dataInicio: '',
      dataFim: '',
      valor: '',
      tipoContrato: '',
      objetoContrato: '',
      fiscalContrato: '',
      medicoesPrevistas: '',
      formaPagamento: ''
    });
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setContrato(contratosList[index]);
  };

  const handleDelete = (index) => {
    const updatedList = contratosList.filter((_, i) => i !== index);
    setContratosList(updatedList);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const filteredContratos = contratosList.filter((contrato) => {
    return (
      (filters.numeroContrato === '' || contrato.numeroContrato.toLowerCase().includes(filters.numeroContrato.toLowerCase())) &&
      (filters.cliente === '' || contrato.cliente.toLowerCase().includes(filters.cliente.toLowerCase())) &&
      (filters.fornecedor === '' || contrato.fornecedor.toLowerCase().includes(filters.fornecedor.toLowerCase())) &&
      (filters.dataInicio === '' || contrato.dataInicio.includes(filters.dataInicio)) &&
      (filters.dataFim === '' || contrato.dataFim.includes(filters.dataFim)) &&
      (filters.valor === '' || contrato.valor.includes(filters.valor)) &&
      (filters.tipoContrato === '' || contrato.tipoContrato.toLowerCase().includes(filters.tipoContrato.toLowerCase())) &&
      (filters.objetoContrato === '' || contrato.objetoContrato.toLowerCase().includes(filters.objetoContrato.toLowerCase())) &&
      (filters.fiscalContrato === '' || contrato.fiscalContrato.toLowerCase().includes(filters.fiscalContrato.toLowerCase())) &&
      (filters.medicoesPrevistas === '' || contrato.medicoesPrevistas.includes(filters.medicoesPrevistas)) &&
      (filters.formaPagamento === '' || contrato.formaPagamento.toLowerCase().includes(filters.formaPagamento.toLowerCase()))
    );
  });

  return (
    <div className="cadastro-contratos-container">
      {/* Cabeçalho */}
      <div className="header-container">
        <button onClick={onVoltar} className="back-button">
          <FontAwesomeIcon icon={faArrowLeft} /> Voltar
        </button>
        <h1 className="title">Cadastro de Contratos</h1>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-row">
          <div className="input-group">
            <label>Número do Contrato</label>
            <input
              type="text"
              name="numeroContrato"
              value={contrato.numeroContrato}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Contratante</label>
            <input
              type="text"
              name="cliente"
              value={contrato.cliente}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Contratada</label>
            <input
              type="text"
              name="fornecedor"
              value={contrato.fornecedor}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="input-group">
            <label>Objeto do Contrato</label>
            <input
              type="text"
              name="objetoContrato"
              value={contrato.objetoContrato}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Fiscal do Contrato</label>
            <input
              type="text"
              name="fiscalContrato"
              value={contrato.fiscalContrato}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="input-group">
            <label>Data de Início</label>
            <input
              type="date"
              name="dataInicio"
              value={contrato.dataInicio}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Data de Término</label>
            <input
              type="date"
              name="dataFim"
              value={contrato.dataFim}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Valor do Contrato (R$)</label>
            <input
              type="text"
              name="valor"
              value={contrato.valor}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="input-group">
            <label>Medições Previstas</label>
            <input
              type="number"
              name="medicoesPrevistas"
              value={contrato.medicoesPrevistas}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Forma de Pagamento</label>
            <select
              name="formaPagamento"
              value={contrato.formaPagamento}
              onChange={handleChange}
              required
            >
              <option value="">Selecione...</option>
              <option value="Mensal">Mensal</option>
              <option value="Por Medição">Por Medição</option>
              <option value="Por Etapa">Por Etapa</option>
            </select>
          </div>
        </div>

        <button type="submit" className="submit-button">
          {editingIndex !== null ? 'Atualizar Contrato' : 'Cadastrar Contrato'}
        </button>
      </form>

      {/* Filtros */}
      <div className="filtros-container">
        <button className="filtro-toggle-button" onClick={() => setShowFiltros(!showFiltros)}>
          <FontAwesomeIcon icon={faFilter} /> Filtros
        </button>
        {showFiltros && (
          <div className="filtros-content">
            <div className="filtro-group">
              <label>Filtrar por Número:</label>
              <input
                type="text"
                name="numeroContrato"
                value={filters.numeroContrato}
                onChange={handleFilterChange}
                placeholder="Número"
              />
            </div>
            <div className="filtro-group">
              <label>Filtrar por Contratante:</label>
              <input
                type="text"
                name="cliente"
                value={filters.cliente}
                onChange={handleFilterChange}
                placeholder="Contratante"
              />
            </div>
            <div className="filtro-group">
              <label>Filtrar por Contratada:</label>
              <input
                type="text"
                name="fornecedor"
                value={filters.fornecedor}
                onChange={handleFilterChange}
                placeholder="Contratada"
              />
            </div>
            <div className="filtro-group">
              <label>Filtrar por Data de Início:</label>
              <input
                type="date"
                name="dataInicio"
                value={filters.dataInicio}
                onChange={handleFilterChange}
                placeholder="Data de Início"
              />
            </div>
            <div className="filtro-group">
              <label>Filtrar por Data de Término:</label>
              <input
                type="date"
                name="dataFim"
                value={filters.dataFim}
                onChange={handleFilterChange}
                placeholder="Data de Término"
              />
            </div>
            <div className="filtro-group">
              <label>Filtrar por Valor:</label>
              <input
                type="text"
                name="valor"
                value={filters.valor}
                onChange={handleFilterChange}
                placeholder="Valor"
              />
            </div>
            <div className="filtro-group">
              <label>Filtrar por Fiscal:</label>
              <input
                type="text"
                name="fiscalContrato"
                value={filters.fiscalContrato}
                onChange={handleFilterChange}
                placeholder="Fiscal"
              />
            </div>
            <div className="filtro-group">
              <label>Filtrar por Forma de Pagamento:</label>
              <input
                type="text"
                name="formaPagamento"
                value={filters.formaPagamento}
                onChange={handleFilterChange}
                placeholder="Forma de Pagamento"
              />
            </div>
          </div>
        )}
      </div>

      {/* Cards de Contratos */}
      <h2 className="title">Contratos Cadastrados</h2>
      {filteredContratos.length > 0 ? (
        <div className="cards-container">
          {filteredContratos.map((contrato, index) => (
            <div key={index} className="card">
              <h3>{contrato.numeroContrato}</h3>
              <p><strong>Contratante:</strong> {contrato.cliente}</p>
              <p><strong>Contratada:</strong> {contrato.fornecedor}</p>
              <p><strong>Data de Início:</strong> {formatDate(contrato.dataInicio)}</p>
              <p><strong>Data de Término:</strong> {formatDate(contrato.dataFim)}</p>
              <p><strong>Valor:</strong> {contrato.valor}</p>
              <p><strong>Fiscal:</strong> {contrato.fiscalContrato}</p>
              <div className="icon-buttons">
                <FontAwesomeIcon
                  icon={faEdit}
                  className="action-icon edit-icon"
                  onClick={() => handleEdit(index)}
                  title="Editar"
                />
                <FontAwesomeIcon
                  icon={faTrash}
                  className="action-icon delete-icon"
                  onClick={() => handleDelete(index)}
                  title="Excluir"
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Nenhum contrato encontrado.</p>
      )}

      {/* Modal de Detalhes */}
      {selectedContrato && (
        <div className="modal-overlay" onClick={() => setSelectedContrato(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Detalhes do Contrato</h2>
            <p><strong>Número:</strong> {selectedContrato.numeroContrato}</p>
            <p><strong>Contratante:</strong> {selectedContrato.cliente}</p>
            <p><strong>Contratada:</strong> {selectedContrato.fornecedor}</p>
            <p><strong>Objeto:</strong> {selectedContrato.objetoContrato}</p>
            <p><strong>Medições Previstas:</strong> {selectedContrato.medicoesPrevistas}</p>
            <p><strong>Forma de Pagamento:</strong> {selectedContrato.formaPagamento}</p>
            <button onClick={() => setSelectedContrato(null)} className="close-button">Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CadastroContratos;