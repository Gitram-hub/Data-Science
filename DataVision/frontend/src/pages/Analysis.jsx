import { useLocation, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import SummaryTable from "../components/Summary"
import ScatterPlot from "./Scatter"

export default function Analyze() {
  const location = useLocation()
  const navigate = useNavigate()
  const data = location?.state || {}

  const [summary, setSummary] = useState(null)
  const [loadingSummary, setLoadingSummary] = useState(false)
  const [correlation, setCorrelation] = useState(null)
  const [loadingCorr, setLoadingCorr] = useState(false)
  const [allLoaded, setAllLoaded] = useState(false)

  useEffect(() => {
    const fetchSummary = async () => {
      setLoadingSummary(true)
      try {
        const res = await fetch("http://127.0.0.1:5000/summary")
        const result = await res.json()
        setSummary(result.desc)
      } catch (err) {
        console.error(err)
      }
      setLoadingSummary(false)
    }
    fetchSummary()
  }, [])

  useEffect(() => {
    if (!summary) return
    const fetchCorrelation = async () => {
      setLoadingCorr(true)
      try {
        const res = await fetch("http://127.0.0.1:5000/correlation")
        const result = await res.json()
        setCorrelation(result)
      } catch (err) {
        console.error(err)
      }
      setLoadingCorr(false)
    }
    fetchCorrelation()
  }, [summary])

  useEffect(() => {
    if (!loadingSummary && !loadingCorr && summary && correlation) {
      const timer = setTimeout(() => setAllLoaded(true), 200) // small delay for smooth transition
      return () => clearTimeout(timer)
    }
  }, [loadingSummary, loadingCorr, summary, correlation])

  if (!data.filename) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white bg-[#020617]">
        <h2 className="text-2xl mb-4">No dataset received.</h2>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-green-500 rounded-full text-black font-bold">
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-[#020617] via-[#03140f] to-[#052e1b] p-10">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-5xl font-black mb-10 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text"
      >
        Data Analysis Report
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-10 shadow-xl"
      >
        <h2 className="text-xl mb-4 text-green-400 font-bold">Dataset Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
          <div>
            <p className="text-slate-400 text-sm uppercase">File Name</p>
            <p className="font-semibold">{data.filename}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm uppercase">Total Rows</p>
            <p className="font-semibold">{data.rows}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm uppercase">Total Columns</p>
            <p className="font-semibold">{data.columns?.length}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm uppercase">Target Column</p>
            <p className="font-semibold text-green-400">
              {data.target || "Not specified"}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl mb-10"
      >
        <h2 className="text-xl mb-6 text-green-400 font-bold">
          Columns in Dataset
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.columns?.map((col, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className={`bg-black/40 p-4 rounded-xl border transition cursor-pointer
              ${col === data.target
                ? "border-green-500 bg-green-900/30"
                : "border-green-400/20 hover:border-green-400"}`}
            >
              {col}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {loadingSummary && (
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-green-400 animate-pulse">
            Generating statistical summary...
          </p>
        </div>
      )}

      {!loadingSummary && summary && (
        <SummaryTable desc={summary} />
      )}

      <AnimatePresence>
        {!allLoaded && summary && correlation && (
          <motion.div
            key="loadingScatter"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center mt-10"
          >
            <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-blue-400 animate-pulse">
              Preparing correlation graphs...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {allLoaded && correlation && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8 }}
  >
    <ScatterPlot
      target={data.target}
      topColumns={correlation.top_correlated_columns}
      graphData={correlation.graph_images} 
    />
  </motion.div>
)}
    </div>
  )
}
