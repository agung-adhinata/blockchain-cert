"use client";

import { AccountBarLogin } from "@/components/custom/account-header";
import { Button } from "@/components/ui/button";
import { APP_TITLE } from "@/lib/constants";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page() {
  const [startup, setStartup] = useState(true);
  const [chainId, setChainId] = useState("");
  const [accountId, setAccountId] = useState("");
  async function setupWeb3() {
    console.log("Setup Ethereum");
    if (typeof window === "undefined") {
      console.warn(`Window is missing, aborting...`);
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
    <div className="w-full h-screen flex flex-col">
      <header className="flex bg-gray-200 gap-2 p-4 w-full justify-end">
        {accountId.length > 0 ? (
          <div>{accountId}</div>
        ) : (
          <AccountBarLogin onClick={() => setupWeb3()} />
        )}
      </header>
      <section className="flex-grow flex flex-col gap-4 items-center justify-center">
        <h1 className="font-bold text-4xl font-mono uppercase">{APP_TITLE}</h1>
        <div className="flex gap-3">
          <Button asChild>
            <Link href={"/profile"}>Profile</Link>
          </Button>
          <Button variant={"outline"} asChild>
            <Link href={"/about"}>About</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
