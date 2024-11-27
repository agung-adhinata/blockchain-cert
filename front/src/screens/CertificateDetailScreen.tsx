import { CertificateDetailCard } from "@/components/big/CertificateDetailCard";
import { HorizontalDivider } from "@/components/ui/divider";
import { Certificate, ethersContext } from "@/context/EthersContext";
import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router";

export default function CertificateDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const etherContext = useContext(ethersContext);
  const [certificates, setCertificates] = useState<Certificate[] | undefined>();

  const fetchCertificateHistories = useCallback(async () => {
    if (!etherContext) return;
    if (!id) return;
    try {
      console.log("fetching certificate");
      const certificate = await etherContext?.contract?.getCertificate(id!);
      if (!certificate) return;
      console.log(`root id: ${certificate.rootId}`);
      const result = await etherContext?.contract?.getCertificateHistory(
        certificate?.rootId
      );
      if (!result) return;
      console.log("fetched certificate histories");
      console.log(result);
      console.log(result.length)
      // setCertificates(result);
    } catch (e) {
      console.error(`Failed to fetch certificate histories:\n${e}`);
    }
  }, [etherContext, id]);

  useEffect(() => {
    if (!id) return;
    if (!etherContext) return;
    try {
      fetchCertificateHistories();
    } catch(e) {
      console.error(`Failed to fetch certificate histories:\n${e}`);
    }
  }, [etherContext, fetchCertificateHistories, id]);

  return (
    <div className="flex items-center justify-between h-full w-full gap-4">
      <div></div>
      {id ? <CertificateDetailCard certificateId={id} /> : <></>}
      <div className=" h-full flex flex-col p-4">
        <p className="font-bold ">Histories</p>
        <HorizontalDivider />
      </div>
    </div>
  );
}
