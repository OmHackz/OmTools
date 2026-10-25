import { useState } from "react";
import { useFilePicker, loadImage } from "../lib/hooks/useImage";
import { useSeo } from "../lib/seo";
import { ToolShell } from "./ToolShell";

const FORMATS: { ext: string; mime: string }[] = [
  { ext: "png", mime: "image/png" },
  { ext: "jpg", mime: "image/jpeg" },
  { ext: "webp", mime: "image/webp" },
];

export function ImageConvert() {
  useSeo("Convert Image — OmTools", "Convert between PNG, JPG, and WebP in your browser.");
  const { inputRef, pick, file, fileName, previewUrl, clear, setFile } = useFilePicker();
  const [target, setTarget] = useState("webp");
  const [result, setResult] = useState<{ url: string; ext: string } | null>(null);

  const convert = async () => {
    if (!file) return;
    const img = await loadImage(file);
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, 0, 0);
    const mime = FORMATS.find((f) => f.ext === target)?.mime ?? "image/webp";
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, mime));
    if (blob) {
      setResult({ url: URL.createObjectURL(blob), ext: target });
    }
  };

  return (
    <ToolShell>
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <div className="tool-body">
        <div className="file-row">
          <button className="btn" onClick={pick}>Choose image</button>
          {file ? <span className="mono file-meta">{fileName}</span> : null}
          {file ? <button className="btn btn-ghost" onClick={clear}>Clear</button> : null}
        </div>
        {previewUrl ? <img className="preview" src={previewUrl} alt="preview" /> : null}
        <div className="control-row">
          <label className="control">
            <span className="control-label mono">Convert to</span>
            <select value={target} onChange={(e) => setTarget(e.target.value)}>
              {FORMATS.map((f) => (
                <option key={f.ext} value={f.ext}>{f.ext.toUpperCase()}</option>
              ))}
            </select>
          </label>
          <button className="btn" onClick={convert} disabled={!file}>Convert</button>
        </div>
        {result ? (
          <div className="result-card">
            <span className="mono result-meta">→ {result.ext.toUpperCase()}</span>
            <a className="btn" href={result.url} download={`converted-${fileName?.replace(/\.[^.]+$/, "") ?? "image"}.${result.ext}`}>
              Download
            </a>
          </div>
        ) : null}
      </div>
    </ToolShell>
  );
}
