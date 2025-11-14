export function selectModel(provider) {
  switch (provider) {
    case "openai":
      return "gpt-4o-mini";
    case "google":
      return "gemini-1.5-flash";
    case "anthropic":
      return "claude-3-haiku-20240307";
    case "local":
      return "llama-3.1-8b";
    default:
      return "gpt-4o-mini";
  }
}
