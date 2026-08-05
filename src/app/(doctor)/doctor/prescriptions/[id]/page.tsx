import { Images } from "@/assets";
import Image from "next/image";

export default async function PrescriptionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="bg-white p-5 box-border">
      <div className="flex items-center justify-between border-b-1 pb-3 mb-3">
        <Image src={Images.Logo} alt="" />
        <span className=" border py-1 px-2">{id}</span>
      </div>
      <div>
        
      </div>
    </div>
  );
}
