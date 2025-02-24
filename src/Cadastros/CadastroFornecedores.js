import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEdit, faTrash, faFilter } from '@fortawesome/free-solid-svg-icons';
import './CadastroFornecedores.css';

// Funções de formatação
const formatTelefone = (value) => {
  const onlyNums = value.replace(/\D/g, '');
  if (onlyNums.length < 3) return onlyNums;
  if (onlyNums.length <= 6) return `(${onlyNums.slice(0, 2)}) ${onlyNums.slice(2)}`;
  if (onlyNums.length <= 10) return `(${onlyNums.slice(0, 2)}) ${onlyNums.slice(2, 6)}-${onlyNums.slice(6)}`;
  return `(${onlyNums.slice(0, 2)}) ${onlyNums.slice(2, 7)}-${onlyNums.slice(7, 11)}`;
};

const formatCnpj = (value) => {
  const numericValue = value.replace(/\D/g, '').slice(0, 14);
  return numericValue.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, '$1.$2.$3/$4-$5');
};

const formatCep = (value) => {
  const numericValue = value.replace(/\D/g, '').slice(0, 8);
  return numericValue.replace(/(\d{5})(\d{0,3})/, '$1-$2');
};

const estadosBrasil = {
  AC: 'Acre', AL: 'Alagoas', AP: 'Amapá', AM: 'Amazonas', BA: 'Bahia',
  CE: 'Ceará', DF: 'Distrito Federal', ES: 'Espírito Santo', GO: 'Goiás',
  MA: 'Maranhão', MT: 'Mato Grosso', MS: 'Mato Grosso do Sul', MG: 'Minas Gerais',
  PA: 'Pará', PB: 'Paraíba', PR: 'Paraná', PE: 'Pernambuco', PI: 'Piauí',
  RJ: 'Rio de Janeiro', RN: 'Rio Grande do Norte', RS: 'Rio Grande do Sul',
  RO: 'Rondônia', RR: 'Roraima', SC: 'Santa Catarina', SP: 'São Paulo',
  SE: 'Sergipe', TO: 'Tocantins'
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

function CadastroFornecedor({ onVoltar }) {
  const [selectedFornecedor, setSelectedFornecedor] = useState(null);
  const [fornecedor, setFornecedor] = useState({
    nome: '', cnpj: '', email: '', telefone: '', cep: '',
    cidade: '', estado: '', rua: '', numero: '', bairro: ''
  });

  const [fornecedorList, setFornecedorList] = useState(() => {
    const savedFornecedores = localStorage.getItem('fornecedor');
    return savedFornecedores ? JSON.parse(savedFornecedores) : [];
  });

  const [filters, setFilters] = useState({
    nome: '', cnpj: '', email: '', telefone: '', cep: '',
    cidade: '', estado: '', rua: '', numero: '', bairro: ''
  });

  const [editingIndex, setEditingIndex] = useState(null);
  const [showFiltros, setShowFiltros] = useState(false);

  useEffect(() => {
    localStorage.setItem('fornecedor', JSON.stringify(fornecedorList));
  }, [fornecedorList]);

  const handleCepBlur = () => {
    const cepNumeros = fornecedor.cep.replace(/\D/g, '');
    if (cepNumeros.length === 8) {
      fetch(`https://viacep.com.br/ws/${cepNumeros}/json/`)
        .then(response => response.json())
        .then(data => {
          if (!data.erro) {
            setFornecedor(prev => ({
              ...prev,
              rua: data.logradouro || '',
              bairro: data.bairro || '',
              cidade: data.localidade || '',
              estado: data.uf || ''
            }));
          }
        })
        .catch(error => console.error('Erro ao buscar CEP:', error));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'telefone') {
      setFornecedor({ ...fornecedor, telefone: formatTelefone(value) });
    } else if (name === 'cnpj') {
      setFornecedor({ ...fornecedor, cnpj: formatCnpj(value) });
    } else if (name === 'cep') {
      setFornecedor({ ...fornecedor, cep: formatCep(value) });
    } else {
      setFornecedor({ ...fornecedor, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingIndex !== null) {
      const updatedList = [...fornecedorList];
      updatedList[editingIndex] = fornecedor;
      setFornecedorList(updatedList);
      setEditingIndex(null);
    } else {
      setFornecedorList([...fornecedorList, fornecedor]);
    }
    setFornecedor({ nome: '', cnpj: '', email: '', telefone: '', cep: '', cidade: '', estado: '', rua: '', numero: '', bairro: '' });
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setFornecedor(fornecedorList[index]);
  };

  const handleDelete = (index) => {
    const updatedList = fornecedorList.filter((_, i) => i !== index);
    setFornecedorList(updatedList);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const filteredFornecedores = fornecedorList.filter((f) => {
    return (
      (filters.nome === '' || f.nome.toLowerCase().includes(filters.nome.toLowerCase())) &&
      (filters.cnpj === '' || f.cnpj.includes(filters.cnpj)) &&
      (filters.email === '' || f.email.toLowerCase().includes(filters.email.toLowerCase())) &&
      (filters.telefone === '' || f.telefone.includes(filters.telefone)) &&
      (filters.cep === '' || f.cep.includes(filters.cep)) &&
      (filters.cidade === '' || f.cidade.toLowerCase().includes(filters.cidade.toLowerCase())) &&
      (filters.estado === '' || f.estado.toLowerCase().includes(filters.estado.toLowerCase())) &&
      (filters.rua === '' || f.rua.toLowerCase().includes(filters.rua.toLowerCase())) &&
      (filters.numero === '' || f.numero.includes(filters.numero)) &&
      (filters.bairro === '' || f.bairro.toLowerCase().includes(filters.bairro.toLowerCase()))
    );
  });

  return (
    <div className="cadastro-fornecedor-container">
      {/* Cabeçalho */}
      <div className="header-container">
        <button onClick={onVoltar} className="back-button">
          <FontAwesomeIcon icon={faArrowLeft} /> Voltar
        </button>
        <h1 className="title">Cadastro de Fornecedores</h1>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-row">
          <div className="input-group">
            <label>Nome/Empresa</label>
            <input
              type="text"
              name="nome"
              value={fornecedor.nome}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>CNPJ</label>
            <input
              type="text"
              name="cnpj"
              value={fornecedor.cnpj}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>E-mail</label>
            <input
              type="email"
              name="email"
              value={fornecedor.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Telefone</label>
            <input
              type="tel"
              name="telefone"
              value={fornecedor.telefone}
              onChange={handleChange}
              required
              maxLength={15}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="input-group">
            <label>CEP</label>
            <input
              type="text"
              name="cep"
              value={fornecedor.cep}
              onChange={handleChange}
              onBlur={handleCepBlur}
              required
              maxLength={9}
            />
          </div>
          <div className="input-group">
            <label>Rua</label>
            <input
              type="text"
              name="rua"
              value={fornecedor.rua}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Número</label>
            <input
              type="text"
              name="numero"
              value={fornecedor.numero}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="input-group">
            <label>Bairro</label>
            <input
              type="text"
              name="bairro"
              value={fornecedor.bairro}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Cidade</label>
            <input
              type="text"
              name="cidade"
              value={fornecedor.cidade}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Estado</label>
            <select
              name="estado"
              value={fornecedor.estado}
              onChange={handleChange}
              required
            >
              <option value="">Selecione o estado</option>
              {Object.keys(estadosBrasil).map((sigla) => (
                <option key={sigla} value={sigla}>{estadosBrasil[sigla]}</option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" className="submit-button">
          {editingIndex !== null ? 'Atualizar Fornecedor' : 'Cadastrar Fornecedor'}
        </button>
      </form>

      {/* Título e Botão de Filtro */}
      <h2 className="title">Fornecedores Cadastrados</h2>
      <div className="filtros-container">
        <button className="filtro-toggle-button" onClick={() => setShowFiltros(!showFiltros)}>
          <FontAwesomeIcon icon={faFilter} /> {showFiltros ? 'Ocultar Filtros' : 'Mostrar Filtros'}
        </button>
        {showFiltros && (
          <div className="filtros-content">
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
              <label>Filtrar por CNPJ:</label>
              <input
                type="text"
                name="cnpj"
                value={filters.cnpj}
                onChange={handleFilterChange}
                placeholder="CNPJ"
              />
            </div>
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
              <label>Filtrar por CEP:</label>
              <input
                type="text"
                name="cep"
                value={filters.cep}
                onChange={handleFilterChange}
                placeholder="CEP"
              />
            </div>
            <div className="filtro-group">
              <label>Filtrar por Cidade:</label>
              <input
                type="text"
                name="cidade"
                value={filters.cidade}
                onChange={handleFilterChange}
                placeholder="Cidade"
              />
            </div>
            <div className="filtro-group">
              <label>Filtrar por Estado:</label>
              <input
                type="text"
                name="estado"
                value={filters.estado}
                onChange={handleFilterChange}
                placeholder="Estado"
              />
            </div>
            <div className="filtro-group">
              <label>Filtrar por Rua:</label>
              <input
                type="text"
                name="rua"
                value={filters.rua}
                onChange={handleFilterChange}
                placeholder="Rua"
              />
            </div>
            <div className="filtro-group">
              <label>Filtrar por Número:</label>
              <input
                type="text"
                name="numero"
                value={filters.numero}
                onChange={handleFilterChange}
                placeholder="Número"
              />
            </div>
            <div className="filtro-group">
              <label>Filtrar por Bairro:</label>
              <input
                type="text"
                name="bairro"
                value={filters.bairro}
                onChange={handleFilterChange}
                placeholder="Bairro"
              />
            </div>
          </div>
        )}
      </div>

      {/* Cards de Fornecedores */}
      {filteredFornecedores.length > 0 ? (
        <div className="cards-container">
          {filteredFornecedores.map((f, index) => (
            <div key={index} className="card">
              <h3>{f.nome}</h3>
              <p><strong>CNPJ:</strong> {f.cnpj}</p>
              <p><strong>E-mail:</strong> {f.email}</p>
              <p><strong>Telefone:</strong> {f.telefone}</p>
              <p><strong>CEP:</strong> {f.cep}</p>
              <p><strong>Estado:</strong> {estadosBrasil[f.estado] || f.estado}</p>
              <p><strong>Rua:</strong> {f.rua}</p>
              <p><strong>Número:</strong> {f.numero}</p>
              <p><strong>Bairro:</strong> {f.bairro}</p>
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
        <p>Nenhum fornecedor encontrado.</p>
      )}

      {/* Modal de Detalhes */}
      {selectedFornecedor && (
        <div className="modal-overlay" onClick={() => setSelectedFornecedor(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Detalhes do Fornecedor</h2>
            <p><strong>Nome:</strong> {selectedFornecedor.nome}</p>
            <p><strong>CNPJ:</strong> {selectedFornecedor.cnpj}</p>
            <p><strong>E-mail:</strong> {selectedFornecedor.email}</p>
            <p><strong>Telefone:</strong> {selectedFornecedor.telefone}</p>
            <p><strong>CEP:</strong> {selectedFornecedor.cep}</p>
            <p><strong>Estado:</strong> {estadosBrasil[selectedFornecedor.estado] || selectedFornecedor.estado}</p>
            <p><strong>Rua:</strong> {selectedFornecedor.rua}</p>
            <p><strong>Número:</strong> {selectedFornecedor.numero}</p>
            <p><strong>Bairro:</strong> {selectedFornecedor.bairro}</p>
            <button onClick={() => setSelectedFornecedor(null)} className="close-button">Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CadastroFornecedor;