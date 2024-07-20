import useCustomCommands from "../hooks/useCustomCommand";
import useEditorToolbar from "../hooks/useEditorToolbar";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Tooltip,
} from "@mui/material";
import * as React from "react";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { IconButtons } from "@/styles/MUI/alignitem.styled";

const DeleteContent = ( ) => {
  const { isEditorEmpty } = useEditorToolbar();
  const { clearEditorContent } = useCustomCommands();
  const [editor] = useLexicalComposerContext();

  const [open, setOpen] = useState(false);
  const handleClearEditorContent = () => {
    clearEditorContent();
    setOpen(false);
  };
  const [readMode, setReadMode] = useState(false);
  const handleReadMode = () => {
    editor.setEditable(false);
    setReadMode(true);
  };

  const handleWriteMode = () => {
    editor.setEditable(true);
    setReadMode(false);
  };
  return (
    <Box style={{ display: "flex", justifyContent : 'center', alignItems : 'center' }}>
      <Tooltip title="Clear editor">
        <IconButtons
         
          disabled={isEditorEmpty}
          onClick={() => setOpen(true)}
        >
          <DeleteForeverOutlinedIcon sx = {{color :'white'}}/>
        </IconButtons>
      </Tooltip>

      {readMode ? (
        <Tooltip title="Write Mode">
          <IconButtons  onClick={handleWriteMode}>
            <LockOpenIcon   sx = {{color :'white'}}/>
          </IconButtons>
        </Tooltip>
      ) : (
        <Tooltip title="Read Only">
          <IconButtons onClick={handleReadMode}>
            <LockIcon  sx = {{color :'white'}}/>
          </IconButtons>
        </Tooltip>
      )}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent sx={{ paddingBottom: 0 }}>
          <h3 id="alert-dialog-description">
            Are you sure you want to clear out the editor's content?
          </h3>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setOpen(false)} autoFocus>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleClearEditorContent}
            autoFocus
          >
            Clear
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeleteContent;
