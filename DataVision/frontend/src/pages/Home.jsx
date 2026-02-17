import React, { useState, useRef } from 'react'
import { Upload, Activity, FileText, ChevronRight } from 'lucide-react'
import { PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts'
import { useNavigate } from "react-router-dom"
import Analysis from './Analysis'

export default function VisionDashboard() {

  const [drag, setDrag] = useState(false)
  const [file, setFile] = useState(null)
  const [target, setTarget] = useState("")
  const [csv, setCsv] = useState(false)
  const [xlsx, setXlsx] = useState(false)
  const [json, setJson] = useState(false)

  const fileRef = useRef()
  const navigate = useNavigate()

  const pieData = [
    { name: 'CSV', value: 40 },
    { name: 'XLSX', value: 30 },
    { name: 'JSON', value: 30 }
  ]

  const lineData = [
    { x: 1, y: 20 },
    { x: 2, y: 40 },
    { x: 3, y: 35 },
    { x: 4, y: 60 },
    { x: 5, y: 55 }
  ]

  const handleFile = (f) => {
    if (!f) {
      alert("Select file first")
      return
    }

    setFile(f)

    const ext = f.name.split('.').pop().toLowerCase()
    setCsv(ext === 'csv')
    setXlsx(ext === 'xlsx' || ext === 'xls')
    setJson(ext === 'json')
  }

  const sendFile = async () => {
    try {
      if (!file || !target) {
        alert("Select file and enter target variable")
        return
      }

      const formData = new FormData()
      formData.append("file", file)
      formData.append("target", target)

      const res = await fetch("http://127.0.0.1:5000/data", {
        method: "POST",
        body: formData
      })

      if (!res.ok) throw new Error("Upload failed")

      const data = await res.json()

      // Navigate to Analysis page
      navigate("/Analysis", { state: data })

    } catch (err) {
      console.error(err)
      alert("Upload error — check backend")
    }
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden text-white bg-gradient-to-br from-[#020617] via-[#03140f] to-[#052e1b]">
      <div className="max-w-[1400px] mx-auto px-4 py-4">

        {/* Header Buttons */}
        <div className="flex justify-end gap-3 mb-2">
          <button className="px-5 py-1.5 cursor-pointer rounded-full border border-green-400 text-green-300 hover:bg-green-900/30 transition">
            Login
          </button>
          <button className="px-5 py-1.5 cursor-pointer rounded-full bg-gradient-to-r from-green-400 to-emerald-500 text-black font-bold hover:scale-105 transition">
            Signup
          </button>
        </div>

        {/* Title */}
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-6xl font-black bg-gradient-to-r from-green-400 via-emerald-300 to-green-400 text-transparent bg-clip-text animate-pulse">
            DATA VISION
          </h1>
          <p className="text-xs tracking-[0.4em] uppercase font-bold text-green-300 mt-2">
            Unlock your data's hidden story
          </p>
        </div>

        <div className="grid grid-cols-12 gap-6 mt-10 items-stretch">

          {/* Left Panel */}
          <div className="col-span-12 xl:col-span-3">
            <div className="h-full bg-white/5 border border-white/10 rounded-3xl p-4 backdrop-blur-xl shadow-xl">
              <h3 className="text-xs uppercase text-slate-300 font-bold mb-4">
                Dataset Distribution
              </h3>

              <div className="h-40">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" innerRadius={35} outerRadius={60}>
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill="#22c55e" />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <h3 className="text-xs uppercase text-slate-300 font-bold mt-5 mb-3">
                Upload Trends
              </h3>

              <div className="h-32">
                <ResponsiveContainer>
                  <LineChart data={lineData}>
                    <Line type="monotone" dataKey="y" stroke="#22c55e" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Center Upload Section */}
          <div className="col-span-12 xl:col-span-6">
            <div
              onDragEnter={() => setDrag(true)}
              onDragLeave={() => setDrag(false)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                setDrag(false)
                handleFile(e.dataTransfer.files[0])
              }}
              className={`h-full rounded-[3rem] border p-12 flex flex-col justify-center items-center text-center backdrop-blur-xl shadow-2xl ${
                drag
                  ? 'bg-green-900/30 border-green-400'
                  : 'bg-white/5 border-white/10'
              }`}>

              <input
                type="file"
                ref={fileRef}
                accept=".csv,.xlsx,.xls,.json"
                className="hidden"
                onChange={e => handleFile(e.target.files[0])}
              />

              <div className="w-28 h-28 mb-8 rounded-full border-2 border-dashed border-green-400 flex items-center justify-center">
                <Upload className="text-green-400 w-14 h-14" />
              </div>

              <h2 className="text-3xl font-black mb-3">Upload Dataset</h2>

              {file && (
                <p className="text-sm text-green-300 mb-4">{file.name}</p>
              )}

              {file && (
                <input
                  type="text"
                  value={target}
                  onChange={e => setTarget(e.target.value)}
                  placeholder="Enter target variable"
                  className="mb-6 px-4 py-2 rounded-lg w-72 bg-black/40 border border-green-400 text-green-300 placeholder-green-500 outline-none focus:ring-2 focus:ring-green-500"
                />
              )}

              <p className="text-sm text-slate-300 mb-6 max-w-md">
                Drag & Drop CSV, XLSX or JSON automatically
              </p>

              <div className="flex gap-4 mb-6">
                {csv && <span className="px-4 py-1 bg-green-500 text-black rounded-full text-xs font-bold">CSV</span>}
                {xlsx && <span className="px-4 py-1 bg-green-500 text-black rounded-full text-xs font-bold">XLSX</span>}
                {json && <span className="px-4 py-1 bg-green-500 text-black rounded-full text-xs font-bold">JSON</span>}
              </div>

              {!file ? (
                <button
                  onClick={() => fileRef.current.click()}
                  className="px-10 py-3 cursor-pointer bg-gradient-to-r from-green-400 to-emerald-500 text-black font-bold rounded-full shadow-lg">
                  Browse Files
                </button>
              ) : (
                <button
                  onClick={sendFile}
                  className="px-10 cursor-pointer py-3 bg-gradient-to-r from-blue-400 to-indigo-500 text-black font-bold rounded-full shadow-lg">
                  Send File
                </button>
              )}

            </div>
          </div>

          {/* Right Panel */}
          <div className="col-span-12 xl:col-span-3">
            <div className="h-full bg-white/5 border border-white/10 rounded-3xl p-4 backdrop-blur-xl shadow-xl">
              <h3 className="text-xs uppercase mb-4 flex items-center gap-2 text-slate-300 font-bold">
                <Activity size={14} className="text-green-400" /> Live Analytics
              </h3>

              <div className="h-32 flex items-end gap-1">
                {[50, 75, 40, 90, 60, 85, 55].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}%` }}
                    className="flex-1 rounded-t-md bg-gradient-to-t from-green-500/70 to-green-300/20"
                  />
                ))}
              </div>

              <div className="mt-6 space-y-3">
                {[
                  { title: 'Insights', icon: FileText, desc: 'Patterns detected' },
                  { title: 'Forecast', icon: Activity, desc: 'Predictions ready' }
                ].map((item, i) => (
                  <div key={i} className="p-3 bg-black/30 rounded-xl flex items-center gap-3">
                    <item.icon size={16} className="text-green-400" />
                    <div>
                      <p className="text-[10px] uppercase text-slate-400">{item.title}</p>
                      <p className="text-xs">{item.desc}</p>
                    </div>
                    <ChevronRight size={12} className="ml-auto text-slate-500" />
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
