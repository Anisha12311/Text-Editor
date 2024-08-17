import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import * as React from "react";

type Props = {
  className?: string;
  placeholderClassName?: string;
  placeholder: string;
};

export default function LexicalContentEditable({
  className,
  placeholder,
}: Props): JSX.Element {
  return (
    <ContentEditable
      className={className ?? "ContentEditable__root"}
      aria-placeholder={placeholder}
    />
  );
}
