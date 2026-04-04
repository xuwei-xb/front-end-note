export declare const Toolbar: import("react").ForwardRefExoticComponent<{
    className?: string;
    children?: import("react").ReactNode;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    variant?: "default" | "action-toolbar";
} & import("react").RefAttributes<HTMLDivElement>>;
export declare const ToolbarButton: import("react").ForwardRefExoticComponent<({
    className?: string;
    mainTooltip?: string;
    secondaryTooltip?: string;
    icon?: import("react").ReactNode;
    onClick?: (e: import("react").MouseEvent) => void;
    isSelected?: boolean;
    isDisabled?: boolean;
    variant?: "default" | "compact";
} & ({
    children: import("react").ReactNode;
    label?: string;
} | {
    children?: undefined;
    label: string;
})) & import("react").RefAttributes<HTMLButtonElement>>;
export declare const ToolbarSelect: import("react").ForwardRefExoticComponent<{
    className?: string;
    items: {
        text: string;
        icon: import("react").ReactNode;
        onClick: () => void;
        isSelected: boolean;
        isDisabled?: boolean;
    }[];
    isDisabled?: boolean;
} & import("react").RefAttributes<HTMLDivElement>>;
