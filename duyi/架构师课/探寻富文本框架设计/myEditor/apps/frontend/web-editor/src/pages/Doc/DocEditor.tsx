import { createReactInlineContentSpec, SuggestionMenuController, useCreateBlockNote, type DefaultReactSuggestionItem } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import { zh } from "@blocknote/core/locales";
import { BlockNoteEditor, BlockNoteSchema, defaultBlockSpecs, defaultInlineContentSpecs, defaultStyleSpecs, filterSuggestionItems, type DefaultSuggestionItem } from "@blocknote/core";

const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs
  },
  inlineContentSpecs: {
    ...defaultInlineContentSpecs,
    mention: createReactInlineContentSpec(
      {
        type: "mention",
        content: "none",
        propSchema: {
          id: {
            default: ""
          },
          name: {
            default: ""
          }
        }
      },
      {
        render: props => { 
          const { id } = props.inlineContent.props;
          return <span className="text-blue-500 bg-amber-200">@{ id }</span>
        }
      }
    )
  },
  styleSpecs: {
    ...defaultStyleSpecs
  }
});

export function DocEditor() {
  const editor = useCreateBlockNote({
    schema,
    dictionary: zh,
    initialContent: [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "这是初始化的一个段落测试..."
          },
          {
            type: "mention",
            props: {
              id: "User123",
              name: "John Doe"
            }
          }
        ]
      }
    ]
  });


  const getMentionUserItems = (e: typeof editor) => { 
    const userItems: DefaultReactSuggestionItem[] = [
      {
        icon: <span>👤</span>,
        title: "User123",
        onItemClick: () => { 
          e.insertInlineContent([
            {
              type: "mention",
              props: {
                id: "User123",
                name: "John Doe"
              }
            }
          ])
        }
      },
      {
        icon: <span>👤</span>,
        title: "User456",
        onItemClick: () => { 
          e.insertInlineContent([
            {
              type: "mention",
              props: {
                id: "User456",
                name: "Jane Smith"
              }
            }
          ])
        }
      }
    ]

    return userItems
  }


  return (
    <>
      <BlockNoteView editor={editor} className="h-full" >
        <SuggestionMenuController
          triggerCharacter="@"
          getItems={async query => { 
            return filterSuggestionItems(getMentionUserItems(editor), query)
          }}
        />
      </BlockNoteView>
    </>
  );
}
