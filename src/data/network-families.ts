/**
 * Presentation for each consensus family.
 *
 * The networks collection carries the facts (name, chainId, arg, family). This
 * carries how a family is labeled and colored, shared by the /networks
 * NetworksSection and the guide's run step so the two cannot drift.
 *
 * Only the header metadata is shared. The two components render different column
 * bodies -- network rows versus run instructions -- so the markup stays local.
 */

export interface NetworkFamilyStyle {
  /** Full consensus description, shown as the column eyebrow. */
  consensus: string;
  /** Short pill text. */
  badgeLabel: string;
  /** Design-system badge variant. */
  badgeClass: string;
  /** Modifier class that sets --family-accent on the column root. */
  modifier: string;
}

const FAMILY_STYLE: Record<string, NetworkFamilyStyle> = {
  "Ethereum Classic": {
    consensus: "Proof-of-Work / ETChash",
    badgeLabel: "PoW",
    badgeClass: "badge-ty badge-green",
    modifier: "family--pow",
  },
  Ethereum: {
    consensus: "Proof-of-Stake / Engine API",
    badgeLabel: "PoS",
    badgeClass: "badge-ty badge-violet",
    modifier: "family--pos",
  },
};

/**
 * Neutral fallback for a family with no entry above.
 *
 * The previous lookup used a non-null assertion, so adding a third family to
 * networks.json would spread `undefined` and fail the build rather than degrade.
 */
const FALLBACK: NetworkFamilyStyle = {
  consensus: "Configurable consensus",
  badgeLabel: "EVM",
  badgeClass: "badge-ty",
  modifier: "family--default",
};

export function familyStyle(family: string): NetworkFamilyStyle {
  return FAMILY_STYLE[family] ?? FALLBACK;
}

export interface NetworkFamily<T> extends NetworkFamilyStyle {
  family: string;
  networks: T[];
}

/**
 * Groups collection entries by family, preserving the order in which families
 * first appear. Callers sort by the collection's `order` field first, which puts
 * Proof-of-Work in the left column.
 */
export function groupByFamily<T extends { family: string }>(networks: T[]): NetworkFamily<T>[] {
  return [...new Set(networks.map((n) => n.family))].map((family) => ({
    family,
    ...familyStyle(family),
    networks: networks.filter((n) => n.family === family),
  }));
}
