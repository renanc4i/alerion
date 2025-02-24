import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEdit, faTrash, faFilter } from '@fortawesome/free-solid-svg-icons';
import './CadastroRodovias.css';

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

function CadastroRodovias({ onVoltar }) {
  const [rodovia, setRodovia] = useState({
    nomeRodovia: '',
    kmInicial: '',
    kmFinal: '',
    sentido: [],
    extensao: 0
  });

  const [rodoviasList, setRodoviasList] = useState(() => {
    const savedRodovias = localStorage.getItem('rodovias');
    return savedRodovias ? JSON.parse(savedRodovias) : [];
  });

  const [filters, setFilters] = useState({
    nomeRodovia: '',
    kmInicial: '',
    kmFinal: '',
    sentido: []
  });

  const [editingIndex, setEditingIndex] = useState(null);
  const [showFiltros, setShowFiltros] = useState(false); // Estado para controlar a exibição dos filtros

  useEffect(() => {
    localStorage.setItem('rodovias', JSON.stringify(rodoviasList));
  }, [rodoviasList]);

  const formatKM = (value) => {
    const numeric = value.replace(/\D/g, '');
    if (numeric.length <= 3) return numeric;
    return `${numeric.slice(0, 3)}.${numeric.slice(3, 6)}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedRodovia = { ...rodovia, [name]: value };

    if (name === 'kmInicial' || name === 'kmFinal') {
      let digits = value.replace(/\D/g, '');
      if (digits.length > 6) digits = digits.slice(0, 6);
      let formatted = digits;
      if (digits.length > 3) {
        formatted = digits.slice(0, 3) + '.' + digits.slice(3);
      }
      updatedRodovia[name] = formatted;

      const kmInicialDigits = parseInt(
        name === 'kmInicial' ? digits : rodovia.kmInicial.replace(/\D/g, ''),
        10
      ) || 0;
      const kmFinalDigits = parseInt(
        name === 'kmFinal' ? digits : rodovia.kmFinal.replace(/\D/g, ''),
        10
      ) || 0;
      const extensao = (kmFinalDigits - kmInicialDigits) / 1000;
      updatedRodovia.extensao = isNaN(extensao) ? '' : extensao;
    }

    setRodovia(updatedRodovia);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const kmInicialDigits = parseInt(rodovia.kmInicial.replace(/\D/g, ''), 10);
    const kmFinalDigits = parseInt(rodovia.kmFinal.replace(/\D/g, ''), 10);

    if (isNaN(kmInicialDigits) || isNaN(kmFinalDigits) || kmInicialDigits >= kmFinalDigits) {
      alert('O KM Final deve ser maior que o KM Inicial.');
      return;
    }

    const extensaoCalculada = (kmFinalDigits - kmInicialDigits) / 1000;
    const novaRodovia = { ...rodovia, extensao: extensaoCalculada };

    if (editingIndex !== null) {
      const updatedList = [...rodoviasList];
      updatedList[editingIndex] = novaRodovia;
      setRodoviasList(updatedList);
      setEditingIndex(null);
    } else {
      setRodoviasList([...rodoviasList, novaRodovia]);
    }

    setRodovia({
      nomeRodovia: '',
      kmInicial: '',
      kmFinal: '',
      sentido: [],
      extensao: 0
    });
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setRodovia(rodoviasList[index]);
  };

  const handleDelete = (index) => {
    const updatedList = rodoviasList.filter((_, i) => i !== index);
    setRodoviasList(updatedList);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleFilterSentidoChange = (newSentidos) => {
    setFilters({ ...filters, sentido: newSentidos });
  };

  const filteredRodovias = rodoviasList.filter((r) => {
    return (
      (filters.nomeRodovia === '' || r.nomeRodovia.toLowerCase().includes(filters.nomeRodovia.toLowerCase())) &&
      (filters.kmInicial === '' || r.kmInicial.includes(filters.kmInicial)) &&
      (filters.kmFinal === '' || r.kmFinal.includes(filters.kmFinal)) &&
      (filters.sentido.length === 0 || filters.sentido.every(s => r.sentido.includes(s)))
    );
  });

  return (
    <div className="cadastro-container">
      <div className="header-container">
        <button onClick={onVoltar} className="back-button">
          <FontAwesomeIcon icon={faArrowLeft} /> Voltar
        </button>
        <h1 className="title">Cadastro de Rodovias</h1>
      </div>

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-row">
          <div className="input-group">
            <label>Nome da Rodovia</label>
            <input
              type="text"
              name="nomeRodovia"
              value={rodovia.nomeRodovia}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>KM Inicial</label>
            <input
              type="text"
              name="kmInicial"
              value={rodovia.kmInicial}
              onChange={handleChange}
              required
              maxLength={7}
            />
          </div>
          <div className="input-group">
            <label>KM Final</label>
            <input
              type="text"
              name="kmFinal"
              value={rodovia.kmFinal}
              onChange={handleChange}
              required
              maxLength={7}
            />
          </div>
          <div className="input-group">
            <label>Extensão da Rodovia (km)</label>
            <input type="text" name="extensao" value={rodovia.extensao} readOnly />
          </div>
          <div className="input-group">
            <label>Sentido</label>
            <MultiSelectDropdown
              options={['Norte', 'Sul', 'Leste', 'Oeste']}
              selectedValues={rodovia.sentido}
              onChange={(newSentidos) => setRodovia({ ...rodovia, sentido: newSentidos })}
              placeholder="Selecione o Sentido"
            />
          </div>
        </div>

        <button type="submit" className="submit-button">
          {editingIndex !== null ? 'Atualizar Rodovia' : 'Cadastrar Rodovia'}
        </button>
      </form>

      <h2 className="subtitle">Rodovias Cadastradas</h2>

      {/* Filtros com ícone de expansão */}
      <div className="filtros-container">
        <button className="filtro-toggle-button" onClick={() => setShowFiltros(!showFiltros)}>
          <FontAwesomeIcon icon={faFilter} /> Filtros
        </button>
        {showFiltros && (
          <div className="filtros-content">
            <div className="filtro-group">
              <label>Filtrar por Nome:</label>
              <input
                type="text"
                name="nomeRodovia"
                value={filters.nomeRodovia}
                onChange={handleFilterChange}
                placeholder="Nome da Rodovia"
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
              <MultiSelectDropdown
                options={['Norte', 'Sul', 'Leste', 'Oeste']}
                selectedValues={filters.sentido}
                onChange={handleFilterSentidoChange}
                placeholder="Selecione o Sentido"
              />
            </div>
          </div>
        )}
      </div>

      {filteredRodovias.length > 0 ? (
        <div className="cards-container">
          {filteredRodovias.map((r, index) => (
            <div key={index} className="card">
              <h3>{r.nomeRodovia}</h3>
              <p><strong>KM Inicial:</strong> {r.kmInicial}</p>
              <p><strong>KM Final:</strong> {r.kmFinal}</p>
              <p><strong>Extensão:</strong> {r.extensao} km</p>
              <p><strong>Sentido:</strong> {r.sentido.join(', ')}</p>
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
        <p>Nenhuma rodovia cadastrada.</p>
      )}
    </div>
  );
}

export default CadastroRodovias;