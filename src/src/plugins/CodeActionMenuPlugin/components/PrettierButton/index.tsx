import {$isCodeNode} from '@lexical/code';
import {$getNearestNodeFromDOMNode, LexicalEditor} from 'lexical';
import * as React from 'react';
import {useState} from 'react';

interface Props {
  lang: string;
  editor: LexicalEditor;
  getCodeDOMNode: () => HTMLElement | null;
}

export function PrettierButton({ editor, getCodeDOMNode}: Props) {
  const [syntaxError, setSyntaxError] = useState<string>('');
  const [tipsVisible, setTipsVisible] = useState<boolean>(false);

  async function handleClick(): Promise<void> {
    const codeDOMNode = getCodeDOMNode();

    try {
      if (!codeDOMNode) {
        return;
      }

      editor.update(() => {
        const codeNode = $getNearestNodeFromDOMNode(codeDOMNode);

        if ($isCodeNode(codeNode)) {
          // Dummy logic or alternative formatting logic here
          const content = codeNode.getTextContent();
          
          // Example: Replace this with your own formatting logic or leave it empty
          const formattedContent = content; // No formatting applied

          if (formattedContent !== '') {
            const selection = codeNode.select(0);
            selection.insertText(formattedContent);
            setSyntaxError('');
            setTipsVisible(false);
          }
        }
      });
    } catch (error: unknown) {
      setError(error);
    }
  }

  function setError(error: unknown) {
    if (error instanceof Error) {
      setSyntaxError(error.message);
      setTipsVisible(true);
    } else {
      console.error('Unexpected error: ', error);
    }
  }

  function handleMouseEnter() {
    if (syntaxError !== '') {
      setTipsVisible(true);
    }
  }

  function handleMouseLeave() {
    if (syntaxError !== '') {
      setTipsVisible(false);
    }
  }

  return (
    <div className="prettier-wrapper">
      <button
        className="menu-item"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label="format">
        {syntaxError ? (
          <i className="format error" />
        ) : (
          <i className="format default" />
        )}
      </button>
      {tipsVisible ? (
        <pre className="code-error-tips">{syntaxError}</pre>
      ) : null}
    </div>
  );
}
