import { ethersContext } from "@/context/EthersContext";
import { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, Outlet } from "react-router";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

export function RootLayout() {
  const etherContext = useContext(ethersContext);
  const [signer, setSigner] = useState<string | undefined>();
  useEffect(() => {
    if (etherContext?.provider) {
      etherContext.provider.getSigner().then((signer) => {
        setSigner(signer.address);
      });
    }
  }, [etherContext?.provider]);
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <header className="flex min-h-16 w-full items-center justify-between border-b-[1px] px-6 py-2">
        <div className="flex gap-2">
          <Link to={"/certificates"}>
            <p className="underline">E Certificates</p>
          </Link>
          <Link to={"/"}>
            <p className="underline">Home & Search</p>
          </Link>
        </div>
        {etherContext?.provider ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>👍 Connected to blockchain</div>
              </TooltipTrigger>
              <TooltipContent>
                <div>
                  <p>Address: {signer}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Button onClick={() => etherContext?.connectMetamask()}>
            Connect
          </Button>
        )}
      </header>
      <Outlet />
    </div>
  );
}
