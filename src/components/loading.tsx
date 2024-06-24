import { LoaderCircle } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <LoaderCircle className="animate-spin w-8 h-8" />
    </div>
  );
};

export default Loading;
