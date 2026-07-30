import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import {
  CONTAINER_REF,
  CONTAINER_URL,
  LICENSE,
  networkFlag,
  ORGANIZATION,
  PACKAGES_URL,
  REPO_URL,
  ROUTES,
  SITE_URL,
} from "@/data/site";

/**
 * Generates /llms.txt at build time.
 *
 * It used to be a hand-maintained file in public/ that restated chain IDs,
 * node requirements, the dependency manifest and every URL already declared
 * elsewhere. Those are now read from the same collections the pages render, so
 * they cannot drift; only the summary prose is written here.
 *
 * The prose is deliberately shorter than the pages'. This file is a summary for
 * crawlers, not a mirror of the site.
 */

const PROSE = {
  // Execution client is the identity. Running a consensus layer and mining are
  // optional capabilities of the same binary and are stated as such below, not
  // folded into this sentence.
  intro:
    "Tyto is a Scala execution client for the Ethereum Virtual Machine ecosystem. It runs several networks at once in one JVM process, and a further network is a configuration rather than a new client. Ethereum Classic, the only Proof-of-Work EVM network in production, and Ethereum are among the networks it ships configured for.",
  why: [
    {
      heading: "Networks",
      body: "Ethereum Classic is the only Proof-of-Work EVM network in production, and Tyto is its native\nclient. Tyto also runs Ethereum mainnet and its testnets. Each network's fork schedule is\ntracked as part of running it.",
    },
    {
      heading: "One Binary",
      body: "Tyto can run several networks at the same time, in one process.\nEach network has its own state, its own metrics registry and its own configuration, and is\nsupervised separately.",
    },
    {
      heading: "Optional Capabilities",
      body: "Tyto is an execution client. Two capabilities are optional and configured per deployment rather\nthan assumed: it can run a consensus layer in the same binary, so one process is a complete\nProof-of-Stake node, and it can mine on Proof-of-Work. It also implements the Engine API, so an\nexternal consensus client can drive it instead of the built-in one.",
    },
    {
      heading: "Scala 3",
      body: "Scala 3's algebraic data types and exhaustive pattern matching make many consensus-critical\nmistakes impossible to express, so they are caught when the code is compiled rather than when a\nblock is processed.",
    },
    {
      heading: "JVM",
      body: "JFR, async-profiler, JMX and heap dumps work on Tyto the way they work on any other JVM process.\nThere is no foreign-language bridge between the client and the rest of your stack.",
    },
    {
      heading: "MCP Server",
      body: "Model Context Protocol is an open standard for exposing structured tools to AI agents. Tyto's MCP\nserver exposes node state, sync progress, peer counts and block data to any MCP-compatible agent,\nfor infrastructure automation, anomaly detection and runbook execution.",
    },
  ],
  mining:
    "Mining is a configured capability of the execution client rather than its identity. getWork and submitWork with\nshare verification before acknowledgement, ECIP-1099 seedHash/DAG-epoch handling, a mining-pool\ndeployment profile (SNAP-serving on, tip-server sync), and BitTorrent-based state distribution\nthat turns pools into snapshot seeders for the whole network.",
  energy:
    "Proof-of-Work mining is a relocatable, curtailable industrial load, so it can co-locate with\nstranded generation: remote hydro, flared wellhead gas, curtailed wind and solar, off-peak\nindustrial capacity, landfill gas, geothermal. These are properties of Proof-of-Work and of\nEthereum Classic rather than of any client; Tyto is the software run at those sites. The full\nargument is maintained at https://ethereumclassicdao.org/environmental-impact",
  regulated:
    "JVM-native infrastructure end to end, for institutions already running on the JVM: no FFI bridge,\nsigned container images with build provenance attestation and a CycloneDX SBOM, concurrent\nmulti-instance execution, and external-signer/HSM custody integration. The regulatory position of\nthe network itself is documented at https://ethereumclassicdao.org/regulation",
  consortium:
    "Consensus is selected per deployment behind one interface, so a permissioned network is a\nconfiguration rather than a separate product: QBFT, Clique Proof of Authority, and Bor-style\nproducer sets. A consortium chain and a public network can run in one process, each isolated.\nNormative references: https://entethalliance.org/specs/qbft/v1/ and\nhttps://entethalliance.github.io/client-spec/chainspec.html",
  configurable:
    "The same network-family framework also hosts, configurable per deployment: PoA consortium and\nprivate networks (Clique/Qbft/Bor-style), sidechains (Polygon/Bor-style), L2 rollups\n(OP-stack/Taiko-style), and ZK-EVM/alt-consensus families.",
  infrastructure:
    "A network needs more than clients that join it. Tyto runs the rest as roles of the same binary:\nbootnodes that answer discovery and publish the signed node records and DNS trees describing the\nnetwork, state serving so a joining node has a source, an RPC relay for applications that will not\nrun a node, plus dashboards and a faucet. Discovery is both consumed and served, which is what lets\na network be originated rather than only joined.",
  operations:
    "Separate Pekko dispatchers for sync, RPC and general work keep sync pressure from starving\nthe RPC. Configuration layers in\na fixed order: profile, then file, then environment, then command line. Observability is scoped to\nthe node instance rather than the process, so several networks in one process cannot report into\none set of counters. Prometheus metrics, Grafana dashboards, and liveness and readiness endpoints\nship in the binary. Storage keying, pruning and history retention are selected per role. A\ndRPC-Provider gRPC bridge and an RPC-relay deployment profile make Tyto a clean upstream for\naggregation gateways.",
  origin: [
    "Tyto alba is the barn owl. Its wing feathers carry a comb-like leading edge and a soft\ntrailing fringe that break up the turbulence a wingbeat would otherwise make, so it flies close to\nsilently. Its ear openings sit at different heights on its skull, which lets it place prey it has\nnever seen. The name is the method.",
  ],
};

