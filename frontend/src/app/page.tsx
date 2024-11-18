"use client"

import { useEffect, useState } from "react";


export default function Page() {
  const [startup, setStartup] = useState(true)
  async function setupWeb3() {  
    if(typeof window === "undefined") return;
    if(window.ethereum) {
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      const id = await window.ethereum.request({method: "eth_chainId"})
      console.log("Ethereum enabled");
      console.log(`Ethereum chainId: ${id}`);
    }
  }

  useEffect(()=> {
    if(startup) {
      setStartup(false)
      setupWeb3()
    }
  },[startup])

  return (
    <div>
      <h1>Page</h1>
    </div>
  );
}