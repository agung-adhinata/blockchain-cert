import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ethersContext } from "@/context/EthersContext";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "../ui/checkbox";

type FormData = {
  title: string;
  description: string;
  file?: FileList;
};

export default function CreateCertificateForm() {
  const etherContext = useContext(ethersContext);
  const [submitEnable, setSubmitEnable] = useState(false);
  const { register, handleSubmit } = useForm<FormData>();

  const onSubmit = handleSubmit(
    async (val) => {
      console.log(val);
      const { title, description, file } = val;
      const filename = file?.[0].name;
      
      const resp = await etherContext?.contract?.signCertificate(
        "0x123" + (Math.random() * 1000).toString(),
        filename ?? "randomname",
        title,
        description
      );
      await resp?.wait()

      console.log("Certificate created");
    },
    (val) => {
      console.log(val);
    }
  );

  return (
    <div className="rounded p-4 flex flex-col gap-4 max-w-md">
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
          <p className="text-sm text-wrap text-muted-foreground">
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
        <div className="h-[1px] bg-border my-2" />
        <div className="flex items-center space-x-2">
          <Checkbox
            id="submitEnable"
            onCheckedChange={(checked) => setSubmitEnable(checked as boolean)}
            checked={submitEnable}
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
        <Button type="submit" disabled={!submitEnable}>
          Create
        </Button>
      </form>
    </div>
  );
}
