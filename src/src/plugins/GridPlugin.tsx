import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $insertNodeToNearestRoot } from "@lexical/utils";
import {
    $createParagraphNode,
    COMMAND_PRIORITY_EDITOR,
    createCommand,
    LexicalCommand,
} from "lexical";
import { useEffect } from "react";
import {
    $createGridColumnNode,
    GridColumnNode,
} from "../nodes/grid/Gridcolumn";
import {
    $createGridContainerNode,
    GridContainerNode,
} from "../nodes/grid/GridContainer";
import {
    $createGridRowNode,
    GridRowNode,
} from "../nodes/grid/Gridrow";

export type InsertGridCommandPayload = Readonly<{
    columns: number;
    rows: number;
}>;

export const INSERT_GRID_COMMAND: LexicalCommand<InsertGridCommandPayload> =
    createCommand("INSERT_GRID_COMMAND");

export default function GridPlugin(): null {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        console.log("editor update again",editor.hasNodes([GridContainerNode, GridRowNode, GridColumnNode]))
        if (!editor.hasNodes([GridContainerNode, GridRowNode, GridColumnNode])) {
            throw new Error(
                "GridPlugin: GridContainerNode, GridRowNode, or GridColumnNode not registered on editor"
            );
        }

        return editor.registerCommand<InsertGridCommandPayload>(
            INSERT_GRID_COMMAND,
            (payload) => {
                const container = $createGridContainerNode();
                
                for (let i = 0; i < payload.rows; i++) {
                    const row = $createGridRowNode();
                    for (let j = 0; j < payload.columns; j++) {
                        row.append(
                            $createGridColumnNode().append(
                                $createParagraphNode()
                            )
                        );
                    }
                    container.append(row);
                }

                $insertNodeToNearestRoot(container);
                container.select();
                console.log("editor container", container)
                return true;
            },
            COMMAND_PRIORITY_EDITOR
        );
    }, [editor]);

    return null;
}
