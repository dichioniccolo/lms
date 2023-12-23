import dynamic from "next/dynamic";

import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <div className="bg-white">Loading...</div>,
});

interface Props {
  value: string;
  onChange(value: string): void;
}

export function Editor({ value, onChange }: Props) {
  return (
    <div className="bg-white">
      <ReactQuill theme="snow" value={value} onChange={onChange} />
    </div>
  );
}
