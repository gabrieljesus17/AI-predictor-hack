'use client'

import { useState, useEffect } from 'react'
import { Star, LogOut } from 'lucide-react'

// Função para gerar username aleatório
const generateUsername = () => {
  const randomNum = Math.floor(Math.random() * 9000) + 1000
  return `username${randomNum}`
}

// Função para gerar valor em dólar com distribuição específica
const generateDollarValue = () => {
  const rand = Math.random() * 100
  
  if (rand < 20) {
    // 20%: $15-$40
    return Math.floor(Math.random() * (40 - 15 + 1)) + 15
  } else if (rand < 50) {
    // 30%: $41-$140
    return Math.floor(Math.random() * (140 - 41 + 1)) + 41
  } else if (rand < 85) {
    // 35%: $141-$450
    return Math.floor(Math.random() * (450 - 141 + 1)) + 141
  } else {
    // 15%: $451-$860
    return Math.floor(Math.random() * (860 - 451 + 1)) + 451
  }
}

// Função para formatar valor em USD com ponto para milhares
const formatUSD = (value: number) => {
  if (value >= 1000) {
    return `${Math.floor(value / 1000)}.${String(value % 1000).padStart(3, '0')} USD`
  }
  return `${value} USD`
}

interface StudentCard {
  id: number
  username: string
  value: number
}

