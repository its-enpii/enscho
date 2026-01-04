"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(async () => {
  const { default: RQ } = await import("react-quill-new");
  const { default: BlotFormatter } = await import("quill-blot-formatter");
  
  // Extend Image Blot to preserve style and custom attributes (Cast to any to bypass strict typing)
  const BaseImage = RQ.Quill.import("formats/image") as any;
  const ImageFormatAttributesList = [
    'alt',
    'height',
    'width',
    'style'
  ];
 
  class Image extends BaseImage {
    static formats(domNode: any) {
      return ImageFormatAttributesList.reduce(function(formats: any, attribute) {
        if (domNode.hasAttribute(attribute)) {
          formats[attribute] = domNode.getAttribute(attribute);
        }
        return formats;
      }, {});
    }
    format(name: any, value: any) {
      if (ImageFormatAttributesList.indexOf(name) > -1) {
        if (value) {
          this.domNode.setAttribute(name, value);
        } else {
          this.domNode.removeAttribute(name);
        }
      } else {
        super.format(name, value);
      }
    }
  }

  // Register the custom Image blot
  RQ.Quill.register(Image as any, true);
  RQ.Quill.register("modules/blotFormatter", BlotFormatter);
  
  return RQ;
}, { 
  ssr: false,
  loading: () => <div className="h-64 bg-slate-50 animate-pulse rounded-lg" />
});

interface EditorProps {
  name: string;
  defaultValue?: string;
  label?: string;
  disableMedia?: boolean;
}

export default function Editor({ name, defaultValue = "", label, disableMedia = false }: EditorProps) {
  const [value, setValue] = useState(defaultValue);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ align: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      disableMedia ? ["link"] : ["link", "image", "video"], // Conditionally remove image/video
      ["clean"],
    ],
    blotFormatter: {} // Enable BlotFormatter
  };

  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>}
      <div className="bg-white relative rounded-lg border border-slate-200">
        <style jsx global>{`
          .ql-container { 
            min-height: 300px;
            font-size: 1rem;
          }
          .ql-editor {
            min-height: 300px;
          }
          .ql-toolbar {
            border-top-left-radius: 0.5rem;
            border-top-right-radius: 0.5rem;
          }
          .ql-container.ql-snow {
            border-bottom-left-radius: 0.5rem;
            border-bottom-right-radius: 0.5rem;
          }
        `}</style>
        <ReactQuill
          theme="snow"
          value={value}
          onChange={setValue}
          modules={modules}
          className="mb-2"
        />
        {/* Hidden input to pass value to Server Action */}
        <input type="hidden" name={name} value={value} />
      </div>
    </div>
  );
}
