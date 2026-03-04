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

  // Fungsi untuk menangani file upload dan membuat preview gambar
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
    setStatus('🚀 Memproses AI... Sedang mencari wajah Anda.')
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
      setStatus('❌ Gagal memproses. Pastikan server AI jalan dan link Drive publik.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#0b0f19] text-slate-200 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Section */}
        <header className="space-y-2 mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <span className="text-2xl">🔍</span> DriveLens AI - Pencari Wajah Otomatis
          </h1>
          <p className="text-slate-400 text-sm">
            Unggah foto wajah Anda, masukkan link folder Google Drive kegiatan, dan biarkan AI mencari foto Anda!
          </p>
        </header>

        {/* Main Grid Layout - Symmetrical 2 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* KOLOM KIRI: Input */}
          <div className="flex flex-col gap-6">
            
            {/* Box 1: Image Upload */}
            <div className="bg-[#1f2937] rounded-lg border border-slate-700 overflow-hidden shadow-lg flex-grow flex flex-col">
              <div className="bg-indigo-600/90 text-white text-sm font-semibold px-4 py-2 flex items-center gap-2">
                <span>🖼️</span> 1. Unggah Foto Wajah Anda (Referensi)
              </div>
              <div className="p-4 flex-grow flex flex-col items-center justify-center relative min-h-[250px] border-2 border-dashed border-slate-600 m-4 rounded-lg hover:bg-slate-800 transition-colors">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-contain p-2" />
                ) : (
                  <div className="text-center text-slate-400 space-y-2">
                    <div className="text-3xl">↑</div>
                    <p className="font-medium">Letakkan Gambar di Sini</p>
                    <p className="text-xs">- atau -</p>
                    <p className="text-sm">Klik untuk Mengunggah</p>
                  </div>
                )}
              </div>
            </div>

            {/* Box 2: Drive Link */}
            <div className="bg-[#1f2937] rounded-lg border border-slate-700 overflow-hidden shadow-lg">
              <div className="bg-indigo-600/90 text-white text-sm font-semibold px-4 py-2 flex items-center gap-2">
                <span>🔗</span> 2. Link Folder Google Drive (Akses Public)
              </div>
              <div className="p-4">
                <input 
                  type="text" 
                  placeholder="https://drive.google.com/drive/folders/..." 
                  className="w-full p-3 rounded-md bg-[#374151] border border-slate-600 outline-none focus:border-indigo-500 text-sm transition-colors"
                  onChange={(e) => setLink(e.target.value)} 
                />
              </div>
            </div>

            {/* Tombol Cari */}
            <button 
              onClick={handleProcess} 
              disabled={isLoading}
              className={`w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg rounded-lg transition-all shadow-lg flex justify-center items-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'active:scale-[0.98]'}`}
            >
              Cari Foto Saya! 🚀
            </button>
            
          </div>

          {/* KOLOM KANAN: Output */}
          <div className="flex flex-col gap-6">
            
            {/* Box 3: Status */}
            <div className="bg-[#1f2937] rounded-lg border border-slate-700 overflow-hidden shadow-lg">
              <div className="bg-indigo-600/90 text-white text-sm font-semibold px-4 py-2 flex items-center gap-2">
                <span>ℹ️</span> Status Pencarian
              </div>
              <div className="p-4">
                <div className="w-full p-3 rounded-md bg-[#374151] border border-slate-600 text-sm min-h-[46px] flex items-center text-slate-300">
                  {status || "Menunggu input..."}
                </div>
              </div>
            </div>

            {/* Box 4: Gallery */}
            <div className="bg-[#1f2937] rounded-lg border border-slate-700 overflow-hidden shadow-lg flex-grow flex flex-col">
              <div className="bg-indigo-600/90 text-white text-sm font-semibold px-4 py-2 flex items-center gap-2">
                <span>📸</span> Hasil Foto Anda
              </div>
              <div className="p-4 flex-grow bg-[#111827] min-h-[300px]">
                {results.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {results.map((url, i) => (
                      <div key={i} className="aspect-square rounded-md overflow-hidden border border-slate-700 bg-black">
                        <img src={url} alt={`Hasil ${i+1}`} className="w-full h-full object-contain" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50 min-h-[250px]">
                    <span className="text-4xl mb-2">🖼️</span>
                    <p className="text-sm">Belum ada hasil</p>
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
