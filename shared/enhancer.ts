/**
 * Shared prompt-enhancer logic.
 * Used by the client UI, the Vite dev middleware, and the serverless functions.
 * Keep this file free of platform-specific APIs.
 */

export interface EnhanceOptions {
  prompt: string;
  agent?: string;
  framework?: string;
  designSystem?: string;
  targetCoder?: string;
  enhanceType?: string;
  systemPrompt?: string;
  /** Which model should perform the enhancement (server-side). */
  enhancerModel?: string;
  /** Custom OpenAI-compatible base URL for the enhancer (server-side). */
  enhancerBaseUrl?: string;
}

export interface EnhanceResult {
  enhancedPrompt: string;
  original: string;
  fallback: boolean;
}

export interface Option {
  id: string;
  label: string;
}

export const AGENT_OPTIONS: Option[] = [
  { id: "general", label: "General" },
  { id: "research", label: "Research" },
  { id: "coding", label: "Coding" },
  { id: "design", label: "Design" },
  { id: "marketing", label: "Marketing" },
  { id: "writing", label: "Writing" },
  { id: "data", label: "Data" },
  { id: "product", label: "Product" },
  { id: "education", label: "Education" },
];

export const FRAMEWORK_OPTIONS: Option[] = [
  { id: "none", label: "None" },
  { id: "react", label: "React" },
  { id: "next", label: "Next.js" },
  { id: "vue", label: "Vue" },
  { id: "nuxt", label: "Nuxt" },
  { id: "svelte", label: "Svelte" },
  { id: "sveltekit", label: "SvelteKit" },
  { id: "angular", label: "Angular" },
  { id: "astro", label: "Astro" },
  { id: "solid", label: "SolidJS" },
  { id: "qwik", label: "Qwik" },
  { id: "remix", label: "Remix" },
  { id: "tanstack", label: "TanStack Start" },
  { id: "htmx", label: "HTMX" },
  { id: "alpine", label: "Alpine.js" },
  { id: "lit", label: "Lit" },
  { id: "webcomponents", label: "Web Components" },
  { id: "express", label: "Express" },
  { id: "fastify", label: "Fastify" },
  { id: "hono", label: "Hono" },
  { id: "nestjs", label: "NestJS" },
  { id: "elysia", label: "Elysia" },
  { id: "django", label: "Django" },
  { id: "fastapi", label: "FastAPI" },
  { id: "flask", label: "Flask" },
  { id: "rails", label: "Rails" },
  { id: "laravel", label: "Laravel" },
  { id: "spring", label: "Spring Boot" },
  { id: "dotnet", label: ".NET" },
  { id: "gin", label: "Gin (Go)" },
  { id: "flutter", label: "Flutter" },
  { id: "reactnative", label: "React Native" },
  { id: "expo", label: "Expo" },
  { id: "tauri", label: "Tauri" },
  { id: "electron", label: "Electron" },
  { id: "plain", label: "HTML/CSS" },
];

export const DESIGN_SYSTEM_OPTIONS: Option[] = [
  { id: "none", label: "None" },
  { id: "tailwind", label: "Tailwind" },
  { id: "shadcn", label: "shadcn/ui" },
  { id: "material", label: "Material" },
  { id: "antd", label: "Ant Design" },
  { id: "chakra", label: "Chakra" },
  { id: "bootstrap", label: "Bootstrap" },
  { id: "radix", label: "Radix" },
  { id: "fluent", label: "Fluent" },
  { id: "carbon", label: "Carbon" },
  { id: "daisyui", label: "DaisyUI" },
  { id: "mantine", label: "Mantine" },
  { id: "radixthemes", label: "Radix Themes" },
  { id: "spectrum", label: "Spectrum" },
  { id: "evergreen", label: "Evergreen" },
  { id: "grommet", label: "Grommet" },
  { id: "themeui", label: "Theme UI" },
  { id: "parkui", label: "Park UI" },
  { id: "magicui", label: "Magic UI" },
  { id: "aceternity", label: "Aceternity" },
  { id: "nextui", label: "NextUI/HeroUI" },
  { id: "daisy", label: "Daisy" },
  { id: "flowbite", label: "Flowbite" },
  { id: "preline", label: "Preline" },
];

