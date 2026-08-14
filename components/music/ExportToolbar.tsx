"use client";

import { RefObject } from "react";
import { JianpuRendererRef } from "./JianpuRenderer";
import { StaffRendererRef } from "./StaffRenderer";

interface ExportToolbarProps {
  jianpuRef?: RefObject<JianpuRendererRef | null>;
  staffRef?: RefObject<StaffRendererRef | null>;
}

export default function ExportToolbar({ jianpuRef, staffRef }: ExportToolbarProps) {
  const download = (dataUrl: string | null, filename: string) => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleExportJianpu = async () => {
    const dataUrl = await jianpuRef?.current?.exportPng();
    if (dataUrl != null) download(dataUrl, "jianpu.png");
  };

  const handleExportStaff = async () => {
    const dataUrl = await staffRef?.current?.exportPng();
    if (dataUrl != null) download(dataUrl, "staff.png");
  };

  return (
    <div className="flex flex-wrap gap-3">
      {jianpuRef && (
        <button
          onClick={handleExportJianpu}
          className="text-sm font-medium text-primary border border-primary rounded-lg px-4 py-2 hover:bg-primary/5 transition-colors"
        >
          Download Numbered PNG
        </button>
      )}
      {staffRef && (
        <button
          onClick={handleExportStaff}
          className="text-sm font-medium text-primary border border-primary rounded-lg px-4 py-2 hover:bg-primary/5 transition-colors"
        >
          Download Staff PNG
        </button>
      )}
    </div>
  );
}
