import React from "react"
import { Database, BarChart3, Brain, Upload } from "lucide-react"

export default function About(){
  return (
    <div className="min-h-screen w-full text-white bg-gradient-to-br from-[#020617] via-[#03140f] to-[#052e1b]">
      <div className="max-w-[1300px] mx-auto px-6 py-16">

        <div className="text-center mb-16">
          <h1 className="text-5xl font-black bg-gradient-to-r from-green-400 to-emerald-300 text-transparent bg-clip-text">
            About Data Vision
          </h1>
          <p className="mt-4 text-slate-300 max-w-xl mx-auto">
            AI-powered platform that converts raw datasets into insights,
            analytics dashboards and machine learning predictions.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 mb-20">
          {[
            {icon:Upload,title:"Upload Data",desc:"Upload CSV, XLSX or JSON datasets easily"},
            {icon:Database,title:"Feature Engineering",desc:"Automatic cleaning and preprocessing"},
            {icon:BarChart3,title:"EDA Analysis",desc:"Visual insights and statistics instantly"},
            {icon:Brain,title:"ML Models",desc:"Predictions, forecasting and anomaly detection"}
          ].map((item,i)=>(
            <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:scale-105 transition">
              <item.icon className="text-green-400 mb-4" size={36}/>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71" className="w-full h-64 object-cover rounded-3xl border border-white/10 hover:scale-105 transition"/>
          <img src="https://images.unsplash.com/photo-1555949963-aa79dcee981c" className="w-full h-64 object-cover rounded-3xl border border-white/10 hover:scale-105 transition"/>
          <img src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485" className="w-full h-64 object-cover rounded-3xl border border-white/10 hover:scale-105 transition"/>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Why Data Vision?</h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Data Vision simplifies data science workflow. Upload your data,
            explore insights, perform feature engineering, visualize trends
            and generate machine learning predictions — all in one place.
          </p>
        </div>

      </div>
    </div>
  )
}
