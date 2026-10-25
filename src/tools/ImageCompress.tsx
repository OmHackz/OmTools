import { useEffect, useMemo, useState } from "react";
import { useFilePicker, loadImage } from "../lib/hooks/useImage";
import { useSeo } from "../lib/seo";
import { ToolShell } from "./ToolShell";
import type { ToolComponent } from "./types";

export const ImageCompress: ToolComponent = () => {
  useSeo(
    "Compress Image — OmTools",
    "Reduce image file size in your browser using WebP and AVIF. No upload, no tracking."
  );
  const { pick, file, previewUrl, clear, fileName, fileSize } = useFilePicker();
  const [quality, setQuality] = useState(0.8);
  const [format, setFormat] = useState<"webp" | "avif">("webp");
  const [result, setResult] = useState<{ url: string; size: number } | null>(null);
  const [busy, setBusy] = useState(false);

  const process = async () => {
    if (!file) return;
    setBusy(true);
    try {
      const img = await loadImage(file);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, `image/${format}`, quality)
      );
      if (blob) {
        const url = URL.createObjectURL(blob);
        setResult({ url, size: blob.size });
      }
    } finally {
      setBusy(false);
    }
  };

  const savedPct = useMemo(() => {
    if (!result || !fileSize) return null;
    const saved = 100 - Math.round((result.size / fileSize) * 100);
    return saved > 0 ? saved : 0;
  }, [result, fileSize]);

  useEffect(
    () => () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (result) URL.revokeObjectURL(result.url);
    },
    [previewUrl, result]
  );

  return (
    <ToolShell>
      <div className="tool-body">
        <div className="file-row">
          <button className="btn" onClick={pick}>
            Choose image
          </button>
          {file ? (
            <span className="mono file-meta">
              {fileName} · {(fileSize ?? 0) / 1024} KB
            </span>
          ) : null}
          {file ? <button className="btn btn-ghost" onClick={clear}>Clear</button> : null}
        </div>
        {previewUrl ? <img className="preview" src={previewUrl} alt="preview" /> : null}
        <div className="control-row">
          <label className="control">
            <span className="control-label mono">Format</span>
            <select value={format} onChange={(e) => setFormat(e.target.value as "webp" | "avif")}>
              <option value="webp">WebP</option>
              <option value="avif">AVIF</option>
            </select>
          </label>
          <label className="control">
            <span className="control-label mono">
              Quality · {Math.round(quality * 100)}%
            </span>
            <input
              type="range"
              min={0.1}
              max={1}
              step={0.05}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
            />
          </label>
          <button className="btn" onClick={process} disabled={!file || busy}>
            {busy ? "Working…" : "Compress"}
          </button>
        </div>
        {result ? (
          <div className="result-card">
            <span className="mono result-meta">
              {Math.round(result.size / 1024)} KB
              {savedPct !== null ? ` · −${savedPct}%` : ""}
            </span>
            <a className="btn" href={result.url} download={`compressed-${fileName ?? "image"}.${format === "webp" ? "webp" : "avif"}`}>
              Download
            </a>
          </div>
        ) : null}
      </div>
    </ToolShell>
  );
};