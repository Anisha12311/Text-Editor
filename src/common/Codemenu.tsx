import React, { FC, useState, MouseEvent } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Box, useMediaQuery } from "@mui/material";
import { getMenuButtonStyle } from "../styles/MUI/alignitem.styled";
type CodeMenuProps = {
    onChange: any;
    options: string[];
  };
const CodeMenu: FC<CodeMenuProps> = ({ onChange, options }:any) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
    const [value,setValue] = useState('JAVASCRIPT')
  const isMdViewport = useMediaQuery("(min-width:960px)");

  const handleClickIconButton = (event: MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleMenuItemClick = ( option: string) => {
   console.log("option", option)
    onChange(option);
    setValue(option)
    handleClose();
  };
  return (
    <>
      <Box
      onClick={handleClickIconButton}
       sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isMdViewport ? '10px 16px' : '6px 12px',
          fontSize: isMdViewport ? '1rem' : '0.875rem',
          color: 'info.main',
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          ...getMenuButtonStyle({ open, isMdViewport }),}}
      >
             {isMdViewport ? value.toUpperCase() : null}
             <KeyboardArrowDownIcon sx={{ color: "rgba(0, 0, 0, 0.87) !important" }} />
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
        sx = {{paddingLeft : '8px', paddingRight : '8px', height : '400px'
        }}
      >
        {options.map((option:any, index:any) => (
          <MenuItem
            role="option"
            key={index}
            onClick={() => handleMenuItemClick( option)}
           sx = {{fontSize : '14px'}}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default CodeMenu;
