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
interface GridContainerComponentProps {
    columns: number;
    children?: React.ReactNode;
  }
  
  const GridContainerComponent: React.FC<GridContainerComponentProps> = ({ columns, children }) => {
    const style = {
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: '10px', 
      padding: '10px', 
    };
  
    return <div style={style}>{children}</div>;
  };

// Define the serialized type for the GridContainerNode
type SerializedGridContainerNode = Spread<
  {
    columns: number;
  },
  SerializedElementNode
>;

// Convert a DOM element to a GridContainerNode
export function convertGridContainerElement(
  domNode: HTMLDivElement
): DOMConversionOutput | null {
  const node = $createGridContainerNode(Number(domNode.getAttribute("data-columns")));
  return {
    node,
  };
}

// Define the GridContainerNode class
export class GridContainerNode extends ElementNode {
  __columns: number = 1;

  constructor(columns: number, key?: NodeKey) {
    super(key);
    this.__columns = columns;
  }

  static getType(): string {
    return "grid-container";
  }

  static clone(node: GridContainerNode): GridContainerNode {
    return new GridContainerNode(node.__columns, node.__key);
  }

  createDOM(): HTMLElement {
    const dom = document.createElement("p");
    dom.classList.add("Grid__container");
    dom.setAttribute("data-type", "grid-container");
    dom.setAttribute("data-columns", this.__columns.toString());
    dom.style.display = "grid";
    dom.style.gridTemplateColumns = `repeat(${this.__columns}, 1fr)`;
    dom.style.gap = "0.5rem";
    dom.style.padding = "0.25rem";
    dom.style.marginTop = "0.5rem";
    dom.style.marginBottom = "0.5rem";
    dom.style.border = "2px solid blue";
    return dom;
  }

  updateDOM(prevNode: GridContainerNode, dom: HTMLDivElement): boolean {
    if (prevNode.__columns !== this.__columns) {
      dom.setAttribute("data-columns", this.__columns.toString());
      dom.style.gridTemplateColumns = `repeat(${this.__columns}, 1fr)`;
      dom.style.gap = "0.5rem";
    dom.style.padding = "0.25rem";
    dom.style.marginTop = "0.5rem";
    dom.style.marginBottom = "0.5rem";
    dom.style.border = "2px solid blue";
    }

    return false;
  }

  static importDOM(): DOMConversionMap<HTMLDivElement> | null {
    return {
      p: (domNode: HTMLDivElement) => {
        if (domNode.getAttribute("data-type") !== "grid-container") {
          return null;
        }

        return {
          conversion: convertGridContainerElement,
          priority: 1,
        };
      },
    };
  }

  static importJSON(serializedNode: SerializedGridContainerNode): GridContainerNode {
    const node = $createGridContainerNode(serializedNode.columns);
    return node;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("p");
    element.setAttribute("data-type", "grid-container");
    element.setAttribute("data-columns", this.__columns.toString());
    element.style.display = "grid";
    element.style.gridTemplateColumns = `repeat(${this.__columns}, 1fr)`;
    element.style.gap = "0.5rem";
    element.style.padding = "0.25rem";
    element.style.marginTop = "0.5rem";
    element.style.marginBottom = "0.5rem";
    element.style.border = "2px solid blue";
    return { element };
  }

  exportJSON(): SerializedGridContainerNode {
    return {
      ...super.exportJSON(),
      columns: this.__columns,
      type: "grid-container",
      version: 1,
    };
  }

  // New decorate method
  decorate(): JSX.Element {
    return (
      <Suspense fallback={null}>
        <GridContainerComponent columns={this.__columns} />
      </Suspense>
    );
  }
}

// Function to create a GridContainerNode
export function $createGridContainerNode(columns: number = 1): GridContainerNode {
  const gridNode =  new GridContainerNode(Number(columns));
  return $applyNodeReplacement(gridNode);

}

// Type guard to check if a node is a GridContainerNode
export function $isGridContainerNode(node: LexicalNode | null | undefined): node is GridContainerNode {
  return node instanceof GridContainerNode;
}
