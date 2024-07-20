"use client";
import * as React from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback, useEffect, useRef, useState } from "react";
import Divider from "@mui/material/Divider";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatColorTextIcon from "@mui/icons-material/FormatColorText";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import NotesIcon from '@mui/icons-material/Notes';

import FormatListNumberedOutlinedIcon from "@mui/icons-material/FormatListNumberedOutlined";
import {
  SELECTION_CHANGE_COMMAND,
  FORMAT_TEXT_COMMAND,
  $getSelection,
  $isRangeSelection,
  $createTextNode,
  $getNodeByKey,
  $createParagraphNode,
} from "lexical";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { $isAtNodeEnd, $wrapNodes } from "@lexical/selection";
import { mergeRegister } from "@lexical/utils";
import SubscriptIcon from "@mui/icons-material/Subscript";
import SuperscriptIcon from "@mui/icons-material/Superscript";
import { createPortal } from "react-dom";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import { createCommand } from "lexical";
import { Box, Tooltip } from "@mui/material";
import {  IconButtons } from "../../../styles/MUI/alignitem.styled";
import { $createCodeNode } from "@lexical/code";
import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import AlignMenu from "../../../common/AlignItems";
import useEditorToolbar from "../../../hooks/useEditorToolbar";
import {
  ToolBar,
  getActiveBtnStyle,
} from "../../../styles/MUI/alignitem.styled";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import ColorPicker from "../../../common/ColorPicker";
import useColorPicker from "../../../hooks/useColorPicker";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";

import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND
} from "@lexical/list";
import { $createQuoteNode } from "@lexical/rich-text";
import {
  $isCodeNode,
  getCodeLanguages,
  getDefaultCodeLanguage,
} from "@lexical/code";
import CodeMenu from "../../../common/Codemenu";
import { FormatButtonProps } from "@/interfaces/alignitem.interface";
import MoreItems from "../../../common/MoreItem";
import DeleteContent from "../../../common/DeleteContent";
import EditIcon from '@mui/icons-material/Edit';
const LowPriority = 1;

const ADD_EMOJI_COMMAND = createCommand();
const ADD_TEXTCOLOR_COMMAND = createCommand();

function positionEditorElement(editor: any, rect: any) {
  if (rect === null) {
    editor.style.opacity = "0";
    editor.style.top = "-1000px";
    editor.style.left = "-1000px";
  } else {
    editor.style.opacity = "1";
    editor.style.top = `${rect.top + rect.height + window.pageYOffset + 10}px`;
    editor.style.left = `${
      rect.left + window.pageXOffset - editor.offsetWidth / 2 + rect.width / 2
    }px`;
  }
}

function FloatingLinkEditor({ editor }: any) {
  const editorRef = useRef(null);
  const inputRef = useRef(null);
  const mouseDownRef = useRef(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [isEditMode, setEditMode] = useState(false);
  const [lastSelection, setLastSelection] = useState(null);

  const updateLinkEditor = useCallback(() => {
    const selection: any = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent)) {
        setLinkUrl(parent.getURL());
      } else if ($isLinkNode(node)) {
        setLinkUrl(node.getURL());
      } else {
        setLinkUrl("");
      }
    }
    const editorElem = editorRef.current;
    const nativeSelection: any = window.getSelection();
    const activeElement = document.activeElement;

    if (editorElem === null) {
      return;
    }

    const rootElement = editor.getRootElement();
    if (
      selection !== null &&
      !nativeSelection.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      const domRange = nativeSelection.getRangeAt(0);
      let rect;
      if (nativeSelection.anchorNode === rootElement) {
        let inner = rootElement;
        while (inner.firstElementChild != null) {
          inner = inner.firstElementChild;
        }
        rect = inner.getBoundingClientRect();
      } else {
        rect = domRange.getBoundingClientRect();
      }

      if (!mouseDownRef.current) {
        positionEditorElement(editorElem, rect);
      }
      setLastSelection(selection);
    } else if (!activeElement || activeElement.className !== "link-input") {
      positionEditorElement(editorElem, null);
      setLastSelection(null);
      setEditMode(false);
      setLinkUrl("");
    }

    return true;
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }: any) => {
        editorState.read(() => {
          updateLinkEditor();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateLinkEditor();
          return true;
        },
        LowPriority
      )
    );
  }, [editor, updateLinkEditor]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      updateLinkEditor();
    });
  }, [editor, updateLinkEditor]);

  return (
    <div ref={editorRef} className="link-editor">
      {isEditMode ? (
        <input
          ref={inputRef}
          className="link-input"
          value={linkUrl}
          onChange={(event) => {
            setLinkUrl(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              if (lastSelection !== null) {
                if (linkUrl !== "") {
                  editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
                }
                setEditMode(false);
              }
            } else if (event.key === "Escape") {
              event.preventDefault();
              setEditMode(false);
            }
          }}
        />
      ) : (
        <>
          <div className="link-input">
            <a href={linkUrl} target="_blank" rel="noopener noreferrer">
              {linkUrl}
            </a>
            <div
              className="link-edit"
              role="button"
              tabIndex={0}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                setEditMode(true);
              }}
            > <EditIcon/></div>
          </div>
        </>
      )}
    </div>
  );
}

