import type { Argument } from "../components/Terminal";
import { cmds, type CommandDefinition } from "../exec";

export const helpCommand: CommandDefinition = {
   help: [
      "&nbsp;",
      "<span class='yellow bold'>help</span>             Return this list",
      "<span class='yellow bold'>hello</span>            Say hi to me!",
      "<span class='yellow bold'>about</span>            Learn a little bit about me",
      "<span class='yellow bold'>socials</span>          Get links to my social profiles",
      "<span class='yellow bold'>clear</span>            Clear the terminal (alias: Ctrl + L)",
      "&nbsp;",
   ],
   exec: (args: Argument[]) => {
      if (args.length === 0) {
         return helpCommand.help;
      }

      if (cmds[args[0].key]) {
         return ["&nbsp;", ...cmds[args[0].key].help, "&nbsp;"];
      }

      throw new Error(`help: '${args[0].key}' is not a known command`);
   },
};
