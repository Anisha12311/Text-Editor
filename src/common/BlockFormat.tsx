import React, { FC } from "react";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import useBlockFormat from "../hooks/useBlockFormat";
import { BlockFormatMenuProps } from "@/interfaces/alignitem.interface";

const BlockFormat: FC<BlockFormatMenuProps> = ({ handleCloses, blockType }) => {
  const { blocks } = useBlockFormat({ blockType });

  return (
    <>
      {blocks.map((option, index) => (
        <MenuItem
          role="option"
          key={index}
          selected={blockType === option.blockType}
          onClick={() => {
            handleCloses();
            option.onClick();
          }}
          sx={{ fontSize: "14px", }}
        >
          <ListItemIcon>{option.icon}</ListItemIcon>
          {option.name}
        </MenuItem>
      ))}
    </>
  );
};

export default BlockFormat;
