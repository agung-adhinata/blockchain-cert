import { Certificate, ethersContext } from "@/context/EthersContext";
import { useContext } from "react";
import { useForm } from "react-hook-form";

type FormData = {
  title: string;
  description: string;
  file: FileList;
};

type EditCertificateFormProps = {
  certificate: Certificate;
};

export function EditCertificateForm(props: EditCertificateFormProps) {
  const etherContext = useContext(ethersContext);
  const { register, handleSubmit,watch } = useForm<FormData>({
    defaultValues: {
      title: props.certificate.title,
      description: props.certificate.description,
    },
  });
  const formValues = watch();

  const onSubmit = handleSubmit(
    async (val) => {
      console.log(val);
      const { title, description, file } = val;
      const filename = file[0].name;

      etherContext?.contract.editCertificate(
        props.certificate.rootId,
        "newid",
        filename,
        title,
        description
      );
      // Call editCertificate function from ethersContext
      console.log("Certificate edited");
    },
    (val) => {
      console.log(val);
    }
  );

  return (
    <div className="rounded p-4 flex flex-col">
      <h1 className="text-xl font-bold">Edit Certificate Form</h1>
      <form onSubmit={onSubmit}>
        <div className="flex flex-col">
          <label htmlFor="title">Title</label>
          <input id="title" {...register("title")} />
        </div>
        <div className="flex flex-col">
          <label htmlFor="description">Description</label>
          <input id="description" {...register("description")} />
        </div>
        <div className="flex flex-col">
          <label htmlFor="file">File</label>
          <input
            id="file"
            type="file"
            {...register("file")}
            accept=".jpg,.png,.jpeg,.webp"
          />
        </div>
        <div className="flex flex-col">
            <label>File information</label>
            <p>{formValues.file[0].size}</p>
        </div>
        <button type="submit">Edit</button>
      </form>
    </div>
  );
}
