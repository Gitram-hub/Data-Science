export default function SummaryTable({ desc }) {
  if (!desc || Object.keys(desc).length === 0) return null

  const firstColumn = Object.keys(desc)[0]
  const stats = Object.keys(desc[firstColumn] || {})

  return (
    <div className="p-6">

      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-400 via-emerald-300 to-green-400 text-transparent bg-clip-text">
        Dataset Summary
      </h2>

      <div
        className="overflow-x-auto rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl animate-fadeIn thin-scrollbar"
      >
        <table className="min-w-full text-sm">

          <thead>
            <tr className="border-b border-white/10">
              <th className="p-4 text-left text-green-300">
                Metric
              </th>

              {Object.keys(desc).map(col => (
                <th
                  key={col}
                  className="p-4 text-left text-green-200 font-semibold hover:text-green-400 transition"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {stats.map(stat => (
              <tr
                key={stat}
                className="border-b border-white/5 hover:bg-green-500/10 transition duration-300"
              >
                <td className="p-4 font-semibold text-green-300">
                  {stat}
                </td>

                {Object.keys(desc).map(col => (
                  <td
                    key={col}
                    className="p-4 text-gray-200 hover:text-green-300 transition"
                  >
                    {typeof desc[col][stat] === "number"
                      ? desc[col][stat].toFixed(2)
                      : desc[col][stat]}
                  </td>
                ))}

              </tr>
            ))}
          </tbody>

        </table>
      </div>

      <style jsx>{`
        .thin-scrollbar::-webkit-scrollbar {
          height: 4px; /* ultra-thin horizontal scrollbar */
        }
        .thin-scrollbar::-webkit-scrollbar-thumb {
          background-color: #1f3e13; /* dark green thumb */
          border-radius: 9999px;
        }
        .thin-scrollbar::-webkit-scrollbar-track {
          background-color: #0d1a07; /* dark green track */
        }
      `}</style>

    </div>
  )
}
