import React, { useState } from 'react';
import CadastroCliente from './CadastroCliente';
import CadastroFornecedores from './CadastroFornecedores';
import CadastroPrestadores from './CadastroPrestadores';
import CadastroEquipe from './CadastroEquipe';
import CadastroMateriais from './CadastroMateriais';
import CadastroFrota from './CadastroFrota';
import CadastroContratos from './CadastroContratos';
import CadastroObras from './CadastroObras';
import CadastroRodovias from './CadastroRodovias';
import './Cadastros.css';

const CADASTRO_TYPES = {
  CLIENTES: 'clientes',
  FORNECEDORES: 'fornecedores',
  PRESTADORES: 'prestadores',
  EQUIPE: 'equipe',
  MATERIAIS: 'materiais',
  FROTA: 'frota',
  CONTRATOS: 'contratos',
  OBRAS: 'obras',
  RODOVIAS: 'rodovias'
};

const cadastros = [
  { id: 1, name: "Clientes", form: CADASTRO_TYPES.CLIENTES, icon: "👥" },
  { id: 2, name: "Fornecedores", form: CADASTRO_TYPES.FORNECEDORES, icon: "🏢" },
  { id: 3, name: "Prestadores de Serviços", form: CADASTRO_TYPES.PRESTADORES, icon: "🔧" },
  { id: 4, name: "Equipe e Pessoal", form: CADASTRO_TYPES.EQUIPE, icon: "👷" },
  { id: 5, name: "Materiais e Equipamentos", form: CADASTRO_TYPES.MATERIAIS, icon: "🧰" },
  { id: 6, name: "Frota Operacional", form: CADASTRO_TYPES.FROTA, icon: "🚚" },
  { id: 7, name: "Contratos e Acordos", form: CADASTRO_TYPES.CONTRATOS, icon: "📜" },
  { id: 8, name: "Obras ou Projetos", form: CADASTRO_TYPES.OBRAS, icon: "🚧" },
  { id: 9, name: "Rodovias", form: CADASTRO_TYPES.RODOVIAS, icon: "🛣️" }
];

function Cadastros() {
  const [activeCadastro, setActiveCadastro] = useState(null);

  const handleCadastroClick = (form) => {
    setActiveCadastro(form);
  };

  const handleVoltar = () => {
    setActiveCadastro(null);
  };

  return (
    <div className="cadastrosContainer">
      <h1 className="cadastrosTitle">Cadastros Gerais</h1>

      {!activeCadastro ? (
        <div className="cardsContainer">
          {cadastros.map((item) => (
            <div
              key={item.id}
              className="cadastroCard"
              role="button"
              tabIndex="0"
              onClick={() => handleCadastroClick(item.form)}
              onKeyPress={(e) => e.key === 'Enter' && handleCadastroClick(item.form)}
            >
              <div className="cardIcon">{item.icon}</div>
              <h3 className="cardTitle">{item.name}</h3>
            </div>
          ))}
        </div>
      ) : (
        <>
          {activeCadastro === CADASTRO_TYPES.CLIENTES && <CadastroCliente onVoltar={handleVoltar} />}
          {activeCadastro === CADASTRO_TYPES.FORNECEDORES && <CadastroFornecedores onVoltar={handleVoltar} />}
          {activeCadastro === CADASTRO_TYPES.PRESTADORES && <CadastroPrestadores onVoltar={handleVoltar} />}
          {activeCadastro === CADASTRO_TYPES.EQUIPE && <CadastroEquipe onVoltar={handleVoltar} />}
          {activeCadastro === CADASTRO_TYPES.MATERIAIS && <CadastroMateriais onVoltar={handleVoltar} />}
          {activeCadastro === CADASTRO_TYPES.FROTA && <CadastroFrota onVoltar={handleVoltar} />}
          {activeCadastro === CADASTRO_TYPES.CONTRATOS && <CadastroContratos onVoltar={handleVoltar} />}
          {activeCadastro === CADASTRO_TYPES.OBRAS && <CadastroObras onVoltar={handleVoltar} />}
          {activeCadastro === CADASTRO_TYPES.RODOVIAS && <CadastroRodovias onVoltar={handleVoltar} />}
        </>
      )}
    </div>
  );
}

export default Cadastros;