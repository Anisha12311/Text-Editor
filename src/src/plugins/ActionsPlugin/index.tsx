"use client";
import * as React from "react";

import type { LexicalEditor } from "lexical";

// import {$createCodeNode, $isCodeNode} from '@lexical/code';
import {
  editorStateFromSerializedDocument,
  exportFile,
  importFile,
  SerializedDocument,
  serializedDocumentFromEditorState,
} from "@lexical/file";
// import {
//   $convertFromMarkdownString,
//   $convertToMarkdownString,
// } from '@lexical/markdown';
import { useCollaborationContext } from "@lexical/react/LexicalCollaborationContext";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import { CONNECTED_COMMAND, TOGGLE_CONNECT_COMMAND } from "@lexical/yjs";
import {
  $getRoot,
  $isParagraphNode,
  CLEAR_EDITOR_COMMAND,
  CLEAR_HISTORY_COMMAND,
  COMMAND_PRIORITY_EDITOR,
} from "lexical";
import { useEffect, useState } from "react";

import { INITIAL_SETTINGS } from "../../appSettings";
import useFlashMessage from "../../hooks/useFlashMessage";
import useModal from "../../hooks/useModal";
import Button from "../../ui/Button";
import { docFromHash, docToHash } from "../../utils/docSerialization";
// import {PLAYGROUND_TRANSFORMERS} from '../MarkdownTransformers';
import {
  SPEECH_TO_TEXT_COMMAND,
  SUPPORT_SPEECH_RECOGNITION,
} from "../SpeechToTextPlugin";
import { CAN_USE_WINDOW } from "../../../shared/src/canUseDOM";
import { Icons, IconsBottom, LightTooltip } from "@/src/themes/Toolbar.styled";
import MicIcon from "@mui/icons-material/Mic";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import ShareIcon from "@mui/icons-material/Share";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import DeleteIcon from "@mui/icons-material/Delete";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import * as marked from "marked";

async function sendEditorState(editor: LexicalEditor): Promise<void> {
  const stringifiedEditorState = JSON.stringify(editor.getEditorState());
  try {
    await fetch("http://localhost:1235/setEditorState", {
      body: stringifiedEditorState,
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      method: "POST",
    });
  } catch {
    // NO-OP
  }
}

async function validateEditorState(editor: LexicalEditor): Promise<void> {
  const stringifiedEditorState = JSON.stringify(editor.getEditorState());
  let response = null;
  try {
    response = await fetch("http://localhost:1235/validateEditorState", {
      body: stringifiedEditorState,
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      method: "POST",
    });
  } catch {
    // NO-OP
  }
  if (response !== null && response.status === 403) {
    throw new Error(
      "Editor state validation failed! Server did not accept changes."
    );
  }
}

async function shareDoc(doc: SerializedDocument): Promise<void> {
  const url = new URL(CAN_USE_WINDOW ? window.location.toString() : "");
  url.hash = await docToHash(doc);
  const newUrl = url.toString();
  window.history.replaceState({}, "", newUrl);
  await window.navigator.clipboard.writeText(newUrl);
}

