import { Certificate, ethersContext } from "@/context/EthersContext";
import { useToast } from "@/hooks/use-toast";
import { useCallback, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ipfs } from "@/lib/ipfs";

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

  const fetchImage = useCallback(async () => {
    try {
      const imageUrl = await ipfs.gateways.convert(props.certificate.ipfsHash);
      setImage(imageUrl);
    } catch (e) {
      console.error(`Failed to fetch image:\n${e}`);
      toast({
        title: "Failed to fetch image",
        description: e?.toString(),
        variant: "destructive",
        duration: 10000,
      });
    }
  }, [props.certificate.ipfsHash, toast]);

  const onSubmit = handleSubmit(
    async (val) => {
      console.log(val);
      try {
        const { title, description, file } = val;
        const filename = file?.[0].name;
        if (!etherContext) return;
        await etherContext?.contract?.editCertificate(
          props.certificate.rootId,
          "0x123" + (Math.random() * 1000).toString(),
          filename ?? props.certificate.ipfsHash,
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
    fetchImage();
  }, [fetchImage]);

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
      <form onSubmit={onSubmit} className="flex flex-col gap-3 w-full">
        <div className="flex flex-col gap-1">
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...register("title")} />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" {...register("description")} />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="file">File</Label>
          <Input
            id="file"
            type="file"
            {...register("file")}
            accept=".jpg,.png,.jpeg,.webp"
          />
        </div>
        <Button type="submit">Edit</Button>
      </form>
    </div>
  );
}
