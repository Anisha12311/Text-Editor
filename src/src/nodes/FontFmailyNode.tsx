import {
  
    $getSelection,
    $isRangeSelection,
    COMMAND_PRIORITY_HIGH,
    EditorConfig,
    LexicalCommand,
    NodeKey,
    Spread,
    TextModeType,
    TextNode,
    createCommand,
  } from "lexical";
  import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
  
  // Define FontNode extending TextNode
  export class FontNode extends TextNode {
    // Node property for font
    __font: string;
  
    constructor(text: string, font: string, key?: NodeKey) {
      super(text, key);
      this.__font = font;
    }
  
    static getType(): string {
      return "font";
    }
  
    static clone(node: FontNode): FontNode {
      return new FontNode(node.__text, node.__font, node.__key);
    }
  
    createDOM(config: EditorConfig): HTMLElement {
      const element = super.createDOM(config);
      if (this.__font) {
        element.classList.add(`font-${normalizeClassName(this.__font)}`);
      }
      return element;
    }
  
    updateDOM(
      prevNode: FontNode,
      dom: HTMLElement,
    ): boolean {
      const prevFont = prevNode.__font;
      const nextFont = this.__font;
  
      if (prevFont !== nextFont) {
        dom.classList.remove(`font-${normalizeClassName(prevFont)}`);
        dom.classList.add(`font-${normalizeClassName(nextFont)}`);
        return true;
      }
      return false;
    }
  
    exportJSON(): SerializedFontNode {
      return {
        ...super.exportJSON(),
        font: this.__font,
        type: "font",
        version: 2,
      };
    }
  
    static importJSON(serializedNode: SerializedFontNode): FontNode {
      const node = $createFontNode(serializedNode.text, serializedNode.font);
      node.setDetail(serializedNode.detail);
      node.setFormat(serializedNode.format);
      node.setMode(serializedNode.mode);
      node.setStyle(serializedNode.style);
      return node;
    }
  }
  
  // Function to create a FontNode
  export function $createFontNode(text: string, font: string): FontNode {
    return new FontNode(text, font);
  }
  
  // Type guard for FontNode
  export function $isFontNode(node: FontNode): node is FontNode {
    return node instanceof FontNode;
  }
  
  // Command for changing font family
  export const FORMAT_FONTFAMILY_COMMAND: LexicalCommand<string> =
    createCommand("changeFontFamily");
  
  // Plugin to handle font family changes
  export function FontFamilyPlugin(): null {
    const [editor] = useLexicalComposerContext();
    if (!editor.hasNodes([FontNode])) {
      throw new Error(
        "FontFamilyPlugin: FontNode not registered on editor (initialConfig.nodes)"
      );
    }
    editor.registerCommand(
      FORMAT_FONTFAMILY_COMMAND,
      (font: string) => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          selection.getNodes().forEach((node) => {
            if (node instanceof TextNode) {
              const fontNode = $createFontNode(node.getTextContent(), font);
              node.replace(fontNode);
            }
          });
        }
        return true;
      },
      COMMAND_PRIORITY_HIGH
    );
    return null;
  }
  
  // Type definitions for serialization
  export type SerializedFontNode = Spread<
    {
      detail: number;
      format: number;
      mode: TextModeType;
      style: string;
      text: string;
      font: string;
    },
    SerializedLexicalNode
  >;
  
  export type SerializedLexicalNode = {
    type: string;
    version: number;
  };
  
  // Helper function to normalize class names
  function normalizeClassName(fontName: string): string {
    return fontName.replace(/\s+/g, "-").toLowerCase();
  }
  