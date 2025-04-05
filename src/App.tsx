import React, { useState, useEffect } from 'react';

// Mock data types (replace with actual types if available)
interface AnalysisResults {
    awarenessLevel: string;
    avatar: string;
    coreBenefit: string;
    offerWeaknesses?: string[];
    offerSuggestions?: string[];
    sophisticationLevel?: number;
}

interface GeneratedCreatives {
    headlines: { stage: string; text: string }[];
    ugcScript: { step: number; instruction: string }[];
    visuals: { type: string; id: string }[]; // Using ID for key
    carousels: { type: string; id: string; items: number }[]; // Using ID for key
    abVariations: { id: string; type: string; variation: string }[]; // Using ID for key
}

interface GhostTestResult {
    predictedCtr: string;
    predictedCpc: string;
    estimatedReach: number;
    confidence: string;
}

interface AdLibraryItem {
    id: string;
    niche: string;
    objective: string;
    emotion: string;
    format: string;
    preview: React.ReactNode; // Placeholder for ad preview
}

// Mock Data Generation Functions
const generateMockAnalysis = (offer: string): AnalysisResults => {
    const levels = ["Problem Unaware", "Problem Aware", "Solution Aware", "Product Aware", "Most Aware"];
    const avatars = ["Small Business Owner", "Marketing Manager", "Startup Founder", "E-commerce Seller"];
    const benefits = ["Increase Sales", "Save Time", "Automate Workflow", "Improve ROI"];
    const weaknesses = ["Too generic", "Benefit unclear", "Weak call to action"];
    const suggestions = ["Focus on specific pain point", "Quantify the benefit", "Add social proof"];
    return {
        awarenessLevel: levels[Math.floor(Math.random() * levels.length)],
        avatar: avatars[Math.floor(Math.random() * avatars.length)],
        coreBenefit: benefits[Math.floor(Math.random() * benefits.length)],
        offerWeaknesses: Math.random() > 0.3 ? weaknesses.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * weaknesses.length) + 1) : undefined,
        offerSuggestions: Math.random() > 0.3 ? suggestions.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * suggestions.length) + 1) : undefined,
        sophisticationLevel: Math.floor(Math.random() * 6) + 1,
    };
};

const generateMockCreatives = (): GeneratedCreatives => ({
    headlines: [
        { stage: "Topo", text: "Cansado de anúncios que não convertem?" },
        { stage: "Meio", text: "Descubra como a IA pode turbinar seus criativos." },
        { stage: "Fundo", text: "Gere anúncios de alta performance com AdForge agora!" },
        { stage: "Topo", text: "O segredo dos anúncios milionários revelado." },
        { stage: "Meio", text: "Sua concorrência não quer que você veja isso." },
    ],
    ugcScript: [
        { step: 1, instruction: "Mostre o celular com o app AdForge aberto." },
        { step: 2, instruction: "Fale sobre a dificuldade de criar anúncios antes." },
        { step: 3, instruction: "Demonstre como é fácil gerar um criativo no app." },
        { step: 4, instruction: "Mostre resultados (pode ser um gráfico simulado)." },
        { step: 5, instruction: "Faça uma chamada para ação clara (experimente!)." },
    ],
    visuals: [
        { type: "Mockup", id: `vis-${Math.random()}` },
        { type: "Screenshot", id: `vis-${Math.random()}` },
        { type: "Lifestyle", id: `vis-${Math.random()}` },
         { type: "Mockup", id: `vis-${Math.random()}` },
    ],
    carousels: [
        { type: "Captura", id: `car-${Math.random()}`, items: 5 },
        { type: "Conversão", id: `car-${Math.random()}`, items: 4 },
    ],
    abVariations: [
        { id: `ab-${Math.random()}`, type: "Headline", variation: "Teste A: Anúncios Imbatíveis. Teste B: A Fábrica de Vendas." },
        { id: `ab-${Math.random()}`, type: "Visual", variation: "Teste A: Mockup App. Teste B: Lifestyle c/ Pessoa." },
    ],
});

