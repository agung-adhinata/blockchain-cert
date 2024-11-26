import { ethersContext } from "@/context/EthersContext";
import { useContext } from "react";
import { Button } from "@/components/ui/button";
import { Outlet } from "react-router";

export function RootLayout() {
  const etherContext = useContext(ethersContext);
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <header className="flex w-full justify-between bg-red-200">
        <p>E Certificates</p>
        {etherContext?.provider ? (
          <div>Connected to blockchain</div>
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
