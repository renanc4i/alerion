import React, { useState, useEffect, useRef } from 'react'; // Adicione useRef aqui
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faFilter } from '@fortawesome/free-solid-svg-icons';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './CadastroMateriais.css'

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

function CadastroMateriais({ onVoltar }) {
  const [material, setMaterial] = useState({
    codigo: '',
    nome: '',
    categoria: '',
    quantidade: '',
    unidade: '',
    fornecedor: ''
  });

  const [materiaisList, setMateriaisList] = useState(() => {
    const savedMateriais = localStorage.getItem('materiais');
    return savedMateriais ? JSON.parse(savedMateriais) : [];
  });

  const [filters, setFilters] = useState({
    codigo: '',
    nome: '',
    categoria: '',
    quantidade: '',
    unidade: '',
    fornecedor: ''
  });

  const [editingIndex, setEditingIndex] = useState(null);
  const [showFiltros, setShowFiltros] = useState(false);

  useEffect(() => {
    localStorage.setItem('materiais', JSON.stringify(materiaisList));
  }, [materiaisList]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMaterial({ ...material, [name]: name === 'quantidade' ? value.replace(/\D/g, '') : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (material.quantidade === '') {
      alert("Por favor, insira a quantidade.");
      return;
    }

    if (editingIndex !== null) {
      const updatedList = [...materiaisList];
      updatedList[editingIndex] = material;
      setMateriaisList(updatedList);
      setEditingIndex(null);
    } else {
      setMateriaisList([...materiaisList, material]);
    }

    setMaterial({ codigo: '', nome: '', categoria: '', quantidade: '', unidade: '', fornecedor: '' });
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setMaterial(materiaisList[index]);
  };

  const handleDelete = (index) => {
    setMateriaisList(materiaisList.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
      setMaterial({ codigo: '', nome: '', categoria: '', quantidade: '', unidade: '', fornecedor: '' });
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const filteredMateriais = materiaisList.filter((mat) => {
    return (
      (filters.codigo === '' || mat.codigo.toLowerCase().includes(filters.codigo.toLowerCase())) &&
      (filters.nome === '' || mat.nome.toLowerCase().includes(filters.nome.toLowerCase())) &&
      (filters.categoria === '' || mat.categoria.toLowerCase().includes(filters.categoria.toLowerCase())) &&
      (filters.quantidade === '' || mat.quantidade.includes(filters.quantidade)) &&
      (filters.unidade === '' || mat.unidade.toLowerCase().includes(filters.unidade.toLowerCase())) &&
      (filters.fornecedor === '' || mat.fornecedor.toLowerCase().includes(filters.fornecedor.toLowerCase()))
    );
  });

  return (
    <div className="cadastro-materiais-container">
      {/* Cabeçalho */}
      <div className="header-container">
        <button onClick={onVoltar} className="back-button">
          <FontAwesomeIcon icon={faArrowLeft} /> Voltar
        </button>
        <h1 className="title">Cadastro de Materiais e Equipamentos</h1>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-row">
          <div className="input-group">
            <label>Código do Material/Equipamento:</label>
            <input
              type="text"
              name="codigo"
              value={material.codigo}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Nome</label>
            <input
              type="text"
              name="nome"
              value={material.nome}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Categoria</label>
            <input
              type="text"
              name="categoria"
              value={material.categoria}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="input-group">
            <label>Quantidade</label>
            <input
              type="number"
              name="quantidade"
              value={material.quantidade}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Unidade de Medida</label>
            <select
              name="unidade"
              value={material.unidade}
              onChange={handleChange}
              required
            >
              <option value="">Selecione...</option>
              <option value="mm">mm</option>
              <option value="cm">cm</option>
              <option value="m">m</option>
              <option value="m3">m³</option>
              <option value="kg">Kg</option>
              <option value="ton">Ton</option>
              <option value="litro">Litro</option>
              <option value="pacote">Pacote</option>
              <option value="peça">Peça</option>
              <option value="unidade">Unidade</option>
            </select>
          </div>
          <div className="input-group">
            <label>Fornecedor</label>
            <input
              type="text"
              name="fornecedor"
              value={material.fornecedor}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <button type="submit" className="submit-button">
          {editingIndex !== null ? 'Atualizar Material' : 'Cadastrar Material'}
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
              <label>Filtrar por Código:</label>
              <input
                type="text"
                name="codigo"
                value={filters.codigo}
                onChange={handleFilterChange}
                placeholder="Código"
              />
            </div>
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
              <label>Filtrar por Categoria:</label>
              <input
                type="text"
                name="categoria"
                value={filters.categoria}
                onChange={handleFilterChange}
                placeholder="Categoria"
              />
            </div>
            <div className="filtro-group">
              <label>Filtrar por Quantidade:</label>
              <input
                type="text"
                name="quantidade"
                value={filters.quantidade}
                onChange={handleFilterChange}
                placeholder="Quantidade"
              />
            </div>
            <div className="filtro-group">
              <label>Filtrar por Unidade:</label>
              <input
                type="text"
                name="unidade"
                value={filters.unidade}
                onChange={handleFilterChange}
                placeholder="Unidade"
              />
            </div>
            <div className="filtro-group">
              <label>Filtrar por Fornecedor:</label>
              <input
                type="text"
                name="fornecedor"
                value={filters.fornecedor}
                onChange={handleFilterChange}
                placeholder="Fornecedor"
              />
            </div>
          </div>
        )}
      </div>

      {/* Cards de Materiais */}
      <h2 className="title">Materiais e Equipamentos Cadastrados</h2>
      {filteredMateriais.length > 0 ? (
        <div className="cards-container">
          {filteredMateriais.map((mat, index) => (
            <div key={index} className="card">
              <h3>{mat.nome}</h3>
              <p><strong>Código:</strong> {mat.codigo}</p>
              <p><strong>Categoria:</strong> {mat.categoria}</p>
              <p><strong>Quantidade:</strong> {mat.quantidade}</p>
              <p><strong>Unidade:</strong> {mat.unidade}</p>
              <p><strong>Fornecedor:</strong> {mat.fornecedor}</p>
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
        <p>Nenhum material encontrado.</p>
      )}
    </div>
  );
}

export default CadastroMateriais;