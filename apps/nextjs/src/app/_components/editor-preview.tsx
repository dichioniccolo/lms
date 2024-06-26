"use client";

import dynamic from "next/dynamic";

import "react-quill/dist/quill.bubble.css";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <>Loading...</>,
});

interface Props {
  value: string;
}

export function Preview({ value }: Props) {
  return <ReactQuill theme="bubble" value={value} readOnly />;
}