export const TARGET_CODER_OPTIONS: Option[] = [
  { id: "none", label: "Any / Generic" },
  { id: "opencode", label: "OpenCode" },
  { id: "claude-code", label: "Claude Code" },
  { id: "cursor", label: "Cursor" },
  { id: "copilot", label: "GitHub Copilot" },
  { id: "windsurf", label: "Windsurf" },
  { id: "cline", label: "Cline" },
  { id: "aider", label: "Aider" },
  { id: "continue", label: "Continue" },
  { id: "tabnine", label: "Tabnine" },
  { id: "codeium", label: "Codeium" },
  { id: "amazon-q", label: "Amazon Q" },
  { id: "cody", label: "Sourcegraph Cody" },
  { id: "bolt", label: "Bolt.new" },
  { id: "v0", label: "v0" },
  { id: "lovable", label: "Lovable" },
  { id: "replit", label: "Replit" },
  { id: "aider-cli", label: "Aider CLI" },
  { id: "gemini-cli", label: "Gemini CLI" },
  { id: "codex", label: "OpenAI Codex" },
];

export const ENHANCE_TYPE_OPTIONS: Option[] = [
  { id: "improve", label: "Improve" },
  { id: "bullet", label: "Bullet points" },
  { id: "sections", label: "Structured sections" },
  { id: "phrases", label: "Key phrases" },
  { id: "expand", label: "Expand" },
  { id: "condense", label: "Condense" },
  { id: "professional", label: "Professional" },
  { id: "casual", label: "Casual" },
  { id: "steps", label: "Step-by-step" },
];

