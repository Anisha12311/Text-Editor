import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  MenuTextMatch,
  useBasicTypeaheadTriggerMatch,
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import {useCallback, useEffect, useMemo, useState} from 'react';
import * as React from 'react';

import AddIcon from "@mui/icons-material/Add";
import {$createMentionNode} from '../node/MentionNode';
import { Avatar, Box, Chip, IconButton, Stack, Typography } from '@mui/material';

const PUNCTUATION =
  '\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%\'"~=<>_:;';
const NAME = '\\b[A-Z][^\\s' + PUNCTUATION + ']';

const DocumentMentionsRegex = {
  NAME,
  PUNCTUATION,
};

const PUNC = DocumentMentionsRegex.PUNCTUATION;

const TRIGGERS = ['@'].join('');

// Chars we expect to see in a mention (non-space, non-punctuation).
const VALID_CHARS = '[^' + TRIGGERS + PUNC + '\\s]';

// Non-standard series of chars. Each series must be preceded and followed by
// a valid char.
const VALID_JOINS =
  '(?:' +
  '\\.[ |$]|' + // E.g. "r. " in "Mr. Smith"
  ' |' + // E.g. " " in "Josh Duck"
  '[' +
  PUNC +
  ']|' + // E.g. "-' in "Salier-Hellendag"
  ')';

const LENGTH_LIMIT = 75;

const AtSignMentionsRegex = new RegExp(
  '(^|\\s|\\()(' +
    '[' +
    TRIGGERS +
    ']' +
    '((?:' +
    VALID_CHARS +
    VALID_JOINS +
    '){0,' +
    LENGTH_LIMIT +
    '})' +
    ')$',
);

// 50 is the longest alias length limit.
const ALIAS_LENGTH_LIMIT = 50;

// Regex used to match alias.
const AtSignMentionsRegexAliasRegex = new RegExp(
  '(^|\\s|\\()(' +
    '[' +
    TRIGGERS +
    ']' +
    '((?:' +
    VALID_CHARS +
    '){0,' +
    ALIAS_LENGTH_LIMIT +
    '})' +
    ')$',
);

// At most, 5 suggestions are shown in the popup.
const SUGGESTION_LIST_LENGTH_LIMIT = 5;


