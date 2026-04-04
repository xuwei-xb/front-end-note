import type { Node } from "prosemirror-model";
import type { Transaction } from "prosemirror-state";
import { Block, DefaultBlockSchema, DefaultInlineContentSchema, DefaultStyleSchema } from "../blocks/defaultBlocks.js";
import type { BlockSchema } from "../schema/index.js";
import type { InlineContentSchema } from "../schema/inlineContent/types.js";
import type { StyleSchema } from "../schema/styles/types.js";
/**
 * Get a TipTap node by id
 */
export declare function getNodeById(id: string, doc: Node): {
    node: Node;
    posBeforeNode: number;
} | undefined;
export declare function isNodeBlock(node: Node): boolean;
/**
 * This attributes the changes to a specific source.
 */
export type BlockChangeSource = {
    /**
     * When an event is triggered by the local user, the source is "local".
     * This is the default source.
     */
    type: "local";
} | {
    /**
     * When an event is triggered by a paste operation, the source is "paste".
     */
    type: "paste";
} | {
    /**
     * When an event is triggered by a drop operation, the source is "drop".
     */
    type: "drop";
} | {
    /**
     * When an event is triggered by an undo or redo operation, the source is "undo" or "redo".
     * @note Y.js undo/redo are not differentiated.
     */
    type: "undo" | "redo" | "undo-redo";
} | {
    /**
     * When an event is triggered by a remote user, the source is "remote".
     */
    type: "yjs-remote";
};
export type BlocksChanged<BSchema extends BlockSchema = DefaultBlockSchema, ISchema extends InlineContentSchema = DefaultInlineContentSchema, SSchema extends StyleSchema = DefaultStyleSchema> = Array<{
    /**
     * The affected block.
     */
    block: Block<BSchema, ISchema, SSchema>;
    /**
     * The source of the change.
     */
    source: BlockChangeSource;
} & ({
    type: "insert" | "delete";
    /**
     * Insert and delete changes don't have a previous block.
     */
    prevBlock: undefined;
} | {
    type: "update";
    /**
     * The block before the update.
     */
    prevBlock: Block<BSchema, ISchema, SSchema>;
})>;
/**
 * Get the blocks that were changed by a transaction.
 * @param transaction The transaction to get the changes from.
 * @param editor The editor to get the changes from.
 * @returns The blocks that were changed by the transaction.
 */
export declare function getBlocksChangedByTransaction<BSchema extends BlockSchema = DefaultBlockSchema, ISchema extends InlineContentSchema = DefaultInlineContentSchema, SSchema extends StyleSchema = DefaultStyleSchema>(transaction: Transaction, appendedTransactions?: Transaction[]): BlocksChanged<BSchema, ISchema, SSchema>;
