// use your own implementation
// use your own implementation
// use your own implementation
import { LexicalEditor } from "lexical";
import * as React from "react";
import { INSERT_GRID_COMMAND } from "../GridPlugin";
import Button from "../../ui/Button";
import { TextField } from "@mui/material";

type InsertGridDialogProps = {
    activeEditor: LexicalEditor;
    onClose: () => void;
};

export const InsertGridDialog: React.FC<InsertGridDialogProps> = ({
    activeEditor,
    onClose,
}) => {
    const [rows, setRows] = React.useState("1");
    const [columns, setColumns] = React.useState("2");
    const [isDisabled, setIsDisabled] = React.useState(true);

    React.useEffect(() => {
        const row = Number(rows);
        const column = Number(columns);
        if (row && row > 0 && row <= 4 && column && column > 0 && column <= 4) {
            setIsDisabled(false);
        } else {
            setIsDisabled(true);
        }
    }, [rows, columns]);

    const handleSubmit = React.useCallback(() => {
        activeEditor.dispatchCommand(INSERT_GRID_COMMAND, {
            columns: Number(columns),
            rows: Number(rows),
        });

        onClose();
    }, [activeEditor, columns, onClose, rows]);

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div >

            <TextField fullWidth id="outlined-basic" label="Rows" variant="outlined" 
                        onChange={(e) => setRows(e.target.value)}
                        value={rows}   type="number"   inputProps={{
                            min: 1, 
                            max: 4, 
                          }}/>

                
            </div>
            <div style = {{marginTop : '10px', marginBottom : '20px'}}>

            <TextField fullWidth id="outlined-basic" label="Columns" variant="outlined" 
                      onChange={(e) => setColumns(e.target.value)}
                      value={columns}
                      type="number"   inputProps={{
                        min: 1, 
                        max: 4, 
                      }}/>
                
            </div>
            <div className="flex justify-end">
                <Button disabled={isDisabled}>Insert</Button>
            </div>
        </form>
    );
};