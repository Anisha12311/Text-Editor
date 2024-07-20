
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {
  $createTableNodeWithDimensions,
  INSERT_TABLE_COMMAND,
  TableNode,
} from '@lexical/table';
import {
  $insertNodes,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  EditorThemeClasses,
  Klass,
  LexicalCommand,
  LexicalEditor,
  LexicalNode,
} from 'lexical';
import {createContext, useContext, useEffect, useMemo, useState} from 'react';
import * as React from 'react';
import { Box, Button, DialogActions, DialogContent, TextField } from '@mui/material';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';

export type InsertTableCommandPayload = Readonly<{
  columns: string;
  rows: string;
  includeHeaders?: boolean;
}>;

export type CellContextShape = {
  cellEditorConfig: null | CellEditorConfig;
  cellEditorPlugins: null | JSX.Element | Array<JSX.Element>;
  set: (
    cellEditorConfig: null | CellEditorConfig,
    cellEditorPlugins: null | JSX.Element | Array<JSX.Element>,
  ) => void;
};

export type CellEditorConfig = Readonly<{
  namespace: string;
  nodes?: ReadonlyArray<Klass<LexicalNode>>;
  onError: (error: Error, editor: LexicalEditor) => void;
  readOnly?: boolean;
  theme?: EditorThemeClasses;
}>;

export const INSERT_NEW_TABLE_COMMAND: LexicalCommand<InsertTableCommandPayload> =
  createCommand('INSERT_NEW_TABLE_COMMAND');

export const CellContext = createContext<CellContextShape>({
  cellEditorConfig: null,
  cellEditorPlugins: null,
  set: () => {
    // Empty
  },
});

export function TableContext({children}: {children: JSX.Element}) {
  const [contextValue, setContextValue] = useState<{
    cellEditorConfig: null | CellEditorConfig;
    cellEditorPlugins: null | JSX.Element | Array<JSX.Element>;
  }>({
    cellEditorConfig: null,
    cellEditorPlugins: null,
  });
  return (
    <CellContext.Provider
      value={useMemo(
        () => ({
          cellEditorConfig: contextValue.cellEditorConfig,
          cellEditorPlugins: contextValue.cellEditorPlugins,
          set: (cellEditorConfig, cellEditorPlugins) => {
            setContextValue({cellEditorConfig, cellEditorPlugins});
          },
        }),
        [contextValue.cellEditorConfig, contextValue.cellEditorPlugins],
      )}>
      {children}
    </CellContext.Provider>
  );
}

export function InsertTableDialog({
  activeEditor,
  onClose,
  handleClose,
}: {
  activeEditor: LexicalEditor;
  onClose: () => void;
  handleClose : () => void;
}): JSX.Element {
  const [rows, setRows] = useState('5');
  const [columns, setColumns] = useState('5');
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    const row = Number(rows);
    const column = Number(columns);
    
    if (row && row > 0 && row <= 500 && column && column > 0 && column <= 50) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [rows, columns]);

  const onClick = () => {
    
    handleClose ()
    activeEditor.dispatchCommand(INSERT_TABLE_COMMAND, {
      columns,
      rows,
    });

    onClose();

  };
  const handleOnchange= (event:any) => {
    setRows(event.target.value);
  }
  const handleColumn= (event:any) => {
    setColumns(event.target.value);
  }
  return (
    <Box  sx = {{backgroundColor : 'white'}}>
   <Box sx = {{display : 'flex', justifyContent : 'space-between'}}>
    <h2 id="alert-dialog-title" style = {{marginLeft : '20px', padding : '10px', color : 'rgba(0, 0, 0, 0.6)'}}>
         Insert Table
        </h2>
        
     <h2 style = {{marginRight : '20px', cursor : 'pointer', paddingTop : '10px',  color : 'rgba(0, 0, 0, 0.6)'}} onClick = {onClose}><  ClearOutlinedIcon/></h2> 
      </Box>
        <div style = {{borderBottom : '1px solid gray'}}/>
        <DialogContent>
            <Box>
        <TextField
          id="outlined-number"
          label="Rows"
          type="number"
          
          value={rows}
          InputLabelProps={{
            shrink: true,
          }}
          onChange = {handleOnchange}
        />
        </Box><Box sx = {{marginTop : "20px"}}>
        <TextField
          id="outlined-number"
          label="Columns"
          type="number"
          
          value={columns}
          InputLabelProps={{
            shrink: true,
          }}
          onChange = {handleColumn}
        />
   </Box>
    </DialogContent>
      <DialogActions data-test-id="table-model-confirm-insert">
       
        <Button
          variant="text"
          disabled={isDisabled} onClick={onClick}
          autoFocus
          sx = {{color :  'rgb(5, 46, 43)' ,
            '&:hover': {
             
              color: 'rgb(5, 46, 43)'
            }
          ,}}
        >
          Confirm
        </Button>
      </DialogActions>
    </Box>
  );
}

export function TablePlugin({
  cellEditorConfig,
  children,
}: {
  cellEditorConfig: CellEditorConfig;
  children: JSX.Element | Array<JSX.Element>;
}): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const cellContext = useContext(CellContext);

  useEffect(() => {
    if (!editor.hasNodes([TableNode])) {
    //   invariant(false, 'TablePlugin: TableNode is not registered on editor');
    }

    cellContext.set(cellEditorConfig, children);

    return editor.registerCommand<InsertTableCommandPayload>(
      INSERT_NEW_TABLE_COMMAND,
      ({columns, rows, includeHeaders}) => {
        const tableNode = $createTableNodeWithDimensions(
          Number(rows),
          Number(columns),
          includeHeaders,
        );
        $insertNodes([tableNode]);
        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [cellContext, cellEditorConfig, children, editor]);

  return null;
}
