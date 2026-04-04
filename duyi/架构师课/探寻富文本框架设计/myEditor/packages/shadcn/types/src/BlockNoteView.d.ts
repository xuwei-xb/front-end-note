import { BlockSchema, InlineContentSchema, StyleSchema } from "@blocknote/core";
import { BlockNoteViewProps } from "@blocknote/react";
import { ShadCNComponents } from "./ShadCNComponentsContext.js";
export declare const BlockNoteView: <BSchema extends BlockSchema, ISchema extends InlineContentSchema, SSchema extends StyleSchema>(props: BlockNoteViewProps<BSchema, ISchema, SSchema> & {
    /**
     * (optional)Provide your own shadcn component overrides
     */
    shadCNComponents?: Partial<ShadCNComponents>;
}) => import("react/jsx-runtime.js").JSX.Element;
