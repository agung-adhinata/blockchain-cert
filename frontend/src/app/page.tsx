"use client";

import { APP_TITLE } from "@/lib/constants";
import { useEffect, useState } from "react";

export default function Page() {
  const [startup, setStartup] = useState(true);
  const [chainId, setChainId] = useState("");
  const [accountId, setAccountId] = useState("");
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
    await window.ethereum.request({ method: "eth_requestAccounts" });
    console.log("Request chain ID");
    const id = await window.ethereum.request({ method: "eth_chainId" });
    console.log("Ethereum enabled");
    console.log(`Ethereum chainId: ${id}`);
    const accountId = await window.ethereum.request({ method: "eth_accounts" });
    if (Array.isArray(accountId)) setAccountId(accountId[0].toString());
    if (typeof id === "string") {
      setChainId(id);
    }
  }

  useEffect(() => {
    if (startup) {
      setStartup(false);
    }
  }, [startup]);

  return (
    <div>
      <header className="flex gap-2">
        {chainId.length > 0 ? (
          <>
            <p>{chainId}</p>
            <p>acc ID: {accountId}</p>
          </>
        ) : (
          <button
            onClick={() => {
              setupWeb3();
            }}
          >
            <p>Connect to metamask</p>
          </button>
        )}
      </header>
      <h1>{APP_TITLE}</h1>
    </div>
  );
}
