"use client";
import { useSession } from "next-auth/react";
import Qbpage from "./Seller/QuoteBrowser/page";
import BuyerJoblist from "./Buyer/BuyerJoblist/page";

export default function Home() {
  const { status, data: session } = useSession();

  function MyJobsRedux() {
    return <></>;
  }
  function Advert_for_MobileApp() {
    return <></>;
  }

  return (
    <main>
      {" "}
      {session?.user.isRepairman === true && <Qbpage />}{" "}
      {session?.user.isClient === true && <BuyerJoblist />}{" "}
    </main>
  );
}
