import React, { Suspense } from 'react';
import {
  $applyNodeReplacement,
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  ElementNode,
  LexicalNode,
  NodeKey,
  SerializedElementNode,
  Spread,
} from "lexical";

interface GridColumnComponentProps {
    span: number;
    children?: React.ReactNode;
  }
  
const GridColumnComponent: React.FC<GridColumnComponentProps> = ({ span, children }) => {
    const style = {
      gridColumn: `span ${span}`,
      border: '1px solid red', 
      padding: '10px',          
    };
  
    return <div style={style}>{children}</div>;
  };
type SerializedGridColumnNode = Spread<
  {
    span: number;
  },
  SerializedElementNode
>;

export function convertGridColumnElement(
  domNode: HTMLDivElement
): DOMConversionOutput | null {
  const node = $createGridColumnNode(Number(domNode.getAttribute("data-span")));
  return {
    node,
  };
}

export class GridColumnNode extends ElementNode {
  __span: number = 1;

  constructor(span: number, key?: NodeKey) {
    super(key);
    this.__span = span;
  }

  static getType(): string {
    return "grid-column";
  }

  static clone(node: GridColumnNode): GridColumnNode {
    return new GridColumnNode(node.__span, node.__key);
  }

  createDOM(): HTMLElement {
    const dom = document.createElement("p");
    dom.classList.add("Grid__column");
    dom.setAttribute("data-type", "grid-column");
    dom.setAttribute("data-span", this.__span.toString());
    dom.style.gridColumn = `span ${this.__span}`;
    dom.style.padding = '0.5rem' ;
    dom.style.border = '1px solid red',
    dom.style.borderRadius = '0.25rem'
    
    return dom;
  }

  updateDOM(prevNode: GridColumnNode, dom: HTMLDivElement): boolean {
    if (prevNode.__span !== this.__span) {
      dom.setAttribute("data-span", this.__span.toString());
      dom.style.padding = '0.5rem' ;
      dom.style.border = '1px solid red',
      dom.style.borderRadius = '0.25rem'

    }

    return false;
  }

  static importDOM(): DOMConversionMap<HTMLDivElement> | null {
    return {
      p: (domNode) => {
        if (domNode.getAttribute("data-type") !== "grid-column") {
          return null;
        }
        return {
          conversion: convertGridColumnElement,
          priority: 1,
        };
      },
    };
  }

  static importJSON(serializedNode: SerializedGridColumnNode): GridColumnNode {
    const node = $createGridColumnNode(serializedNode.span);
    return node;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("p");
    element.setAttribute("data-type", "grid-column");
    element.setAttribute("data-span", this.__span.toString());
    element.style.gridColumn = `span ${this.__span}`;
    element.style.padding = '0.5rem' ;
    element.style.border = '1px solid red',
    element.style.borderRadius = '0.25rem'

    return { element };
  }

  exportJSON(): SerializedGridColumnNode {
    return {
      ...super.exportJSON(),
      span: this.__span,
      type: "grid-column",
      version: 1,
    };
  }

  // New decorate method
  decorate(): JSX.Element {
    return (
      <Suspense fallback={null}>
        <GridColumnComponent span={this.__span} />
      </Suspense>
    );
  }
}

export function $createGridColumnNode(span: number = 1): GridColumnNode {
  const gridcolumn =  new GridColumnNode(Number(span));
  return $applyNodeReplacement(gridcolumn)
}

export function $isGridColumnNode(node: LexicalNode | null | undefined): node is GridColumnNode {
  return node instanceof GridColumnNode;
}
