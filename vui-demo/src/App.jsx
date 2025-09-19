import './index.css'
import Me from './comps/me';

function App() {

  return (
    <>
      <div className="flex flex-col items-center justify-center bg-[#FFFFF0] h-screen">
        <h1 className="text-2xl">What can I help you with?</h1>
        <Me></Me>
        <div className="mt-15 bg-[#305CDE] w-100 h-1"></div>
        <div className="mt-20 w-20 h-20 bg-[#305CDE] rounded-full flex items-center justify-center"></div>
        <h1 className="mt-8 text-xl">“Hey Assistant, how can I make my interviews more productive?”</h1>
      </div>

    </>
  )
}

export default App;
