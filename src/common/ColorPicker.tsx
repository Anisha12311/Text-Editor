import React, { FC, useState } from "react";
import { SketchPicker } from "react-color";
import Popper from "@mui/material/Popper";
import IconButton from "@mui/material/IconButton";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { ColorPickerProps } from "@/interfaces/alignitem.interface";
import { Box, Tooltip } from "@mui/material";

const ColorPicker: FC<ColorPickerProps> = ({ title, icon, onChange }) => {
  const [hex, setHex] = useState("#fff");
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [open, setOpen] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) =>{
    setAnchorEl(event.currentTarget);
     setOpen(!open)
  }

  const handleClose = () =>{ 
    setAnchorEl(null);
    setOpen(false)
  }

  return (
    <Box sx = {{marginLeft : '5px',}}>
      <Tooltip title = {title}>
      <IconButton
        aria-haspopup={anchorEl ? "true" : undefined}
        aria-controls={anchorEl ? "color-picker" : undefined}
        onClick={handleClick}
        size="small"
        title={title}
      >
        {icon}
      </IconButton>
      </Tooltip>
      <Popper
        id="color-picker"
        open={open}
        anchorEl={anchorEl}
        placement="bottom"
        transition
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClose}>
            <Fade {...TransitionProps} timeout={350}>
              <Paper>
                <SketchPicker
                  color={hex}
                  onChange={(color) => {
                    setHex(color.hex);
                    onChange(color.hex);
                  }}
                />
              </Paper>
            </Fade>
          </ClickAwayListener>
        )}
      </Popper>
    </Box>
  );
};

export default ColorPicker;
