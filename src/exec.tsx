import { aboutCommand } from "./cmd/aboutCommand";
import { helloCommand } from "./cmd/helloCommand";
import { helpCommand } from "./cmd/helpCommand";
import type { Argument, Command } from "./components/Terminal";

export interface CommandDefinition {
   help: string[];
   exec: (args: Argument[]) => string[];
}

export const cmds: Record<string, CommandDefinition> = {
   help: helpCommand,
   hello: helloCommand,
   about: aboutCommand,
};

export function execCommand(command: Command): string[] {
   if (!cmds[command.cmd]) {
      throw new Error(`'${command.cmd}': command not found`);
   }

   return cmds[command.cmd].exec(command.arguments);
}

function checkSyntax(raw: string) {
   if (!/(\S+)+/.test(raw)) {
      throw new Error("Invalid syntax");
   } else if (!/"(\\"|[^"])*"/.test(raw) && raw.includes('"')) {
      throw new Error('Invalid syntax: missing closing quotation (")');
   }
}

export function runCommand(raw: string): Command {
   const parts = raw.split(" ");
   const command: Command = {
      raw,
      cmd: parts[0],
      arguments: [],
      result: [],
   };

   try {
      checkSyntax(raw);
      command.arguments = parseArgs(raw);
      command.result = execCommand(command);
   } catch (e: any) {
      command.result = e.message.split("\n").map((item: string) => `<span class="red">${item}</span>`);
   }

   return command;
}

function parseArgs(raw: string): Argument[] {
   const rawArgs = raw.split(" ").slice(1);
   const args: Argument[] = [];

   // Loop through each arg
   for (let i = 0; i < rawArgs.length; ++i) {
      const arg = rawArgs[i];
      const currentArg: Argument = {
         key: arg,
      };

      if (arg.startsWith("--") && arg !== "--") {
         // If an argument starts with `--` we expect there to be a value proceeding it
         if (!rawArgs[i + 1]) throw new Error(`Argument expected after ${arg}`);

         if (rawArgs[i + 1].startsWith('"')) {
            let len = 0;

            while (!rawArgs[i + len].endsWith('"')) ++len;

            currentArg.value = rawArgs
               .slice(i + 1, i + len + 1)
               .join(" ")
               .replaceAll(/"/g, "");
            currentArg.quoted = true;
            i += len;
         }
      }

      args.push(currentArg);
   }

   return args;
}
