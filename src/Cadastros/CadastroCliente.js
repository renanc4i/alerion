import React, { useState, useEffect } from 'react'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEdit, faTrash, faFilter } from '@fortawesome/free-solid-svg-icons';
import './CadastroCliente.css';

const estadosBrasil = {
  AC: 'Acre',
  AL: 'Alagoas',
  AP: 'Amapá',
  AM: 'Amazonas',
  BA: 'Bahia',
  CE: 'Ceará',
  DF: 'Distrito Federal',
  ES: 'Espírito Santo',
  GO: 'Goiás',
  MA: 'Maranhão',
  MT: 'Mato Grosso',
  MS: 'Mato Grosso do Sul',
  MG: 'Minas Gerais',
  PA: 'Pará',
  PB: 'Paraíba',
  PR: 'Paraná',
  PE: 'Pernambuco',
  PI: 'Piauí',
  RJ: 'Rio de Janeiro',
  RN: 'Rio Grande do Norte',
  RS: 'Rio Grande do Sul',
  RO: 'Rondônia',
  RR: 'Roraima',
  SC: 'Santa Catarina',
  SP: 'São Paulo',
  SE: 'Sergipe',
  TO: 'Tocantins'
};

const formatPhone = (value) => {
  const numericValue = value.replace(/\D/g, '');
  if (numericValue.length <= 10) {
    return numericValue.replace(/(\d{2})(\d{4})(\d{0,4})/, (match, p1, p2, p3) => {
      return p3 ? `(${p1}) ${p2}-${p3}` : `(${p1}) ${p2}`;
    });
  }
  return numericValue.replace(/(\d{2})(\d{5})(\d{0,4})/, (match, p1, p2, p3) => {
    return p3 ? `(${p1}) ${p2}-${p3}` : `(${p1}) ${p2}`;
  });
};

const formatCpfCnpj = (value) => {
  const numericValue = value.replace(/\D/g, '');
  if (numericValue.length <= 11) {
    return numericValue.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, (match, p1, p2, p3, p4) => {
      return p4 ? `${p1}.${p2}.${p3}-${p4}` : `${p1}.${p2}.${p3}`;
    });
  }
  return numericValue.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, (match, p1, p2, p3, p4, p5) => {
    return p5 ? `${p1}.${p2}.${p3}/${p4}-${p5}` : `${p1}.${p2}.${p3}/${p4}`;
  });
};

const formatCep = (value) => {
  const numericValue = value.replace(/\D/g, '').slice(0, 8);
  return numericValue.replace(/(\d{5})(\d{0,3})/, '$1-$2');
};

