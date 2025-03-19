import Link from "next/link"
import { FunctionComponent } from "react"

const VisualizationPage: FunctionComponent = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="border border-slate-800 rounded-2xl p-8 text-center">
        <h1 className="text-4xl font-bold border-b border-slate-800 pb-2">Visualization</h1>
        <p className="pt-4">
          This page is under construction <br/>

          <Link href="/">
            <span className="text-blue-500 cursor-pointer hover:underline">Go back to table</span>
          </Link>
        </p>
      </div>
    </div>
  )
}

export default VisualizationPage
