import { useState } from "react";
import { useFilePicker, loadImage } from "../lib/hooks/useImage";
import { useSeo } from "../lib/seo";
import { ToolShell } from "./ToolShell";

export function ImageResize() {
  useSeo("Resize Image — OmTools", "Resize an image to exact dimensions in your browser.");
  const { inputRef, pick, file, fileName, previewUrl, clear, setFile } = useFilePicker();
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [locked, setLocked] = useState(true);
  const [result, setResult] = useState<{ url: string; w: number; h: number } | null>(null);

  const onPick = async (f: File | null) => {
    setFile(f);
    if (f) {
      const img = await loadImage(f);
      setWidth(img.naturalWidth);
      setHeight(img.naturalHeight);
    }
  };

  const process = async () => {
    if (!file) return;
    const img = await loadImage(file);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, 0, 0, width, height);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/png"));
    if (blob) {
      const url = URL.createObjectURL(blob);
      setResult({ url, w: width, h: height });
    }
  };

  const setW = (w: number) => {
    setWidth(w);
    if (locked && file && height > 0 && width > 0) {
      setHeight(Math.round((w / width) * height));
    }
  };
  const setH = (h: number) => {
    setHeight(h);
    if (locked && file && width > 0 && height > 0) {
      setWidth(Math.round((h / height) * width));
    }
  };

  return (
    <ToolShell>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => onPick(e.target.files?.[0] ?? null)}
      />
      <div className="tool-body">
        <div className="file-row">
          <button className="btn" onClick={pick}>Choose image</button>
          {file ? <span className="mono file-meta">{fileName}</span> : null}
          {file ? <button className="btn btn-ghost" onClick={clear}>Clear</button> : null}
        </div>
        {previewUrl ? <img className="preview" src={previewUrl} alt="preview" /> : null}
        <div className="control-row">
          <label className="control">
            <span className="control-label mono">Width</span>
            <input type="number" value={width || ""} onChange={(e) => setW(Number(e.target.value))} />
          </label>
          <label className="control">
            <span className="control-label mono">Height</span>
            <input type="number" value={height || ""} onChange={(e) => setH(Number(e.target.value))} />
          </label>
          <label className="control control-check">
            <input type="checkbox" checked={locked} onChange={(e) => setLocked(e.target.checked)} />
            <span className="mono">lock ratio</span>
          </label>
          <button className="btn" onClick={process} disabled={!file || !width || !height}>
            Resize
          </button>
        </div>
        {result ? (
          <div className="result-card">
            <span className="mono result-meta">{result.w} × {result.h}</span>
            <a className="btn" href={result.url} download={`resized-${fileName ?? "image"}.png`}>
              Download
            </a>
          </div>
        ) : null}
      </div>
    </ToolShell>
  );
}