function getSelectedNode(selection: any) {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
  }
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [isLink, setIsLink] = useState(false);
  const { onFontColorSelect, onBgColorSelect } = useColorPicker();
  const [selectedElementKey, setSelectedElementKey] = useState(null);
  const codeLanguges = React.useMemo(() => getCodeLanguages(), []);
  const [codeLanguage, setCodeLanguage] = useState("");
  console.log("code language", codeLanguage)
  const [activeStates, setActiveStates] = useState({
    bulletedList: false,
    numberedList: false,
    subscript: false,
    superscript: false,
    quote: false,
    codeBlock: false,
    insertLink : false
  });

  const toggleActiveState = (key:any) => {
    setActiveStates((prevState:any) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const handleBulletedListClick = () => {
    setActiveStates((prevState) => {
      const newActiveStates = {
        ...prevState,
        bulletedList: !prevState.bulletedList,
      };
      if (newActiveStates.bulletedList ) {
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
      } else {
        editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
      }
      return newActiveStates;
    });
  };

  const handleNumberedListClick = () => {
    setActiveStates((prevState) => {
      const newActiveStates = {
        ...prevState,
        numberedList: !prevState.numberedList,
      };
      if (newActiveStates.numberedList ) {
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
      } else {
        editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
      }
      return newActiveStates;
    });
  };


  const updateToolbar = useCallback(() => {
    const selection: any = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }

      if ($isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode();
        const element =
          anchorNode.getKey() === "root"
            ? anchorNode
            : anchorNode.getTopLevelElementOrThrow();
        const elementKey: any = element.getKey();
        const elementDOM = editor.getElementByKey(elementKey);
        if (elementDOM !== null) {
          setSelectedElementKey(elementKey);
          if ($isCodeNode(element)) {
            console.log("setlanugage", element.getLanguage())
            setCodeLanguage(element.getLanguage() || getDefaultCodeLanguage());
          }
        }
      }
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
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
      ),
      editor.registerCommand(
        ADD_TEXTCOLOR_COMMAND,
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

  const insertLink = useCallback(() => {
    toggleActiveState("insertLink")
    if (!isLink) {
      console.log("islink", isLink);
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://");
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  const { hasFormat, blockTypes } = useEditorToolbar();
  const formatQuote = () => {
    toggleActiveState("quote")
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            $wrapNodes(selection, () => $createQuoteNode());
      }
    });
  };

  const onCodeLanguageSelect = ( option: any) => {
    console.log("option cahnge", option, )
    editor.update(() => {
      if (selectedElementKey !== null) {
        const node = $getNodeByKey(selectedElementKey);
        if ($isCodeNode(node)) {
          node.setLanguage(option);
        }
      }
    });
  };

  const formatCode = () => {
    toggleActiveState("codeBlock")
    editor.update(() => {
      let selection = $getSelection();

      if ($isRangeSelection(selection)) {
        if (selection?.isCollapsed()) {
          $wrapNodes(selection, () => $createCodeNode());
        } else {
          const textContent: any = selection?.getTextContent();
          const codeNode = $createCodeNode();
          selection?.insertNodes([codeNode]);
          selection = $getSelection();
          if ($isRangeSelection(selection))
            selection.insertRawText(textContent);
        }
      }
    });
  };

  const formatButtons: FormatButtonProps[] = [
    {
      title: "Bold (Ctrl + B)",
      icon: FormatBoldIcon,
      active: hasFormat.bold,
      onClick: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold"),
    },
    {
      title: "Italic (Ctrl + I)",
      icon: FormatItalicIcon,
      active: hasFormat.italic,
      onClick: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic"),
    },
    {
      title: "Underline (Ctrl + U)",
      icon: FormatUnderlinedIcon,
      active: hasFormat.underline,
      onClick: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline"),
    },
    {
      title: "Strikethrough",
      icon: StrikethroughSIcon,
      active: hasFormat.strikethrough,
      onClick: () =>
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough"),
    },
    {
      title: "Insert link",
      icon: InsertLinkIcon,
      active: activeStates.insertLink,
      onClick: insertLink,
    },
    { isDivider: true },
    {
      title: "Bulleted list",
      icon: FormatListBulletedIcon,
      active:  activeStates.bulletedList,
      onClick: () =>handleBulletedListClick()
        
    },
    {
      title: "Numbered list",
      icon: FormatListNumberedOutlinedIcon,
      active: activeStates.numberedList,
      onClick: () =>handleNumberedListClick()
    },
    {
      title: "Subscript",
      icon: SubscriptIcon,
      active: activeStates.subscript, // Adjust according to your application's state
      onClick: () => {
        toggleActiveState("subscript")
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript")}
    },
    {
      title: "Superscript",
      icon: SuperscriptIcon,
      active: hasFormat.superscript,
      onClick: () =>  editor.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript")
    },

    {
      title: "Quote",
      icon: FormatQuoteIcon,
      active: activeStates.quote, 
      onClick: formatQuote,
    },
    {
      title: "Code block",
      icon: CodeOutlinedIcon,
      active: activeStates.codeBlock, // Adjust according to your application's state
      onClick: formatCode,
    },
  ];
  const formatParagraph = () => {
    
        editor.update(() => {
            const selection = $getSelection();
            if (
                $isRangeSelection(selection) 
              
            )
                $wrapNodes(selection, () => $createParagraphNode());
        });
    
};
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" , background : '#3f3f3f', padding : '20px 13px 13px 13px'}}>
      <ToolBar ref={toolbarRef}>
        {blockTypes !== "code" && (
          <Box sx={{ display: "flex", marginLeft : '-2px' }}>
            {formatButtons.map((button, index) =>
              button.isDivider ? (
                <Divider
                  key={index}
                  orientation="vertical"
                  flexItem
                  sx={{ marginRight: "0px", backgroundColor :  '#4d4848', mt : '5px',mb: '5px' }}
                />
              ) : (
                <Tooltip key={index} title={button.title!}>
                  <IconButtons
                    size="small"
                    sx={getActiveBtnStyle( button.active!)}
                    onClick={button.onClick!}
                  >
                    <button.icon sx={{ width:  "20px", height :  "20px", color :  'white',  }} />
                  </IconButtons>
                </Tooltip>
              )
            )
            
            }

            {isLink &&
              createPortal(
                <FloatingLinkEditor editor={editor} />,
                document.body
              )}
            <Divider
              orientation="vertical"
              flexItem
              sx={{ marginRight: "5px", backgroundColor :  '#4d4848' ,mt : '5px',mb: '5px' }}
            />
            <AlignMenu  />
            <Divider orientation="vertical" flexItem  sx = {{ backgroundColor :  '#4d4848',mt : '5px',mb: '5px'}}/>

            <ColorPicker
              key="color-picker"
              title="Font color"
              onChange={(color: any) => onFontColorSelect(color)}
              icon={
                <FormatColorTextIcon
                  sx={{ width:  "20px" ,height :  '20px',color :  'white',marginTop : '3px'}}
                />
              }
            />

            <ColorPicker
              key="bg-color-picker"
              title="Background color"
              onChange={(color: any) => onBgColorSelect(color)}
              icon={
                <FormatColorFillIcon
                  sx={{ width:  "20px", height :  '20px' , color :  'white', marginTop : '3px'}}
                />
              }
            />

            <Tooltip title="Highlight">
              <IconButtons
                size="small"
                sx={getActiveBtnStyle( hasFormat.highlight)}
                onClick={() => {
                  setIsLink(true);
                  editor.dispatchCommand(FORMAT_TEXT_COMMAND, "highlight");
                }}
              >
                <BorderColorIcon sx={{width:  "20px", height :  '20px',color :  'white'}} />
              </IconButtons>
            </Tooltip>

            <Divider
              orientation="vertical"
              flexItem
              sx={{ marginRight: "5px", backgroundColor :  '#4d4848',mt : '5px',mb: '5px' }}
            />
            <MoreItems  />
          </Box>
        )}
        {blockTypes === "code" && (
          <>
            <CodeMenu onChange={onCodeLanguageSelect} options={codeLanguges} />
            <Divider
                 
                  orientation="vertical"
                  flexItem
                  sx={{ marginRight: "0px" , backgroundColor :  '#4d4848',mt : '5px',mb: '5px'}}
                />
           <IconButtons sx = {{borderRadius : '0'}} onClick = {formatParagraph}>
           <NotesIcon sx = {{width : '20px', color :  'white'}}/> <Box sx = {{marginLeft : '8px', fontSize:'17px', color :  'white'}}>Normal</Box>
           </IconButtons>

          </>
        )}
      </ToolBar>
      <DeleteContent  />
    </Box>
  );
}
