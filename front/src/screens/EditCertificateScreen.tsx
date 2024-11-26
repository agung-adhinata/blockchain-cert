import { EditCertificateForm } from "@/components/big/EditCertificateForm";
import { Certificate, ethersContext } from "@/context/EthersContext";
import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router";

export default function EditCertificateScreen() {
  const { id } = useParams<{ id: string }>();
  const etherContext = useContext(ethersContext);
  const [certificate, setCertificate] = useState<Certificate | undefined>();
  const [loading, setLoading] = useState(true);

  const fetchCertificate = useCallback(async () => {
    console.log("fetching certificate");
    setLoading(true);
    console.log("etherContext", etherContext);
    if (!etherContext) return;
    console.log("id", id);
    if (!id) return;
    try {
      const result = await etherContext.contract?.getCertificate(id);
      if (!result) return;
      setCertificate(result);
    } catch (e) {
      console.error(`Failed to fetch certificate:\n${e}`);
    }
    setLoading(false);
  }, [id, etherContext]);

  useEffect(() => {
    if (etherContext) {
      fetchCertificate();
    }
  }, [id, etherContext, fetchCertificate]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      {loading ? <span>Loading...</span> : <></>}
      {certificate ? (
        <EditCertificateForm certificate={certificate} />
      ) : (
        <>
          <span>Certificate not found</span>
        </>
      )}
    </div>
  );
}
