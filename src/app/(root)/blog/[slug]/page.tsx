import MaxWidthWrapper from "@/common/MaxWidthWrapper";
import Image from "next/image";
import React from "react";

type Props = {};

export default function BlogDetailsPage({}: Props) {
  return (
    <MaxWidthWrapper className="max-w-screen-lg">
      <img src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="w-full h-[50vh] border-none rounded bg-gray-800"></img>
      <div className="flex flex-col gap-4 mt-6">
        <h1 className="text-4xl font-bold">Blog Title</h1>
        <p className="text-gray-500">Blog Description</p>
      </div>
    </MaxWidthWrapper>
  );
}
