"use client";

import { Button } from "@/components/ui/button";
import { ethersContext } from "@/layout/EthersContext";
import Link from "next/link";
import { useContext, useEffect } from "react";

export default function AppPage() {
  const blockchainContext = useContext(ethersContext);
  useEffect(() => {
    if (!blockchainContext) return;
    if (typeof window.ethereum !== "undefined") {
      try {
        window.ethereum.enable().then(async () => {
          const signer = await blockchainContext.provider.getSigner();
          console.log(signer);
          const certificate = await blockchainContext.connect(signer).getCertificates(
            await signer.getAddress()
          );
          console.log(certificate)
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, [blockchainContext]);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-slate-300">
      <section className="p-4 flex flex-col gap-3 rounded min-w-96 bg-slate-200 shadow">
        <h1 className="text-3xl font-bold">E-Certificate</h1>
        <p>This is you list of newly created certificate</p>
        <Button asChild>
          <Link href={"/app/create"}>Create New Signed Certificate</Link>
        </Button>
      </section>
    </div>
  );
}
