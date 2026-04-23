'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [userMessage, setUserMessage] = useState('');
  const [userPlatform, setUserPlatform] = useState('whatsapp');
  const [userContact, setUserContact] = useState('');
  const [currentRowId, setCurrentRowId] = useState<number | null>(null);
  const [currentTrackingCode, setCurrentTrackingCode] = useState('');
  const [paymentTimer, setPaymentTimer] = useState<NodeJS.Timeout | null>(null);
  const [timeLeft, setTimeLeft] = useState(300);
  const [userCount, setUserCount] = useState(8293);
  const [messageText, setMessageText] = useState('');
  const [platform, setPlatform] = useState('whatsapp');
  const [contact, setContact] = useState('');

  // Contador de usuários
  useEffect(() => {
    const interval = setInterval(() => {
      setUserCount(prev => prev + Math.floor(Math.random() * 3));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Funções
  const showScreen = (screenName: string) => {
    setCurrentScreen(screenName);
  };

  const goToCreate = () => {
    setCurrentScreen('create');
    setMessageText('');
    setContact('');
    setPlatform('whatsapp');
    setCurrentRowId(null);
    setCurrentTrackingCode('');
  };

  const salvarMensagemNoSupabase = async (message: string, platform: string, contact: string) => {
    const trackingCode = Math.random().toString(36).substring(2, 10).toUpperCase();

    const { data, error } = await supabase
      .from('mensagens')
      .insert([
        {
          mensagem: message,
          plataforma: platform,
          contato: contact,
          tracking_code: trackingCode,
          status: 'pendente',
        },
      ])
      .select();

    if (error) {
      console.error('Erro ao salvar:', error);
      return false;
    }

    setCurrentRowId(data[0].id);
    setCurrentTrackingCode(trackingCode);
    return true;
  };

  const atualizarStatusMensagem = async (status: string) => {
    if (!currentRowId) return;
    await supabase
      .from('mensagens')
      .update({ status, updated_at: new Date() })
      .eq('id', currentRowId);
  };

  const handleSubmit = async () => {
    if (!messageText || messageText.length < 10) {
      alert('Mensagem precisa ter pelo menos 10 caracteres');
      return;
    }
    if (!contact) {
      alert('Informe o contato');
      return;
    }

    const salvo = await salvarMensagemNoSupabase(messageText, platform, contact);
    if (salvo) {
      setUserMessage(messageText);
      setUserPlatform(platform);
      setUserContact(contact);
      setCurrentScreen('payment');
      startTimer();
    }
  };

  const startTimer = () => {
    let time = 300;
    const timer = setInterval(() => {
      time--;
      setTimeLeft(time);
      if (time <= 0) {
        clearInterval(timer);
        setCurrentScreen('create');
      }
    }, 1000);
    setPaymentTimer(timer);
  };

  const copyPix = async () => {
    const pixCode = '00020126360014br.gov.bcb.pix0114empresa.com52040000530398654069.995802BR5913Zylo Recebedor6008Sao Paulo62070503***6304E2A8';
    await navigator.clipboard.writeText(pixCode);
    alert('Código PIX copiado!');
  };

  const simulatePayment = async () => {
    await atualizarStatusMensagem('pago');
    if (paymentTimer) clearInterval(paymentTimer);
    setCurrentScreen('success');
  };

  const resetToHome = () => {
    setCurrentScreen('home');
    setCurrentRowId(null);
    setCurrentTrackingCode('');
  };

  const getPlatformName = (plat: string) => {
    const names: Record<string, string> = {
      whatsapp: 'WhatsApp', instagram: 'Instagram', facebook: 'Facebook', tiktok: 'TikTok', email: 'Email'
    };
    return names[plat] || plat;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const updateCharCount = () => {
    const length = messageText.length;
    return `${length}/500`;
  };

  const getPlaceholder = () => {
    const placeholders: Record<string, string> = {
      whatsapp: '📱 11999999999 (apenas números)',
      instagram: '@usuario',
      facebook: 'Link do perfil',
      tiktok: '@usuario',
      email: 'nome@email.com',
    };
    return placeholders[platform] || 'Digite o contato';
  };

  // TELA HOME
  if (currentScreen === 'home') {
    return (
      <div className="app-container">
        <header className="navbar">
          <div className="logo">
            <div className="logo-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#121214" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <span style={{ fontWeight: 600, fontSize: 18 }}>Zylo</span>
          </div>
          <div className="stats-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
            </svg>
            <span>{userCount.toLocaleString()}</span>
            <span>On line</span>
          </div>
        </header>
        <main style={{ padding: '20px' }}>
          <div className="text-center">
            <div className="badge" style={{ marginBottom: 16 }}>+5.294 mensagens hoje</div>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Tem algo que<br />nunca teve coragem de dizer?</h1>
            <button className="btn btn-primary" style={{ marginTop: 24 }} onClick={goToCreate}>DESABAFAR AGORA →</button>
          </div>
          <div className="grid-2 mt-6">
            <div className="card" style={{ textAlign: 'center' }}><div className="text-success" style={{ fontSize: 20, fontWeight: 700 }}>10K+</div><div className="text-xs text-muted">Usuários</div></div>
            <div className="card" style={{ textAlign: 'center' }}><div className="text-success" style={{ fontSize: 20, fontWeight: 700 }}>50K+</div><div className="text-xs text-muted">Mensagens</div></div>
            <div className="card" style={{ textAlign: 'center' }}><div className="text-success" style={{ fontSize: 20, fontWeight: 700 }}>30min</div><div className="text-xs text-muted">Entrega</div></div>
            <div className="card" style={{ textAlign: 'center' }}><div className="text-success" style={{ fontSize: 20, fontWeight: 700 }}>100%</div><div className="text-xs text-muted">Seguro</div></div>
          </div>
        </main>
      </div>
    );
  }

  // TELA CRIAR MENSAGEM
  if (currentScreen === 'create') {
    return (
      <div className="app-container">
        <header style={{ padding: '16px 20px' }}>
          <button onClick={() => setCurrentScreen('home')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>← Voltar</button>
        </header>
        <main style={{ padding: '20px' }}>
          <div style={{ marginBottom: 20 }}>
            <label className="input-label">Sua mensagem</label>
            <textarea className="input-field" rows={5} placeholder="Escreva seu desabafo aqui..." maxLength={500} value={messageText} onChange={(e) => setMessageText(e.target.value)}></textarea>
            <div className="flex-between mt-2"><span className="text-xs text-muted">Mínimo 10 caracteres</span><span className="text-xs text-muted">{updateCharCount()}</span></div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label className="input-label">Plataforma</label>
            <select className="input-field" value={platform} onChange={(e) => setPlatform(e.target.value)}>
              <option value="whatsapp">WhatsApp</option><option value="instagram">Instagram</option><option value="facebook">Facebook</option><option value="tiktok">TikTok</option><option value="email">Email</option>
            </select>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label className="input-label">Contato da pessoa</label>
            <input className="input-field" placeholder={getPlaceholder()} value={contact} onChange={(e) => setContact(e.target.value)} />
          </div>
          <button className="btn btn-primary mt-6" onClick={handleSubmit}>CONTINUAR →</button>
        </main>
      </div>
    );
  }

  // TELA PAGAMENTO
  if (currentScreen === 'payment') {
    return (
      <div className="app-container">
        <header style={{ padding: '16px 20px' }}>
          <button onClick={() => setCurrentScreen('create')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>← Voltar</button>
        </header>
        <main style={{ padding: '20px' }}>
          <div className="text-center"><div style={{ fontSize: 28, fontWeight: 700 }}>R$ 9,99</div><div className="text-xs text-muted">envio único</div></div>
          <div className="card mt-6">
            <div className="flex-between text-sm" style={{ marginBottom: 8 }}><span className="text-muted">Enviar via</span><span>{getPlatformName(userPlatform)}</span></div>
            <div className="flex-between text-sm"><span className="text-muted">Para</span><span>{userContact}</span></div>
          </div>
          <div className="card mt-6">
            <div className="flex-between mb-4"><span style={{ fontWeight: 500 }}>PIX Copia e Cola</span><div className="badge"><span>{formatTime(timeLeft)}</span></div></div>
            <div className="text-center"><div style={{ background: 'white', padding: 16, borderRadius: 16, display: 'inline-block' }}><img src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=00020126360014br.gov.bcb.pix0114empresa.com52040000530398654069.995802BR5913Zylo%20Recebedor6008Sao%20Paulo62070503***6304E2A8" alt="QR Code" style={{ width: 160, height: 160 }} /></div></div>
            <div className="card mt-4" style={{ background: 'var(--bg-primary)', padding: 12 }}><code className="text-xs" style={{ wordBreak: 'break-all' }}>00020126360014br.gov.bcb.pix0114empresa.com52040000530398654069.995802BR5913Zylo Recebedor6008Sao Paulo62070503***6304E2A8</code></div>
            <button className="btn btn-outline mt-4" onClick={copyPix}>Copiar código</button>
            <div className="divider mt-4" style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16 }}><div style={{ flex: 1, height: 1, background: 'var(--border)' }}></div><span>ou</span><div style={{ flex: 1, height: 1, background: 'var(--border)' }}></div></div>
            <button className="btn btn-primary mt-4" onClick={simulatePayment}>Confirmar pagamento</button>
          </div>
        </main>
      </div>
    );
  }

  // TELA SUCESSO
  if (currentScreen === 'success') {
    return (
      <div className="app-container">
        <main style={{ padding: '20px', textAlign: 'center', marginTop: 60 }}>
          <div style={{ width: 56, height: 56, background: 'var(--primary)', borderRadius: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#121214" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>Mensagem enviada!</h2>
          <p className="text-muted text-sm">Seu desabafo foi registrado com sucesso.</p>
          <div className="card mt-6"><div className="text-center"><div className="text-xs text-muted">Código de rastreio</div><div style={{ fontFamily: 'monospace', fontSize: 16, letterSpacing: 1 }}>{currentTrackingCode}</div></div></div>
          <button className="btn btn-secondary mt-6" onClick={resetToHome}>Voltar ao início</button>
        </main>
      </div>
    );
  }

  return null;
}