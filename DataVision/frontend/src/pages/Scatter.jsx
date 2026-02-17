import { motion } from "framer-motion"

export default function ScatterPlot({ target, topColumns, graphData }) {
  if (!topColumns || topColumns.length === 0) return null

  return (
    <div className="mt-10 w-full px-4">
      <motion.h2
        className="text-3xl font-bold text-green-400 mb-10 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Correlation of Top Columns with {target}
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topColumns.map((col, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: idx * 0.2 }}
            className="w-full mb-10 bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-lg flex flex-col items-center"
          >
            <h3 className="text-green-400 font-bold mb-4 text-center text-lg">
              {col} vs {target}
            </h3>
            <img
              src={graphData[col]}
              alt={`${col} vs ${target}`}
              className="w-full max-h-[250px] rounded-xl shadow-md object-contain"
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
