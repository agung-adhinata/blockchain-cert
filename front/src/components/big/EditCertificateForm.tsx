import { Certificate, ethersContext } from "@/context/EthersContext";
import { useToast } from "@/hooks/use-toast";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getPinataImage, ipfs } from "@/lib/ipfs";

type FormData = {
  title: string;
  description: string;
  file?: FileList;
};

type EditCertificateFormProps = {
  certificate: Certificate;
};

export function EditCertificateForm(props: EditCertificateFormProps) {
  const etherContext = useContext(ethersContext);
  const { toast } = useToast();

  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      title: props.certificate.title,
      description: props.certificate.description,
    },
  });
  const [image, setImage] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const onSubmit = handleSubmit(
    async (val) => {
      console.log(val);
      setLoading(true);
      try {
        const { title, description, file } = val;
        const filename = file?.[0];
        const newID = "ECERT" + (Math.random() * 1000).toString();

        if (!etherContext) return;
        if (filename) {
          const renamedFile = new File([filename as Blob], `${newID}`, {
            type: filename?.type,
          });
          const ipfsHash = await ipfs.upload.file(renamedFile);

          await etherContext?.contract?.editCertificate(
            props.certificate.rootId,
            newID,
            ipfsHash.IpfsHash,
            title,
            description,
          );
          console.log("Certificate edited");
          return;
        }

        await etherContext?.contract?.editCertificate(
          props.certificate.rootId,
          newID,
          props.certificate.ipfsHash,
          title,
          description,
        );
        console.log("Certificate edited");
      } catch (e) {
        console.error(`Failed to edit certificate:\n${e}`);
        toast({
          title: "Failed to edit certificate",
          description: e?.toString(),
          variant: "destructive",
          duration: 10000,
        });
      }
      setLoading(false);
    },
    (val) => {
      console.log(val);
      toast({
        title: "Failed to edit",
        description: "Error editing certificate, check console log",
        variant: "destructive",
      });
    },
  );
  useEffect(() => {
    getPinataImage(props.certificate.ipfsHash).then(setImage);
  }, [props.certificate.ipfsHash]);

  return (
    <div className="flex w-full max-w-md flex-col gap-8 rounded p-4">
      <section className="w-full overflow-hidden p-4">
        <img
          src={image}
          alt={props.certificate.title}
          className="h-64 w-full rounded object-cover"
        />
      </section>
      <div>
        <h1 className="text-xl font-bold">Edit Certificate Form</h1>
        <p className="text-xs text-muted-foreground">
          signer: {props.certificate.signedBy}
        </p>
      </div>
      <form onSubmit={onSubmit} className="flex w-full flex-col gap-3">
        <div className="flex flex-col gap-1">
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...register("title")} />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="description">Description</Label>
          <Textarea required id="description" {...register("description")} />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="file">File</Label>
          <Input
            id="file"
            type="file"
            {...register("file")}
            accept=".jpg,.png,.jpeg,.webp"
          />
          <p className="text-muted-foreground">Optional, use it only if you want to change the certificate file</p>
        </div>
        <Button disabled={loading} type="submit">
          Edit
        </Button>
      </form>
    </div>
  );
}
