'use client'
import { useState } from 'react'
import { Client } from "@gradio/client"

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [link, setLink] = useState('')
  const [status, setStatus] = useState('')
  const [results, setResults] = useState<string[]>([])

  const handleProcess = async () => {
    if (!file || !link) return alert("Upload foto dan masukkan link Drive dulu, ya!")
    
    setStatus('🚀 Mengirim data ke AI... Harap tunggu.')
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
      setStatus('❌ Gagal memproses. Pastikan server Hugging Face sedang jalan dan link Drive publik.')
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 flex flex-col items-center justify-center">
      <div className="max-w-3xl w-full space-y-10">
        
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
            DriveLens AI
          </h1>
          <p className="text-slate-400">Pencarian wajah otomatis di Google Drive.</p>
        </div>

        <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-cyan-400">1. Upload Foto Wajahmu</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)} 
              className="w-full text-sm text-slate-400 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-cyan-400">2. Link Google Drive</label>
            <input 
              type="text" 
              placeholder="https://drive.google.com/drive/folders/..." 
              className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-cyan-500 transition-colors"
              onChange={(e) => setLink(e.target.value)} 
            />
          </div>
          
          <button 
            onClick={handleProcess} 
            className="w-full py-4 mt-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 font-bold text-lg rounded-xl transition-all shadow-lg active:scale-95"
          >
            Mulai Cari Wajah ⚡
          </button>
        </div>

        {status && (
          <div className="text-center font-medium text-slate-300 bg-slate-800/50 p-4 rounded-xl border border-slate-700 animate-pulse">
            {status}
          </div>
        )}

        {results.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {results.map((url, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden border border-slate-700">
                <img src={url} alt="Hasil AI" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
              </div>
            ))}
          </div>
        )}
        
      </div>
    </main>
  )
}