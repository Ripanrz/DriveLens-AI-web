'use client'
import { useState } from 'react'
import { Client } from "@gradio/client"

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [link, setLink] = useState('')
  const [status, setStatus] = useState('')
  const [results, setResults] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)
    if (selectedFile) {
      setPreviewUrl(URL.createObjectURL(selectedFile))
    } else {
      setPreviewUrl(null)
    }
  }

  const handleProcess = async () => {
    if (!file || !link) return alert("Upload foto dan masukkan link Drive dulu, ya!")
    
    setIsLoading(true)
    setStatus('🚀 Memproses AI... Sedang mencari wajah Anda di dataset.')
    setResults([])
    
    try {
      const client = await Client.connect("Ripanrz/drivelens-ai")
      const result = (await client.predict("/cari_wajah", [
        file,
        link 
      ])) as { data: [string, string[]] };
      
      setStatus(result.data[0]);
      setResults(result.data[1]);
    } catch (error) {
      console.error(error)
      setStatus('❌ Gagal memproses. Pastikan server AI berjalan dan link Drive publik.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] text-zinc-300 p-4 md:p-8 font-sans selection:bg-blue-500/30 relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-10 relative z-10">
        
        {/* Header Section */}
        <header className="text-center space-y-4 mb-12 mt-8">
          <div className="inline-flex items-center justify-center p-3 bg-zinc-900/50 border border-zinc-800 rounded-2xl mb-4 shadow-lg">
            <span className="text-3xl">👁️‍🗨️</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
              DriveLens AI
            </span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-base max-w-xl mx-auto font-medium">
            Unggah foto wajah Anda, masukkan link folder Google Drive, dan biarkan AI kami menemukan momen Anda secara otomatis.
          </p>
        </header>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* KOLOM KIRI: Input */}
          <div className="flex flex-col gap-6">
            
            {/* Box 1: Image Upload */}
            <div className="bg-zinc-900/40 backdrop-blur-xl rounded-3xl border border-zinc-800/50 p-6 shadow-2xl transition-all duration-300 hover:border-zinc-700/50 flex flex-col h-full">
              <h2 className="text-zinc-100 font-semibold mb-4 flex items-center gap-2">
                <span className="bg-blue-500/10 text-blue-400 p-2 rounded-lg text-xs">01</span>
                Foto Referensi Wajah
              </h2>
              <div className="flex-grow flex flex-col items-center justify-center relative min-h-[280px] border-2 border-dashed border-zinc-700/50 rounded-2xl bg-zinc-950/50 hover:bg-zinc-800/50 hover:border-blue-500/50 transition-all duration-300 group overflow-hidden">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <div className="text-center text-zinc-500 space-y-3 p-6 transform group-hover:scale-105 transition-transform duration-300">
                    <div className="w-16 h-16 mx-auto bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800 group-hover:border-blue-500/50">
                      <svg className="w-6 h-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                    </div>
                    <p className="font-medium text-sm">Tarik & Lepas foto ke sini</p>
                    <p className="text-xs text-zinc-600">Mendukung format JPG, PNG, WEBP</p>
                  </div>
                )}
              </div>
            </div>

            {/* Box 2: Drive Link */}
            <div className="bg-zinc-900/40 backdrop-blur-xl rounded-3xl border border-zinc-800/50 p-6 shadow-2xl transition-all duration-300 hover:border-zinc-700/50">
              <h2 className="text-zinc-100 font-semibold mb-4 flex items-center gap-2">
                <span className="bg-purple-500/10 text-purple-400 p-2 rounded-lg text-xs">02</span>
                Link Google Drive
              </h2>
              <input 
                type="url" 
                placeholder="https://drive.google.com/drive/folders/..." 
                className="w-full px-5 py-4 rounded-xl bg-zinc-950/80 border border-zinc-800 outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 text-sm text-zinc-200 placeholder:text-zinc-600 transition-all shadow-inner"
                onChange={(e) => setLink(e.target.value)} 
              />
            </div>

            {/* Tombol Cari */}
            <button 
              onClick={handleProcess} 
              disabled={isLoading}
              className={`w-full py-4 mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-base rounded-2xl transition-all duration-300 flex justify-center items-center gap-3 shadow-[0_0_20px_rgba(79,70,229,0.2)] hover:shadow-[0_0_30px_rgba(79,70,229,0.4)] border border-white/10 ${isLoading ? 'opacity-70 cursor-not-allowed grayscale-[30%]' : 'active:scale-[0.98]'}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Menganalisis Wajah...
                </>
              ) : (
                <>Temukan Wajah Saya ⚡</>
              )}
            </button>
            
          </div>

          {/* KOLOM KANAN: Output */}
          <div className="flex flex-col gap-6">
            
            {/* Box 3: Status */}
            <div className="bg-zinc-900/40 backdrop-blur-xl rounded-3xl border border-zinc-800/50 p-6 shadow-2xl transition-all duration-300 hover:border-zinc-700/50">
               <h2 className="text-zinc-100 font-semibold mb-4 flex items-center gap-2">
                <span className="bg-zinc-800 text-zinc-400 p-2 rounded-lg text-xs">⚙️</span>
                Status Sistem
              </h2>
              <div className="w-full px-5 py-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80 text-sm text-zinc-300 flex items-center shadow-inner min-h-[56px]">
                <span className={`${isLoading ? 'animate-pulse text-blue-400' : ''}`}>
                  {status || "Menunggu instruksi dari Anda..."}
                </span>
              </div>
            </div>

            {/* Box 4: Gallery */}
            <div className="bg-zinc-900/40 backdrop-blur-xl rounded-3xl border border-zinc-800/50 p-6 shadow-2xl transition-all duration-300 hover:border-zinc-700/50 flex-grow flex flex-col min-h-[400px]">
               <h2 className="text-zinc-100 font-semibold mb-4 flex items-center gap-2">
                <span className="bg-green-500/10 text-green-400 p-2 rounded-lg text-xs">✨</span>
                Hasil Analisis AI
              </h2>
              <div className="flex-grow bg-zinc-950/50 rounded-2xl border border-zinc-800/50 p-4 shadow-inner overflow-hidden">
                {results.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4 h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {results.map((url, i) => (
                      <div key={i} className="aspect-square rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 relative group">
                        <img src={url} alt={`Hasil ${i+1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                          <span className="text-xs font-medium text-white">Cocok ({i+1})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-4">
                    <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800/50">
                      <svg className="w-8 h-8 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium">Hasil pencarian akan muncul di sini</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  )
}
