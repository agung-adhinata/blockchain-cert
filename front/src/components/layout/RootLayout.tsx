import { ethersContext } from "@/context/EthersContext";
import { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, Outlet } from "react-router";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent 
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
    <div className="flex flex-col items-center justify-center h-screen">
      <header className="flex w-full min-h-16 items-center justify-between border-b-[1px] py-2 px-6">
        <Link to={"/certificates"}>
          <p>E Certificates</p>
        </Link>
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
