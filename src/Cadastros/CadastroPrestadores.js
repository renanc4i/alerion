import React, { useState, useEffect, useRef } from 'react'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEdit, faTrash, faFilter } from '@fortawesome/free-solid-svg-icons';
import './CadastroPrestadores.css';

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
        {selectedValues.length > 0
          ? selectedValues.slice(0, 3).join(', ') + (selectedValues.length > 3 ? '...' : '')
          : placeholder}
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

function CadastroPrestadores({ onVoltar }) {
  const [prestador, setPrestador] = useState({
    nome: '',
    cnpj: '',
    email: '',
    telefone: '',
    cep: '',
    cidade: '',
    estado: '',
    rua: '',
    numero: '',
    bairro: '',
    servicos: []
  });

  const [prestadoresList, setPrestadoresList] = useState(() => {
    const savedPrestadores = localStorage.getItem('prestadores');
    return savedPrestadores ? JSON.parse(savedPrestadores) : [];
  });

  // Atualizamos os filtros para incluir todos os campos do formulário
  const [filters, setFilters] = useState({
    nome: '',
    cnpj: '',
    email: '',
    telefone: '',
    cep: '',
    estado: '',
    rua: '',
    numero: '',
    bairro: '',
    servicos: []
  });

  const [editingIndex, setEditingIndex] = useState(null);
  const [showFiltros, setShowFiltros] = useState(false);
  const [selectedPrestador, setSelectedPrestador] = useState(null);

  useEffect(() => {
    localStorage.setItem('prestadores', JSON.stringify(prestadoresList));
  }, [prestadoresList]);

  const stateNames = {
    AC: "Acre",
    AL: "Alagoas",
    AP: "Amapá",
    AM: "Amazonas",
    BA: "Bahia",
    CE: "Ceará",
    DF: "Distrito Federal",
    ES: "Espírito Santo",
    GO: "Goiás",
    MA: "Maranhão",
    MT: "Mato Grosso",
    MS: "Mato Grosso do Sul",
    MG: "Minas Gerais",
    PA: "Pará",
    PB: "Paraíba",
    PR: "Paraná",
    PE: "Pernambuco",
    PI: "Piauí",
    RJ: "Rio de Janeiro",
    RN: "Rio Grande do Norte",
    RS: "Rio Grande do Sul",
    RO: "Rondônia",
    RR: "Roraima",
    SC: "Santa Catarina",
    SP: "São Paulo",
    SE: "Sergipe",
    TO: "Tocantins"
  };

  const formatCnpjCpf = (value) => {
    const onlyNums = value.replace(/\D/g, '');
    if (onlyNums.length === 11) {
      return onlyNums.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    } else if (onlyNums.length === 14) {
      return onlyNums.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    } else {
      return onlyNums;
    }
  };

  const formatTelefone = (value) => {
    const onlyNums = value.replace(/\D/g, '');
    if (onlyNums.length < 3) return onlyNums;
    if (onlyNums.length <= 6) return `(${onlyNums.slice(0, 2)}) ${onlyNums.slice(2)}`;
    if (onlyNums.length <= 10) return `(${onlyNums.slice(0, 2)}) ${onlyNums.slice(2, 6)}-${onlyNums.slice(6)}`;
    return `(${onlyNums.slice(0, 2)}) ${onlyNums.slice(2, 7)}-${onlyNums.slice(7, 11)}`;
  };

  const formatCEP = (value) => {
    let v = value.replace(/\D/g, '');
    v = v.substring(0, 8);
    return v.replace(/(\d{5})(\d{0,3})/, (match, p1, p2) => (p2 ? `${p1}-${p2}` : p1));
  };

  const handleCepBlur = () => {
    const cepValue = prestador.cep || '';
    const cepNumeros = cepValue.replace(/\D/g, '');
    if (cepNumeros.length === 8) {
      fetch(`https://viacep.com.br/ws/${cepNumeros}/json/`)
        .then(response => response.json())
        .then(data => {
          if (!data.erro) {
            setPrestador(prev => ({
              ...prev,
              cidade: data.localidade || '',
              estado: data.uf || '',
              rua: data.logradouro || '',
              bairro: data.bairro || ''
            }));
          }
        })
        .catch(error => console.error('Erro ao buscar CEP:', error));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cnpj') {
      setPrestador({ ...prestador, [name]: formatCnpjCpf(value) });
    } else if (name === 'telefone') {
      setPrestador({ ...prestador, [name]: formatTelefone(value) });
    } else if (name === 'cep') {
      setPrestador({ ...prestador, [name]: formatCEP(value) });
    } else {
      setPrestador({ ...prestador, [name]: value });
    }
  };

  const handleServicoChange = (newServicos) => {
    setPrestador({ ...prestador, servicos: newServicos });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const numericCpfCnpj = prestador.cnpj.replace(/\D/g, '');
    if (numericCpfCnpj.length !== 11 && numericCpfCnpj.length !== 14) {
      alert("O campo CPF/CNPJ deve conter exatamente 11 dígitos (CPF) ou 14 dígitos (CNPJ).");
      return;
    }
    if (editingIndex !== null) {
      const updatedList = [...prestadoresList];
      updatedList[editingIndex] = prestador;
      setPrestadoresList(updatedList);
      setEditingIndex(null);
    } else {
      setPrestadoresList([...prestadoresList, prestador]);
    }
    setPrestador({
      nome: '',
      cnpj: '',
      email: '',
      telefone: '',
      cep: '',
      cidade: '',
      estado: '',
      rua: '',
      numero: '',
      bairro: '',
      servicos: []
    });
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setPrestador(prestadoresList[index]);
  };

  const handleDelete = (index) => {
    const updatedList = prestadoresList.filter((_, i) => i !== index);
    setPrestadoresList(updatedList);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleFilterServicoChange = (newServicos) => {
    setFilters({ ...filters, servicos: newServicos });
  };

  const filteredPrestadores = prestadoresList.filter((prestador) => {
    return (
      (filters.nome === '' || prestador.nome.toLowerCase().includes(filters.nome.toLowerCase())) &&
      (filters.cnpj === '' || prestador.cnpj.includes(filters.cnpj)) &&
      (filters.email === '' || prestador.email.toLowerCase().includes(filters.email.toLowerCase())) &&
      (filters.telefone === '' || prestador.telefone.includes(filters.telefone)) &&
      (filters.cep === '' || prestador.cep.includes(filters.cep)) &&
      (filters.estado === '' || prestador.estado.toLowerCase().includes(filters.estado.toLowerCase())) &&
      (filters.rua === '' || prestador.rua.toLowerCase().includes(filters.rua.toLowerCase())) &&
      (filters.numero === '' || prestador.numero.toLowerCase().includes(filters.numero.toLowerCase())) &&
      (filters.bairro === '' || prestador.bairro.toLowerCase().includes(filters.bairro.toLowerCase())) &&
      (filters.servicos.length === 0 || filters.servicos.every(s => prestador.servicos.includes(s)))
    );
  });

  return (
    <div className="cadastro-prestadores-container">
      <div className="header-container">
        <button onClick={onVoltar} className="prestador-back-button">
          <FontAwesomeIcon icon={faArrowLeft} /> Voltar
        </button>
        <h1 className="header-title">Cadastro de Prestadores</h1>
      </div>
      <form onSubmit={handleSubmit} className="prestador-form">
        {/* Primeira linha: Nome, CNPJ, E-mail, Telefone, CEP, Estado */}
        <div className="prestador-form-row">
          <div className="prestador-input-group">
            <label>Nome</label>
            <input type="text" name="nome" value={prestador.nome} onChange={handleChange} required />
          </div>
          <div className="prestador-input-group">
            <label>CNPJ</label>
            <input type="text" name="cnpj" value={prestador.cnpj} onChange={handleChange} required maxLength={18} />
          </div>
          <div className="prestador-input-group">
            <label>E-mail</label>
            <input type="email" name="email" value={prestador.email} onChange={handleChange} required />
          </div>
          <div className="prestador-input-group">
            <label>Telefone</label>
            <input type="tel" name="telefone" value={prestador.telefone} onChange={handleChange} required maxLength={15} />
          </div>
          <div className="prestador-input-group">
            <label>CEP</label>
            <input type="text" name="cep" value={prestador.cep} onChange={handleChange} onBlur={handleCepBlur} required maxLength={9} />
          </div>
          <div className="prestador-input-group">
            <label>Estado</label>
            <select name="estado" value={prestador.estado} onChange={handleChange} required>
              <option value="">Selecione o estado</option>
              {Object.keys(stateNames).map((sigla) => (
                <option key={sigla} value={sigla}>{stateNames[sigla]}</option>
              ))}
            </select>
          </div>
        </div>
        {/* Segunda linha: Rua, Número, Bairro, Serviços */}
        <div className="prestador-form-row">
          <div className="prestador-input-group">
            <label>Rua</label>
            <input type="text" name="rua" value={prestador.rua} onChange={handleChange} required />
          </div>
          <div className="prestador-input-group">
            <label>Número</label>
            <input type="text" name="numero" value={prestador.numero} onChange={handleChange} required />
          </div>
          <div className="prestador-input-group">
            <label>Bairro</label>
            <input type="text" name="bairro" value={prestador.bairro} onChange={handleChange} required />
          </div>
          <div className="prestador-input-group servicos">
            <label>Serviços</label>
            <MultiSelectDropdown
              options={["Pavimentação", "Drenagem", "Roçada", "Sinalização", "Manutenção", "Reparos"]}
              selectedValues={prestador.servicos}
              onChange={handleServicoChange}
              placeholder="Selecione os Serviços"
            />
          </div>
        </div>
        <button type="submit" className="prestador-submit-button">
          {editingIndex !== null ? 'Atualizar Prestador' : 'Cadastrar Prestador'}
        </button>
      </form>

      {/* Título para a listagem */}
      <h2 className="prestador-title">Prestadores Cadastrados</h2>

      {/* Filtros */}
      <div className="filtros-container">
        <button className="filtro-toggle-button" onClick={() => setShowFiltros(!showFiltros)}>
          <FontAwesomeIcon icon={faFilter} /> {showFiltros ? 'Ocultar Filtros' : 'Mostrar Filtros'}
        </button>
        {showFiltros && (
          <div className="filtros-content">
            <div className="filtro-group">
              <label>Filtrar por Nome:</label>
              <input type="text" name="nome" value={filters.nome} onChange={handleFilterChange} placeholder="Nome" />
            </div>
            <div className="filtro-group">
              <label>Filtrar por CNPJ:</label>
              <input type="text" name="cnpj" value={filters.cnpj} onChange={handleFilterChange} placeholder="CNPJ" />
            </div>
            <div className="filtro-group">
              <label>Filtrar por E-mail:</label>
              <input type="text" name="email" value={filters.email} onChange={handleFilterChange} placeholder="E-mail" />
            </div>
            <div className="filtro-group">
              <label>Filtrar por Telefone:</label>
              <input type="text" name="telefone" value={filters.telefone} onChange={handleFilterChange} placeholder="Telefone" />
            </div>
            <div className="filtro-group">
              <label>Filtrar por CEP:</label>
              <input type="text" name="cep" value={filters.cep} onChange={handleFilterChange} placeholder="CEP" />
            </div>
            <div className="filtro-group">
              <label>Filtrar por Estado:</label>
              <input type="text" name="estado" value={filters.estado} onChange={handleFilterChange} placeholder="Estado" />
            </div>
            <div className="filtro-group">
              <label>Filtrar por Rua:</label>
              <input type="text" name="rua" value={filters.rua} onChange={handleFilterChange} placeholder="Rua" />
            </div>
            <div className="filtro-group">
              <label>Filtrar por Número:</label>
              <input type="text" name="numero" value={filters.numero} onChange={handleFilterChange} placeholder="Número" />
            </div>
            <div className="filtro-group">
              <label>Filtrar por Bairro:</label>
              <input type="text" name="bairro" value={filters.bairro} onChange={handleFilterChange} placeholder="Bairro" />
            </div>
            <div className="filtro-group">
              <label>Filtrar por Serviços:</label>
              <MultiSelectDropdown
                options={["Pavimentação", "Drenagem", "Roçada", "Sinalização", "Manutenção", "Reparos"]}
                selectedValues={filters.servicos}
                onChange={handleFilterServicoChange}
                placeholder="Selecione os Serviços"
              />
            </div>
          </div>
        )}
      </div>

      {/* Exibição em Cards */}
      {filteredPrestadores.length > 0 ? (
        <div className="cards-container">
          {filteredPrestadores.map((prestador, index) => (
            <div key={index} className="card" onClick={() => setSelectedPrestador(prestador)}>
              <h3>{prestador.nome}</h3>
              <p><strong>CNPJ:</strong> {prestador.cnpj}</p>
              <p><strong>E-mail:</strong> {prestador.email}</p>
              <p><strong>Telefone:</strong> {prestador.telefone}</p>
              <p><strong>Serviços:</strong> {prestador.servicos.join(', ')}</p>
              <div className="icon-buttons">
                <FontAwesomeIcon
                  icon={faEdit}
                  className="prestador-action-icon prestador-edit-icon"
                  onClick={(e) => { e.stopPropagation(); handleEdit(index); }}
                  title="Editar"
                />
                <FontAwesomeIcon
                  icon={faTrash}
                  className="prestador-action-icon prestador-delete-icon"
                  onClick={(e) => { e.stopPropagation(); handleDelete(index); }}
                  title="Excluir"
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Nenhum prestador cadastrado.</p>
      )}

      {selectedPrestador && (
        <div className="modal-overlay" onClick={() => setSelectedPrestador(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Detalhes do Prestador</h2>
            <p><strong>Nome:</strong> {selectedPrestador.nome}</p>
            <p><strong>CNPJ:</strong> {selectedPrestador.cnpj}</p>
            <p><strong>E-mail:</strong> {selectedPrestador.email}</p>
            <p><strong>Telefone:</strong> {selectedPrestador.telefone}</p>
            <p><strong>Serviços:</strong> {selectedPrestador.servicos.join(', ')}</p>
            <p><strong>CEP:</strong> {selectedPrestador.cep}</p>
            <p><strong>Estado:</strong> {stateNames[selectedPrestador.estado] || selectedPrestador.estado}</p>
            <p><strong>Cidade:</strong> {selectedPrestador.cidade}</p>
            <p><strong>Rua:</strong> {selectedPrestador.rua}</p>
            <p><strong>Número:</strong> {selectedPrestador.numero}</p>
            <p><strong>Bairro:</strong> {selectedPrestador.bairro}</p>
            <button onClick={() => setSelectedPrestador(null)} className="close-button">Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CadastroPrestadores;
