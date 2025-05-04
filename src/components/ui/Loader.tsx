import { Loader2 } from "lucide-react";

function Loader() {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Loader2 className="animate-spin w-6 h-6" />
    </div>
  );
}

export default Loader;
