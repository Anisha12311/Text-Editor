"use client";
import * as React from "react";

import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";

import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import CodeHighlightPlugin from "./CodeHeighlightPlugin";
import PlaygroundAutoLinkPlugin from "./AutoLinkPlugin";
import ListMaxIndentLevelPlugin from "./ListMaxIndentLevelPlugin";
import { Box } from "@mui/material";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { HashtagPlugin } from "@lexical/react/LexicalHashtagPlugin";

import MentionsPlugin from "./MentionsPlugin";

import dynamic from "next/dynamic";
import { EditorContainer, MainBox } from "../../../styles/MUI/alignitem.styled";
import ActionsPlugin from "./ActionPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import useCustomCommands from "../../../hooks/useCustomCommand";
import DragDropPaste from "./ImageDragDropPaste";

const SpeechToTextPlugin = dynamic(() => import("./SpeechToTextPlugin"), {
  ssr: false,
});
const ToolbarPlugin = dynamic(() => import("./ToolbarPlugin"), {ssr : false})
const TableCellResizerPlugin = dynamic(() => import ("./TableCellResizer"), {ssr : false})

function Placeholder() {
  return <div className="editor-placeholder">New Message</div>;
}

export const MainEditor = () => {
  const [editor] = useLexicalComposerContext();
  const { clearEditorContent } = useCustomCommands();
  const [isToolbar, setIsToolbar] = React.useState(false)

  // React.useEffect(() => {
  //   if (initialContent) {
  //     editor.update(() => {
  //       const parser = new DOMParser();
  //       const doc = parser.parseFromString(initialContent, "text/html");
  //       const nodes =  $generateNodesFromDOM(editor, doc);
  //       const root = $getRoot();
  //       root.clear();
  //       root.append(...nodes);
  //     });
      
  //   }
  //   else {
  //     editor.update(() => {
  //       const root = $getRoot();
  //       root.clear();
  //     });
  //   }


  // }, [initialContent, editor]);
  return (
    <MainBox>

      <EditorContainer>
     
       <ToolbarPlugin  />

        <TablePlugin />
      
        <Box className="editor-inner">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className={ "editor-input"} />
            }
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
       
          <AutoFocusPlugin />
          <CodeHighlightPlugin />
          <ListPlugin />
          <LinkPlugin />
          <PlaygroundAutoLinkPlugin />
          <ListMaxIndentLevelPlugin maxDepth={7} />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <HashtagPlugin />
           {/* {isMention &&  <MentionsPlugin
            profileColor={profileColor}
            suggestions={suggestions}
            mode={mode}
          />} */}
          
          <DragDropPaste/>
          <SpeechToTextPlugin />
          <TablePlugin />
          <TableCellResizerPlugin />
        </Box>
      </EditorContainer>
   
      
 
     
    

      {/* <TreeViewPlugin></TreeViewPlugin> */}
    </MainBox>
  );
};
