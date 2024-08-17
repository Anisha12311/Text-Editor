import { Box, styled } from "@mui/material";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
interface IconsProps {
  isEditable?: boolean;
  isActive?: boolean;
  disabled?:boolean
}

const Icons = styled(Box)<IconsProps>(
  ({ isEditable = true, isActive = false }) => ({
    height: "30px",
    width: "30px",
    borderRadius: "20px",
    backgroundColor: isActive ? "#00b7ea" : "white",
    color: isActive ? "white" : !isEditable ? "#9f9d9d" : "#525151",
    transition:
      "background .2s,opacity .34s,transform .34s cubic-bezier(.4,0,.2,1),-webkit-transform .34s cubic-bezier(.4,0,.2,1)",
    opacity: "1",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    ":hover": {
      backgroundColor: "#00b7ea",
      color: "white",
    },
    cursor: "pointer",
    marginLeft: "3px",
  })
);

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#00b7ea",
    color: "white",
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}));

const IconsBottom = styled(Box)<IconsProps>(
  ({ isEditable = true, isActive = false, disabled }) => ({
    height: "35px",
    width: "35px",
    borderRadius: "20px",
    backgroundColor: isActive ? "#00b7ea" : "white",
    color: isActive ? "white" : !isEditable ? "#9f9d9d" : "#525151",
    transition:
      "background .2s,opacity .34s,transform .34s cubic-bezier(.4,0,.2,1),-webkit-transform .34s cubic-bezier(.4,0,.2,1)",
    opacity: "1",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    ":hover": {
      backgroundColor: "#00b7ea",
      color: "white",
    },
    cursor: disabled ? "not-allowed" : "pointer",
    marginLeft: "13px",
    boxShadow: "3px 4px 5px 0px rgba(0, 0, 0, 0.18)",
  })
);

const LightTooltipBottom = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#00b7ea",
    color: "white",
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}));

export { Icons, LightTooltip, LightTooltipBottom, IconsBottom };
