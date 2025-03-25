import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTachometerAlt,
  faFileAlt,
  faTools,
  faChartBar,
  faRocket,
  faSackDollar,
  faUpload,
  faWarehouse,
  faHardHat,
  faBell,
  faFileSignature,
} from '@fortawesome/free-solid-svg-icons';
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import './App.css';
import Cadastros from './Cadastros/Cadastros';
import ControleServicos from './ControleDeServicos/ControleServicos';
import AlerionLogo from './assets/images/Alerion BR 2.png';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="content">
          <Routes>
            <Route path="/" element={<h1>Bem-vindo ao Sistema Alerion</h1>} />
            <Route path="/cadastros" element={<Cadastros />} />
            <Route path="/controle-servicos" element={<ControleServicos />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <div className="logo-section">
        <img src={AlerionLogo} alt="Logo da Alerion" />
      </div>
      <nav className="menu">
        <MenuItem icon={faTachometerAlt} label="Dashboard" onClick={() => navigate('/')} />
        <MenuItem icon={faFileAlt} label="Cadastros" onClick={() => navigate('/cadastros')} />
        <MenuItem icon={faFileSignature} label="Gestão de Contratos Rodoviários" />
        <MenuItem icon={faChartBar} label="Medições de Serviços" />
        <MenuItem icon={faRocket} label="Controle de Serviços e Apontamentos" onClick={() => navigate('/controle-servicos')} />
        <MenuItem icon={faSackDollar} label="Gestão Financeira" />
        <MenuItem icon={faTools} label="Gestão de Equipamentos e Frota" />
        <MenuItem icon={faWarehouse} label="Gestão de Estoque" />
        <MenuItem icon={faHardHat} label="Segurança do Trabalho" />
        <MenuItem icon={faUpload} label="Documentação e Arquivos" />
        <MenuItem icon={faBell} label="Alertas e Notificações" />
      </nav>
    </aside>
  );
}

function MenuItem({ icon, label, onClick }) {
  return (
    <div className="menu-item" onClick={onClick} role="button" tabIndex="0" onKeyPress={(e) => e.key === 'Enter' && onClick()}>
      <span className="menu-icon">
        <FontAwesomeIcon icon={icon} />
      </span>
      <span className="menu-label">{label}</span>
    </div>
  );
}

export default App;