export const ENHANCER_MODEL_OPTIONS: Option[] = [
  { id: "default", label: "Server default" },
  { id: "gpt-4o", label: "GPT-4o" },
  { id: "gpt-4o-mini", label: "GPT-4o mini" },
  { id: "gpt-4.1", label: "GPT-4.1" },
  { id: "gpt-4.1-mini", label: "GPT-4.1 mini" },
  { id: "o3", label: "o3" },
  { id: "o4-mini", label: "o4-mini" },
  { id: "claude-3.5-sonnet", label: "Claude 3.5 Sonnet" },
  { id: "claude-3.7-sonnet", label: "Claude 3.7 Sonnet" },
  { id: "claude-4-sonnet", label: "Claude 4 Sonnet" },
  { id: "claude-4-opus", label: "Claude 4 Opus" },
  { id: "gemini-2.0-flash", label: "Gemini 2.0 Flash" },
  { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
  { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro" },
  { id: "llama-4-maverick", label: "Llama 4 Maverick" },
  { id: "llama-4-scout", label: "Llama 4 Scout" },
  { id: "deepseek-v3", label: "DeepSeek V3" },
  { id: "deepseek-r1", label: "DeepSeek R1" },
  { id: "mistral-large", label: "Mistral Large" },
  { id: "qwen-3", label: "Qwen 3" },
  { id: "custom", label: "Custom provider" },
];

const AGENT_DESCRIPTIONS: Record<string, string> = {
  general: "general-purpose",
  research: "research (academic rigor, methodology, citations)",
  coding: "software engineering (clean, runnable code)",
  design: "UI/UX design (accessibility, visual hierarchy)",
  marketing: "marketing (audience, positioning, conversion)",
  writing: "writing and editing (clarity, tone, structure)",
  data: "data analysis (statistics, SQL, visualization)",
  product: "product management (requirements, priorities, tradeoffs)",
  education: "teaching (clear explanations, examples, scaffolding)",
};

const CODER_DESCRIPTIONS: Record<string, string> = {
  "none": "any AI coding assistant",
  "opencode": "OpenCode (terminal-first coding agent with tool use)",
  "claude-code": "Claude Code (Anthropic's agentic coding CLI)",
  "cursor": "Cursor (AI-first IDE with Composer)",
  "copilot": "GitHub Copilot (inline completion + chat)",
  "windsurf": "Windsurf (agentic IDE with Cascade)",
  "cline": "Cline (autonomous coding agent in VS Code)",
  "aider": "Aider (terminal pair-programming)",
  "continue": "Continue (open-source coding assistant)",
  "tabnine": "Tabnine (privacy-focused completion)",
  "codeium": "Codeium (fast completion + chat)",
  "amazon-q": "Amazon Q Developer",
  "cody": "Sourcegraph Cody (codebase-aware)",
  "bolt": "Bolt.new (full-stack app generation)",
  "v0": "v0 (UI component generation)",
  "lovable": "Lovable (full-stack app generation)",
  "replit": "Replit Agent",
  "aider-cli": "Aider CLI",
  "gemini-cli": "Gemini CLI",
  "codex": "OpenAI Codex",
};

const STYLE_INSTRUCTIONS: Record<string, string> = {
  improve: "Make the prompt clearer and more specific without changing its length dramatically.",
  bullet: "Format the enhanced prompt as a tight bulleted list of instructions.",
  sections:
    "Organize the enhanced prompt into clear sections: Role, Task, Context, Requirements, and Output format.",
  phrases: "Rewrite the prompt as short, high-signal phrases separated by semicolons.",
  expand:
    "Expand the prompt with missing context, constraints, edge cases, and acceptance criteria.",
  condense: "Condense the prompt to its essential instructions and remove anything redundant.",
  professional: "Use a professional, formal tone.",
  casual: "Use a friendly, conversational tone.",
  steps: "Rewrite the prompt as numbered, sequential steps.",
};

function labelOf(options: Option[], id: string | undefined, fallback: string): string {
  if (!id) return fallback;
  return options.find((o) => o.id === id)?.label ?? id;
}

function styleOf(id: string | undefined): string {
  return STYLE_INSTRUCTIONS[id ?? "improve"] ?? STYLE_INSTRUCTIONS.improve;
}

/** Build the default system prompt shown in the Advanced section. */
export function generateSystemPrompt(
  input: Pick<EnhanceOptions, "agent" | "framework" | "designSystem" | "targetCoder" | "enhanceType">
): string {
  const agent = labelOf(AGENT_OPTIONS, input.agent, "General");
  const agentDesc =
    AGENT_DESCRIPTIONS[input.agent ?? "general"] ?? AGENT_DESCRIPTIONS.general;

  const targetLines: string[] = [];
  const framework = labelOf(FRAMEWORK_OPTIONS, input.framework, "None");
  const designSystem = labelOf(DESIGN_SYSTEM_OPTIONS, input.designSystem, "None");
  const targetCoder = labelOf(TARGET_CODER_OPTIONS, input.targetCoder, "Any / Generic");
  const coderDesc =
    CODER_DESCRIPTIONS[input.targetCoder ?? "none"] ?? CODER_DESCRIPTIONS.none;

  if (framework !== "None") targetLines.push(`- Framework: ${framework}`);
  if (designSystem !== "None") targetLines.push(`- Design system: ${designSystem}`);
  if (targetCoder !== "Any / Generic") {
    targetLines.push(`- Target coding agent: ${targetCoder} (${coderDesc})`);
  }

  return [
    "You are an expert prompt engineer. Your job is to rewrite the user's rough prompt into a precise, high-quality prompt that gets better results from AI coding agents.",
    "",
    `The enhanced prompt will be used by a ${agent} assistant (${agentDesc}).`,
    "",
    ...(targetLines.length > 0 ? ["Target environment:", ...targetLines, ""] : []),
    `Enhancement style: ${styleOf(input.enhanceType)}`,
    "",
    "Rules:",
    "1. Preserve the user's original intent, constraints, and any concrete details.",
    "2. Make implicit assumptions explicit; fill gaps only when obvious, and mark genuine unknowns as assumptions.",
    "3. Remove ambiguity, filler, and contradictory instructions.",
    "4. Prefer concrete requirements over vague adjectives.",
    "5. Include an output format when the task has a clear deliverable.",
    "6. Tailor the prompt to the conventions and capabilities of the target coding agent when one is specified.",
    "7. Return only the enhanced prompt. Do not add explanations, preambles, or wrap the answer in code fences.",
  ].join("\n");
}

/** Build the user message sent to the AI model. */
export function buildUserMessage(input: EnhanceOptions): string {
  const lines = [
    "Enhance the following prompt.",
    "",
    `Agent: ${labelOf(AGENT_OPTIONS, input.agent, "General")}`,
    `Framework: ${labelOf(FRAMEWORK_OPTIONS, input.framework, "None")}`,
    `Design system: ${labelOf(DESIGN_SYSTEM_OPTIONS, input.designSystem, "None")}`,
    `Target coding agent: ${labelOf(TARGET_CODER_OPTIONS, input.targetCoder, "Any / Generic")}`,
    `Enhancement style: ${labelOf(ENHANCE_TYPE_OPTIONS, input.enhanceType, "Improve")}`,
    "",
    "Original prompt:",
    input.prompt.trim(),
  ];
  return lines.join("\n");
}

/** Deterministic, offline enhancement used when no API key is configured. */
export function localEnhance(input: EnhanceOptions): string {
  const prompt = input.prompt.trim();
  if (!prompt) return "";

  const agent = labelOf(AGENT_OPTIONS, input.agent, "General");
  const framework = labelOf(FRAMEWORK_OPTIONS, input.framework, "None");
  const designSystem = labelOf(DESIGN_SYSTEM_OPTIONS, input.designSystem, "None");
  const targetCoder = labelOf(TARGET_CODER_OPTIONS, input.targetCoder, "Any / Generic");
  const type = input.enhanceType ?? "improve";

  const context: string[] = [];
  if (framework !== "None") context.push(`Framework: ${framework}`);
  if (designSystem !== "None") context.push(`Design system: ${designSystem}`);
  if (targetCoder !== "Any / Generic") context.push(`Target coding agent: ${targetCoder}`);

  const role = `You are a ${agent} assistant.`;
  const contextBlock = context.length > 0 ? ["Context:", ...context.map((c) => `- ${c}`)] : [];
  const guidelines = [
    "Requirements:",
    "- Be specific and unambiguous.",
    "- State assumptions explicitly.",
    "- Prefer concrete requirements over vague adjectives.",
  ];
  const output = ["Output format:", "Return a clear, well-structured response that directly satisfies the task."];

  const sentences = prompt
    .split(/(?<=[.!?])\s+|;\s+/)
    .map((s) => s.trim().replace(/[.!?]$/, ""))
    .filter(Boolean);

  switch (type) {
    case "bullet":
      return [
        role,
        "",
        "Instructions:",
        ...sentences.map((s) => `- ${s}`),
        "",
        ...contextBlock,
        "",
        ...guidelines,
      ]
        .filter((line) => line !== undefined)
        .join("\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

    case "steps":
      return [
        role,
        "",
        "Steps:",
        ...sentences.map((s, i) => `${i + 1}. ${s}`),
        "",
        ...contextBlock,
      ]
        .filter((line) => line !== undefined)
        .join("\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

    case "phrases": {
      const phrases = sentences.map((s) => s.toLowerCase());
      const extras = context.map((c) => c.toLowerCase());
      return [...phrases, ...extras, "be specific", "state assumptions"].join("; ");
    }

    case "condense":
      return prompt.replace(/\s+/g, " ");

    case "professional":
      return [`${role}`, "", `Task: ${prompt}`, "", ...contextBlock, "", "Tone: Professional, precise, and direct."]
        .filter((line) => line !== undefined)
        .join("\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

    case "casual":
      return [`${role}`, "", `Task: ${prompt}`, "", ...contextBlock, "", "Tone: Friendly and conversational, but still clear."]
        .filter((line) => line !== undefined)
        .join("\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

    case "expand":
      return [
        role,
        "",
        `Task: ${prompt}`,
        "",
        ...contextBlock,
        "",
        "Additional requirements:",
        "- Cover edge cases and failure modes.",
        "- Include acceptance criteria.",
        "- Call out any assumptions explicitly.",
        "- Suggest a concrete output format.",
      ]
        .filter((line) => line !== undefined)
        .join("\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

    case "sections":
    case "improve":
    default:
      return [
        role,
        "",
        `Task: ${prompt}`,
        "",
        ...contextBlock,
        "",
        ...guidelines,
        "",
        ...output,
      ]
        .filter((line) => line !== undefined)
        .join("\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
  }
}

type Env = Record<string, string | undefined>;

/**
 * Enhance a prompt. Uses an OpenAI-compatible API when AI_API_KEY is set,
 * otherwise falls back to the deterministic local enhancer.
 *
 * enhancerModel / enhancerBaseUrl let the caller pick a specific model or
 * provider; when omitted (or "default"/"custom" without a URL) the server's
 * env values are used.
 */
export async function enhancePrompt(
  input: EnhanceOptions,
  env: Env
): Promise<EnhanceResult> {
  const original = input.prompt?.trim() ?? "";
  if (!original) return { enhancedPrompt: "", original, fallback: true };

  const apiKey = env.AI_API_KEY || env.OPENAI_API_KEY || "";
  if (!apiKey) {
    return { enhancedPrompt: localEnhance(input), original, fallback: true };
  }

  const requestedModel = input.enhancerModel && input.enhancerModel !== "default" ? input.enhancerModel : "";
  const requestedUrl = input.enhancerBaseUrl && input.enhancerBaseUrl.trim() ? input.enhancerBaseUrl.trim() : "";

  const model = requestedModel && requestedModel !== "custom" ? requestedModel : (env.AI_MODEL || "gpt-4o-mini");
  const baseUrl = (requestedUrl || env.AI_BASE_URL || "https://api.openai.com/v1").replace(/\/+$/, "");
  const system = input.systemPrompt?.trim() || generateSystemPrompt(input);

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.7,
        messages: [
          { role: "system", content: system },
          { role: "user", content: buildUserMessage(input) },
        ],
      }),
    });

    if (!response.ok) {
      return { enhancedPrompt: localEnhance(input), original, fallback: true };
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = data.choices?.[0]?.message?.content;
    if (!text || !text.trim()) {
      return { enhancedPrompt: localEnhance(input), original, fallback: true };
    }
    return { enhancedPrompt: text.trim(), original, fallback: false };
  } catch {
    return { enhancedPrompt: localEnhance(input), original, fallback: true };
  }
}
