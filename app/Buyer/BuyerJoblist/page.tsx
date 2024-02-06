import React from "react";
import { useSession } from "next-auth/react";
import { trpc } from "@/app/_trpc/client";

const BuyerJoblist = () => {
  const { status, data: session } = useSession();
  return <div className='bg-blue-950'>BuyerJoblist</div>;
};

export default BuyerJoblist;
