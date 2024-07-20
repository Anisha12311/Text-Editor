"use client";
import * as React from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { Box } from "@mui/material";
import { HashtagNode } from "@lexical/hashtag";
import Theme from "../../styles/Theme";
import { MentionNode } from "./node/MentionNode";
import { MainEditor } from "./plugins/MainEditor";
import { ImageNode } from "./node/ImageNode";
import { Container } from "@/styles/MUI/alignitem.styled";
import ActionsPlugin from "./plugins/ActionPlugin";

const editorConfig: any = {
  onError(error: any) {
    throw error;
  },

  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode,
    HashtagNode,
    MentionNode,
    ImageNode
  ],

};
export interface VTextEditorProps   {
  TopToolbar : boolean,
  handleHtmlStringChange :(data:any) => void,
  ClearEditor ?:boolean,
  profileColor ?:any,
  suggestions ?:any,
  mode ?:boolean,
  theme ?: any,
  IconHeight ?:string,
  IconWidth ?: string,
  isMobile? : boolean
  activeMic?:boolean,
 open?:boolean,
 anchorEl?:HTMLElement | null,
 setOpen?:any
 showTextEditorOptions? : boolean,
 isMention:boolean,
 showFooter?:boolean,
 handlePastedFiles?:(files : any)=> void,
 initialContent?: string
}
export  const RichTextEditor = () => {
  // const currentMode = mode ? "dark" : "light";
  return (
    <Container>

      <LexicalComposer
        initialConfig={{ ...editorConfig, theme: Theme}}
        
      >
          
        <MainEditor/>


        <ActionsPlugin/>
      </LexicalComposer>

    </Container>
  );
};
