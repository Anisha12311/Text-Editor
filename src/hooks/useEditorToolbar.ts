import {useCallback, useEffect, useState} from "react";
import {$isRootOrShadowRoot, $isTextNode} from "lexical";
import {
    mergeRegister,
    $findMatchingParent,
    $getNearestBlockElementAncestorOrThrow,
    $getNearestNodeOfType,
} from "@lexical/utils";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {$getRoot, $getSelection, $isParagraphNode, $isRangeSelection} from "lexical";
import {blockTypeToBlockName, initialHasFormat} from "../lib/constant";
import {$isListNode, ListNode} from "@lexical/list";
import {$isDecoratorBlockNode} from '@lexical/react/LexicalDecoratorBlockNode';
import {$isLinkNode, TOGGLE_LINK_COMMAND} from '@lexical/link';
import {INSERT_HORIZONTAL_RULE_COMMAND} from '@lexical/react/LexicalHorizontalRuleNode';
import {$selectAll} from '@lexical/selection';
import {$isHeadingNode} from '@lexical/rich-text';
import {$isCodeNode} from '@lexical/code';
import getSelectedNode from "../lib/util";


const useEditorToolbar = () => {

    const [editor] = useLexicalComposerContext();

    const [hasFormat, setHasFormat] = useState<Record<any, boolean>>(initialHasFormat);
    const [isEditorEmpty, setIsEditorEmpty] = useState(false);
    const [blockTypes, setblockTypes] = useState<keyof typeof blockTypeToBlockName>('paragraph');
    // const [selectedElementKey, setSelectedElementKey] = useState<NodeKey | null>(null);
    // const [codeLanguage, setCodeLanguage] = useState<string>("");
    const [isLink, setIsLink] = useState(false);

    const updateToolbar = useCallback(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
            const anchorNode = selection.anchor.getNode();
            let element =
                anchorNode.getKey() === 'root'
                    ? anchorNode
                    : $findMatchingParent(anchorNode, (e) => {
                        const parent = e.getParent();
                        return parent !== null && $isRootOrShadowRoot(parent);
                    });

            if (element === null) {
                element = anchorNode.getTopLevelElementOrThrow();
            }
            const elementKey = element.getKey();
            const elementDOM = editor.getElementByKey(elementKey);
            setHasFormat({        
                bold: selection.hasFormat('bold'),
                italic: selection.hasFormat('italic'),
                underline: selection.hasFormat('underline'),
                strikethrough: selection.hasFormat('strikethrough'),
                code: selection.hasFormat('code'),
                subscript: selection.hasFormat('subscript'),
                superscript: selection.hasFormat('superscript'),
                highlight : selection.hasFormat('highlight'),
                clearFormatting: selection.hasFormat('strikethrough') || selection.hasFormat('subscript') || selection.hasFormat('superscript')
            });

            const node = getSelectedNode(selection);
            const parent = node.getParent();
            if ($isLinkNode(parent) || $isLinkNode(node)) {
                setIsLink(true);
            } else {
                setIsLink(false);
            }

            if (elementDOM !== null) {
                // setSelectedElementKey(elementKey);
                if ($isListNode(element)) {
                    const parentList = $getNearestNodeOfType<ListNode>(
                        anchorNode,
                        ListNode,
                    );
                    const type = parentList
                        ? parentList.getListType()
                        : element.getListType();
                    setblockTypes(type);
                } else {
                    const type = $isHeadingNode(element)
                        ? element.getTag()
                        : element.getType();
                    if (type in blockTypeToBlockName) {
                        setblockTypes(type as keyof typeof blockTypeToBlockName);
                    }
                    if ($isCodeNode(element)) {
                        // const language =
                            // element.getLanguage() as keyof typeof CODE_LANGUAGE_MAP;
                        // setCodeLanguage(
                            // language ? CODE_LANGUAGE_MAP[language] || language : '',
                        // );
                        return;
                    }
                }
            }
        }
        checkIfEditorIsEmpty();
    }, [editor]);

    const checkIfEditorIsEmpty = useCallback(() => {
        const root = $getRoot();
        const children = root.getChildren();

        if (children.length > 1) {
            setIsEditorEmpty(false);
            return;
        }

        if ($isParagraphNode(children[0])) {
            setIsEditorEmpty(children[0].getChildren().length === 0);
        } else {
            setIsEditorEmpty(false);
        }
    }, [editor]);

    const insertLink = useCallback(() => {
        if (!isLink) {
            console.log("TOGGLE_LINK_COMMAND");
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
        } else {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
        }
    }, [editor, isLink]);

    const insertHorizontalRule = () => {
        editor.dispatchCommand(
            INSERT_HORIZONTAL_RULE_COMMAND,
            undefined,
        );
    }

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({editorState}) => {
              
                editorState.read(() => {
                    updateToolbar();
                });
            }),
        );
    }, [updateToolbar, editor]);

    const clearFormatting = useCallback(() => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                $selectAll(selection);
                selection.getNodes().forEach((node) => {
                    if ($isTextNode(node)) {
                        node.setFormat(0);
                        node.setStyle('');
                        $getNearestBlockElementAncestorOrThrow(node).setFormat('');
                    }
                    if ($isDecoratorBlockNode(node)) {
                        node.setFormat('');
                    }
                });
            }
        });
    }, [editor]);

    return {
        hasFormat,
        isEditorEmpty,
        blockTypes,
        insertLink,
        insertHorizontalRule,
        clearFormatting,
    };
};

export default useEditorToolbar;