
import { EthersProvider } from "@/layout/EthersContext";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full h-screen">
      <EthersProvider>{children}</EthersProvider>
    </div>
  );
}
