"use client";
import * as React from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { SPEECH_TO_TEXT_COMMAND } from "./SpeechToTextPlugin";
import { Box, ClickAwayListener, Popper } from "@mui/material";
import {
  $createTextNode,
  $getSelection,
  $isRangeSelection,
  createCommand,
} from "lexical";
import { mergeRegister } from "@lexical/utils";
import { AddReactionOutlined, FormatColorText } from "@mui/icons-material";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data/sets/14/google.json";
import MicIcon from "@mui/icons-material/Mic";
import { useState, useEffect } from "react";
import {  IconButtons } from "@/styles/MUI/alignitem.styled";

const ADD_EMOJI_COMMAND = createCommand();
const LowPriority = 1;

const ActionsPlugin: React.FC = () => {
  const [editor] = useLexicalComposerContext();
  const [anchorEls, setAnchorEl] = useState<HTMLElement | null>(null);
  const [opens, setOpens] = useState(false);
  const [isSpeechToText, setIsSpeechToText] = useState(false);
  const [emojiMetadata, setEmojiMetadata] = useState({} as any);
  const handlemic = () => {
    setIsSpeechToText((prev) => {
      editor.dispatchCommand(SPEECH_TO_TEXT_COMMAND, !prev);
      return !prev;
    });
  };
  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        ADD_EMOJI_COMMAND,
        (payload: any) => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            selection.insertNodes([$createTextNode(payload)]);
          }
          return true;
        },
        LowPriority
      )
    );
  }, [editor]);


  const handleEmojiSelect = (e: { native: string; id: string }) => {
    const metadata: any = { ...emojiMetadata };
    const selector: string = e.native;
    editor.dispatchCommand(ADD_EMOJI_COMMAND, selector);

    metadata[selector] = `:${e.id}: `;
    setEmojiMetadata(metadata);
    setOpens(false)
  };

  const CustomPicker = () => {
    return (
      <ClickAwayListener
        onClickAway={() => {
          setOpens(false);
        }}
      >
        <Popper
          id="basic-menu"
          anchorEl={anchorEls}
          open={opens}
          placement={"top"}
          sx={{
            zIndex: 1302,
            padding: 0,
            "& .MuiMenu-list": { padding: 0 },
            overflow: "hidden",
            "& .MuiPaper-root": { borderRadius: "10px", overflow: "hidden" },
          }}
        >
          <Picker
            data={data}
            set="google"
            theme={"light"}
            icons="solid"
            autoFocus={false}
            dynamicWidth={false}
            navPosition="bottom"
            previewPosition="none"
            skinTonePosition="none"
            onEmojiSelect={handleEmojiSelect}
          />
        </Popper>
      </ClickAwayListener>
    );
  };
  return (
    <>
      <Box style={{ width: "100%",height : '15%', background : '#3f3f3f' }} >
        <CustomPicker />
          <Box sx = {{padding : '13px'}}>
            <IconButtons
              aria-label="Reaction"
            >
              <FormatColorText     sx = {{color : 'white'}}/>
            </IconButtons>

            <IconButtons
              onClick={(event) => {
                setOpens(!opens);
                setAnchorEl(event.currentTarget);
              }}
            >
              <AddReactionOutlined     sx = {{color : 'white'}}/>
            </IconButtons>

            <IconButtons
              onClick={() => {
                handlemic();
              }}
              className={
                isSpeechToText ? "slow-motion-ripple active pulse" : ""
              }
            >
              <MicIcon      sx = {{color : 'white'}}/>
            </IconButtons>
          </Box>
      </Box>
    </>
  );
};
export default ActionsPlugin;
