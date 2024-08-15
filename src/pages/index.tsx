"use client";

import * as React from "react";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import "katex/dist/katex.css";

import { SharedAutocompleteContext } from "../src/context/SharedAutocompleteContext";
import { SharedHistoryContext } from "../src/context/SharedHistoryContext";
import dynamic from "next/dynamic";
const Editor = dynamic(() => import("../src/Editor"), {
  ssr: false,
});
import PlaygroundNodes from "../src/nodes/PlaygroundNodes";

import { TableContext } from "../src/plugins/TablePlugin";

import PlaygroundEditorTheme from "../src/themes/PlaygroundEditorTheme";
import { FlashMessageContext } from "../src/context/FlashMessageContext";
import { Box } from "@mui/material";
import Image from "next/image";
import img from "../images/text.png";
export interface VTextEditorProps {
  handleHtmlStringChange: (data: any) => void;
  initialContent?: string;
  clearEditor: boolean;
}
const LexicalEditor = ({
  handleHtmlStringChange,
  initialContent,
  clearEditor,
}: VTextEditorProps) => {
  const initialConfig: any = {
    nodes: [...PlaygroundNodes],
    onError: (error: Error) => {
      throw error;
    },
    theme: PlaygroundEditorTheme,
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100vh",
        backgroundColor: "#3586ff",
        overflow: "hidden",
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            zIndex: "9999",
            width: "100%",
            height: "70px",
            position: "fixed",
            top: 0,
            background: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow:
              "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
          }}
        >
        
          <Box className="textimage"></Box>
          <Box className="texteditor1">ext Editor</Box>
        </Box>
        <Box
          sx={{
            justifyContent: "center",
            display: "flex",
            alignItems: "center",
          }}
        >
          {" "}
          <FlashMessageContext>
            <LexicalComposer initialConfig={initialConfig}>
              <SharedHistoryContext>
                <TableContext>
                  <SharedAutocompleteContext>
                    <div className="editor-shell">
                      <Editor
                        initialContent={initialContent}
                        handleHtmlStringChange={handleHtmlStringChange}
                        clearEditor={clearEditor}
                      />
                    </div>
                  </SharedAutocompleteContext>
                </TableContext>
              </SharedHistoryContext>
            </LexicalComposer>
          </FlashMessageContext>
        </Box>
      </Box>
      <Box className="wave wave1"></Box>
      <Box className="wave wave2"></Box>
      <Box className="wave wave3"></Box>
      <Box className="wave wave4"></Box>
    </Box>
  );
};

export default LexicalEditor;
