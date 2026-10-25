import { useMemo, useState } from "react";
import { useSeo } from "../lib/seo";
import { ToolShell } from "./ToolShell";
import {
  AGENT_OPTIONS,
  DESIGN_SYSTEM_OPTIONS,
  ENHANCE_TYPE_OPTIONS,
  FRAMEWORK_OPTIONS,
  TARGET_MODEL_OPTIONS,
  generateSystemPrompt,
  localEnhance,
  type EnhanceResult,
  type Option,
} from "../../shared/enhancer";

function ChipGroup({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="pe-field">
      <span className="pe-label mono">{label}</span>
      <div className="pe-chips" role="group" aria-label={label}>
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`pe-chip${option.id === value ? " active" : ""}`}
            aria-pressed={option.id === value}
            onClick={() => onChange(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function PromptEnhancer() {
  useSeo(
    "Prompt Enhancer — OmTools",
    "Turn rough prompts into precise, structured prompts for any AI model, framework, or agent."
  );

  const [prompt, setPrompt] = useState("");
  const [agent, setAgent] = useState("general");
  const [framework, setFramework] = useState("none");
  const [designSystem, setDesignSystem] = useState("none");
  const [targetModel, setTargetModel] = useState("any");
  const [enhanceType, setEnhanceType] = useState("improve");

  const [customSystem, setCustomSystem] = useState("");
  const [customized, setCustomized] = useState(false);
  const [showSystem, setShowSystem] = useState(false);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EnhanceResult | null>(null);
  const [copied, setCopied] = useState(false);

  const generatedSystem = useMemo(
    () => generateSystemPrompt({ agent, framework, designSystem, targetModel, enhanceType }),
    [agent, framework, designSystem, targetModel, enhanceType]
  );

  const effectiveSystem = customized ? customSystem : generatedSystem;

  const enhance = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setCopied(false);
    const payload = {
      prompt,
      agent,
      framework,
      designSystem,
      targetModel,
      enhanceType,
      systemPrompt: effectiveSystem,
    };
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`Request failed (${response.status})`);
      const data = (await response.json()) as EnhanceResult;
      if (!data.enhancedPrompt) throw new Error("Empty response");
      setResult(data);
    } catch {
      // Static hosting without functions, dev preview, or a temporary outage:
      // fall back to the same deterministic enhancer used by the API.
      setResult({
        enhancedPrompt: localEnhance(payload),
        original: prompt,
        fallback: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.enhancedPrompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <ToolShell>
      <div className="tool-body pe">
        <label className="panel">
          <span className="panel-label mono">Your prompt</span>
          <textarea
            className="pe-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. build me a dashboard for tracking habits with streaks and charts"
            spellCheck={false}
          />
        </label>

        <div className="pe-options">
          <ChipGroup label="Agent" value={agent} options={AGENT_OPTIONS} onChange={setAgent} />
          <ChipGroup
            label="Enhance type"
            value={enhanceType}
            options={ENHANCE_TYPE_OPTIONS}
            onChange={setEnhanceType}
          />
          <ChipGroup label="Framework" value={framework} options={FRAMEWORK_OPTIONS} onChange={setFramework} />
          <ChipGroup
            label="Design system"
            value={designSystem}
            options={DESIGN_SYSTEM_OPTIONS}
            onChange={setDesignSystem}
          />
          <ChipGroup
            label="Target model"
            value={targetModel}
            options={TARGET_MODEL_OPTIONS}
            onChange={setTargetModel}
          />
        </div>

        <details
          className="pe-advanced"
          onToggle={(e) => setShowSystem((e.currentTarget as HTMLDetailsElement).open)}
        >
          <summary>Advanced · system prompt</summary>
          <div className="pe-advanced-body">
            <p className="pe-hint">
              Generated from your selections. Edit it to take full control; reset to regenerate.
            </p>
            <textarea
              value={showSystem ? effectiveSystem : generatedSystem}
              onChange={(e) => {
                setCustomSystem(e.target.value);
                setCustomized(true);
              }}
              spellCheck={false}
            />
            <div className="pe-advanced-actions">
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  setCustomized(false);
                  setCustomSystem("");
                }}
              >
                Reset to generated
              </button>
              <span className="mono pe-system-state">{customized ? "custom" : "auto-generated"}</span>
            </div>
          </div>
        </details>

        <div className="pe-actions">
          <button className="btn" onClick={enhance} disabled={loading || !prompt.trim()}>
            {loading ? "Enhancing…" : "Enhance prompt"}
          </button>
          {prompt.trim() ? (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setPrompt("");
                setResult(null);
              }}
            >
              Clear
            </button>
          ) : null}
          <span className="mono pe-key-hint">no login · no ads</span>
        </div>

        {result ? (
          <div className="pe-result">
            <div className="pe-result-head">
              <span className="mono result-meta">
                {result.fallback ? "enhanced locally" : "enhanced with AI"}
              </span>
              <button type="button" className="btn btn-sm" onClick={copy}>
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <pre className="pe-result-text mono">{result.enhancedPrompt}</pre>
            <p className="pe-hint">
              Paste this into your AI tool. Set <code className="mono">AI_API_KEY</code> on the server for
              model-powered enhancement.
            </p>
          </div>
        ) : null}
      </div>
    </ToolShell>
  );
}
