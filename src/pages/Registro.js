import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

const Registro = () => {
  const { state } = useLocation();
  const colaborador = state?.colaborador;
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!info.trim()) {
      alert('Por favor, preencha a informação antes de salvar.');
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, 'registros'), {
        nome: colaborador.nome,
        info: info,
        criadoEm: Timestamp.now()
      });

      alert('✅ Informação registrada com sucesso!');
      setInfo('');
    } catch (error) {
      alert(`Erro ao salvar: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Registrar para {colaborador?.nome}</h2>
      <textarea
        value={info}
        onChange={(e) => setInfo(e.target.value)}
        placeholder="Digite a informação aqui..."
        rows={4}
        cols={50}
        style={{ marginBottom: '12px' }}
      />
      <br />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Salvando...' : 'Salvar'}
      </button>
    </div>
  );
};

export default Registro;

