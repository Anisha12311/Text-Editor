// import "@/styles/globals.css";
import type { AppProps } from "next/app";
// import "../styles/Home.css";
import "../app/global.css"
import "../src/index.css";
import "../src/nodes/ImageNode.css";
import "../src/nodes/PollNode.css";
import "../src/nodes/StickyNode.css";
import "../src/themes/CommentEditorTheme.css";
import "../src/themes/StickyEditorTheme.css";
import "../src/themes/PlaygroundEditorTheme.css";
import "../src/ui/Button.css";
import "../src/ui/ColorPicker.css";
import "../src/ui/ContentEditable.css";
import "../src/ui/Input.css";
import "../src/ui/Dialog.css";
import "../src/ui/EquationEditor.css";
import "../src/ui/FlashMessage.css";
import "../src/ui/KatexEquationAlterer.css";
import "../src/ui/Modal.css";
import "../src/ui/Select.css";
import "../src/nodes/ExcalidrawNode/ExcalidrawModal.css";
import "../src/nodes/InlineImageNode/InlineImageNode.css";
import "../src/nodes/PageBreakNode/index.css";
import "../src/plugins/CodeActionMenuPlugin/index.css";
import "../src/plugins/CodeActionMenuPlugin/components/PrettierButton/index.css";
import "../src/plugins/CollapsiblePlugin/Collapsible.css";
import "../src/plugins/FloatingLinkEditorPlugin/index.css";
import "../src/plugins/ToolbarPlugin/fontSize.css";
import "../src/plugins/FloatingTextFormatToolbarPlugin/index.css";
export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
