import React from "react"
import Music from "./Components/Music"

function App() {

  return (
    <>
      <div className="Container flex flex-col  items-center mockup-phone mockup-phone-display">
        <div className=" phone mockup-phone-camera "></div>
        <img className="h-30 w-30 mt-6" src="/headphone.png"/>
        <div className="mt-2">
          <Music/>
        </div>
      </div>
    </>
  )
  
}
export default App
