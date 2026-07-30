import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { file } from "astro/loaders";

/**
 * Facts that appear in more than one place get a schema and a single source.
 *
 * These three were chosen because they were already duplicated and had already
 * started to drift: chain IDs lived in NetworksSection, QuickStartSection and
 * llms.txt; node requirements in QuickStartSection and llms.txt; the dependency
 * manifest in stack.astro and llms.txt.
 *
 * Prose stays in its component. A schema buys nothing for a paragraph rendered
 * once, and moving it away from its markup makes both harder to read.
 */

const networks = defineCollection({
  loader: file("src/content/networks.json"),
  schema: z.object({
    name: z.string(),
    chainId: z.number().int().positive(),
    /** The CLI argument that selects this network. */
    arg: z.string(),
    /** Groups the network under a consensus family in the UI. */
    family: z.string(),
    /** Short consensus label for table cells. */
    consensus: z.string(),
    tags: z.array(z.string()),
    /** Display order. getCollection() does not preserve source-file order. */
    order: z.number().int(),
    /** Prose form used in running text, e.g. "Mordor testnet". */
    shortName: z.string(),
    /** Flags the production network within its family, versus its testnet. */
    primary: z.boolean(),
    /** One-line description used by the llms.txt summary. */
    summary: z.string(),
  }),
});

const hardware = defineCollection({
  loader: file("src/content/hardware.json"),
  schema: z.object({
    /** The dimension being specified: Java, Memory, Disk space, Disk type, CPU. */
    item: z.string(),
    requirement: z.string(),
    /** What actually drives the number, which is more useful than the number. */
    note: z.string(),
    /** Display order. getCollection() does not preserve source-file order. */
    order: z.number().int(),
  }),
});

const stack = defineCollection({
  loader: file("src/content/stack.json"),
  schema: z.object({
    layer: z.string(),
    library: z.string(),
    /** Update policy for this dependency, not a pinned version. */
    track: z.string(),
    /** Display order. getCollection() does not preserve source-file order. */
    order: z.number().int(),
    /** Condensed label for the llms.txt highlight list. */
    shortName: z.string().optional(),
  }),
});

export const collections = { networks, hardware, stack };
