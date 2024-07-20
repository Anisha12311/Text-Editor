import { IMenuButtonStyle } from "@/interfaces/alignitem.interface";
import {Box, IconButton, SxProps, Theme, styled} from "@mui/material";


export const getMenuButtonStyle = ({ open, isMdViewport}: IMenuButtonStyle): SxProps => ({
    color: "rgba(0, 0, 0, 0.87) !important",
    p: "5px",
    textTransform: "none",
    ...(open && {
        "& .MuiButton-endIcon": {
            transition: "all 0.2s ease-in-out",
            transform: "rotate(180deg)",
        }
    }),
 
    ...(!isMdViewport && {
        "& .MuiButton-startIcon, & .MuiButton-endIcon": {
            m: 0,
        }
    }),
});

export const getActiveBtnStyle = ( isActive: boolean): SxProps<Theme> => ({
  
    "&:hover": 'rgb(238, 238, 238)',

});

export const ToolBar:any = styled(Box)(() => ({
    display: 'flex',
    marginBottom: '1px',
    overflowY : 'hidden',
    verticalAlign: 'middle',
    overflowX: 'auto',
    justifyContent : 'space-between',
    alignItems : 'center',

}))
export const EditorContainer:any = styled(Box)(({showFooter}:any) => ({
    margin: '0px',

    color: '#000',
    position: 'relative',
    lineHeight: '20px',
    fontWeight: 400,
    textAlign: 'left',
    height : showFooter && '80%',
    overflow : showFooter && 'hidden auto'
}));

export const Footer:any = styled(Box)(() => ({
    gap : '10px',
    display : 'flex',
    marginLeft : '-5px',
    height : '40px'
}))




export const pickerStyle = {
	position: "absolute",
	left: "16px",
	zIndex: 2,
	bottom: "45px",
	maxHeight: { xs: "200px", sm: "300px" },
	overflowY: "auto",
	scrollbarWidth: "none",
    ml : '15px'
};
export const mobilePickerStyle = {
	position: "absolute",
	left: { xs: "6px", sm: "16px" },
	zIndex: 999,
	bottom: { xs: "90px", sm: "-424px" },
	overflow: "auto",
	maxHeight: { xs: "245px", sm: "inherit" },
};

export const FooterToolbar:any = styled(Box)(() => ({
    zIndex : 12,
    position: "relative", 
    display: "flex",
    justifyContent: "space-between",
    height :'40px'
}))

const Container = styled(Box)`
    background-color: #fff;
    border-radius: 30px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.35);
    position: relative;
    overflow: hidden;
    width: 968px;
    max-width: 100%;
    min-height: 580px;
    display: flex;
    flex-direction: column;
    height : 80%;
`

const IconButtons = styled(IconButton)`
border-radius: 2px;
    line-height: 24px;
    margin: 0;
    height : 50%;
    min-width: 0;
    cursor : pointer;
    border-radius : 50%;
    padding : 7px;
    margin-left : 5px;
          &:hover {
    background-color: rgba(0,0,0,.75);
   
  }
`

const MainBox = styled(Box)`
height: 98%;
    overflow: hidden auto;
   
`

export {Container,IconButtons ,MainBox}