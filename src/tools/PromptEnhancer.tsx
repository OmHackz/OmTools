import { useMemo, useState } from "react";
import { useSeo } from "../lib/seo";
import { ToolShell } from "./ToolShell";
import {
  AGENT_OPTIONS,
  DESIGN_SYSTEM_OPTIONS,
  ENHANCE_TYPE_OPTIONS,
  ENHANCER_MODEL_OPTIONS,
  FRAMEWORK_OPTIONS,
  TARGET_CODER_OPTIONS,
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
    "Turn rough prompts into precise, structured prompts for any AI coding agent."
  );

  const [prompt, setPrompt] = useState("");
  const [agent, setAgent] = useState("general");
  const [framework, setFramework] = useState("none");
  const [designSystem, setDesignSystem] = useState("none");
  const [targetCoder, setTargetCoder] = useState("none");
  const [enhanceType, setEnhanceType] = useState("improve");

  const [customSystem, setCustomSystem] = useState("");
  const [customized, setCustomized] = useState(false);

  const [enhancerModel, setEnhancerModel] = useState("default");
  const [customBaseUrl, setCustomBaseUrl] = useState("");
  const [customModelName, setCustomModelName] = useState("");
  const [customApiKey, setCustomApiKey] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EnhanceResult | null>(null);
  const [copied, setCopied] = useState(false);

  const generatedSystem = useMemo(
    () => generateSystemPrompt({ agent, framework, designSystem, targetCoder, enhanceType }),
    [agent, framework, designSystem, targetCoder, enhanceType]
  );

  const effectiveSystem = customized ? customSystem : generatedSystem;

  const isCustomProvider = enhancerModel === "custom";
  const enhancerBaseUrl = isCustomProvider ? customBaseUrl.trim() : "";
  const enhancerModelValue = isCustomProvider
    ? customModelName.trim() || "custom"
    : enhancerModel;
  const enhancerApiKey = isCustomProvider ? customApiKey.trim() : "";

  const enhance = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setCopied(false);
    const payload = {
      prompt,
      agent,
      framework,
      designSystem,
      targetCoder,
      enhanceType,
      systemPrompt: effectiveSystem,
      enhancerModel: enhancerModelValue,
      enhancerBaseUrl,
      enhancerApiKey,
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
    } catch (err) {
      setResult({
        enhancedPrompt: localEnhance(payload),
        original: prompt,
        fallback: true,
        error: err instanceof Error ? `Could not reach /api/ai: ${err.message}` : "Could not reach /api/ai.",
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
            label="Target coder"
            value={targetCoder}
            options={TARGET_CODER_OPTIONS}
            onChange={setTargetCoder}
          />
        </div>

        <details className="pe-advanced">
          <summary>Advanced · system prompt &amp; enhancer model</summary>
          <div className="pe-advanced-body">
            <p className="pe-hint">
              The system prompt is regenerated live as you change options above. Edit it to take full control.
            </p>
            <textarea
              value={effectiveSystem}
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

            <div className="pe-field">
              <span className="pe-label mono">Enhancer model</span>
              <select
                value={enhancerModel}
                onChange={(e) => setEnhancerModel(e.target.value)}
              >
                {ENHANCER_MODEL_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="pe-hint">
                "Server default" uses the server's configured AI. "Custom provider" requires your own base URL, model name, and API key.
              </p>
            </div>

            {isCustomProvider ? (
              <div className="pe-custom-provider">
                <div className="pe-field">
                  <span className="pe-label mono">Custom base URL</span>
                  <input
                    type="text"
                    value={customBaseUrl}
                    onChange={(e) => setCustomBaseUrl(e.target.value)}
                    placeholder="https://api.example.com/v1"
                    spellCheck={false}
                  />
                  <p className="pe-hint">
                    OpenAI-compatible base URL, including <code className="mono">/v1</code>. The request goes to <code className="mono">{'{base}'}/chat/completions</code>.
                  </p>
                </div>
                <div className="pe-field">
                  <span className="pe-label mono">Custom model name</span>
                  <input
                    type="text"
                    value={customModelName}
                    onChange={(e) => setCustomModelName(e.target.value)}
                    placeholder="model-id"
                    spellCheck={false}
                  />
                </div>
                <div className="pe-field">
                  <span className="pe-label mono">Custom API key</span>
                  <input
                    type="password"
                    value={customApiKey}
                    onChange={(e) => setCustomApiKey(e.target.value)}
                    placeholder="sk-..."
                    spellCheck={false}
                    autoComplete="off"
                  />
                </div>
                <p className="pe-hint">
                  Your key is sent to the server for this request only and is not stored. Required for custom providers.
                </p>
              </div>
            ) : null}
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
                {result.fallback
                  ? result.error
                    ? "failed · fell back to local"
                    : "enhanced locally"
                  : "enhanced with AI"}
              </span>
              <button type="button" className="btn btn-sm" onClick={copy}>
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <pre className="pe-result-text mono">{result.enhancedPrompt}</pre>
            {result.error ? (
              <p className="pe-error mono">
                ⚠ {result.error}
              </p>
            ) : null}
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
