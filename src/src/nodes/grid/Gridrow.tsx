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

interface GridRowComponentProps {
    children?: React.ReactNode;
  }
  
  const GridRowComponent: React.FC<GridRowComponentProps> = ({ children }) => {
    const style = {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
      gap: '10px', // Example styling for grid gaps
      padding: '5px', // Example styling for padding
    };
  
    return <div style={style}>{children}</div>;
  };
type SerializedGridRowNode = Spread<{}, SerializedElementNode>;

export function convertGridRowElement(): DOMConversionOutput | null {
  const node = $createGridRowNode();
  return {
    node,
  };
}

export class GridRowNode extends ElementNode {
  constructor(key?: NodeKey) {
    super(key);
  }

  static getType(): string {
    return "grid-row";
  }

  static clone(node: GridRowNode): GridRowNode {
    return new GridRowNode(node.__key);
  }

  createDOM(): HTMLElement {
    const dom = document.createElement("span");
    dom.classList.add("Grid__row");
    dom.setAttribute("data-type", "grid-row");
    dom.style.display =  'grid';
    dom.style.gap = '0.5rem';
    dom.style.gridAutoFlow = 'column';
    dom.style.gridAutoColumns = '1fr'
    return dom;
  }

  updateDOM(): boolean {
    return false;
  }

  static importDOM(): DOMConversionMap<HTMLDivElement> | null {
    return {
      span: (domNode) => {
        if (domNode.getAttribute("data-type") !== "grid-row") {
          return null;
        }
        return {
          conversion: convertGridRowElement,
          priority: 1,
        };
      },
    };
  }

  static importJSON(): GridRowNode {
    const node = $createGridRowNode();
    return node;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("span");
    element.setAttribute("data-type", "grid-row");
    element.style.display =  'grid';
    element.style.gap = '0.5rem';
    element.style.gridAutoFlow = 'column';
    element.style.gridAutoColumns = '1fr'
    return { element };
  }

  exportJSON(): SerializedGridRowNode {
    return {
      ...super.exportJSON(),
      type: "grid-row",
      version: 1,
    };
  }

  // New decorate method
  decorate(): JSX.Element {
    return (
      <Suspense fallback={null}>
        <GridRowComponent />
      </Suspense>
    );
  }
}

export function $createGridRowNode(): GridRowNode {
  const gridRow =  new GridRowNode();
  return $applyNodeReplacement(gridRow)
}

export function $isGridRowNode(node: LexicalNode | null | undefined): node is GridRowNode {
  return node instanceof GridRowNode;
}
