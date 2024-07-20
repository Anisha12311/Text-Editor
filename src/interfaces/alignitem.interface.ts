import React, {ReactElement} from "react";
import {SvgIconProps} from "@mui/material/SvgIcon";
import {ElementFormatType} from "lexical";
import { blockTypeToBlockName } from "@/lib/constant";

export interface AlignMenuItem {
    name: string;
    icon: ReactElement<SvgIconProps>,
    payload: ElementFormatType
}

export interface FormatTextMenuItem {
    name: string;
    icon: ReactElement<SvgIconProps>,
    payload: any
}

export type FormatButtonProps = {
    title?: string;
    icon?: any; // This type indicates a React component
    active?: boolean;
    onClick?: any;
    isDivider?: boolean;
  };

  export type FormatMoreItems = {
    name ?: string;
    title?: string;
    icon?: any; // This type indicates a React component
    active?: boolean;
    onClick?: any;
    isDivider?: boolean;
  };
export interface IMenuButtonStyle {
    open: boolean;
    isMdViewport: boolean;
}

export interface FormatTextMenuProps {
    hasFormat: Record<any, boolean>;
}

export interface BlockFormatMenuProps {
    blockType: keyof typeof blockTypeToBlockName;
    handleCloses : () => void
}

export interface ColorPickerProps {
    title: string;
    onChange: (color: string) => void;
    icon?: React.ReactElement<SvgIconProps>;
}

export interface UseCustomCommandsReturn {
    clearEditorContent: () => void;
}
