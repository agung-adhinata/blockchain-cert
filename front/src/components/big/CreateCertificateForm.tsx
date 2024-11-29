import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ethersContext } from "@/context/EthersContext";
import { useContext, useEffect, useState } from "react";
import { set, useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { ipfs } from "@/lib/ipfs";

type FormData = {
  title: string;
  description: string;
  file?: FileList;
};

export default function CreateCertificateForm() {
  const etherContext = useContext(ethersContext);
  const [canSubmit, setCanSubmit] = useState(false);
  const { register, handleSubmit } = useForm<FormData>();
  const [loading, setLoading] = useState(false);

  const [disableCreate, setDisableCreate] = useState(false);

  useEffect(() => {
    setDisableCreate(!canSubmit || loading);
  }, [canSubmit, loading]);

  const onSubmit = handleSubmit(
    async (val) => {
      setLoading(true);
      console.log(val);
      const { title, description, file } = val;
      if (file?.length === 0) {
        console.log("No file selected");
        throw new Error("No file selected");
      }
      const currentFile = file?.[0];
      console.log("Uploading file", currentFile?.name);
      const upload = await ipfs.upload.file(currentFile as unknown as File);
      if (!upload) {
        console.error("Failed to upload file", upload);
        throw new Error("Failed to upload file");
      }

      console.log("File uploaded", upload.IpfsHash);

      const resp = await etherContext?.contract?.signCertificate(
        "0x123" + (Math.random() * 1000).toString(),
        upload.IpfsHash,
        title,
        description,
      );
      await resp?.wait();

      console.log("Certificate created");
      setLoading(false);
    },
    (val) => {
      console.log(val);
      setLoading(false);
    },
  );

  return (
    <div className="flex max-w-md flex-col gap-4 rounded p-4">
      <h1 className="text-xl font-bold">Create Certificate</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            required
            {...register("title", { required: "Title is required" })}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            required
            placeholder="Write description about your certificate"
            {...register("description", { required: "Title is required" })}
          />
          <p className="text-wrap text-sm text-muted-foreground">
            Make description as short as possible to reduce gas fee
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="file">File</Label>
          <Input
            id="file"
            type="file"
            accept=".jpg,.png,.jpeg,.webp"
            {...register("file", { required: false })}
          />
        </div>
        <div className="my-2 h-[1px] bg-border" />
        <div className="flex items-center space-x-2">
          <Checkbox
            id="submitEnable"
            onCheckedChange={(checked) => setCanSubmit(checked as boolean)}
            checked={canSubmit}
          />
          <div className="grid gap-1.5 leading-none">
            <Label htmlFor="submitEnable" className="text-sm">
              Ready to mint
            </Label>
            <p className="text-sm text-muted-foreground">
              I understand that this certificate will be permanently stored on
              the blockchain and cannot be removed
            </p>
          </div>
        </div>
        <p>URL : {import.meta.env.VITE_PINATA_GATEWAY}</p>
        <Button type="submit" disabled={disableCreate}>
          Create
        </Button>
      </form>
    </div>
  );
}