function CadastroCliente({ onVoltar }) {
  const [cliente, setCliente] = useState({
    nome: '',
    cpfCnpj: '',
    email: '',
    telefone: '',
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    cep: '',
    estado: ''
  });

  const [clienteList, setClienteList] = useState(() => {
    const savedClientes = localStorage.getItem('clientes');
    return savedClientes ? JSON.parse(savedClientes) : [];
  });

  const [editingIndex, setEditingIndex] = useState(null);
  const [selectedCliente, setSelectedCliente] = useState(null);

  
  const [showFiltros, setShowFiltros] = useState(false);
  const [filters, setFilters] = useState({
    nome: '',
    cpfCnpj: '',
    email: '',
    telefone: '',
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    cep: '',
    estado: ''
  });

  const closeModal = () => {
    setSelectedCliente(null);
  };

  useEffect(() => {
    localStorage.setItem('clientes', JSON.stringify(clienteList));
  }, [clienteList]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'telefone') {
      const numericValue = value.replace(/\D/g, '');
      if (numericValue.length > 11) return;
      setCliente({ ...cliente, telefone: formatPhone(value) });
    } else if (name === 'cpfCnpj') {
      const numericValue = value.replace(/\D/g, '');
      if (numericValue.length > 14) return;
      setCliente({ ...cliente, cpfCnpj: formatCpfCnpj(value) });
    } else if (name === 'cep') {
      setCliente({ ...cliente, cep: formatCep(value) });
    } else {
      setCliente({ ...cliente, [name]: value });
    }
  };

  const handleCepBlur = () => {
    const cepNumeros = cliente.cep.replace(/\D/g, '');
    if (cepNumeros.length === 8) {
      fetch(`https://viacep.com.br/ws/${cepNumeros}/json/`)
        .then((response) => response.json())
        .then((data) => {
          if (!data.erro) {
            setCliente((prev) => ({
              ...prev,
              rua: data.logradouro || '',
              bairro: data.bairro || '',
              cidade: data.localidade || '',
              estado: data.uf || ''
            }));
          }
        })
        .catch((err) => console.error('Erro ao buscar CEP:', err));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const numericCpfCnpj = cliente.cpfCnpj.replace(/\D/g, '');
    if (numericCpfCnpj.length !== 11 && numericCpfCnpj.length !== 14) {
      alert('O CPF/CNPJ deve conter 11 ou 14 dígitos.');
      return;
    }
    if (editingIndex !== null) {
      const updatedList = [...clienteList];
      updatedList[editingIndex] = cliente;
      setClienteList(updatedList);
      setEditingIndex(null);
    } else {
      setClienteList([...clienteList, cliente]);
    }
    setCliente({
      nome: '',
      cpfCnpj: '',
      email: '',
      telefone: '',
      rua: '',
      numero: '',
      bairro: '',
      cidade: '',
      cep: '',
      estado: ''
    });
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setCliente(clienteList[index]);
  };

  const handleDelete = (index) => {
    const updatedList = clienteList.filter((_, i) => i !== index);
    setClienteList(updatedList);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredClientes = clienteList.filter((cliente) => {
    return (
      (filters.nome === '' || cliente.nome.toLowerCase().includes(filters.nome.toLowerCase())) &&
      (filters.cpfCnpj === '' || cliente.cpfCnpj.toLowerCase().includes(filters.cpfCnpj.toLowerCase())) &&
      (filters.email === '' || cliente.email.toLowerCase().includes(filters.email.toLowerCase())) &&
      (filters.telefone === '' || cliente.telefone.toLowerCase().includes(filters.telefone.toLowerCase())) &&
      (filters.rua === '' || cliente.rua.toLowerCase().includes(filters.rua.toLowerCase())) &&
      (filters.numero === '' || cliente.numero.toLowerCase().includes(filters.numero.toLowerCase())) &&
      (filters.bairro === '' || cliente.bairro.toLowerCase().includes(filters.bairro.toLowerCase())) &&
      (filters.cidade === '' || cliente.cidade.toLowerCase().includes(filters.cidade.toLowerCase())) &&
      (filters.cep === '' || cliente.cep.toLowerCase().includes(filters.cep.toLowerCase())) &&
      (filters.estado === '' || cliente.estado.toLowerCase().includes(filters.estado.toLowerCase()))
    );
  });

  return (
    <div className="cadastro-container">
      <div className="header-container">
        <button onClick={onVoltar} className="back-button">
          <FontAwesomeIcon icon={faArrowLeft} /> Voltar
        </button>
      </div>

      <h1 className="title-cli">Cadastro de Clientes</h1>

      <form onSubmit={handleSubmit} className="form-container">
        {/* Primeira linha */}
        <div className="form-row">
          <div className="input-group">
            <label>Nome/Empresa</label>
            <input type="text" name="nome" value={cliente.nome} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>CPF/CNPJ</label>
            <input type="text" name="cpfCnpj" value={cliente.cpfCnpj} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>E-mail</label>
            <input type="email" name="email" value={cliente.email} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Telefone</label>
            <input type="tel" name="telefone" value={cliente.telefone} onChange={handleChange} required />
          </div>
        </div>

        {/* Segunda linha */}
        <div className="form-row">
          <div className="input-group">
            <label>CEP</label>
            <input type="text" name="cep" value={cliente.cep} onChange={handleChange} onBlur={handleCepBlur} required />
          </div>
          <div className="input-group">
            <label>Rua</label>
            <input type="text" name="rua" value={cliente.rua} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Número</label>
            <input type="text" name="numero" value={cliente.numero} onChange={handleChange} required />
          </div>
        </div>

        {/* Terceira linha */}
        <div className="form-row">
          <div className="input-group">
            <label>Bairro</label>
            <input type="text" name="bairro" value={cliente.bairro} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Cidade</label>
            <input type="text" name="cidade" value={cliente.cidade} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Estado</label>
            <select name="estado" value={cliente.estado} onChange={handleChange} required>
              <option value="">Selecione o estado</option>
              {Object.keys(estadosBrasil).map((sigla) => (
                <option key={sigla} value={sigla}>{estadosBrasil[sigla]}</option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" className="submit-button">
          {editingIndex !== null ? 'Atualizar Cliente' : 'Cadastrar Cliente'}
        </button>
      </form>

      <h1 className="title-cli">Clientes Cadastrados</h1>
      {/* Filtros */}
      <div className="filtros-container">
        <button className="filtro-toggle-button" onClick={() => setShowFiltros(!showFiltros)}>
          <FontAwesomeIcon icon={faFilter} /> {showFiltros ? 'Ocultar Filtros' : 'Mostrar Filtros'}
        </button>
        {showFiltros && (
          <div className="filtros-content">
            <div className="filtro-group">
              <label>Filtrar por Nome/Empresa:</label>
              <input
                type="text"
                name="nome"
                value={filters.nome}
                onChange={handleFilterChange}
                placeholder="Nome/Empresa"
              />
            </div>
            <div className="filtro-group">
              <label>Filtrar por CPF/CNPJ:</label>
              <input
                type="text"
                name="cpfCnpj"
                value={filters.cpfCnpj}
                onChange={handleFilterChange}
                placeholder="CPF/CNPJ"
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
              <label>Filtrar por Estado:</label>
              <input
                type="text"
                name="estado"
                value={filters.estado}
                onChange={handleFilterChange}
                placeholder="Estado"
              />
            </div>
          </div>
        )}
      </div>

      {/* Exibição em Cards */}
      {filteredClientes.length > 0 ? (
        <div className="cards-container">
          {filteredClientes.map((cliente, index) => (
            <div key={index} className="card" onClick={() => setSelectedCliente(cliente)}>
              <h3>{cliente.nome}</h3>
              <p><strong>CPF/CNPJ:</strong> {cliente.cpfCnpj}</p>
              <p><strong>Telefone:</strong> {cliente.telefone}</p>
              <p><strong>E-mail:</strong> {cliente.email}</p>
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
        <p>Nenhum cliente encontrado.</p>
      )}

      {selectedCliente && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Detalhes do Cliente</h2>
            <p><strong>Nome/Empresa:</strong> {selectedCliente.nome}</p>
            <p><strong>CPF/CNPJ:</strong> {selectedCliente.cpfCnpj}</p>
            <p><strong>Telefone:</strong> {selectedCliente.telefone}</p>
            <p><strong>E-mail:</strong> {selectedCliente.email}</p>
            <p><strong>CEP:</strong> {selectedCliente.cep}</p>
            <p><strong>Rua:</strong> {selectedCliente.rua}</p>
            <p><strong>Número:</strong> {selectedCliente.numero}</p>
            <p><strong>Bairro:</strong> {selectedCliente.bairro}</p>
            <p><strong>Cidade:</strong> {selectedCliente.cidade}</p>
            <p><strong>Estado:</strong> {selectedCliente.estado}</p>
            <button onClick={closeModal} className="close-button">Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CadastroCliente;
