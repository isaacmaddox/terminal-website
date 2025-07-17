import { useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { PromptText } from "../App";
import { runCommand } from "../exec";
import TerminalPrompt from "./TerminalPrompt";

export interface Command {
   raw: string;
   cmd: string;
   arguments: Argument[];
   result: string[];
}

export interface Argument {
   key: string;
   value?: string | null;
   quoted?: boolean;
}

export default function Terminal() {
   const [history, setHistory] = useState<Command[]>([]);

   function clearHistory() {
      setHistory([]);
   }

   function getHistoricCommand(idx: number): [Command | undefined, number] {
      if (idx >= 0) return [undefined, history.length];
      return [history.at(idx), history.length];
   }

   function run(raw: string) {
      const result = runCommand(raw);
      setHistory((h) => [...h, result]);
   }

   return (
      <div id="terminal">
         {history?.map((command, idx) => {
            return (
               <Fragment key={idx}>
                  <div className="terminal-line">
                     <PromptText />
                     <span className="command">{command.raw}</span>
                  </div>
                  {command.result.map((line, idx) => {
                     if (line === "") return;
                     return <div key={idx} className="terminal-line text" dangerouslySetInnerHTML={{ __html: line.replaceAll(/\s\s/g, " &nbsp;") }}></div>;
                  })}
               </Fragment>
            );
         })}
         <TerminalPrompt commandCallback={run} clearCallback={clearHistory} historyCallback={getHistoricCommand} />
      </div>
   );
}