export default function NewMentionsPlugin({suggestions,profileColor } : any): JSX.Element | null {

  console.log("suggestions", suggestions)
const mentionsCache = new Map();

const dummyMentionsData = suggestions
const dummyLookupService = {
  search(string: string, callback: (results: any) => void): void {
    setTimeout(() => {
      const results = dummyMentionsData?.filter((mention:any) =>
        mention?.name?.toLowerCase().includes(string.toLowerCase()),
      );
      callback(results);
    }, 500);
  },
};

function useMentionLookupService(mentionString: string | null) {
  const [results, setResults] = useState<Array<string>>([]);

  useEffect(() => {
    const cachedResults = mentionsCache.get(mentionString);

    if (mentionString == null) {
      setResults([]);
      return;
    }

    if (cachedResults === null) {
      return;
    } else if (cachedResults !== undefined) {
      setResults(cachedResults);
      return;
    }

    mentionsCache.set(mentionString, null);
    dummyLookupService.search(mentionString, (newResults) => {
      mentionsCache.set(mentionString, newResults);
      setResults(newResults);
    });
  }, [mentionString]);

  return results;
}

function checkForAtSignMentions(
  text: string,
  minMatchLength: number,
): MenuTextMatch | null {
  let match = AtSignMentionsRegex.exec(text);

  if (match === null) {
    match = AtSignMentionsRegexAliasRegex.exec(text);
  }
  if (match !== null) {
    // The strategy ignores leading whitespace but we need to know it's
    // length to add it to the leadOffset
    const maybeLeadingWhitespace = match[1];

    const matchingString = match[3];
    if (matchingString.length >= minMatchLength) {
      return {
        leadOffset: match.index + maybeLeadingWhitespace.length,
        matchingString,
        replaceableString: match[2],
      };
    }
  }
  return null;
}

function getPossibleQueryMatch(text: string): MenuTextMatch | null {
  return checkForAtSignMentions(text, 1);
}
 const getInitials = (name: string) => {
	if (!name) {
		return "";
	}
	try {
		const names = name.split(" ");
		return names
			.map(na => na.charAt(0))
			.join("")
			.toUpperCase();
	} catch (error) {
		return "";
	}
};


function MentionsTypeaheadMenuItem({
  onClick,
  option,
}: {
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  option: any;

}) {
console.log("profileColor child",option.id  )



// Check if the element is found

  return (
    <Box style = {{ marginTop : '10px'}} >
    {" "}
    <Chip
      color="default"
      size="medium"
      variant="filled"
      onClick = {onClick}
      sx={{
        "&.MuiChip-filled": {
          height: "38px",
          borderRadius: "100px",
          
        },
       
      }}
      avatar={
        <Avatar
          sx={{
             backgroundColor: profileColor(option.id as any).backgroundColor,
            color: profileColor(option.id as any).color,
            width: 24,
            height: 24,
            fontSize: 12,
            fontWeight: "400",
          }}
          alt=""
        >
          {getInitials(option.name as any)} 
        </Avatar>
      }
      label={
        <Box sx={{ cursor: "pointer", }}>
          <Stack direction="row" justifyContent={"center"}>
            <Box pl={1.5} sx={{ cursor: "pointer" }}>
              <Typography
                sx={{ cursor: "pointer" ,fontSize: "0.813rem",
                  fontWeight: 400,
                  letterSpacing: "0.16px",
                  lineHeight: "18px"}}
                
                color={"custom.mentinedname"}
                width={"140px"}
                overflow={"hidden"}
                textOverflow={"ellipsis"}
                whiteSpace={"nowrap"}
                display={"block"}
              >
                {option.name}
              </Typography>
            </Box>
            <Box>
              <IconButton
                sx={{
                  padding: "0px",
                }}
                aria-label="add"
                onClick = {onClick}
              >
                <AddIcon
                  fontSize="small"
                  
                />
              </IconButton>
            </Box>
          </Stack>
        </Box>
      }
    />{" "}
  </Box>
  );
}
  const [editor] = useLexicalComposerContext();

  const [queryString, setQueryString] = useState<string | null>(null);

  const results = useMentionLookupService(queryString);

  const checkForSlashTriggerMatch = useBasicTypeaheadTriggerMatch('/', {
    minLength: 0,
  });

  const options:any = useMemo(
    () =>
      results
        .map(
          (result) =>
          result
        )
        .slice(0, SUGGESTION_LIST_LENGTH_LIMIT),
    [results],
  );

  const onSelectOption = useCallback(
    (
      selectedOption: any,
      nodeToReplace: any | null,
      closeMenu: () => void,
    ) => {
      editor.update(() => {
        const mentionNode:any = $createMentionNode(selectedOption.name);
        if (nodeToReplace) {
          nodeToReplace.replace(mentionNode);
        }
        mentionNode.select();
        closeMenu();
      });
    },
    [editor],
  );

  const checkForMentionMatch = useCallback(
    (text: string) => {
      const slashMatch = checkForSlashTriggerMatch(text, editor);
      if (slashMatch !== null) {
        return null;
      }
      return getPossibleQueryMatch(text);
    },
    [checkForSlashTriggerMatch, editor],
  );


  return (
    <LexicalTypeaheadMenuPlugin<MenuOption>
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForMentionMatch}
      options={options}
      menuRenderFn={(
        anchorElementRef,
        {selectedIndex, selectOptionAndCleanUp, setHighlightedIndex},
      ) =>
        anchorElementRef  && results.length
          ? (
              <Box className="typeahead-popover mentions-menu">
                
                  {options.map((option:any,i:number) => (
                    <MentionsTypeaheadMenuItem
                      index={i}
                      isSelected={selectedIndex === i}
                      onClick={() => {
                        setHighlightedIndex(i);
                        selectOptionAndCleanUp(option);
                      }}
                      onMouseEnter={() => {
                        setHighlightedIndex(i);
                      }}
                      key={option.id}
                      option={option}
                    />
                  ))}
             
              </Box>)
             
            
            
          : null
      }
    />
  );
}