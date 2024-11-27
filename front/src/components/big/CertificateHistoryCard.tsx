import { Certificate, ethersContext } from "@/context/EthersContext";
import { dateFromTimestamp } from "@/lib/utils";
import { useCallback, useContext, useEffect, useState } from "react";

export function CertificateHistoryCard({
  rootId,
  currentId: currentID,
}: {
  rootId: string;
  currentId: string;
}) {
  const etherContext = useContext(ethersContext);
  const [certificates, setCertificates] = useState<Certificate[] | undefined>();

  const [loading, setLoading] = useState<boolean>(false);

  const fetchHistories = useCallback(async () => {
    if (!etherContext) return;
    setLoading(true);
    try {
      const certs = await etherContext.contract?.getCertificateHistory(rootId);
      if (!certs) return;
      setCertificates(certs);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, [etherContext, rootId]);

  useEffect(() => {
    if (!etherContext) return;
    if (rootId) {
      fetchHistories();
    }
  }, [rootId, fetchHistories, etherContext]);

  return (
    <div className="flex flex-col gap-4 h-full border-l-[1px]">
      <p className="font-bold text-lg p-4">Histories</p>
      {loading ? <p>Loading...</p> : <></>}
      {certificates ? (
        certificates.map((cert, i) => {
          const highlight = cert.id === currentID ? "border-red-400" : "";
          return (
            <div
              key={i}
              className={
                "flex flex-col gap hover:bg-muted w-full py-4 px-8 hover:cursor-pointer border-l-4 " +
                highlight
              }
            >
              <p className="text-sm text-muted-foreground">ID: {cert.id}</p>
              <p className="text-sm text-muted-foreground">
                DATE: {dateFromTimestamp(cert.timestamp).toLocaleString()}
              </p>
              <p className="">{cert.title}</p>
            </div>
          );
        })
      ) : (
        <></>
      )}
    </div>
  );
}
