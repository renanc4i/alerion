import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEdit, faTrash, faFilter } from '@fortawesome/free-solid-svg-icons';
import './CadastroFrota.css';

// Função para formatar a placa no padrão "AAA-0000"
const formatPlaca = (value) => {
  let formatted = value.toUpperCase().replace(/[^A-Z0-9]/g, ""); // Remove caracteres inválidos e transforma em maiúsculas

  if (formatted.length > 7) {
    formatted = formatted.slice(0, 7); // Limita a 7 caracteres (3 letras + 4 números)
  }

  if (formatted.length > 3) {
    return `${formatted.slice(0, 3)}-${formatted.slice(3)}`; // Adiciona o hífen após as 3 letras
  }

  return formatted;
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

function CadastroFrota({ onVoltar }) {
  const [frota, setFrota] = useState({
    placa: '',
    categoria: '',
    modelo: '',
    fabricante: '',
    anoFabricacao: '',
    responsavel: ''
  });

  const [frotaList, setFrotaList] = useState(() => {
    const savedFrota = localStorage.getItem('frota');
    return savedFrota ? JSON.parse(savedFrota) : [];
  });

  const [filters, setFilters] = useState({
    placa: '',
    categoria: '',
    modelo: '',
    fabricante: '',
    anoFabricacao: '',
    responsavel: ''
  });

  const [editingIndex, setEditingIndex] = useState(null);
  const [showFiltros, setShowFiltros] = useState(false);

  useEffect(() => {
    localStorage.setItem('frota', JSON.stringify(frotaList));
  }, [frotaList]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "placa") {
      setFrota({ ...frota, [name]: formatPlaca(value) });
    } else if (name === "anoFabricacao") {
      const onlyNumbers = value.replace(/\D/g, "").slice(0, 4);
      setFrota({ ...frota, [name]: onlyNumbers });
    } else { 
      setFrota({ ...frota, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const placaSemTraco = frota.placa.replace("-", ""); // Remove o traço para validação
    if (placaSemTraco.length !== 7) {
      alert("A Placa do Veículo deve conter exatamente 3 letras seguidas de 4 números (AAA-0000).");
      return;
    }
    if (frota.anoFabricacao.length !== 4) {
      alert("O campo 'Ano de Fabricação' deve conter exatamente 4 dígitos.");
      return;
    }
    if (editingIndex !== null) {
      const updatedList = [...frotaList];
      updatedList[editingIndex] = frota;
      setFrotaList(updatedList);
      setEditingIndex(null);
    } else {
      setFrotaList([...frotaList, frota]);
    }
    setFrota({
      placa: '',
      categoria: '',
      modelo: '',
      fabricante: '',
      anoFabricacao: '',
      responsavel: ''
    });
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setFrota(frotaList[index]);
  };

  const handleDelete = (index) => {
    const updatedList = frotaList.filter((_, i) => i !== index);
    setFrotaList(updatedList);
    if (editingIndex === index) {
      setEditingIndex(null);
      setFrota({
        placa: '',
        categoria: '',
        modelo: '',
        fabricante: '',
        anoFabricacao: '',
        responsavel: ''
      });
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const filteredFrota = frotaList.filter((f) => {
    return (
      (filters.placa === '' || f.placa.toLowerCase().includes(filters.placa.toLowerCase())) &&
      (filters.categoria === '' || f.categoria.toLowerCase().includes(filters.categoria.toLowerCase())) &&
      (filters.modelo === '' || f.modelo.toLowerCase().includes(filters.modelo.toLowerCase())) &&
      (filters.fabricante === '' || f.fabricante.toLowerCase().includes(filters.fabricante.toLowerCase())) &&
      (filters.anoFabricacao === '' || f.anoFabricacao.includes(filters.anoFabricacao)) &&
      (filters.responsavel === '' || f.responsavel.toLowerCase().includes(filters.responsavel.toLowerCase()))
    );
  });

  return (
    <div className="cadastro-frota-container">
      {/* Cabeçalho */}
      <div className="header-container">
        <button onClick={onVoltar} className="back-button">
          <FontAwesomeIcon icon={faArrowLeft} /> Voltar
        </button>
        <h1 className="title">Cadastro de Frotas</h1>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-row">
          <div className="input-group">
            <label>Placa do Veículo</label>
            <input
              type="text"
              name="placa"
              value={frota.placa}
              onChange={handleChange}
              required
              maxLength={8} // Limita a 8 caracteres (AAA-0000)
            />
          </div>
          <div className="input-group">
            <label>Categoria do Veículo</label>
            <select
              name="categoria"
              value={frota.categoria}
              onChange={handleChange}
              required
            >
              <option value="">Selecione...</option>
              <option value="Leve">Leve</option>
              <option value="Pesado">Pesado</option>
              <option value="Especial">Especial</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="input-group">
            <label>Modelo</label>
            <input
              type="text"
              name="modelo"
              value={frota.modelo}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Fabricante</label>
            <input
              type="text"
              name="fabricante"
              value={frota.fabricante}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="input-group">
            <label>Ano de Fabricação</label>
            <input
              type="text"
              name="anoFabricacao"
              value={frota.anoFabricacao}
              onChange={handleChange}
              required
              maxLength={4}
            />
          </div>
          <div className="input-group">
            <label>Responsável pelo Veículo</label>
            <input
              type="text"
              name="responsavel"
              value={frota.responsavel}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button type="submit" className="submit-button">
          {editingIndex !== null ? 'Atualizar Frota' : 'Cadastrar Frota'}
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
              <label>Filtrar por Placa:</label>
              <input
                type="text"
                name="placa"
                value={filters.placa}
                onChange={handleFilterChange}
                placeholder="Placa"
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
              <label>Filtrar por Modelo:</label>
              <input
                type="text"
                name="modelo"
                value={filters.modelo}
                onChange={handleFilterChange}
                placeholder="Modelo"
              />
            </div>
            <div className="filtro-group">
              <label>Filtrar por Fabricante:</label>
              <input
                type="text"
                name="fabricante"
                value={filters.fabricante}
                onChange={handleFilterChange}
                placeholder="Fabricante"
              />
            </div>
            <div className="filtro-group">
              <label>Filtrar por Ano:</label>
              <input
                type="text"
                name="anoFabricacao"
                value={filters.anoFabricacao}
                onChange={handleFilterChange}
                placeholder="Ano"
              />
            </div>
            <div className="filtro-group">
              <label>Filtrar por Responsável:</label>
              <input
                type="text"
                name="responsavel"
                value={filters.responsavel}
                onChange={handleFilterChange}
                placeholder="Responsável"
              />
            </div>
          </div>
        )}
      </div>

      {/* Cards de Frotas */}
      <h2 className="title">Frota Cadastrada</h2>
      {filteredFrota.length > 0 ? (
        <div className="cards-container">
          {filteredFrota.map((f, index) => (
            <div key={index} className="card">
              <h3>{f.placa}</h3>
              <p><strong>Categoria:</strong> {f.categoria}</p>
              <p><strong>Modelo:</strong> {f.modelo}</p>
              <p><strong>Fabricante:</strong> {f.fabricante}</p>
              <p><strong>Ano:</strong> {f.anoFabricacao}</p>
              <p><strong>Responsável:</strong> {f.responsavel}</p>
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
        <p>Nenhuma frota encontrada.</p>
      )}
    </div>
  );
}

export default CadastroFrota;