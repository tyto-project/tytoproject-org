/**
 * Singleton project facts.
 *
 * A content collection is the wrong shape for these: a collection is a set of
 * entries, and these are one value each.
 *
 * ROUTES is the single source for the site's route list. NavHeader, FooterSection,
 * the 404 and the generated llms.txt all derive from it. They previously each
 * carried their own hand-maintained copy, four in total, which is how the nav came
 * to omit /stack and /architecture while the footer listed them.
 */

export const SITE_URL = "https://tytoproject.org";
export const DOCS_URL = "https://docs.tytoproject.org";

export const ORG_URL = "https://github.com/tyto-project";
export const REPO_URL = "https://github.com/tyto-project/tyto-cli";
export const RELEASES_URL = `${REPO_URL}/releases`;
export const PACKAGES_URL = `${REPO_URL}/packages`;
/**
 * Organization-level discussions, not the repository's. Discussion spans the whole
 * project rather than the client repo alone.
 *
 * Deliberately not derived: org-scoped GitHub URLs take the `/orgs/<name>/` form,
 * so neither `${REPO_URL}/discussions` (the repo's own tab) nor `${ORG_URL}/…`
 * (which lacks the `/orgs/` segment) produces it.
 */
export const DISCUSSIONS_URL = "https://github.com/orgs/tyto-project/discussions";
export const ISSUES_URL = `${REPO_URL}/issues`;
/**
 * GitHub's private vulnerability reporting form, which opens a draft advisory
 * visible only to the maintainers. The repository's SECURITY.md asks for
 * suspected vulnerabilities here and not on the public issue tracker, so
 * nothing on this site may point a security report at ISSUES_URL.
 */
export const SECURITY_URL = `${REPO_URL}/security/advisories/new`;
export const CONTAINER_URL = "https://ghcr.io/tyto-project/tyto-cli";
export const CONTAINER_REF = "ghcr.io/tyto-project/tyto-cli";

/**
 * The elevator pitch: what Tyto is, in one sentence.
 *
 * Used twice and defined once, because the two uses are the same job. It is the
 * default meta description for every page that does not set its own, and it is the
 * footer blurb. Kept under ~160 characters so a search result does not truncate it.
 *
 * Keep it to identity. Licensing, signing and the SBOM are real but belong to
 * /operations, /institutions and /stack; the footer states the license one line
 * below this anyway, so repeating it here only crowds the pitch.
 */
export const SITE_DESCRIPTION =
  "Tyto is a Scala execution client for the EVM ecosystem: several networks at once in one JVM process, and a further network is configuration, not a new client.";

/**
 * How a network is selected on the command line.
 *
 * Stated once so it cannot diverge. The site previously split between a bare
 * positional argument on the install pages and `--network=` on the operational
 * ones, which meant a reader who followed the guide could not copy-paste any
 * operational block.
 */
export const networkFlag = (arg: string): string => `--network=${arg}`;

export const LICENSE = "Apache 2.0";
/** Published Maven coordinates, which is what the `org.tyto` namespace resolves to. */
export const MAVEN_URL = "https://central.sonatype.com/search?q=g:org.tyto";

export interface OrganizationEntity {
  name: string;
  url: string;
}

/**
 * Maintainership, with a URL per entity so the footer can link each one and the
 * JSON-LD can assert it. `members` was a plain string list until the footer needed
 * to link them; prose that only lists the names uses MEMBER_NAMES below.
 */
export const ORGANIZATION = {
  name: "The Tyto Authors",
  /** Who "The Tyto Authors" resolves to. */
  url: "https://github.com/orgs/tyto-project/people",
} as const satisfies OrganizationEntity;

/** The attributed entity. One holder: the code is new and written by one party. */
export const ATTRIBUTION_ENTITIES: readonly OrganizationEntity[] = [
  { name: ORGANIZATION.name, url: ORGANIZATION.url },
];

/**
 * Footer grouping a route belongs to. The nav is a curated subset; the footer
 * carries all of them.
 *
 * `use` is the audience track: who a reader is and why they are here. The homepage
 * is the router for those, which is why none of them needs a nav slot.
 */
