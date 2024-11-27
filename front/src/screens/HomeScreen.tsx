// simple home screen

import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export default function HomeScreen() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <h1 className="">Home Screen</h1>
      <Button asChild>
        <Link to="/certificates">Certificates</Link>
      </Button>
    </div>
  );
}