export default function ActionsPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());
  const [isSpeechToText, setIsSpeechToText] = useState(false);
  const [connected, setConnected] = useState(false);
  const [isEditorEmpty, setIsEditorEmpty] = useState(true);
  const [modal, showModal] = useModal();
  const showFlashMessage = useFlashMessage();
  const fileInputRef = React.useRef(null);

  const { isCollabActive } = useCollaborationContext();
  useEffect(() => {
    if (INITIAL_SETTINGS.isCollab) {
      return;
    }
    docFromHash(window.location.hash).then((doc) => {
      if (doc && doc.source === "Playground") {
        editor.setEditorState(editorStateFromSerializedDocument(editor, doc));
        editor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined);
      }
    });
  }, [editor]);
  useEffect(() => {
    return mergeRegister(
      editor.registerEditableListener((editable) => {
        setIsEditable(editable);
      }),
      editor.registerCommand<boolean>(
        CONNECTED_COMMAND,
        (payload) => {
          const isConnected = payload;
          setConnected(isConnected);
          return false;
        },
        COMMAND_PRIORITY_EDITOR
      )
    );
  }, [editor]);

  useEffect(() => {
    return editor.registerUpdateListener(({ dirtyElements, tags }) => {
      if (
        !isEditable &&
        dirtyElements.size > 0 &&
        !tags.has("historic") &&
        !tags.has("collaboration")
      ) {
        validateEditorState(editor);
      }
      editor.getEditorState().read(() => {
        const root = $getRoot();
        const children = root.getChildren();

        if (children.length > 1) {
          setIsEditorEmpty(false);
        } else {
          if ($isParagraphNode(children[0])) {
            const paragraphChildren = children[0].getChildren();
            setIsEditorEmpty(paragraphChildren.length === 0);
          } else {
            setIsEditorEmpty(false);
          }
        }
      });
    });
  }, [editor, isEditable]);

  const hanldleExport = () => {
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

  return (
    <div
      className="actions"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: "10px",
        paddingRight: "5px",
      }}
    >
      {SUPPORT_SPEECH_RECOGNITION && (
        <IconsBottom
          isEditable={!isSpeechToText}
          isActive={isSpeechToText}
          onClick={() => {
            editor.dispatchCommand(SPEECH_TO_TEXT_COMMAND, !isSpeechToText);
            setIsSpeechToText(!isSpeechToText);
          }}
        >
          <LightTooltip placement="top" title="Speech To Text">
            <MicIcon sx={{ width: "24px", height: "24px" }} />
          </LightTooltip>
        </IconsBottom>
      )}

      <IconsBottom onClick={handleFileSelects}>
        <LightTooltip placement="top" title="Import Html/md">
          <FileUploadOutlinedIcon sx={{ width: "24px", height: "24px" }} />
        </LightTooltip>
      </IconsBottom>

      <IconsBottom onClick={hanldleExport}>
        <LightTooltip placement="top" title="Export">
          <FileDownloadOutlinedIcon sx={{ width: "24px", height: "24px" }} />
        </LightTooltip>
      </IconsBottom>

      <IconsBottom
        isActive={isCollabActive || INITIAL_SETTINGS.isCollab}
        onClick={() =>
          shareDoc(
            serializedDocumentFromEditorState(editor.getEditorState(), {
              source: "Playground",
            })
          ).then(
            () => showFlashMessage("URL copied to clipboard"),
            () => showFlashMessage("URL could not be copied to clipboard")
          )
        }
      >
        <LightTooltip placement="top" title="Share">
          <ShareIcon sx={{ width: "24px", height: "24px" }} />
        </LightTooltip>
      </IconsBottom>

      <IconsBottom
        onClick={() => {
          if (!isEditorEmpty) {
            showModal("Clear editor", (onClose) => (
              <ShowClearDialog editor={editor} onClose={onClose} />
            ));
          }
        }}
        isEditable={!isEditorEmpty}
        disabled={isEditorEmpty}
      >
        <LightTooltip placement="top" title="Clear">
          <DeleteIcon sx={{ width: "24px", height: "24px" }} />
        </LightTooltip>
      </IconsBottom>

      <IconsBottom
        onClick={() => {
          if (isEditable) {
            sendEditorState(editor);
          }
          editor.setEditable(!editor.isEditable());
        }}
      >
        <LightTooltip
          placement="top"
          title={isEditable ? "Read mode" : "Write mode"}
        >
          {isEditable ? (
            <LockIcon sx={{ width: "24px", height: "24px" }} />
          ) : (
            <LockOpenIcon sx={{ width: "24px", height: "24px" }} />
          )}
        </LightTooltip>
      </IconsBottom>

      {modal}

      <input
        ref={fileInputRef}
        type="file"
        accept=".html, .md"
        style={{ display: "none" }}
        id="file-upload"
        onChange={handleFileSelect}
      />
    </div>
  );
}

function ShowClearDialog({
  editor,
  onClose,
}: {
  editor: LexicalEditor;
  onClose: () => void;
}): JSX.Element {
  return (
    <>
      Are you sure you want to clear the editor?
      <div className="Modal__content">
        <Button
          onClick={() => {
            editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
            editor.focus();
            onClose();
          }}
        >
          Clear
        </Button>{" "}
        <Button
          onClick={() => {
            editor.focus();
            onClose();
          }}
        >
          Cancel
        </Button>
      </div>
    </>
  );
}
