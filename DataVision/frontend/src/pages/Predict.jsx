import { useState } from "react"
import { motion } from "framer-motion"

export default function Predict({rmse}){

const [file,setFile]=useState(null)
const [predictions,setPredictions]=useState(null)
const [loading,setLoading]=useState(false)
const [drag,setDrag]=useState(false)

const handlePredict=async()=>{
if(!file)return alert("Upload test dataset first")
const formData=new FormData()
formData.append("file",file)
setLoading(true)
try{
const res=await fetch("http://127.0.0.1:5000/predict",{method:"POST",body:formData})
const data=await res.json()
setPredictions(data.predictions)
}catch(err){
console.error(err)
alert("Prediction failed")
}
setLoading(false)
}

return(
<motion.div
initial={{opacity:0,y:20}}
animate={{opacity:1,y:0}}
className="max-w-xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl mt-10 text-white"
>

{rmse&&(
<p className="text-green-400 text-center mb-4 font-semibold">
RMSE Score: {rmse}
</p>
)}

<h2 className="text-lg text-green-400 mb-4 font-bold text-center">
Upload Test Dataset
</h2>

<div
onDragEnter={()=>setDrag(true)}
onDragLeave={()=>setDrag(false)}
onDragOver={e=>e.preventDefault()}
onDrop={e=>{
e.preventDefault()
setDrag(false)
setFile(e.dataTransfer.files[0])
}}
className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
drag?"border-green-400 bg-green-900/20":"border-green-500/40"
}`}
>
<input
type="file"
className="hidden"
id="fileUpload"
onChange={e=>setFile(e.target.files[0])}
/>
<label htmlFor="fileUpload" className="cursor-pointer">
{file?file.name:"Drag & Drop or Click to Upload"}
</label>
</div>

<button
onClick={handlePredict}
className="mt-5 cursor-pointer w-full py-2 bg-green-500 rounded-full text-black font-bold hover:bg-green-400 transition"
>
Predict
</button>

{loading&&(
<p className="mt-3 text-green-300 text-center animate-pulse">
Predicting...
</p>
)}

{predictions&&(
<div className="mt-6">
<h3 className="text-green-400 mb-2 font-semibold text-sm">
Prediction Results
</h3>

<div className="overflow-x-auto scrollbar-thin scrollbar-thumb-green-800 scrollbar-track-transparent">
<pre className="bg-black/40 p-3 rounded-lg text-xs whitespace-pre">
{JSON.stringify(predictions,null,2)}
</pre>
</div>

<style>{`
.scrollbar-thin::-webkit-scrollbar{height:6px}
.scrollbar-thin::-webkit-scrollbar-track{background:transparent}
.scrollbar-thin::-webkit-scrollbar-thumb{background:#14532d;border-radius:10px}
`}</style>

</div>
)}

</motion.div>
)
}
