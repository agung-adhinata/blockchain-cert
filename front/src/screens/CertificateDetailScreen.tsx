import { CertificateDetailCard } from "@/components/big/CertificateDetailCard";
import { useParams } from "react-router";

export default function CertificateDetailScreen() {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="flex flex-col items-center justify-center h-full">
      {id ? <CertificateDetailCard certificateId={id} /> : <></>}
    </div>
  );
}
