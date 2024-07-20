import React, {  useState, MouseEvent } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { FORMAT_ELEMENT_COMMAND } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { alignMenuItems } from "../lib/constant";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import { Box, useMediaQuery } from "@mui/material";
import { getMenuButtonStyle } from "../styles/MUI/alignitem.styled";
type formatTypes = {
  icon: any;
  name: string;
};

const AlignMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const isMdViewport = useMediaQuery("(min-width:960px)");
  const [formatType, setFromatType] = useState<formatTypes>({
    icon: <FormatAlignLeftIcon sx={{ width: "20px" }} />,
    name: "Align",
  });
  const [editor] = useLexicalComposerContext();

  const handleClickIconButton = (event: MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  return (
    <>
      <Box
  aria-haspopup={anchorEl ? "true" : undefined}
  aria-controls={anchorEl ? "align-menu" : undefined}
  onClick={handleClickIconButton}
  sx={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: isMdViewport ? '10px 16px' : '6px 12px',
    fontSize: isMdViewport ? '1rem' : '0.875rem',
    border: 'none',
    cursor: 'pointer',
   
    ...getMenuButtonStyle({ open, isMdViewport }),
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.08)',
    },
  }}
>
  {formatType?.icon && <Box component="span" sx={{ marginRight: '8px' }}>{formatType.icon}</Box>}
  {isMdViewport ? "Align" : null}
  <KeyboardArrowDownIcon sx={{ color:  'rgba(0, 0, 0, 0.87) !important', width: '20px', marginLeft: '8px' }} />
</Box>

      

      <Menu
        id="align-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "block-format-button",
          role: "listbox",
        }}
      
      >
        {alignMenuItems.map((option, index) => (
          <MenuItem
            role="option"
            key={index}
            onClick={() => {
              handleClose();
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, option.payload);
              setFromatType({ icon: option.icon, name: option.name });
            }}
            sx={{ fontSize: "14px" }}
          >
            <ListItemIcon>{option.icon}</ListItemIcon>
            {option.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default AlignMenu;
