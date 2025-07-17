import { useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { PromptText } from "../App";
import { execCommand } from "../exec";
import TerminalPrompt from "./TerminalPrompt";

export interface Command {
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

   function handleCommand(rawCmd: string) {
      const args = rawCmd.split(" ");
      const command = args.splice(0, 1)[0];
      const cmd: Command = {
         cmd: command,
         arguments: [],
         result: [],
      };

      for (let i = 0; i < args.length; ++i) {
         const key = args[i];

         if (key.startsWith("--") && args[i + 1]) {
            // If the argument starts with double dashes we should expect an argument following
            // We should allow single-token arguments, and multi-token ones surrounded by quotes
            let argValue = args[i + 1];

            if (argValue.startsWith('"')) {
               // Here, we should go until we find the argument that ends with `"`
               for (let j = i + 2; j < args.length; ++j) {
                  i = j + 1;
                  argValue += ` ${args[j]}`;
                  console.log(argValue);
                  if (argValue.endsWith('"')) {
                     // Once the argument ends with a quote, trim the quotes off and we have our argument
                     argValue = argValue.slice(1, argValue.length - 1);
                     break;
                  }
               }
               cmd.arguments.push({
                  key,
                  value: argValue,
                  quoted: true,
               });
            } else {
               // Here, we are just expecting a single token
               cmd.arguments.push({
                  key,
                  value: argValue,
               });
               ++i;
            }
         } else if (key.startsWith("-")) {
            cmd.arguments.push({
               key,
            });
         } else {
            cmd.arguments.push({
               key,
            });
         }
      }

      try {
         console.log(cmd);
         cmd.result = execCommand(cmd);
      } catch (e: any) {
         cmd.result = e.message.split("\n").map((item: string) => `<span class="red">${item}</span>`);
      }

      setHistory((h) => [...h, cmd].slice(0, 49));
   }

   return (
      <div id="terminal">
         {history?.map((command, idx) => {
            return (
               <Fragment key={idx}>
                  <div className="terminal-line">
                     <PromptText />
                     <span className="command">{command.cmd}</span>
                     {command.arguments.map((arg, idx2) => (
                        <Fragment key={idx2}>
                           <span className={`argument ${arg.value || arg.key.startsWith("-") ? "has-value" : ""}`}>
                              {arg.key}
                           </span>
                           {arg.value && (
                              <span className="argument-value">
                                 {arg.quoted && <>&quot;</>}
                                 {arg.value}
                                 {arg.quoted && <>&quot;</>}
                              </span>
                           )}
                        </Fragment>
                     ))}
                  </div>
                  {command.result.map((line, idx) => {
                     if (line === "") return;
                     return (
                        <div
                           key={idx}
                           className="terminal-line text"
                           dangerouslySetInnerHTML={{ __html: line.replaceAll(/\s\s/g, " &nbsp;") }}></div>
                     );
                  })}
               </Fragment>
            );
         })}
         <TerminalPrompt
            commandCallback={handleCommand}
            clearCallback={clearHistory}
            historyCallback={getHistoricCommand}
         />
      </div>
   );
}