export type RouteGroup = "product" | "use" | "operate" | "meta";

export interface SiteRoute {
  path: string;
  /** Nav and footer label. */
  label: string;
  /** One line for the llms.txt "Web Properties" list. */
  summary: string;
  group: RouteGroup;
  /**
   * Show in the primary nav. The nav is deliberately a curated subset: it has room
   * for a handful of items, and the footer is where every route is reachable.
   */
  nav?: boolean;
}

/** Every indexable route. The single source for nav, footer, 404 and llms.txt. */
export const ROUTES: readonly SiteRoute[] = [
  { path: "/", label: "Home", summary: "Main site", group: "product" },
  {
    path: "/features",
    label: "Features",
    summary:
      "Capability surface: wire protocols, SNAP sync, Engine API, JSON-RPC, GraphQL, MCP server",
    group: "product",
    nav: true,
  },
  {
    path: "/architecture",
    label: "Architecture",
    summary:
      "The layer split read top to bottom, the module graph that enforces it, and why this stack fits the problem",
    group: "product",
    nav: true,
  },
  { path: "/stack", label: "Stack", summary: "Full dependency manifest", group: "product" },
  {
    path: "/networks",
    label: "Networks",
    summary:
      "The network-family framework: Proof-of-Work and Proof-of-Stake families, the configured presets, and the consensus-module seam",
    group: "product",
    nav: true,
  },
  {
    path: "/energy",
    label: "Energy",
    summary:
      "Proof-of-Work as energy infrastructure: programmable demand, stranded energy sites, and grid roles",
    group: "use",
  },
  {
    path: "/institutions",
    label: "Institutions",
    summary:
      "Regulated finance: decentralization as computational evidence, settlement finality, and JVM-native deployment",
    group: "use",
  },
  {
    path: "/consortium",
    label: "Consortium",
    summary: "Permissioned and private networks: QBFT, permissioning, and per-deployment consensus",
    group: "use",
  },
  {
    path: "/infrastructure",
    label: "Infrastructure",
    summary:
      "Running network infrastructure: bootnodes, testnet origination, faucet, RPC relay and dashboards, from the same binary",
    group: "use",
  },
  {
    path: "/guide",
    label: "Quick Start",
    summary:
      "Installation guide: platform distributions, Docker or build from source, then running any configured network from one binary",
    group: "operate",
    nav: true,
  },
  {
    path: "/mining",
    label: "Mining",
    summary:
      "Running Tyto as a mining-pool node: getWork and submitWork, ECIP-1099 epochs, and the pool deployment profile",
    group: "operate",
  },
  {
    path: "/staking",
    label: "Staking",
    summary:
      "Running Tyto on a Proof-of-Stake network: the built-in consensus layer, and pairing an external consensus client over the Engine API instead",
    group: "operate",
  },
  {
    path: "/operations",
    label: "Operations",
    summary:
      "Running Tyto in production: archive nodes, service deployment, monitoring, and the supply-chain posture",
    group: "operate",
  },
  {
    path: "/about",
    label: "About",
    summary:
      "Who maintains Tyto, how it is licensed, where the name comes from, and how to contribute",
    group: "meta",
    nav: true,
  },
] as const;

/** Routes in one footer column, in ROUTES order. */
export function routesInGroup(group: RouteGroup): readonly SiteRoute[] {
  return ROUTES.filter((route) => route.group === group);
}

/** The curated nav subset, in ROUTES order. */
export const NAV_ROUTES: readonly SiteRoute[] = ROUTES.filter((route) => route.nav);

export interface ExternalLink {
  label: string;
  href: string;
}

/** Off-site destinations. Not routes, so they are not in ROUTES. */
export const EXTERNAL_LINKS = {
  download: { label: "Download", href: RELEASES_URL },
  docs: { label: "Documentation", href: DOCS_URL },
  github: { label: "GitHub", href: REPO_URL },
  docker: { label: "Docker", href: CONTAINER_URL },
} as const satisfies Record<string, ExternalLink>;
