import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEdit, faTrash, faFilter } from '@fortawesome/free-solid-svg-icons';
import './CadastroEquipe.css';

// Funções de formatação
const formatCPF = (value) => {
  const onlyNums = value.replace(/\D/g, '');
  if (onlyNums.length <= 3) return onlyNums;
  if (onlyNums.length <= 6) return `${onlyNums.slice(0, 3)}.${onlyNums.slice(3)}`;
  if (onlyNums.length <= 9) return `${onlyNums.slice(0, 3)}.${onlyNums.slice(3, 6)}.${onlyNums.slice(6)}`;
  return `${onlyNums.slice(0, 3)}.${onlyNums.slice(3, 6)}.${onlyNums.slice(6, 9)}-${onlyNums.slice(9, 11)}`;
};

const formatTelefone = (value) => {
  const onlyNums = value.replace(/\D/g, '');
  if (onlyNums.length < 3) return onlyNums;
  if (onlyNums.length <= 6) return `(${onlyNums.slice(0, 2)}) ${onlyNums.slice(2)}`;
  if (onlyNums.length <= 10) return `(${onlyNums.slice(0, 2)}) ${onlyNums.slice(2, 6)}-${onlyNums.slice(6)}`;
  return `(${onlyNums.slice(0, 2)}) ${onlyNums.slice(2, 7)}-${onlyNums.slice(7, 11)}`;
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

function CadastroEquipe({ onVoltar }) {
  const [colaborador, setColaborador] = useState({
    nome: '',
    cpf: '',
    cargo: '',
    departamento: '',
    email: '',
    telefone: '',
    status: 'Ativo'
  });

  const [equipeList, setEquipeList] = useState(() => {
    const savedEquipe = localStorage.getItem('equipe');
    return savedEquipe ? JSON.parse(savedEquipe) : [];
  });

  const [filters, setFilters] = useState({
    nome: '',
    cpf: '',
    cargo: '',
    departamento: '',
    email: '',
    telefone: '',
    status: ''
  });

  const [editingIndex, setEditingIndex] = useState(null);
  const [showFiltros, setShowFiltros] = useState(false);

  useEffect(() => {
    localStorage.setItem('equipe', JSON.stringify(equipeList));
  }, [equipeList]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'telefone') {
      setColaborador({ ...colaborador, [name]: formatTelefone(value) });
    } else if (name === 'cpf') {
      setColaborador({ ...colaborador, [name]: formatCPF(value) });
    } else {
      setColaborador({ ...colaborador, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingIndex !== null) {
      const updatedList = [...equipeList];
      updatedList[editingIndex] = colaborador;
      setEquipeList(updatedList);
      setEditingIndex(null);
    } else {
      setEquipeList([...equipeList, colaborador]);
    }
    setColaborador({
      nome: '',
      cpf: '',
      cargo: '',
      departamento: '',
      email: '',
      telefone: '',
      status: 'Ativo'
    });
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setColaborador(equipeList[index]);
  };

  const handleDelete = (index) => {
    const updatedList = equipeList.filter((_, i) => i !== index);
    setEquipeList(updatedList);
    if (editingIndex === index) {
      setEditingIndex(null);
      setColaborador({
        nome: '',
        cpf: '',
        cargo: '',
        departamento: '',
        email: '',
        telefone: '',
        status: 'Ativo'
      });
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const filteredEquipe = equipeList.filter((colaborador) => {
    return (
      (filters.nome === '' || colaborador.nome.toLowerCase().includes(filters.nome.toLowerCase())) &&
      (filters.cpf === '' || colaborador.cpf.includes(filters.cpf)) &&
      (filters.cargo === '' || colaborador.cargo.toLowerCase().includes(filters.cargo.toLowerCase())) &&
      (filters.departamento === '' || colaborador.departamento.toLowerCase().includes(filters.departamento.toLowerCase())) &&
      (filters.email === '' || colaborador.email.toLowerCase().includes(filters.email.toLowerCase())) &&
      (filters.telefone === '' || colaborador.telefone.includes(filters.telefone)) &&
      (filters.status === '' || colaborador.status.toLowerCase().includes(filters.status.toLowerCase()))
    );
  });

  return (
    <div className="cadastro-equipe-container">
      {/* Cabeçalho */}
      <div className="header-container">
        <button onClick={onVoltar} className="back-button">
          <FontAwesomeIcon icon={faArrowLeft} /> Voltar
        </button>
        <h1 className="title">Cadastro de Colaboradores</h1>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-row">
          <div className="input-group">
            <label>Nome Completo</label>
            <input
              type="text"
              name="nome"
              value={colaborador.nome}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>CPF</label>
            <input
              type="text"
              name="cpf"
              value={colaborador.cpf}
              onChange={handleChange}
              required
              maxLength={14}
            />
          </div>
          <div className="input-group">
            <label>Cargo</label>
            <input
              type="text"
              name="cargo"
              value={colaborador.cargo}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Departamento</label>
            <input
              type="text"
              name="departamento"
              value={colaborador.departamento}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="input-group">
            <label>E-mail</label>
            <input
              type="email"
              name="email"
              value={colaborador.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Telefone</label>
            <input
              type="tel"
              name="telefone"
              value={colaborador.telefone}
              onChange={handleChange}
              required
              maxLength={15}
            />
          </div>
          <div className="input-group">
            <label>Status do Funcionário</label>
            <select
              name="status"
              value={colaborador.status}
              onChange={handleChange}
              required
            >
              <option value="Ativo">Ativo</option>
              <option value="Afastado">Afastado</option>
              <option value="Demitido">Demitido</option>
            </select>
          </div>
        </div>

        <button type="submit" className="submit-button">
          {editingIndex !== null ? 'Atualizar Colaborador' : 'Cadastrar Colaborador'}
        </button>
      </form>

      {/* Título e Botão de Filtro */}
      <h2 className="title">Equipe Cadastrada</h2>
      <div className="filtros-container">
        <button className="filtro-toggle-button" onClick={() => setShowFiltros(!showFiltros)}>
          <FontAwesomeIcon icon={faFilter} /> {showFiltros ? 'Ocultar Filtros' : 'Mostrar Filtros'}
        </button>
        {showFiltros && (
          <div className="filtros-content">
            {/* Primeira linha com 4 filtros */}
            <div className="filtro-row">
              <div className="filtro-group">
                <label>Filtrar por Nome:</label>
                <input
                  type="text"
                  name="nome"
                  value={filters.nome}
                  onChange={handleFilterChange}
                  placeholder="Nome"
                />
              </div>
              <div className="filtro-group">
                <label>Filtrar por CPF:</label>
                <input
                  type="text"
                  name="cpf"
                  value={filters.cpf}
                  onChange={handleFilterChange}
                  placeholder="CPF"
                />
              </div>
              <div className="filtro-group">
                <label>Filtrar por Cargo:</label>
                <input
                  type="text"
                  name="cargo"
                  value={filters.cargo}
                  onChange={handleFilterChange}
                  placeholder="Cargo"
                />
              </div>
              <div className="filtro-group">
                <label>Filtrar por Departamento:</label>
                <input
                  type="text"
                  name="departamento"
                  value={filters.departamento}
                  onChange={handleFilterChange}
                  placeholder="Departamento"
                />
              </div>
            </div>

            {/* Segunda linha com 3 filtros */}
            <div className="filtro-row">
              <div className="filtro-group">
                <label>Filtrar por E-mail:</label>
                <input
                  type="text"
                  name="email"
                  value={filters.email}
                  onChange={handleFilterChange}
                  placeholder="E-mail"
                />
              </div>
              <div className="filtro-group">
                <label>Filtrar por Telefone:</label>
                <input
                  type="text"
                  name="telefone"
                  value={filters.telefone}
                  onChange={handleFilterChange}
                  placeholder="Telefone"
                />
              </div>
              <div className="filtro-group">
                <label>Filtrar por Status:</label>
                <input
                  type="text"
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  placeholder="Status"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cards de Colaboradores */}
      {filteredEquipe.length > 0 ? (
        <div className="cards-container">
          {filteredEquipe.map((colaborador, index) => (
            <div key={index} className="card">
              <h3>{colaborador.nome}</h3>
              <p><strong>CPF:</strong> {colaborador.cpf}</p>
              <p><strong>Cargo:</strong> {colaborador.cargo}</p>
              <p><strong>Departamento:</strong> {colaborador.departamento}</p>
              <p><strong>Status:</strong> {colaborador.status}</p>
              <p><strong>E-mail:</strong> {colaborador.email}</p>
              <p><strong>Telefone:</strong> {colaborador.telefone}</p>
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
        <p>Nenhum colaborador encontrado.</p>
      )}
    </div>
  );
}

export default CadastroEquipe;