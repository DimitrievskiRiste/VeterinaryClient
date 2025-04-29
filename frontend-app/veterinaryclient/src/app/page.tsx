
import Image from "next/image";
import HomePage from "@/Components/HomePage";
import {Suspense} from "react";
import PageLoading from "@/Components/PageLoading";
export default async function Home({props}) {
  return (
    <>
      <Suspense fallback={<PageLoading/>}>
          <HomePage/>
      </Suspense>
    </>
  );
}
