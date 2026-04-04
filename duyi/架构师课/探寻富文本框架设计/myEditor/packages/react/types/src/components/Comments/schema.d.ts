import { BlockNoteSchema } from "@blocknote/core";
export declare const schema: BlockNoteSchema<import("@blocknote/core").BlockSchemaFromSpecs<{
    paragraph: {
        config: {
            type: "paragraph";
            content: "inline";
            propSchema: {};
        };
        implementation: import("@blocknote/core").TiptapBlockImplementation<{
            type: "paragraph";
            content: "inline";
            propSchema: {};
        }, any, import("@blocknote/core").InlineContentSchema, import("@blocknote/core").StyleSchema>;
    };
}>, import("@blocknote/core").InlineContentSchemaFromSpecs<{
    text: {
        config: "text";
        implementation: any;
    };
    link: {
        config: "link";
        implementation: any;
    };
}>, import("@blocknote/core").StyleSchemaFromSpecs<{
    bold: {
        config: {
            type: string;
            propSchema: "boolean";
        };
        implementation: import("@blocknote/core").StyleImplementation;
    };
    italic: {
        config: {
            type: string;
            propSchema: "boolean";
        };
        implementation: import("@blocknote/core").StyleImplementation;
    };
    underline: {
        config: {
            type: string;
            propSchema: "boolean";
        };
        implementation: import("@blocknote/core").StyleImplementation;
    };
    strike: {
        config: {
            type: string;
            propSchema: "boolean";
        };
        implementation: import("@blocknote/core").StyleImplementation;
    };
    code: {
        config: {
            type: string;
            propSchema: "boolean";
        };
        implementation: import("@blocknote/core").StyleImplementation;
    };
}>>;