/** Runtime-stack highlights, by collection id, plus the supply-chain claims. */
const STACK_HIGHLIGHTS: readonly [string, string][] = [
  ["language", ", kept current with each LTS patch release"],
  ["jdk", ""],
  ["actors", " (Apache Software Foundation, no BSL)"],
  ["storage", ", tracked to the latest stable release"],
  ["effects", ", the effect system"],
];

const SUPPLY_CHAIN = [
  "Signed build provenance: Cosign keyless signing on every release",
  "CycloneDX SBOM on all release artifacts",
];

export const GET: APIRoute = async () => {
  // getCollection() does not preserve source-file order, so sort on the declared
  // `order` field rather than relying on how the loader happened to read the JSON.
  const byOrder = <T extends { data: { order: number } }>(a: T, b: T) =>
    a.data.order - b.data.order;
  const networks = (await getCollection("networks")).sort(byOrder);
  const hardware = (await getCollection("hardware")).sort(byOrder);
  const stack = (await getCollection("stack")).sort(byOrder);

  const byId = new Map(stack.map((e) => [e.id, e.data]));
  // Quick Start leads with the Proof-of-Work production network, matching the guide.
  const powArg = networks.find((n) => n.data.primary && n.data.consensus.startsWith("PoW"))!.data
    .arg;
  // Running prose leads with the production networks. The Supported Networks list
  // below stays in collection order, which interleaves each family with its testnet.
  const chainList = [...networks]
    .sort((a, b) => Number(b.data.primary) - Number(a.data.primary) || a.data.order - b.data.order)
    .map((n) => `${n.data.shortName} (chain ${n.data.chainId})`)
    .join(", ")
    .replace(/, ([^,]*)$/, ", and $1");

  // Prose paragraphs are wrapped at 100 columns so the diff stays readable when
  // someone edits them. List items and the intro blockquote are deliberately not
  // wrapped: one line per route or per network is what makes them scannable, and
  // breaking a `- URL - summary` entry across lines would destroy that.
  const wrap = (text: string, width = 100) =>
    text
      .split(" ")
      .reduce((lines: string[], word) => {
        const last = lines[lines.length - 1];
        if (last && `${last} ${word}`.length <= width) lines[lines.length - 1] = `${last} ${word}`;
        else lines.push(word);
        return lines;
      }, [])
      .join("\n");

  const out = `# Tyto

> ${PROSE.intro}

${wrap(
  `Tyto is a Scala EVM execution client, maintained by ${ORGANIZATION.name}. One binary runs ${chainList} from a single deployment, each network fully isolated: its own state, its own metrics registry, its own config.`,
)}

## Why Tyto

${PROSE.why.map((s) => `### ${s.heading}\n\n${s.body}`).join("\n\n")}

## Mining Economy

${PROSE.mining}

## Energy

${PROSE.energy}

## Regulated Finance

${PROSE.regulated}

## Consortium and Permissioned Networks

${PROSE.consortium}

## Supported Networks

${networks.map((n) => `- ${n.data.name} (chain ${n.data.chainId}): ${n.data.summary}`).join("\n")}

${PROSE.configurable}

## Network Infrastructure

${PROSE.infrastructure}

## Runtime Stack

${STACK_HIGHLIGHTS.map(([id, note]) => {
  const e = byId.get(id);
  return e ? `- ${e.layer}: ${e.shortName ?? e.library}${note}` : "";
})
  .filter(Boolean)
  .join("\n")}
${SUPPLY_CHAIN.map((s) => `- ${s}`).join("\n")}

## Operations

${PROSE.operations}

## Node Requirements

${hardware.map((h) => `- ${h.data.item}: ${h.data.requirement}. ${h.data.note}`).join("\n")}

## Quick Start

    docker run ${CONTAINER_REF} ${networkFlag(powArg)}

## Web Properties

${ROUTES.map((r) => `- ${SITE_URL}${r.path === "/" ? "" : r.path} - ${r.summary}`).join("\n")}

## Links

Source:   ${REPO_URL}
Docker:   ${CONTAINER_URL}
Packages: ${PACKAGES_URL}
License:  ${LICENSE}

## Origin

${PROSE.origin.join("\n\n")}

## Organization

${ORGANIZATION.name}
`;

  return new Response(out, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
