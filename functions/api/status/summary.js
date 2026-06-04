
const SERVICE_TARGETS = [
  {
    key: "openwebui",
    name: "OpenWebUI + Ollama",
    endpoint: "https://app.jackgpt.org",
    description: "Public chat interface and model routing are reachable.",
  },
  {
    key: "automatic1111",
    name: "AUTOMATIC1111",
    endpoint: "https://images.jackgpt.org",
    description: "Image-generation service is reachable.",
  },
  {
    key: "images",
    name: "images.jackgpt.org",
    endpoint: "https://images.jackgpt.org",
    description: "Public image-generation endpoint is reachable.",
  },
  {
    key: "meshcentral",
    name: "mesh.jackgpt.org",
    endpoint: "https://mesh.jackgpt.org",
    description: "Remote-management endpoint is reachable.",
  },
  {
    key: "jackgpt-search",
    name: "JackGPT Search",
    endpoint: "https://search.jackgpt.org/search?q=openai&format=json",
    publicUrl: "https://search.jackgpt.org",
    minResults: 1,
    description: "Branded JackGPT Search is returning real search results.",
  },
  {
    key: "market-desk",
    name: "Market Desk",
    endpoint: "https://market.jackgpt.org/health",
    description: "AI-powered equity research dashboard health endpoint is reachable.",
  },
  {
    key: "kalshi-temperature-bot",
    name: "Kalshi Temperature Bot",
    endpoint: "https://kalshi.jackgpt.org/health",
    description: "Kalshi bot scanner dashboard and health endpoint are reachable.",
  },
  {
    key: "minecraft",
    name: "Minecraft Server",
    endpoint: "https://market.jackgpt.org/api/minecraft/health",
    showEndpoint: false,
    description: "Minecraft server is answering the internal status probe.",
  },
  {
    key: "website",
    name: "JackGPT Platform",
    endpoint: "https://jackgpt.org",
    description: "Portfolio homepage is reachable.",
  },
];

function buildTimeoutSignal(ms) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort("timeout"), ms);
  return {
    signal: controller.signal,
    clear: () => clearTimeout(timeoutId),
  };
}

async function checkTarget(target) {
  const startedAt = Date.now();
  const { signal, clear } = buildTimeoutSignal(8000);

  try {
    let response;

    if (target.minResults) {
      response = await fetch(target.endpoint, {
        method: "GET",
        redirect: "follow",
        signal,
        cf: { cacheTtl: 0, cacheEverything: false },
        headers: {
          "cache-control": "no-store",
          pragma: "no-cache",
          "user-agent": "jackgpt-status-probe",
        },
      });
    } else {
      try {
        response = await fetch(target.endpoint, {
          method: "HEAD",
          redirect: "follow",
          signal,
          cf: { cacheTtl: 0, cacheEverything: false },
          headers: {
            "cache-control": "no-store",
            pragma: "no-cache",
            "user-agent": "jackgpt-status-probe",
          },
        });
      } catch {
        response = await fetch(target.endpoint, {
          method: "GET",
          redirect: "follow",
          signal,
          cf: { cacheTtl: 0, cacheEverything: false },
          headers: {
            "cache-control": "no-store",
            pragma: "no-cache",
            "user-agent": "jackgpt-status-probe",
          },
        });
      }
    }

    const latencyMs = Date.now() - startedAt;
    const httpStatus = response.status;
    let status =
      response.ok
        ? latencyMs > 2000
          ? "degraded"
          : "online"
        : "offline";
    let description = target.description;

    if (target.minResults) {
      try {
        const data = await response.clone().json();
        const resultCount = Array.isArray(data.results) ? data.results.length : 0;
        if (!response.ok) {
          status = "offline";
          description = "JackGPT Search functional probe failed.";
        } else if (resultCount < target.minResults) {
          status = "degraded";
          description = `JackGPT Search loaded but returned ${resultCount} result(s).`;
        } else if (status === "online") {
          description = `JackGPT Search returned ${resultCount} result(s).`;
        }
      } catch {
        status = response.ok ? "degraded" : "offline";
        description = "JackGPT Search functional probe did not return valid JSON.";
      }
    }

    return {
      ...target,
      status,
      httpStatus,
      latencyMs,
      checkedAt: new Date().toISOString(),
      description,
    };
  } catch (error) {
    return {
      ...target,
      status: "offline",
      httpStatus: "ERR",
      latencyMs: null,
      checkedAt: new Date().toISOString(),
      description:
        error === "timeout" || String(error).includes("timeout")
          ? "Status probe timed out."
          : "Status probe failed.",
    };
  } finally {
    clear();
  }
}

export async function onRequestGet() {
  const checks = await Promise.all(SERVICE_TARGETS.map(checkTarget));

  return new Response(
    JSON.stringify(
      {
        services: checks,
        generatedAt: new Date().toISOString(),
      },
      null,
      2,
    ),
    {
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store, no-cache, must-revalidate, max-age=0",
      },
    },
  );
}
