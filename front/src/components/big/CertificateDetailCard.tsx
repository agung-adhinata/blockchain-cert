import { Certificate, ethersContext } from "@/context/EthersContext";
import { useCallback, useContext, useEffect, useState } from "react";
import { HorizontalDivider } from "@/components/ui/divider";
import { Button } from "../ui/button";
import { Link } from "react-router";
import { dateFromTimestamp } from "@/lib/utils";
import { getPinataImage } from "@/lib/ipfs";
import { useToast } from "@/hooks/use-toast";

export function CertificateDetailCard({
  certificateId,
}: {
  certificateId: string;
}) {
  const { toast } = useToast();
  const etherContext = useContext(ethersContext);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState<string | undefined>();
  const [certificate, setCertificate] = useState<Certificate | undefined>();

  // const fetchImage = useCallback(async () => {
  //   if (!certificate) return;
  //   try {
  //     const imageUrl = await getPinataImage(certificate.ipfsHash);
  //     console.log(imageUrl);
  //     setImage(imageUrl);
  //   } catch (e) {
  //     console.error(`Failed to fetch image:\n${e}`);
  //     toast({
  //       title: "Failed to fetch image",
  //       description: e?.toString(),
  //       variant: "destructive",
  //       duration: 10000,
  //     });
  //   }
  // }, [certificate, toast]);

  const fetchCertificate = useCallback(async () => {
    if (!etherContext) return;
    try {
      setLoading(true);
      const result =
        await etherContext?.contract?.getCertificate(certificateId);
      if (!result) return;
      setCertificate(result);
      getPinataImage(result.ipfsHash).then(setImage);
    } catch (e) {
      console.error(`Failed to fetch certificate:\n${e}`);

      toast({
        title: "Failed to fetch certificate",
        description: e?.toString(),
        variant: "destructive",
        duration: 10000,
      });
    }
    setLoading(false);
  }, [certificateId, etherContext, toast]);

  useEffect(() => {
    if (etherContext) {
      fetchCertificate();

    }
  }, [etherContext, fetchCertificate]);

  return (
    <div className="flex max-w-xl flex-col gap-4 rounded bg-muted p-4">
      {loading ? (
        <h1 className="flex flex-col items-center">
          <span className="font-bold">🐇 Loading... </span>
          <span className="text-center text-muted-foreground">
            make sure you have good network and connected to metamask 🛜
          </span>
        </h1>
      ) : certificate ? (
        <div className="flex flex-col gap-2">
          <section className="w-full overflow-hidden rounded min-h-[200px] bg-black/10">
            <img
              src={image}
              alt={certificate.title}
              className="h-96 w-full object-cover"
            />
          </section>
          <section className="grid max-w-full shrink grid-flow-row-dense grid-cols-4 text-xs">
            <p className="col-span-1 shrink font-mono">SIGNER: </p>
            <p className="col-span-3 font-mono text-muted-foreground">
              {certificate.signedBy}
            </p>
            <p className="col-span-1 shrink font-mono">ID: </p>
            <p className="col-span-3 font-mono text-muted-foreground">
              {certificate.id}
            </p>
            <p className="col-span-1 shrink font-mono">DATE TIME: </p>
            <p className="col-span-3 font-mono text-muted-foreground">
              {dateFromTimestamp(certificate.timestamp).toLocaleString()}
            </p>
          </section>
          <h1 className="text-xl font-bold">{certificate.title}</h1>
          <div>
            <p className="font-semibold font-mono">DESCRIPTION: </p>
            <p className="text-muted-foreground">{certificate.description}</p>
          </div>
          {/* <p>{certificate.ipfsHash}</p> */}
          <HorizontalDivider />
          <div className="flex gap-2">
            <Button asChild>
              <Link to={"/certificates/edit/" + certificate.id}>
                Edit Certificate
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <h1>Certificate not found</h1>
      )}
    </div>
  );
}