export default function Home() {
  const [showPopup, setShowPopup] = useState(false)
  const [accessCode, setAccessCode] = useState('')
  const [error, setError] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showStep4, setShowStep4] = useState(false)
  const [showStep5, setShowStep5] = useState(false)
  const [studentCards, setStudentCards] = useState<StudentCard[]>([])
  
  // Estados para Etapa 6
  const [showBetMessage, setShowBetMessage] = useState(false)
  const [processingLines, setProcessingLines] = useState<string[]>([])
  const [isSignalEnabled, setIsSignalEnabled] = useState(false)
  const [betSizeClicked, setBetSizeClicked] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Gerar cards iniciais
  useEffect(() => {
    if (isAuthenticated) {
      const initialCards: StudentCard[] = []
      for (let i = 0; i < 3; i++) {
        initialCards.push({
          id: Date.now() + i,
          username: generateUsername(),
          value: generateDollarValue()
        })
      }
      setStudentCards(initialCards)
    }
  }, [isAuthenticated])

  // Adicionar novo card a cada 9-21 segundos (randomizado)
  useEffect(() => {
    if (!isAuthenticated) return

    const addNewCard = () => {
      const randomDelay = Math.random() * 12000 + 9000 // 9-21 segundos
      
      setTimeout(() => {
        const newCard: StudentCard = {
          id: Date.now(),
          username: generateUsername(),
          value: generateDollarValue()
        }
        
        setStudentCards(prev => [newCard, ...prev].slice(0, 10)) // Mantém no máximo 10 cards
        addNewCard() // Agenda o próximo card
      }, randomDelay)
    }

    addNewCard()
  }, [isAuthenticated])

  const handleValidate = () => {
    if (accessCode === '1898') {
      setError(false)
      setIsAuthenticated(true)
      setShowPopup(false)
    } else {
      setError(true)
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setShowPopup(false)
    setAccessCode('')
    setStudentCards([])
    setShowStep4(false)
    setShowStep5(false)
    setShowBetMessage(false)
    setProcessingLines([])
    setIsSignalEnabled(false)
    setBetSizeClicked(false)
    setIsAnalyzing(false)
  }

  const handleActivate = () => {
    setShowStep4(true)
  }

  const handleBackToStep3 = () => {
    setShowStep4(false)
    setShowStep5(false)
    setShowBetMessage(false)
    setProcessingLines([])
    setIsSignalEnabled(false)
    setBetSizeClicked(false)
    setIsAnalyzing(false)
  }

  const handleFoundGame = () => {
    setShowStep5(true)
  }

  const handleBackToStep4 = () => {
    setShowStep5(false)
    setShowBetMessage(false)
    setProcessingLines([])
    setIsSignalEnabled(false)
    setBetSizeClicked(false)
    setIsAnalyzing(false)
  }

  const handleHowToUse = () => {
    // Ação futura para o botão "COMO USAR O PREDICTOR"
    console.log('Como usar o predictor')
  }

  const handleGetBetSize = () => {
    // Se já foi clicado, não faz nada
    if (betSizeClicked) return
    
    // Marcar como clicado
    setBetSizeClicked(true)
    
    // Mostrar mensagem "Analyzing data..."
    setShowBetMessage(true)
    setIsAnalyzing(true)
    
    // Resetar estados
    setProcessingLines([])
    setIsSignalEnabled(false)
    
    // Linhas de processamento
    const lines = [
      '> Connecting to data stream...',
      '> Analyzing market volatility...',
      '> Calculating risk-to-reward ratio...',
      '> Running predictive model v3.4...',
      '> Finalizing bet size...',
      '> SUCCESS: Bet parameters calculated.'
    ]
    
    // Adicionar linhas gradualmente com delay de 1.8 segundos
    lines.forEach((line, index) => {
      setTimeout(() => {
        setProcessingLines(prev => [...prev, line])
        
        // Se for a última linha, habilitar o botão Get Signal e mudar mensagem
        if (index === lines.length - 1) {
          setIsSignalEnabled(true)
          setIsAnalyzing(false)
        }
      }, index * 1800)
    })
  }

  // Etapa 5 - Predictor Principal
  if (showStep5) {
    return (
      <div className="min-h-screen bg-black text-white px-4 py-6">
        {/* Header com botões Lottery e Logout */}
        <div className="flex justify-end gap-3 mb-6">
          <button className="flex items-center gap-2 bg-black border-2 border-yellow-500 text-yellow-500 px-4 py-2 rounded-sm font-mono text-sm hover:bg-yellow-500 hover:text-black transition-all">
            <Star className="w-4 h-4" />
            Lottery
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-sm font-mono text-sm hover:bg-red-700 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* Seção MY STUDENTS - CENTRALIZADA */}
        <div className="mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h2 className="text-[#00FF00] font-mono text-lg tracking-wider">MY STUDENTS</h2>
            <span className="bg-red-600 text-white text-xs font-mono px-2 py-1 rounded-sm">LIVE</span>
          </div>

          {/* Linha divisória superior */}
          <div className="w-full h-[1px] bg-gray-700 mb-4"></div>

          {/* Cards rolantes - CORES INVERTIDAS */}
          <div className="overflow-x-auto scrollbar-hide mb-4">
            <div className="flex gap-3 pb-2">
              {studentCards.map((card) => (
                <div 
                  key={card.id}
                  className="min-w-[140px] h-[70px] bg-[#1A1A2E] border border-gray-700 rounded-sm px-3 py-2 flex-shrink-0 animate-slideIn flex items-center gap-3"
                >
                  {/* Círculo à esquerda com "AO" em BRANCO */}
                  <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-mono text-xs flex-shrink-0">
                    AO
                  </div>
                  
                  {/* Conteúdo à direita - CORES INVERTIDAS */}
                  <div className="flex flex-col justify-center min-w-0">
                    <p className="text-white font-mono text-xs mb-1 truncate">{card.username}</p>
                    <p className="text-[#00FF00] font-mono text-sm font-bold">
                      {formatUSD(card.value)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Linha divisória inferior */}
          <div className="w-full h-[1px] bg-gray-700"></div>
        </div>

        {/* Card Principal do Predictor - AUMENTADO 30% */}
        <div className="w-full max-w-4xl mx-auto bg-[#1A1A2E] border-2 border-gray-700 rounded-sm p-8">
          {/* Botões Voltar e Como Usar */}
          <div className="flex justify-between items-center mb-8">
            <button 
              onClick={handleBackToStep4}
              className="bg-black border-2 border-yellow-500 text-yellow-500 px-6 py-2 rounded-sm font-mono text-sm hover:bg-yellow-500 hover:text-black transition-all"
            >
              Voltar
            </button>
            <button 
              onClick={handleHowToUse}
              className="text-orange-500 font-mono text-sm hover:text-orange-400 transition-all"
            >
              COMO USAR O PREDICTOR
            </button>
          </div>

          {/* Título */}
          <h1 className="text-[#00FF00] font-mono text-3xl sm:text-4xl mb-10 text-center tracking-wide">
            Aviator AI PREDICTOR
          </h1>

          {/* Multiplicador */}
          <div className="text-center mb-10">
            <p className="text-white font-mono text-7xl sm:text-8xl font-bold">
              x1.00
            </p>
          </div>

          {/* Mensagem de aposta em amarelo (Etapa 6) */}
          {showBetMessage && (
            <div className="text-center mb-6">
              <p className="font-mono text-base sm:text-lg" style={{ color: '#dbdd1c' }}>
                {isAnalyzing ? 'Analyzing data...' : 'Aposte um valor entre 10 U$ até 30 U$'}
              </p>
            </div>
          )}

          {/* Botão Get Bet Size */}
          <button 
            onClick={handleGetBetSize}
            className={`w-full bg-[#00FF00] text-black font-mono text-lg py-4 rounded-sm tracking-wider mb-5 transition-all ${
              betSizeClicked ? 'cursor-default' : 'hover:bg-[#00DD00]'
            }`}
          >
            Get Bet Size
          </button>

          {/* Botão Get Signal (Habilitado/Desabilitado) */}
          <button 
            disabled={!isSignalEnabled}
            className={`w-full font-mono text-lg py-4 rounded-sm tracking-wider mb-8 transition-all ${
              isSignalEnabled 
                ? 'bg-[#00FF00] text-black hover:bg-[#00DD00] cursor-pointer' 
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            Get Signal
          </button>

          {/* Campo de processamento - LARGURA AUMENTADA e TEXTO 30% MENOR */}
          <div className="w-full min-h-[140px] bg-black border border-gray-700 rounded-sm p-4 font-mono text-[0.7rem]">
            {processingLines.map((line, index) => (
              <div 
                key={index}
                className={`mb-1 ${
                  line.includes('SUCCESS') ? 'text-[#00FF00]' : 'text-[#a4cbc8]'
                }`}
              >
                {line}
              </div>
            ))}
          </div>
        </div>

        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          .animate-slideIn {
            animation: slideIn 0.3s ease-out;
          }
        `}</style>
      </div>
    )
  }

  // Etapa 4 - Tutorial Aviator
  if (showStep4) {
    return (
      <div className="min-h-screen bg-black text-white px-4 py-6">
        {/* Header com botões Lottery e Logout */}
        <div className="flex justify-end gap-3 mb-6">
          <button className="flex items-center gap-2 bg-black border-2 border-yellow-500 text-yellow-500 px-4 py-2 rounded-sm font-mono text-sm hover:bg-yellow-500 hover:text-black transition-all">
            <Star className="w-4 h-4" />
            Lottery
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-sm font-mono text-sm hover:bg-red-700 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* Seção MY STUDENTS - CENTRALIZADA */}
        <div className="mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h2 className="text-[#00FF00] font-mono text-lg tracking-wider">MY STUDENTS</h2>
            <span className="bg-red-600 text-white text-xs font-mono px-2 py-1 rounded-sm">LIVE</span>
          </div>

          {/* Linha divisória superior */}
          <div className="w-full h-[1px] bg-gray-700 mb-4"></div>

          {/* Cards rolantes - CORES INVERTIDAS */}
          <div className="overflow-x-auto scrollbar-hide mb-4">
            <div className="flex gap-3 pb-2">
              {studentCards.map((card) => (
                <div 
                  key={card.id}
                  className="min-w-[140px] h-[70px] bg-[#1A1A2E] border border-gray-700 rounded-sm px-3 py-2 flex-shrink-0 animate-slideIn flex items-center gap-3"
                >
                  {/* Círculo à esquerda com "AO" em BRANCO */}
                  <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-mono text-xs flex-shrink-0">
                    AO
                  </div>
                  
                  {/* Conteúdo à direita - CORES INVERTIDAS */}
                  <div className="flex flex-col justify-center min-w-0">
                    <p className="text-white font-mono text-xs mb-1 truncate">{card.username}</p>
                    <p className="text-[#00FF00] font-mono text-sm font-bold">
                      {formatUSD(card.value)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Linha divisória inferior */}
          <div className="w-full h-[1px] bg-gray-700"></div>
        </div>

        {/* Botão Voltar */}
        <div className="mb-6">
          <button 
            onClick={handleBackToStep3}
            className="bg-black border-2 border-yellow-500 text-yellow-500 px-6 py-2 rounded-sm font-mono text-sm hover:bg-yellow-500 hover:text-black transition-all"
          >
            Voltar
          </button>
        </div>

        {/* Conteúdo da Etapa 4 */}
        <div className="flex flex-col items-center">
          {/* Título principal */}
          <h1 className="text-[#00FF00] font-mono text-2xl sm:text-3xl mb-8 text-center tracking-wide">
            Primeiro, encontre o jogo "Aviator"
          </h1>

          {/* Subtítulo */}
          <p className="text-gray-400 font-mono text-sm sm:text-base mb-6 text-center">
            Como encontrar o Aviator dentro da plataforma
          </p>

          {/* Card central para vídeo */}
          <div className="w-full max-w-2xl bg-[#1A1A2E] border-2 border-gray-700 rounded-sm p-8 mb-8 flex items-center justify-center min-h-[300px]">
            <div className="text-center">
              <p className="text-gray-500 font-mono text-sm mb-2">Espaço reservado para vídeo</p>
              <p className="text-gray-600 font-mono text-xs">(Vídeo será inserido posteriormente)</p>
            </div>
          </div>

          {/* Botão "ENCONTREI O JOGO" */}
          <button 
            onClick={handleFoundGame}
            className="w-full max-w-md bg-[#00FF00] text-black font-mono text-base py-3 rounded-sm hover:bg-[#00DD00] transition-all tracking-wider"
          >
            ENCONTREI O JOGO
          </button>
        </div>

        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          .animate-slideIn {
            animation: slideIn 0.3s ease-out;
          }
        `}</style>
      </div>
    )
  }

  // Etapa 3 - Menu Principal
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white px-4 py-6">
        {/* Header com botões Lottery e Logout */}
        <div className="flex justify-end gap-3 mb-6">
          <button className="flex items-center gap-2 bg-black border-2 border-yellow-500 text-yellow-500 px-4 py-2 rounded-sm font-mono text-sm hover:bg-yellow-500 hover:text-black transition-all">
            <Star className="w-4 h-4" />
            Lottery
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-sm font-mono text-sm hover:bg-red-700 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* Seção MY STUDENTS - CENTRALIZADA */}
        <div className="mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h2 className="text-[#00FF00] font-mono text-lg tracking-wider">MY STUDENTS</h2>
            <span className="bg-red-600 text-white text-xs font-mono px-2 py-1 rounded-sm">LIVE</span>
          </div>

          {/* Linha divisória superior */}
          <div className="w-full h-[1px] bg-gray-700 mb-4"></div>

          {/* Cards rolantes - CORES INVERTIDAS */}
          <div className="overflow-x-auto scrollbar-hide mb-4">
            <div className="flex gap-3 pb-2">
              {studentCards.map((card) => (
                <div 
                  key={card.id}
                  className="min-w-[140px] h-[70px] bg-[#1A1A2E] border border-gray-700 rounded-sm px-3 py-2 flex-shrink-0 animate-slideIn flex items-center gap-3"
                >
                  {/* Círculo à esquerda com "AO" em BRANCO */}
                  <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-mono text-xs flex-shrink-0">
                    AO
                  </div>
                  
                  {/* Conteúdo à direita - CORES INVERTIDAS */}
                  <div className="flex flex-col justify-center min-w-0">
                    <p className="text-white font-mono text-xs mb-1 truncate">{card.username}</p>
                    <p className="text-[#00FF00] font-mono text-sm font-bold">
                      {formatUSD(card.value)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Linha divisória inferior */}
          <div className="w-full h-[1px] bg-gray-700"></div>
        </div>

        {/* Seção AI SIGNALS - CENTRALIZADA e 15% MAIOR */}
        <div>
          <h2 className="text-[#00FF00] font-mono text-[1.38rem] tracking-wider mb-6 text-center">AI SIGNALS</h2>

          {/* Card do jogo Aviator */}
          <div className="bg-[#1A1A2E] border-2 border-gray-700 rounded-sm overflow-hidden">
            {/* Parte superior - IMAGEM INSERIDA */}
            <div className="w-full">
              <img 
                src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/204b8392-e466-4728-b961-cda630a80799.png" 
                alt="Aviator AI Predictor" 
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Parte inferior - Informações */}
            <div className="p-6">
              <h3 className="text-white font-mono text-xl mb-4">Aviator AI PREDICTOR</h3>
              
              <div className="flex gap-6 mb-6">
                <div>
                  <p className="text-gray-400 font-mono text-xs mb-1">Signals/sec:</p>
                  <p className="text-[#00FF00] font-mono text-sm font-bold">552</p>
                </div>
                <div>
                  <p className="text-gray-400 font-mono text-xs mb-1">Success rate:</p>
                  <p className="text-[#00FF00] font-mono text-sm font-bold">96.2%</p>
                </div>
              </div>

              <button 
                onClick={handleActivate}
                className="w-full bg-[#00FF00] text-black font-mono text-base py-3 rounded-sm hover:bg-[#00DD00] transition-all tracking-wider"
              >
                ACTIVATE
              </button>
            </div>
          </div>
        </div>

        {/* Espaço vazio para futuros cards */}
        <div className="h-20"></div>

        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          .animate-slideIn {
            animation: slideIn 0.3s ease-out;
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black px-4">
      {/* Etapa 1 - Tela Inicial */}
      {!showPopup && (
        <>
          {/* Título AI PREDICTOR */}
          <h1 className="text-[#00FF00] text-4xl sm:text-5xl font-mono mb-12 tracking-wider">
            AI PREDICTOR_
          </h1>
          
          {/* Botão GET AI SIGNALS */}
          <button 
            onClick={() => setShowPopup(true)}
            className="border-2 border-[#00FF00] text-[#00FF00] px-8 py-3 font-mono text-sm sm:text-base hover:bg-[#00FF00] hover:text-black transition-all duration-300 rounded-sm tracking-wide"
          >
            GET AI SIGNALS
          </button>
        </>
      )}

      {/* Etapa 2 - Pop-up de Código de Acesso */}
      {showPopup && (
        <div className="w-full max-w-md px-4">
          {/* Pop-up */}
          <div className="bg-black border-2 border-[#00FF00] p-6 rounded-sm">
            {/* Mensagem de aviso no topo */}
            <p className="text-red-500 font-mono text-xs sm:text-sm mb-4">
              // 3 access codes available for today
            </p>

            {/* Título */}
            <h2 className="text-[#00FF00] font-mono text-xl sm:text-2xl mb-6">
              Type access code
            </h2>

            {/* Campo de entrada */}
            <input
              type="text"
              value={accessCode}
              onChange={(e) => {
                setAccessCode(e.target.value)
                setError(false)
              }}
              placeholder="Access code"
              className={`w-full p-3 mb-4 bg-[#1A1A2E] text-gray-300 font-mono rounded-sm outline-none border-2 ${
                error ? 'border-red-500' : 'border-transparent'
              } focus:border-[#00FF00] transition-colors`}
            />

            {/* Mensagem de erro */}
            {error && (
              <p className="text-red-500 font-mono text-xs mb-4">
                // Invalid access code
              </p>
            )}

            {/* Botão VALIDATE */}
            <button
              onClick={handleValidate}
              className="w-full p-3 bg-[#00FF00] text-black font-mono text-sm sm:text-base hover:bg-[#00DD00] transition-colors rounded-sm tracking-wide"
            >
              VALIDATE
            </button>
          </div>

          {/* Texto e botão abaixo do pop-up */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 font-mono text-sm sm:text-base mb-4">
              Se ainda não adquiriu seu código de acesso clique no botão abaixo
            </p>
            <button className="border-2 border-[#00FF00] text-[#00FF00] px-6 py-2 font-mono text-sm sm:text-base hover:bg-[#00FF00] hover:text-black transition-all duration-300 rounded-sm tracking-wide">
              ADQUIRIR CÓDIGO
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
