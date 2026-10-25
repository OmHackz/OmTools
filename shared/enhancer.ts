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
  targetModel?: string;
  enhanceType?: string;
  systemPrompt?: string;
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
  { id: "angular", label: "Angular" },
  { id: "astro", label: "Astro" },
  { id: "django", label: "Django" },
  { id: "rails", label: "Rails" },
  { id: "laravel", label: "Laravel" },
  { id: "flutter", label: "Flutter" },
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
];

export const TARGET_MODEL_OPTIONS: Option[] = [
  { id: "any", label: "Any model" },
  { id: "gpt-4o", label: "GPT-4o" },
  { id: "gpt-4.1", label: "GPT-4.1" },
  { id: "o3", label: "o3" },
  { id: "claude", label: "Claude" },
  { id: "gemini", label: "Gemini" },
  { id: "llama", label: "Llama" },
  { id: "deepseek", label: "DeepSeek" },
  { id: "mistral", label: "Mistral" },
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
  input: Pick<EnhanceOptions, "agent" | "framework" | "designSystem" | "targetModel" | "enhanceType">
): string {
  const agent = labelOf(AGENT_OPTIONS, input.agent, "General");
  const agentDesc =
    AGENT_DESCRIPTIONS[input.agent ?? "general"] ?? AGENT_DESCRIPTIONS.general;

  const targetLines: string[] = [];
  const framework = labelOf(FRAMEWORK_OPTIONS, input.framework, "None");
  const designSystem = labelOf(DESIGN_SYSTEM_OPTIONS, input.designSystem, "None");
  const targetModel = labelOf(TARGET_MODEL_OPTIONS, input.targetModel, "Any model");

  if (framework !== "None") targetLines.push(`- Framework: ${framework}`);
  if (designSystem !== "None") targetLines.push(`- Design system: ${designSystem}`);
  if (targetModel !== "Any model") targetLines.push(`- Target model: ${targetModel}`);

  return [
    "You are an expert prompt engineer. Your job is to rewrite the user's rough prompt into a precise, high-quality prompt that gets better results from AI models.",
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
    "6. Return only the enhanced prompt. Do not add explanations, preambles, or wrap the answer in code fences.",
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
    `Target model: ${labelOf(TARGET_MODEL_OPTIONS, input.targetModel, "Any model")}`,
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
  const targetModel = labelOf(TARGET_MODEL_OPTIONS, input.targetModel, "Any model");
  const type = input.enhanceType ?? "improve";

  const context: string[] = [];
  if (framework !== "None") context.push(`Framework: ${framework}`);
  if (designSystem !== "None") context.push(`Design system: ${designSystem}`);
  if (targetModel !== "Any model") context.push(`Target model: ${targetModel}`);

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

  const baseUrl = (env.AI_BASE_URL || "https://api.openai.com/v1").replace(/\/+$/, "");
  const model = env.AI_MODEL || "gpt-4o-mini";
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
