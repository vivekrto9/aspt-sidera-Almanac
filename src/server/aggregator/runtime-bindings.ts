type SecretStoreBinding = {
  get: () => Promise<unknown>;
};

export const notConfiguredSecretSentinel = "__ASTROPAGES_NOT_CONFIGURED__";
export const integrationSecretBundleBinding = "ASTROPAGES_INTEGRATION_SECRETS_JSON";
export const platformGooglePlacesSecretBinding =
  "ASTROPAGES_PLATFORM_GOOGLE_PLACES_GOOGLE_PLACES_API_KEY";
export const legacyPlatformGooglePlacesSecretBinding =
  "ASTROPAGES_PLATFORM_GOOGLE_PLACES_API_KEY";
const legacyGooglePlacesSecretBinding = "GOOGLE_PLACES_API_KEY";
const secretStoreBindingTimeoutMs = 1500;

const isSecretStoreBinding = (value: unknown): value is SecretStoreBinding =>
  Boolean(value && typeof value === "object" && typeof (value as SecretStoreBinding).get === "function");

export const resolveRuntimeBinding = async (value: unknown) => {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed === notConfiguredSecretSentinel ? "" : trimmed;
  }
  if (!isSecretStoreBinding(value)) return "";
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    const resolved = await Promise.race([
      value.get(),
      new Promise<"__ASTROPAGES_SECRET_STORE_TIMEOUT__">((resolve) => {
        timeout = setTimeout(
          () => resolve("__ASTROPAGES_SECRET_STORE_TIMEOUT__"),
          secretStoreBindingTimeoutMs,
        );
      }),
    ]);
    if (resolved === "__ASTROPAGES_SECRET_STORE_TIMEOUT__") return "";
    return typeof resolved === "string" && resolved.trim() !== notConfiguredSecretSentinel
      ? resolved.trim()
      : "";
  } catch {
    return "";
  } finally {
    if (timeout) clearTimeout(timeout);
  }
};

const safeSecretValue = (value: unknown) => {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  return trimmed && trimmed !== notConfiguredSecretSentinel ? trimmed : "";
};

const parseSecretBundle = (value: string) => {
  try {
    const payload = JSON.parse(value) as { secrets?: Record<string, unknown> };
    return payload && typeof payload === "object" && payload.secrets && typeof payload.secrets === "object"
      ? payload.secrets
      : {};
  } catch {
    return {};
  }
};

export const resolveBundledSecretBinding = async (
  env: Record<string, unknown>,
  bindingName: string,
) => {
  const bundle = await resolveRuntimeBinding(env[integrationSecretBundleBinding]);
  if (!bundle) return "";
  return safeSecretValue(parseSecretBundle(bundle)[bindingName]);
};

export const resolveSecretBinding = async (
  env: Record<string, unknown>,
  bindingName: string,
) => {
  const isGooglePlacesBinding = [
    platformGooglePlacesSecretBinding,
    legacyPlatformGooglePlacesSecretBinding,
    legacyGooglePlacesSecretBinding,
  ].includes(bindingName);

  if (isGooglePlacesBinding) {
    for (const candidate of [
      platformGooglePlacesSecretBinding,
      legacyPlatformGooglePlacesSecretBinding,
    ]) {
      const platformValue = await resolveRuntimeBinding(env[candidate]);
      if (platformValue) return platformValue;
    }

    for (const candidate of new Set([
      bindingName,
      platformGooglePlacesSecretBinding,
      legacyPlatformGooglePlacesSecretBinding,
      legacyGooglePlacesSecretBinding,
    ])) {
      const bundled = await resolveBundledSecretBinding(env, candidate);
      if (bundled) return bundled;
    }

    return resolveRuntimeBinding(env[legacyGooglePlacesSecretBinding]);
  }

  const bundled = await resolveBundledSecretBinding(env, bindingName);
  if (bundled) return bundled;
  return resolveRuntimeBinding(env[bindingName]);
};

export const hasSecretBinding = async (env: Record<string, unknown>, bindingName: string) =>
  Boolean(await resolveSecretBinding(env, bindingName));
