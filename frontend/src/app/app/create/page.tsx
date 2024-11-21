"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@mantine/form";
export default function CreatePage() {
  const form = useForm({
    mode: "controlled",
    initialValues: {
      title: "",
      description: "",
      file: undefined as File | undefined,
    },
  });
  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-slate-300">
      <section className="p-4 flex flex-col gap-3 rounded min-w-96 bg-slate-200 shadow">
        <h1 className="text-3xl font-bold">New Certificate</h1>
        <form
          onSubmit={form.onSubmit((values) => {
            console.log(values);
          })}
          className="flex flex-col gap-2"
        >
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              key={form.key("title")}
              id="title"
              {...form.getInputProps("title")}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              key={form.key("description")}
              id="description"
              {...form.getInputProps("description")}
            />
          </div>
          <div>
            <Label htmlFor="file-upload">File</Label>
            <Input
              key={form.key("file")}
              id="file-upload"
              type="file"
              value={form.values.file?.name || ""}
              onChange={(e) => {
                console.log(e.target.files?.[0]);
                form.setFieldValue("file", e.target.files?.[0] || undefined);
              }}
            />
          </div>

          <Button type="submit">Sign Certificate</Button>
        </form>
      </section>
    </div>
  );
}
