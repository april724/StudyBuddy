
import React, { useState } from 'react';
import { 
  BookOpen, 
  PenTool, 
  Lightbulb, 
  Camera, 
  ArrowLeft, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';
import { AppMode } from './types';
import { analyzeStudyMaterial } from './services/geminiService';
import LoadingHeart from './components/LoadingHeart';
import ImageCropper from './components/ImageCropper';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.HOME);
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);

  const resetState = () => {
    setMode(AppMode.HOME);
    setRawImage(null);
    setResult(null);
    setIsAnalyzing(false);
    setIsCropping(false);
    setUserAnswer('');
    setShowExplanation(false);
  };

  const handlePrint = () => {
    try {
      // 確保同步觸發，避免某些瀏覽器攔截非同步的列印請求
      window.focus();
      window.print();
    } catch (e) {
      console.error("Print feature failed:", e);
      alert("抱歉，您的瀏覽器目前不支援直接列印功能。請嘗試使用螢幕截圖方式保存這份重點地圖喔！");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRawImage(reader.result as string);
        setIsCropping(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropConfirm = async (croppedBase64: string) => {
    setResult(null);
    setIsCropping(false);
    setIsAnalyzing(true);
    try {
      const data = await analyzeStudyMaterial(croppedBase64, mode);
      setResult(data);
    } catch (error) {
      console.error("Analysis failed", error);
      alert("分析失敗，請檢查網路或 API KEY。");
      setIsAnalyzing(false);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderHome = () => (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6">
      <div className="text-center mb-12 animate-in fade-in slide-in-from-top duration-700">
        <h1 className="text-5xl md:text-6xl font-cute text-pink-500 mb-4 tracking-wider drop-shadow-sm">StudyBuddy</h1>
        <p className="text-lg text-gray-600 font-medium italic">讓學習變得很可愛的 AI 夥伴 ✨</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <button 
          onClick={() => setMode(AppMode.MISTAKE_EXPLANATION)}
          className="bg-orange-100 hover:bg-orange-200 p-8 rounded-3xl border-4 border-orange-300 flex flex-col items-center bouncy shadow-lg group"
        >
          <div className="bg-orange-300 p-4 rounded-full mb-4 group-hover:rotate-12 transition-transform">
            <RotateCcw className="w-10 h-10 text-white" />
          </div>
          <span className="text-xl font-bold text-orange-700">錯題講解</span>
          <p className="text-sm text-orange-600 mt-2 text-center font-medium">拍下不會的題目<br/>AI 幫你解析思路</p>
        </button>

        <button 
          onClick={() => setMode(AppMode.PROBLEM_PRACTICE)}
          className="bg-blue-100 hover:bg-blue-200 p-8 rounded-3xl border-4 border-blue-300 flex flex-col items-center bouncy shadow-lg group"
        >
          <div className="bg-blue-300 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
            <PenTool className="w-10 h-10 text-white" />
          </div>
          <span className="text-xl font-bold text-blue-700">題目練習</span>
          <p className="text-sm text-blue-600 mt-2 text-center font-medium">先挑戰看看自己的實力<br/>再看生動的解析</p>
        </button>

        <button 
          onClick={() => setMode(AppMode.KEY_POINTS)}
          className="bg-purple-100 hover:bg-purple-200 p-8 rounded-3xl border-4 border-purple-300 flex flex-col items-center bouncy shadow-lg group"
        >
          <div className="bg-purple-300 p-4 rounded-full mb-4 group-hover:animate-pulse transition-transform">
            <Lightbulb className="w-10 h-10 text-white" />
          </div>
          <span className="text-xl font-bold text-purple-700">重點學習</span>
          <p className="text-sm text-purple-600 mt-2 text-center font-medium">提取繁雜內容<br/>製作精美資訊圖表</p>
        </button>
      </div>
    </div>
  );

  const renderUpload = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 animate-in fade-in duration-500">
      <button 
        onClick={resetState} 
        className="self-start mb-8 flex items-center text-gray-500 hover:text-pink-500 transition-colors font-bold no-print"
      >
        <ArrowLeft className="w-5 h-5 mr-1" /> 返回首頁
      </button>
      
      {isCropping && rawImage ? (
        <ImageCropper 
          imageSrc={rawImage} 
          onConfirm={handleCropConfirm} 
          onCancel={() => {
            setIsCropping(false);
            setRawImage(null);
          }} 
        />
      ) : (
        <div className="bg-white p-10 md:p-16 rounded-[3.5rem] shadow-2xl border-dashed border-4 border-pink-200 w-full max-w-xl text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
          <Camera className="w-24 h-24 text-pink-300 mx-auto mb-8 animate-bounce" />
          <h2 className="text-3xl font-cute text-pink-600 mb-4">第一步：捕捉知識</h2>
          <p className="text-gray-400 mb-10 text-lg">請上傳包含題目或內容的照片<br/>接下來我們會進行「精準框選」喔！</p>
          
          <label className="cursor-pointer bg-pink-500 text-white py-5 px-12 rounded-full text-xl font-bold hover:bg-pink-600 transition-all shadow-xl shadow-pink-200 inline-block bouncy active:scale-95">
            開啟相機或相簿
            <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
          </label>
        </div>
      )}
    </div>
  );

  const renderResult = () => {
    if (isAnalyzing) return <LoadingHeart />;
    if (!result) return null;

    if (mode === AppMode.MISTAKE_EXPLANATION) {
      return (
        <div className="max-w-3xl mx-auto p-6 space-y-6 pb-20">
          <button onClick={resetState} className="flex items-center text-gray-500 mb-4 font-bold no-print"><ArrowLeft className="w-4 h-4 mr-1"/> 返回</button>
          
          <div className="bg-white rounded-[2rem] p-8 shadow-xl border-t-8 border-orange-400 animate-in slide-in-from-left duration-500">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🔍</span>
              <h3 className="text-xl font-bold text-orange-600">辨識到的題目</h3>
            </div>
            <p className="text-gray-700 leading-relaxed italic text-lg bg-orange-50/50 p-4 rounded-xl border border-orange-100">{result.question}</p>
          </div>

          {!showExplanation ? (
            <div className="bg-orange-50 rounded-[2.5rem] p-10 border-2 border-orange-200 text-center animate-in zoom-in duration-700 shadow-inner">
              <Sparkles className="w-12 h-12 text-orange-400 mx-auto mb-4 animate-spin-slow" />
              <h2 className="text-3xl font-cute text-orange-700 mb-4">AI 已經準備好攻略了！</h2>
              <p className="text-orange-600 mb-8 text-lg">先看看下面的提示與思路，最後再試著填入答案吧！</p>
              
              <div className="bg-white p-8 rounded-3xl mb-10 text-left shadow-md border-2 border-orange-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 text-orange-50 text-6xl font-cute">TIP</div>
                <h4 className="font-bold text-orange-500 mb-3 flex items-center gap-2">
                   <div className="w-2 h-6 bg-orange-400 rounded-full"></div>
                   💡 AI 的解題黃金思路：
                </h4>
                <p className="text-gray-600 leading-relaxed text-lg relative z-10">{result.explanation}</p>
              </div>

              <div className="flex flex-col items-center gap-6">
                <div className="w-full max-w-md">
                   <label className="text-left block text-sm font-bold text-orange-400 mb-2 ml-4">YOUR ANSWER / 你的答案</label>
                   <input 
                    type="text" 
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="例如：(A) 或是 42"
                    className="w-full p-5 rounded-2xl border-4 border-orange-200 focus:border-orange-400 focus:outline-none focus:ring-8 focus:ring-orange-100 transition-all text-center text-2xl font-bold placeholder:text-gray-200"
                  />
                </div>
                <button 
                  onClick={() => setShowExplanation(true)}
                  className="bg-orange-500 text-white py-4 px-12 rounded-full font-bold text-xl shadow-xl shadow-orange-200 hover:bg-orange-600 transition-all bouncy active:scale-95"
                >
                  確認答案並看解答
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 rounded-[3rem] p-12 border-4 border-green-200 text-center animate-in fade-in zoom-in duration-500 shadow-2xl">
              <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <CheckCircle2 className="w-16 h-16 text-green-500" />
              </div>
              <h2 className="text-4xl font-cute text-green-700 mb-4">正確答案揭曉！</h2>
              <div className="bg-white py-8 px-16 rounded-[2rem] shadow-xl border-4 border-green-300 inline-block mb-8 animate-bounce">
                <span className="text-5xl font-black text-green-600 tracking-widest">{result.answer}</span>
              </div>
              <div className="p-6 bg-white/50 rounded-2xl border border-green-100 mb-10">
                <p className="text-gray-600 text-lg font-medium">剛才的挑戰：<span className="font-black text-orange-500 text-2xl mx-2 underline decoration-wavy underline-offset-4">{userAnswer || "空"}</span></p>
              </div>
              <button onClick={resetState} className="bg-gray-800 text-white py-4 px-12 rounded-full font-bold text-lg hover:bg-black transition-all shadow-xl">
                繼續下一題挑戰 🚀
              </button>
            </div>
          )}
        </div>
      );
    }

    if (mode === AppMode.PROBLEM_PRACTICE) {
      return (
        <div className="max-w-3xl mx-auto p-6 space-y-8 pb-20">
          <button onClick={resetState} className="flex items-center text-gray-500 mb-4 font-bold no-print"><ArrowLeft className="w-4 h-4 mr-1"/> 返回</button>
          
          <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border-t-8 border-blue-500 animate-in slide-in-from-bottom duration-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-500 p-2 rounded-xl text-white shadow-lg shadow-blue-200">
                 <PenTool className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-blue-700">挑戰你的學習力！</h3>
            </div>
            <p className="text-gray-800 leading-relaxed text-2xl font-bold bg-blue-50/50 p-6 rounded-[2rem] border-2 border-dashed border-blue-100 italic">
               「{result.question}」
            </p>
          </div>

          {!showExplanation ? (
            <div className="bg-blue-50 rounded-[2.5rem] p-10 border-4 border-blue-100 text-center animate-in zoom-in duration-700">
              <h2 className="text-3xl font-cute text-blue-700 mb-6">寫下你的大膽猜測...</h2>
              <textarea 
                rows={4}
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="在這裡寫下你的想法或答案..."
                className="w-full p-6 rounded-3xl border-4 border-blue-200 focus:border-blue-500 focus:outline-none focus:ring-8 focus:ring-blue-100 transition-all text-lg shadow-inner"
              />
              <div className="mt-8">
                <button 
                  onClick={() => setShowExplanation(true)}
                  className="bg-blue-600 text-white py-4 px-14 rounded-full font-black text-xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all bouncy"
                >
                  看 AI 老師的生動講解
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in slide-in-from-bottom duration-700">
              <div className="bg-yellow-50 rounded-[3rem] p-10 md:p-14 border-4 border-yellow-200 relative overflow-hidden shadow-2xl">
                <div className="absolute top-4 right-8 text-7xl opacity-10 animate-pulse font-cute">!</div>
                <h3 className="text-3xl font-cute text-yellow-700 mb-6 flex items-center gap-2">
                   <div className="bg-yellow-400 p-2 rounded-xl text-white shadow-md">
                     <Sparkles className="w-6 h-6" />
                   </div>
                   超好懂的趣味講解：
                </h3>
                <p className="text-gray-700 text-xl leading-relaxed mb-10 font-medium">{result.explanation}</p>
                
                {result.mnemonics && (
                  <div className="bg-white p-8 rounded-[2rem] border-l-[12px] border-pink-400 shadow-xl mb-10 relative">
                    <div className="absolute -top-4 -right-4 bg-pink-400 text-white p-3 rounded-full shadow-lg">
                      <Lightbulb className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-pink-500 text-xl flex items-center gap-2 mb-2">
                       ✨ 必殺！記憶小撇步
                    </h4>
                    <p className="text-gray-600 italic text-lg leading-relaxed">{result.mnemonics}</p>
                  </div>
                )}

                <div className="pt-8 border-t-2 border-yellow-200 flex flex-col md:flex-row justify-between items-center gap-6 no-print">
                   <div className="flex items-baseline gap-3">
                     <span className="text-gray-400 font-bold uppercase text-xs tracking-widest">Standard Answer</span>
                     <span className="text-4xl font-black text-green-600 drop-shadow-sm">{result.answer}</span>
                   </div>
                   <button onClick={resetState} className="bg-blue-600 text-white py-3 px-10 rounded-full font-bold shadow-lg hover:bg-blue-700 flex items-center gap-2 transition-all active:scale-95">
                      <RotateCcw className="w-5 h-5" /> 我還想挑戰！
                   </button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (mode === AppMode.KEY_POINTS) {
      return (
        <div className="max-w-5xl mx-auto p-6 pb-20">
          <button onClick={resetState} className="flex items-center text-gray-500 mb-8 font-bold no-print"><ArrowLeft className="w-4 h-4 mr-1"/> 返回</button>
          
          <div className="bg-white rounded-[4rem] p-10 md:p-16 shadow-2xl border-b-[16px] border-purple-500 relative overflow-hidden print-container animate-in fade-in duration-1000">
            <div className="absolute top-10 right-10 opacity-10 rotate-12 no-print">
               <BookOpen className="w-40 h-40 text-purple-900" />
            </div>
            
            <div className="relative z-10 text-center mb-16">
               <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-600 px-6 py-2 rounded-full text-sm font-black uppercase tracking-widest mb-6 shadow-sm no-print">
                  <Sparkles className="w-4 h-4" /> StudyBuddy Visualizer
               </div>
               <h1 className="text-5xl md:text-7xl font-cute text-purple-800 mb-8 tracking-tight">{result.mainTitle}</h1>
               <div className="w-24 h-2 bg-purple-200 mx-auto mb-8 rounded-full no-print"></div>
               <p className="text-gray-500 max-w-2xl mx-auto text-xl leading-relaxed italic">{result.summary}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
              {result.keyPoints?.map((point: any, idx: number) => (
                <div key={idx} className={`group p-8 rounded-[2.5rem] shadow-sm border-2 transition-all hover:shadow-xl hover:-translate-y-2 ${
                  idx % 4 === 0 ? 'bg-pink-50 border-pink-100' : 
                  idx % 4 === 1 ? 'bg-blue-50 border-blue-100' : 
                  idx % 4 === 2 ? 'bg-green-50 border-green-100' :
                  'bg-yellow-50 border-yellow-100'
                }`}>
                  <div className="flex items-center mb-6">
                    <div className="text-5xl mr-5 group-hover:scale-125 transition-transform duration-500">{point.icon || "🌟"}</div>
                    <h4 className="text-2xl font-black text-gray-800 leading-tight">{point.title}</h4>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-lg font-medium">{point.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-20 text-center p-10 bg-gradient-to-r from-purple-50 to-pink-50 rounded-[2rem] border-2 border-purple-100 no-print">
              <p className="text-purple-700 font-cute text-2xl tracking-widest">✨ 恭喜你！這張知識地圖已經存入大腦囉！ ✨</p>
            </div>
          </div>
          
          <div className="mt-12 flex justify-center gap-6 no-print">
            <button 
              onClick={handlePrint}
              className="bg-purple-600 text-white py-4 px-12 rounded-full font-black text-xl shadow-xl shadow-purple-200 hover:bg-purple-700 flex items-center gap-3 transition-all active:scale-95"
            >
              <Lightbulb className="w-6 h-6" /> 列印這張重點地圖
            </button>
            <button onClick={resetState} className="bg-white text-gray-500 py-4 px-10 rounded-full font-bold hover:bg-gray-50 transition-all border-2 border-gray-100">
              回到首頁
            </button>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen pb-20 overflow-x-hidden selection:bg-pink-200 selection:text-pink-900">
      <div className="fixed inset-0 pointer-events-none opacity-20 z-[-1] no-print">
        <div className="absolute top-10 left-10 w-48 h-48 bg-pink-300 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-blue-300 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 left-1/3 w-56 h-56 bg-yellow-200 rounded-full blur-[90px] animate-spin-slow"></div>
      </div>

      <header className="p-8 flex items-center justify-between max-w-7xl mx-auto no-print">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={resetState}>
          <div className="bg-pink-500 p-2.5 rounded-2xl text-white shadow-lg shadow-pink-200 group-hover:rotate-[360deg] transition-transform duration-700">
            <BookOpen className="w-8 h-8" />
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-cute text-pink-600 leading-none">StudyBuddy</span>
            <span className="text-[10px] font-black text-pink-300 uppercase tracking-[0.3em] mt-1">Smart Learning</span>
          </div>
        </div>
        <div className="hidden md:flex gap-6 items-center">
           <div className="h-10 w-px bg-gray-200"></div>
           <div className="text-right">
             <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none mb-1">AI Intelligence</p>
             <p className="text-sm font-bold text-gray-600 flex items-center gap-1">Gemini 3 Flash <span className="text-pink-400">●</span></p>
           </div>
        </div>
      </header>

      <main className="container mx-auto px-4">
        {mode === AppMode.HOME ? renderHome() : 
         (isCropping || !rawImage) ? renderUpload() :
         renderResult()}
      </main>

      <footer className="mt-32 py-12 text-center border-t border-dashed border-pink-100 no-print">
        <p className="text-gray-400 text-sm font-cute tracking-[0.5em] mb-4">StudyBuddy v2.0</p>
        <p className="flex items-center justify-center gap-2 text-pink-300">
          <Sparkles className="w-4 h-4" /> 快樂學習，每一天都充滿能量 <Sparkles className="w-4 h-4" />
        </p>
      </footer>
    </div>
  );
};

export default App;
