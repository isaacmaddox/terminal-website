import { useEffect, useRef, useState, type ChangeEvent, type CSSProperties, type KeyboardEventHandler } from "react";
import { PromptText } from "../App";
import type { Command } from "./Terminal";

interface TerminalPromptProps {
   commandCallback: (cmd: string) => void;
   clearCallback: () => void;
   historyCallback: (idx: number) => [Command | undefined, number];
}

export default function TerminalPrompt({ commandCallback, clearCallback, historyCallback }: TerminalPromptProps) {
   const [cmd, setCmd] = useState<string>("");
   const [offset, setOffset] = useState<number>(0);
   const [isFocused, setIsFocused] = useState<boolean>(true);
   const [isPaused, setIsPaused] = useState<boolean>(false);
   const [historyIdx, setHistoryIdx] = useState<number>(0);
   const inputRef = useRef<HTMLInputElement>(null);

   function handleBlur() {
      setIsFocused(false);
   }

   function handleFocus() {
      setIsFocused(true);
   }

   function focusInput() {
      inputRef.current?.focus();
   }

   function handleChange(event: ChangeEvent<HTMLInputElement>) {
      setCmd(event.target.value);
      setOffset((o) => Math.min(event.target.value.length, o));
   }

   function updateCmd(cmd: Command, newIdx: number) {
      setCmd(cmd.raw);
      setHistoryIdx(newIdx);
      setOffset(cmd.raw.length);
   }

   const handleKeydown: KeyboardEventHandler<HTMLInputElement> = (event) => {
      if (event.shiftKey) return;

      // Submit command
      if (event.key === "Enter") {
         if (cmd === "clear") {
            clearCallback();
         } else {
            commandCallback(cmd);
         }
         setCmd("");
         setOffset(0);
         setHistoryIdx(0);
         return;
      }

      if (event.key === "l" && event.ctrlKey) {
         event.preventDefault();
         clearCallback();
         setHistoryIdx(0);
         return;
      }

      if (event.key === "ArrowRight") {
         setOffset((o) => Math.max(0, o - 1));
      } else if (event.key === "ArrowLeft") {
         setOffset((o) => Math.min(cmd.length, o + 1));
      } else if (event.key === "ArrowUp") {
         const [cmd, len] = historyCallback(historyIdx - 1);
         if (cmd) {
            // There is a command in the previous slot
            // Put that command in the prompt, and set our current index to the previous slot
            updateCmd(cmd, historyIdx - 1);
         } else {
            // There is not a command in the previous slot.
            // Make sure we are at index len * -1 - 1
            if (historyIdx !== len * -1 - 1) setHistoryIdx(len * -1 - 1);
            setCmd("");
            setOffset(0);
         }
      } else if (event.key === "ArrowDown") {
         const [cmd] = historyCallback(historyIdx + 1);
         if (cmd) {
            // There is a command in the next slot
            // Put that command in the prompt, and set our current index to the next slot
            updateCmd(cmd, historyIdx + 1);
         } else {
            // There is not a command in the next slot
            // Make sure historyIdx = 0
            if (historyIdx !== 0) setHistoryIdx(0);
            setCmd("");
            setOffset(0);
         }
      } else if (event.key === "End") {
         setOffset(0);
      } else if (event.key === "Home") {
         setOffset(cmd.length);
      }
   };

   useEffect(() => {
      setIsPaused(true);
      let to = setTimeout(() => {
         setIsPaused(false);
      }, 500);

      return () => clearTimeout(to);
   }, [cmd]);

   return (
      <div className="terminal-line" onClick={focusInput}>
         <PromptText />
         <input autoComplete="off" type="text" name="command-box" id="command-box" autoFocus onFocus={handleFocus} onBlur={handleBlur} onKeyDown={handleKeydown} onChange={handleChange} value={cmd} ref={inputRef} />
         {isFocused && <div id="caret" style={{ "--offset": offset } as CSSProperties} className={isPaused ? "paused" : ""}></div>}
      </div>
   );
}
