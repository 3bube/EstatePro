import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function AgentContact({
  owner,
}: {
  owner: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: string;
    profileImage: string;
  };
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">Contact Agent</h2>
      <div className="flex items-center mb-4">
        <Avatar>
          <AvatarImage
            src={owner?.profileImage ?? "/placeholder.svg?height=100&width=100"}
            alt={owner?.firstName ?? "Agent name"}
          />
          <AvatarFallback>{owner?.firstName?.charAt(0) ?? "A"}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">
            {owner?.firstName} {owner?.lastName}
          </p>
          <p className="text-gray-600">Real Estate Agent</p>
        </div>
      </div>
      <div className="space-y-2">
        <p>
          <span className="font-semibold">Phone:</span>{" "}
          {owner?.phoneNumber ?? "No phone number"}
        </p>
        <p>
          <span className="font-semibold">Email:</span> {owner?.email}
        </p>
      </div>
    </div>
  );
}