const generateMockGhostTest = (): GhostTestResult => ({
    predictedCtr: `${(Math.random() * 2 + 0.5).toFixed(2)}%`,
    predictedCpc: `R$ ${(Math.random() * 5 + 0.5).toFixed(2)}`,
    estimatedReach: Math.floor(Math.random() * 10000 + 5000),
    confidence: ["Baixa", "Média", "Alta"][Math.floor(Math.random() * 3)],
});

const generateMockAdLibrary = (): AdLibraryItem[] => [
    { id: 'ad1', niche: 'SaaS', objective: 'Lead Gen', emotion: 'Curiosidade', format: 'Vídeo UGC', preview: <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-32 flex items-center justify-center text-gray-500">Video Preview 1</div> },
    { id: 'ad2', niche: 'E-commerce', objective: 'Conversão', emotion: 'Urgência', format: 'Carrossel', preview: <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-32 flex items-center justify-center text-gray-500">Carousel Preview 1</div> },
    { id: 'ad3', niche: 'Infoproduto', objective: 'Engajamento', emotion: 'Autoridade', format: 'Imagem Única', preview: <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-32 flex items-center justify-center text-gray-500">Image Preview 1</div> },
     { id: 'ad4', niche: 'Serviços', objective: 'Reconhecimento', emotion: 'Confiança', format: 'Vídeo Curto', preview: <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-32 flex items-center justify-center text-gray-500">Video Preview 2</div> },
];


const AdForgeApp: React.FC = () => {
    const [offerInput, setOfferInput] = useState<string>('');
    const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
    const [generatedCreatives, setGeneratedCreatives] = useState<GeneratedCreatives | null>(null);
    const [ghostTesterResults, setGhostTesterResults] = useState<GhostTestResult | null>(null);
    const [offerAnalysis, setOfferAnalysis] = useState<AnalysisResults | null>(null);
    const [adLibraryItems, setAdLibraryItems] = useState<AdLibraryItem[]>(generateMockAdLibrary()); // Initialize library

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [isTesting, setIsTesting] = useState<boolean>(false);
    const [isAnalyzingOffer, setIsAnalyzingOffer] = useState<boolean>(false);

    const [activeTab, setActiveTab] = useState<'generate' | 'unlock' | 'library' | 'tester'>('generate');
    const [uploadStatus, setUploadStatus] = useState<string | null>(null);


    const handleGenerate = () => {
        if (!offerInput.trim()) return;
        setIsLoading(true);
        setAnalysisResults(null);
        setGeneratedCreatives(null);
        setGhostTesterResults(null); // Reset other results too
        setOfferAnalysis(null);

        // Simulate API call
        setTimeout(() => {
            setAnalysisResults(generateMockAnalysis(offerInput));
            setGeneratedCreatives(generateMockCreatives());
            setIsLoading(false);
        }, 2000);
    };

    const handleUnlockOffer = () => {
        if (!offerInput.trim()) return;
        setIsAnalyzingOffer(true);
        setOfferAnalysis(null);
         // Simulate API call
        setTimeout(() => {
            setOfferAnalysis(generateMockAnalysis(offerInput)); // Use the same mock for simplicity
            setIsAnalyzingOffer(false);
        }, 1500);
    }

    const handleRunGhostTest = () => {
        setIsTesting(true);
        setGhostTesterResults(null);
         // Simulate API call
         setTimeout(() => {
            setGhostTesterResults(generateMockGhostTest());
            setIsTesting(false);
        }, 1800);
    }

    const handleUploadToMeta = () => {
        setIsUploading(true);
        setUploadStatus("Enviando para Meta Ads...");
         // Simulate API call
        setTimeout(() => {
            const success = Math.random() > 0.2; // Simulate success/failure
             setUploadStatus(success ? "Criativos enviados com sucesso!" : "Falha ao enviar. Verifique sua conexão/API Key.");
            setIsUploading(false);
        }, 2500);

        // Optionally hide status message after a few seconds
        setTimeout(() => setUploadStatus(null), 7000);
    }

    const renderVisual = (visual: { type: string; id: string }) => (
        <div key={visual.id} className="flex flex-col items-center space-y-1">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-24 h-24 flex items-center justify-center text-gray-400 text-xs">
                Visual
            </div>
            <span className="text-xs text-gray-600">{visual.type}</span>
        </div>
    );

     const renderCarousel = (carousel: { type: string; id: string; items: number }) => (
        <div key={carousel.id} className="flex flex-col items-center space-y-1 p-2 border rounded-lg bg-gray-50">
             <div className="flex space-x-1 overflow-hidden w-full justify-center">
                {[...Array(Math.min(carousel.items, 4))].map((_, i) => ( // Show max 4 items preview
                     <div key={i} className="bg-gray-300 border border-dashed rounded w-10 h-10 flex-shrink-0"></div>
                 ))}
                 {carousel.items > 4 && <div className="text-gray-500 self-center ml-1">...</div>}
             </div>

            <span className="text-xs text-gray-600">{carousel.type} ({carousel.items} itens)</span>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100 p-4 md:p-8 font-sans">
            <header className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-2">
                    AdForge
                </h1>
                <p className="text-lg md:text-xl text-gray-400 italic">
                    Forje anúncios que quebram algoritmos e vendem até silêncio.
                </p>
            </header>

            {/* Tab Navigation */}
             <div className="mb-6 flex flex-wrap justify-center space-x-2 md:space-x-4 border-b border-gray-700 pb-2">
                <button
                    onClick={() => setActiveTab('generate')}
                    className={`px-4 py-2 rounded-t-lg text-sm md:text-base font-medium transition-colors duration-200 ${activeTab === 'generate' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                >
                    Gerar Criativos
                </button>
                 <button
                    onClick={() => setActiveTab('unlock')}
                    className={`px-4 py-2 rounded-t-lg text-sm md:text-base font-medium transition-colors duration-200 ${activeTab === 'unlock' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                >
                    Destravar Ofertas
                </button>
                 <button
                    onClick={() => setActiveTab('library')}
                    className={`px-4 py-2 rounded-t-lg text-sm md:text-base font-medium transition-colors duration-200 ${activeTab === 'library' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                >
                    Biblioteca Campeã
                </button>
                 <button
                    onClick={() => setActiveTab('tester')}
                    className={`px-4 py-2 rounded-t-lg text-sm md:text-base font-medium transition-colors duration-200 ${activeTab === 'tester' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                >
                    Testador Fantasma™
                </button>
            </div>

            {/* Main Content Area */}
            <main className="max-w-5xl mx-auto">

                {/* Generate Creatives Tab */}
                 {activeTab === 'generate' && (
                    <div className="space-y-6">
                        {/* Input Section */}
                        <section className="bg-gray-800 p-6 rounded-lg shadow-lg">
                            <label htmlFor="offerInput" className="block text-lg font-semibold mb-2 text-blue-300">
                                1. Descreva sua Oferta (ou cole a URL da Landing Page)
                            </label>
                            <textarea
                                id="offerInput"
                                value={offerInput}
                                onChange={(e) => setOfferInput(e.target.value)}
                                placeholder="Ex: Curso online de tráfego pago para iniciantes que querem seus primeiros clientes em 30 dias. Ou cole https://sua-landing-page.com"
                                className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 min-h-[100px]"
                                rows={4}
                            />
                            <button
                                onClick={handleGenerate}
                                disabled={isLoading || !offerInput.trim()}
                                className={`mt-4 w-full md:w-auto px-6 py-3 rounded-md font-bold text-white transition duration-300 ease-in-out flex items-center justify-center space-x-2 ${
                                    isLoading || !offerInput.trim()
                                        ? 'bg-gray-600 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:scale-105'
                                }`}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Forjando Anúncios...
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38zM12 5.394L8.176 11H12v3.606L15.824 9H12V5.394z" clipRule="evenodd" />
                                        </svg>
                                        <span>Gerar Criativos Agora</span>
                                     </>
                                )}
                            </button>
                        </section>

                        {/* Results Section */}
                        {isLoading && (
                            <div className="text-center py-10">
                                <p className="text-xl text-gray-400 animate-pulse">Analisando oferta e gerando criativos...</p>
                            </div>
                        )}

                        {!isLoading && analysisResults && generatedCreatives && (
                            <section className="space-y-6">
                                {/* Analysis Summary */}
                                <div className="bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 border-blue-400">
                                    <h2 className="text-xl font-semibold mb-3 text-blue-300">Análise da Oferta</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                        <p><strong className="text-gray-300">Nível de Consciência:</strong> {analysisResults.awarenessLevel}</p>
                                        <p><strong className="text-gray-300">Avatar Principal:</strong> {analysisResults.avatar}</p>
                                        <p><strong className="text-gray-300">Benefício Central:</strong> {analysisResults.coreBenefit}</p>
                                    </div>
                                </div>

                                {/* Generated Creatives */}
                                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                                     <h2 className="text-xl font-semibold mb-4 text-purple-400">Criativos Gerados</h2>

                                     {/* Headlines */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold mb-2 text-gray-200">Headlines Magnéticas 🧲</h3>
                                        <ul className="list-disc list-inside space-y-1 text-gray-300 pl-2">
                                            {generatedCreatives.headlines.map((headline, index) => (
                                                <li key={index}>
                                                    <span className="font-medium text-cyan-300 mr-2">[{headline.stage}]</span>
                                                    {headline.text}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* UGC Script */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold mb-2 text-gray-200">Script de Vídeo UGC 🎬</h3>
                                        <div className="bg-gray-700 p-4 rounded-md space-y-2">
                                            {generatedCreatives.ugcScript.map((step) => (
                                                <p key={step.step} className="text-sm text-gray-300">
                                                    <strong className="text-green-400">{step.step}.</strong> {step.instruction}
                                                </p>
                                            ))}
                                        </div>
                                    </div>

                                     {/* Visuals */}
                                     <div className="mb-6">
                                         <h3 className="text-lg font-semibold mb-3 text-gray-200">Visuais Gerados por IA 🖼️</h3>
                                         <div className="flex flex-wrap gap-4">
                                             {generatedCreatives.visuals.map(renderVisual)}
                                         </div>
                                     </div>

                                     {/* Carousels */}
                                     <div className="mb-6">
                                        <h3 className="text-lg font-semibold mb-3 text-gray-200">Carrosséis Prontos 🎠</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {generatedCreatives.carousels.map(renderCarousel)}
                                        </div>
                                    </div>

                                    {/* A/B Variations */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold mb-2 text-gray-200">Variações A/B ⚡</h3>
                                        <ul className="space-y-2 text-gray-300">
                                            {generatedCreatives.abVariations.map((variation) => (
                                                <li key={variation.id} className="bg-gray-700 p-3 rounded-md text-sm">
                                                    <strong className="text-yellow-400 mr-2">{variation.type}:</strong> {variation.variation}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                     {/* Upload Button */}
                                    <div className="mt-8 pt-6 border-t border-gray-700">
                                         <button
                                             onClick={handleUploadToMeta}
                                             disabled={isUploading}
                                             className={`w-full md:w-auto px-6 py-3 rounded-md font-bold text-white transition duration-300 ease-in-out flex items-center justify-center space-x-2 ${
                                                 isUploading
                                                     ? 'bg-gray-600 cursor-not-allowed'
                                                     : 'bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 transform hover:scale-105'
                                             }`}
                                         >
                                             {isUploading ? (
                                                 <>
                                                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                     </svg>
                                                     Enviando...
                                                 </>
                                             ) : (
                                                 <>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                      <path d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L6.707 6.707a1 1 0 01-1.414 0z" />
                                                    </svg>
                                                     <span>Subir Direto para Meta Ads</span>
                                                 </>
                                             )}
                                         </button>
                                         {uploadStatus && (
                                            <p className={`mt-3 text-sm ${uploadStatus.includes('sucesso') ? 'text-green-400' : 'text-red-400'}`}>
                                                {uploadStatus}
                                            </p>
                                         )}
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>
                )}

                {/* Unlock Offers Tab */}
                 {activeTab === 'unlock' && (
                     <div className="space-y-6">
                         <section className="bg-gray-800 p-6 rounded-lg shadow-lg">
                             <h2 className="text-xl font-semibold mb-3 text-yellow-400">Modo "Destravar Ofertas" 🔓</h2>
                             <p className="text-gray-400 mb-4 text-sm">Cole sua oferta abaixo para a IA analisar pontos fracos e sugerir melhorias com base nos 6 níveis de sofisticação de mercado.</p>
                              <textarea
                                id="offerInputUnlock"
                                value={offerInput} // Reuse state or use a separate one if needed
                                onChange={(e) => setOfferInput(e.target.value)}
                                placeholder="Cole sua oferta aqui..."
                                className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-gray-100 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition duration-200 min-h-[100px]"
                                rows={4}
                            />
                            <button
                                onClick={handleUnlockOffer}
                                disabled={isAnalyzingOffer || !offerInput.trim()}
                                className={`mt-4 w-full md:w-auto px-6 py-3 rounded-md font-bold text-white transition duration-300 ease-in-out flex items-center justify-center space-x-2 ${
                                    isAnalyzingOffer || !offerInput.trim()
                                        ? 'bg-gray-600 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 transform hover:scale-105'
                                }`}
                            >
                                {isAnalyzingOffer ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Analisando Oferta...
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                          <path d="M12.293 7.293a1 1 0 011.414 0l2 2a1 1 0 010 1.414l-2 2a1 1 0 01-1.414-1.414L13.586 11H10a1 1 0 110-2h3.586l-.293-.293z" />
                                        </svg>
                                        <span>Analisar e Sugerir Melhorias</span>
                                     </>
                                )}
                            </button>
                         </section>

                          {isAnalyzingOffer && (
                             <div className="text-center py-10">
                                <p className="text-xl text-gray-400 animate-pulse">Identificando gargalos e oportunidades...</p>
                             </div>
                         )}

                         {!isAnalyzingOffer && offerAnalysis && (
                             <section className="bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 border-yellow-400 space-y-4">
                                 <h3 className="text-lg font-semibold text-yellow-300">Resultado da Análise:</h3>
                                 {offerAnalysis.sophisticationLevel && (
                                      <p className="text-sm"><strong className='text-gray-300'>Nível de Sofisticação Estimado:</strong> {offerAnalysis.sophisticationLevel} / 6</p>
                                 )}
                                  {offerAnalysis.offerWeaknesses && offerAnalysis.offerWeaknesses.length > 0 && (
                                     <div>
                                         <h4 className="font-semibold text-red-400 mb-1">🚨 Pontos Fracos Identificados:</h4>
                                         <ul className="list-disc list-inside text-red-300 text-sm pl-2 space-y-1">
                                             {offerAnalysis.offerWeaknesses.map((weakness, index) => <li key={index}>{weakness}</li>)}
                                         </ul>
                                     </div>
                                 )}
                                 {offerAnalysis.offerSuggestions && offerAnalysis.offerSuggestions.length > 0 && (
                                      <div>
                                         <h4 className="font-semibold text-green-400 mb-1">💡 Sugestões de Melhoria:</h4>
                                         <ul className="list-disc list-inside text-green-300 text-sm pl-2 space-y-1">
                                             {offerAnalysis.offerSuggestions.map((suggestion, index) => <li key={index}>{suggestion}</li>)}
                                         </ul>
                                     </div>
                                 )}
                                  {!offerAnalysis.offerWeaknesses && !offerAnalysis.offerSuggestions && (
                                    <p className="text-green-400">✅ Sua oferta parece sólida! Continue testando.</p>
                                  )}
                             </section>
                         )}
                    </div>
                 )}

                {/* Ad Library Tab */}
                 {activeTab === 'library' && (
                    <div className="space-y-6">
                        <section className="bg-gray-800 p-6 rounded-lg shadow-lg">
                            <h2 className="text-xl font-semibold mb-4 text-cyan-400">Biblioteca Viva de Anúncios Campeões 🏆</h2>
                             {/* Add Filters Here Eventually */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {adLibraryItems.map(item => (
                                    <div key={item.id} className="bg-gray-700 p-4 rounded-lg shadow-md space-y-3">
                                        {item.preview}
                                        <div className="text-xs space-y-1">
                                            <p><strong className="text-gray-300">Nicho:</strong> <span className="bg-blue-900 text-blue-200 px-1.5 py-0.5 rounded">{item.niche}</span></p>
                                            <p><strong className="text-gray-300">Objetivo:</strong> <span className="bg-purple-900 text-purple-200 px-1.5 py-0.5 rounded">{item.objective}</span></p>
                                            <p><strong className="text-gray-300">Emoção:</strong> <span className="bg-pink-900 text-pink-200 px-1.5 py-0.5 rounded">{item.emotion}</span></p>
                                            <p><strong className="text-gray-300">Formato:</strong> <span className="bg-gray-600 text-gray-200 px-1.5 py-0.5 rounded">{item.format}</span></p>
                                        </div>
                                         {/* Add buttons like 'Analyze' or 'Copy Structure' here */}
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                 )}

                 {/* Ghost Tester Tab */}
                 {activeTab === 'tester' && (
                     <div className="space-y-6">
                         <section className="bg-gray-800 p-6 rounded-lg shadow-lg">
                             <h2 className="text-xl font-semibold mb-3 text-indigo-400">Testador Fantasma™ 👻</h2>
                             <p className="text-gray-400 mb-4 text-sm">Simule a performance da sua campanha principal (baseada nos criativos gerados ou selecionados) antes de investir um centavo.</p>

                            {/* Needs generated creatives first */}
                            {!generatedCreatives && activeTab !== 'generate' && (
                                 <p className="text-yellow-400 text-sm mb-4">⚠️ Gere ou selecione criativos primeiro na aba 'Gerar Criativos'.</p>
                             )}

                            <button
                                onClick={handleRunGhostTest}
                                disabled={isTesting || !generatedCreatives} // Disable if testing or no creatives generated
                                className={`w-full md:w-auto px-6 py-3 rounded-md font-bold text-white transition duration-300 ease-in-out flex items-center justify-center space-x-2 ${
                                    isTesting || !generatedCreatives
                                        ? 'bg-gray-600 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105'
                                }`}
                            >
                                {isTesting ? (
                                     <>
                                         <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                         </svg>
                                         Simulando Campanha...
                                     </>
                                ) : (
                                     <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                          <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 00.808 9.636c4.79-4.79 12.504-4.79 17.294 0a1 1 0 001.414-1.414zM10 10.001a2 2 0 100 4 2 2 0 000-4zm0-2a4 4 0 100 8 4 4 0 000-8z" clipRule="evenodd" />
                                        </svg>
                                         <span>Rodar Simulação</span>
                                     </>
                                )}
                            </button>
                         </section>

                         {isTesting && (
                             <div className="text-center py-10">
                                <p className="text-xl text-gray-400 animate-pulse">Processando dados e prevendo resultados...</p>
                             </div>
                         )}

                         {!isTesting && ghostTesterResults && (
                             <section className="bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 border-indigo-400 space-y-3">
                                <h3 className="text-lg font-semibold text-indigo-300">Previsão de Performance:</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                     <div className="bg-gray-700 p-3 rounded">
                                        <p className="text-xs text-gray-400">CTR Previsto</p>
                                        <p className="text-lg font-bold text-green-400">{ghostTesterResults.predictedCtr}</p>
                                     </div>
                                      <div className="bg-gray-700 p-3 rounded">
                                        <p className="text-xs text-gray-400">CPC Previsto</p>
                                        <p className="text-lg font-bold text-yellow-400">{ghostTesterResults.predictedCpc}</p>
                                     </div>
                                     <div className="bg-gray-700 p-3 rounded">
                                        <p className="text-xs text-gray-400">Alcance Estimado</p>
                                        <p className="text-lg font-bold text-blue-400">{ghostTesterResults.estimatedReach.toLocaleString('pt-BR')}</p>
                                     </div>
                                     <div className="bg-gray-700 p-3 rounded">
                                        <p className="text-xs text-gray-400">Confiança</p>
                                         <p className={`text-lg font-bold ${
                                            ghostTesterResults.confidence === 'Alta' ? 'text-green-400' : ghostTesterResults.confidence === 'Média' ? 'text-yellow-400' : 'text-red-400'
                                         }`}>
                                             {ghostTesterResults.confidence}
                                         </p>
                                     </div>
                                </div>
                                <p className="text-xs text-gray-500 pt-2">*Previsões baseadas em dados simulados de comportamento e benchmarks de mercado. Use como guia, não garantia.</p>
                             </section>
                         )}
                     </div>
                )}


            </main>
        </div>
    );
};

export default AdForgeApp;