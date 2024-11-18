"use client";

import { APP_TITLE } from "@/lib/constants";
import { useEffect, useState } from "react";

export default function Page() {
  const [startup, setStartup] = useState(true);

  async function setupWeb3() {
    console.log("Setup Ethereum");
    if (typeof window === "undefined") {
      console.warn(`WIndow is missing, aborting...`);
      return;
    }
    if (!window.ethereum) {
      console.warn(`Ether module is missing, aborting...`);
      return;
    }
    console.log("Request chain ID");
    const id = await window.ethereum.request({ method: "eth_chainId" });
    console.log("Ethereum enabled");
    console.log(`Ethereum chainId: ${id}`);
  }

  useEffect(() => {
    if (startup) {
      setupWeb3();
      setStartup(false);
    }
  }, [startup]);

  return (
    <div>
      <h1>{APP_TITLE}</h1>
    </div>
  );
}
