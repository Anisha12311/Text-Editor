
import { RichTextEditor } from "@/components/TextEditor";
import { Box } from "@mui/material";

export default function Home() {
  return (
    <Box sx = {{display : 'flex', justifyContent : 'center', alignItems : 'center', height  : '100vh'}}>
      <RichTextEditor/> 
    </Box>
  );
}
