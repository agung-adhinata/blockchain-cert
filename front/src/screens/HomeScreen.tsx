// simple home screen

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

export default function HomeScreen() {
  const [certId, setCertId] = useState<string>("");

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <h1 className="">Home Screen</h1>
      <div className="flex gap-3">
        <Input
          className="max-w-96"
          placeholder="put your certificate Id Here and press enter"
          value={certId}
          onChange={(e) => setCertId(e.target.value)}
        />
        <Button asChild size={"icon"} variant={"default"} className="min-w-9 min-h-9">
          <Link to={`/certificates/${certId}`}>
            <Search />
          </Link>
        </Button>
        <Button asChild variant={"outline"}>
          <Link to="/certificates">Certificates</Link>
        </Button>
      </div>
    </div>
  );
}
