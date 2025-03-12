import React, { useState } from 'react';
import { FaTimes, FaUpload, FaTrashAlt, FaEdit } from 'react-icons/fa';
import './DetalhesApontamento.css';

const DetalhesApontamento = ({ apontamento, onClose, onEdit, onDelete }) => {
    const [fotos, setFotos] = useState(apontamento.evidencias || []);
    const [historico] = useState([
        {
            data: '2024-02-24 14:30',
            usuario: 'João Silva',
            acao: 'Criação do apontamento'
        },
        {
            data: '2024-02-25 09:15',
            usuario: 'Maria Santos',
            acao: 'Alteração de status para Concluído'
        }
    ]);

    const handleUploadFoto = (e) => {
        const arquivos = Array.from(e.target.files);
        // Aqui você implementaria o upload real das fotos
        const novasFotos = arquivos.map(arquivo => ({
            id: Date.now() + Math.random(),
            url: URL.createObjectURL(arquivo),
            nome: arquivo.name
        }));
        setFotos([...fotos, ...novasFotos]);
    };

    const handleRemoverFoto = (fotoId) => {
        setFotos(fotos.filter(foto => foto.id !== fotoId));
    };

    return (
        <div className="modal-detalhes">
            <div className="modal-content">
                <button className="fechar-modal" onClick={onClose}>
                    <FaTimes />
                </button>
                <h3>Detalhes do Apontamento</h3>

                <div className="detalhes-grid">
                    <div className="detalhe-item">
                        <strong>Código:</strong>
                        <span>{apontamento.codigo}</span>
                    </div>
                    <div className="detalhe-item">
                        <strong>Rodovia:</strong>
                        <span>{apontamento.rodovia}</span>
                    </div>
                    <div className="detalhe-item">
                        <strong>KM Inicial:</strong>
                        <span>{apontamento.kmInicial}</span>
                    </div>
                    <div className="detalhe-item">
                        <strong>KM Final:</strong>
                        <span>{apontamento.kmFinal}</span>
                    </div>
                    <div className="detalhe-item">
                        <strong>Faixa:</strong>
                        <span>{apontamento.faixa}</span>
                    </div>
                    <div className="detalhe-item">
                        <strong>Empresa:</strong>
                        <span>{apontamento.empresa}</span>
                    </div>
                    <div className="detalhe-item">
                        <strong>Equipe:</strong>
                        <span>{apontamento.equipe}</span>
                    </div>
                    <div className="detalhe-item">
                        <strong>Categoria:</strong>
                        <span>{apontamento.classe}</span>
                    </div>
                    <div className="detalhe-item">
                        <strong>Status:</strong>
                        <span className={`status ${apontamento.status.toLowerCase()}`}>
                            {apontamento.status}
                        </span>
                    </div>
                    <div className="detalhe-item">
                        <strong>Prazo:</strong>
                        <span className={`prazo ${getPrazoClass(apontamento.prazo)}`}>
                            {apontamento.prazo}
                        </span>
                    </div>
                    <div className="detalhe-item">
                        <strong>Data de Execução:</strong>
                        <span>{apontamento.dataExecucao || '-'}</span>
                    </div>
                </div>

                <div className="acoes-detalhes">
                    <button className="btn-editar" onClick={onEdit}>
                        <FaEdit /> Editar
                    </button>
                    <button className="btn-excluir" onClick={onDelete}>
                        <FaTrashAlt /> Excluir
                    </button>
                </div>

                <div className="secao-fotos">
                    <h4>Fotos</h4>
                    <div className="upload-area">
                        <label className="btn-upload">
                            <FaUpload /> Adicionar Fotos
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleUploadFoto}
                                style={{ display: 'none' }}
                            />
                        </label>
                    </div>
                    <div className="galeria-fotos">
                        {fotos.map(foto => (
                            <div key={foto.id} className="foto-item">
                                <img src={foto.url} alt={foto.nome} />
                                <button 
                                    className="btn-remover-foto"
                                    onClick={() => handleRemoverFoto(foto.id)}
                                >
                                    <FaTrashAlt />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="secao-historico">
                    <h4>Histórico</h4>
                    <div className="historico-lista">
                        {historico.map((item, index) => (
                            <div key={index} className="historico-item">
                                <div className="historico-data">{item.data}</div>
                                <div className="historico-usuario">{item.usuario}</div>
                                <div className="historico-acao">{item.acao}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const getPrazoClass = (prazo) => {
    const hoje = new Date();
    const dataPrazo = new Date(prazo.split('/').reverse().join('-'));
    
    if (dataPrazo < hoje) return 'vencido';
    const diffDias = Math.ceil((dataPrazo - hoje) / (1000 * 60 * 60 * 24));
    
    if (diffDias <= 2) return 'critico';
    return 'proximo';
};

export default DetalhesApontamento; 