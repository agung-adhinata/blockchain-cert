import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ethersContext } from "@/context/EthersContext";
import { useContext } from "react";
import { useForm } from "react-hook-form";

type FormData = {
  title: string;
  description: string;
  file: FileList;
};

export default function CreateCertificateScreen() {
  const etherContext = useContext(ethersContext);
  const { register, handleSubmit } = useForm<FormData>();

  const onSubmit = handleSubmit(
    async (val) => {
      console.log(val);
      const { title, description, file } = val;
      const filename = file[0].name;

      etherContext?.contract.signCertificate(
        "0x123" + Math.random().toString(),
        filename,
        title,
        description
      );
      console.log("Certificate created");
    },
    (val) => {
      console.log(val);
    }
  );

  return (
    <div>
      <h1>Create Certificate Screen</h1>

      <form
        onSubmit={onSubmit}
      >
        <div className="flex flex-col">
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...register("title")} />
        </div>
        <div className="flex flex-col">
          <Label htmlFor="description">Description</Label>
          <Input id="description" {...register("description")} />
        </div>
        <div className="flex flex-col">
          <Label htmlFor="file">File</Label>
          <Input
            id="file"
            type="file"
            accept=".jpg,.png,.jpeg,.webp"
            {...register("file")}
          />
        </div>
        <Button type="submit">Create</Button>
      </form>
    </div>
  );
}
