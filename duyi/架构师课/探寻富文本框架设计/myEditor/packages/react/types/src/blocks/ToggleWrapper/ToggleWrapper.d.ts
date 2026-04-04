import { Block } from "@blocknote/core";
import { ReactNode } from "react";
import { ReactCustomBlockRenderProps } from "../../schema/ReactBlockSpec.js";
export declare const ToggleWrapper: (props: Omit<ReactCustomBlockRenderProps<any, any, any>, "contentRef"> & {
    children: ReactNode;
    toggledState?: {
        set: (block: Block<any, any, any>, isToggled: boolean) => void;
        get: (block: Block<any, any, any>) => boolean;
    };
}) => string | number | boolean | Iterable<ReactNode> | import("react/jsx-runtime").JSX.Element | null | undefined;
