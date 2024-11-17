"use client"


export default function Page() {
  function setupWeb3() {  
    if(typeof window === "undefined") return;
    if(window.ethereum) {
      console.log("Ethereum enabled");
      console.log(`Ethereum chainId: ${window.ethereum.chainId}`);
    }
  }
  setupWeb3();
  return (
    <div>
      <h1>Page</h1>
    </div>
  );
}