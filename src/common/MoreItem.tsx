import * as React from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {
  Box,
  Dialog,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Popover,
  Tooltip,
} from "@mui/material";
import { useState, useRef } from "react";
import { FormatMoreItems } from "@/interfaces/alignitem.interface";
import FormatTextdirectionLToROutlinedIcon from "@mui/icons-material/FormatTextdirectionLToROutlined";
import BlockFormat from "./BlockFormat";
import useEditorToolbar from "../hooks/useEditorToolbar";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { REDO_COMMAND, UNDO_COMMAND } from "lexical";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import FormatClearIcon from "@mui/icons-material/FormatClear";
import { $getRoot } from "lexical";
import ArrowRightOutlinedIcon from "@mui/icons-material/ArrowRightOutlined";
import * as marked from "marked";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import {  TableView } from "@mui/icons-material";

import { InsertTableDialog } from "../components/TextEditor/plugins/TablePlugin";
import { IconButtons } from "@/styles/MUI/alignitem.styled";

const MoreItems = () => {
  const [editor] = useLexicalComposerContext();
  const fileInputRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [nestedAnchorEl, setNestedAnchorEl] = useState(null);
  const [showInsertTable, setShowInsertTable] = useState(false);





  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
    setNestedAnchorEl(null);
  };
  const handleNestedClick = (event: any) => {
    console.log("clicks");
    setNestedAnchorEl(event.currentTarget);
  };

  const { blockTypes } = useEditorToolbar();
  const { clearFormatting } = useEditorToolbar();
  const handleFormat = () => {
    console.log("click text");
    clearFormatting();
  };
  const hanldleExport = () => {
    console.log("download");
    editor.update(() => {
      const htmlString = $generateHtmlFromNodes(editor, null);
      downloadHTMLFile(
        htmlString,
        `VTextEditor_${new Date().toISOString()}.html`
      );
    });
  };

  const downloadHTMLFile = (htmlString: string, fileName: string) => {
    const blob = new Blob([htmlString], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importHTML = (htmlString: any) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    editor.update(() => {
      const nodes = $generateNodesFromDOM(editor, doc);
      const root = $getRoot();
      root.clear();
      root.append(...nodes);
    });
  };

  const importMarkdown = (markdownContent: any) => {
    const htmlContent = marked.parse(markdownContent);
    importHTML(htmlContent);
  };

  const handleFileSelect = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const fileContent = e.target.result;
        if (file.name.endsWith(".html")) {
          importHTML(fileContent);
        } else if (file.name.endsWith(".md")) {
          importMarkdown(fileContent);
        } else {
          console.error("Unsupported file type");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleFileSelects = () => {
    if (fileInputRef.current) {
      (fileInputRef.current as HTMLInputElement).click();
    }
  };


  const FormatMoreItem: FormatMoreItems[] = [
    {
      icon: FormatTextdirectionLToROutlinedIcon,
      name: "Heading",
      onClick: handleNestedClick,
    },
    {
      name: "Clear All Formating",
      onClick: handleFormat,
      icon: FormatClearIcon,
    },
    { isDivider: true },
    {
      title: "Undo (Ctrl + Z)",
      name: "Undo",
      icon: UndoIcon,
      onClick: () => editor.dispatchCommand(UNDO_COMMAND, undefined),
    },

    {
      title: " (Redo (Ctrl + Y)",
      name: "Redo",
      icon: RedoIcon,
      onClick: () => editor.dispatchCommand(REDO_COMMAND, undefined),
    },
    { isDivider: true },
    {
      title: "Import",
      name: "Import",
      icon: FileUploadOutlinedIcon,
      onClick: handleFileSelects,
    },
    {
      title: "Export",
      name: "Export",
      icon: FileDownloadOutlinedIcon,
      onClick: hanldleExport,
    },
    { isDivider: true },

    {
      title: "Table",
      name: "Insert Table",
      icon: TableView,
      onClick: () => setShowInsertTable(true),
    },
  ];

  return (
    <Box sx = {{display : 'flex', justifyContent : 'center', alignItems : 'center'}}>
      <Tooltip title="Highlight">
        <IconButton
         
          onClick={(event) => setAnchorEl(event.currentTarget)}
        >
          <MoreHorizIcon sx={{  color : 'white'}} />
        </IconButton>
      </Tooltip>
      <Menu
        id="align-menu"
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "block-format-button",
          role: "listbox",
        }}
        sx={{ paddingLeft: "8px", paddingRight: "8px", height: "400px" , 
        }}
      >
        {FormatMoreItem.map((option, index) =>
          option.isDivider ? (
            <Divider
              key={index}
              orientation="horizontal"
              flexItem
              sx={{ padding: 0 }}
            />
          ) : (
            <MenuItem
              role="option"
              key={index}
              onClick={option.onClick}
              sx={{ fontSize: "14px" }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "180px",
                }}
              >
                <Box sx={{ display: "flex" }}>
                  <ListItemIcon >
                    <option.icon sx={{ width: "20px" }} />
                  </ListItemIcon>
                  <Box>{option.name}</Box>
                </Box>
                <Box>
                  {option.name === "Heading" && (
                    <ListItemIcon >
                      <ArrowRightOutlinedIcon />
                    </ListItemIcon>
                  )}
                </Box>
              </Box>
            </MenuItem>
          )
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept=".html, .md"
          style={{ display: "none" }}
          id="file-upload"
          onChange={handleFileSelect}
        />

     
      </Menu>

      <Popover
        id="nested-menu"
        open={Boolean(nestedAnchorEl)}
        anchorEl={nestedAnchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
       
      >
        <BlockFormat blockType={blockTypes} handleCloses={handleClose} />
      </Popover>

      {showInsertTable && (
        <Dialog open={showInsertTable}>
          <InsertTableDialog
         
            activeEditor={editor}
            onClose={() => setShowInsertTable(false)}
            handleClose={handleClose}
          />
        </Dialog>
      )}
    </Box>
  );
};

export default MoreItems;
