import { useState } from "react";
import { Input } from "../ui/input";



export default function SearchCert() {
    const [certId, setCertId] = useState<string>("");
    return (
        <div className="min-w-40 bg-red-50">
            <Input className="min-w-40"
                placeholder="put your certificate Id Here and press enter"
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
            />
        </div>
    )
}