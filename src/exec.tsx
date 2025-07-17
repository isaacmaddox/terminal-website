import type { Argument, Command } from "./components/Terminal";

const cmds: Record<string, (args: Argument[]) => string[]> = {
   help: helpFn,
   hello: (_: Argument[]) => {
      return ["Hello there! I'm <span class='yellow'>Isaac Maddox</span>"];
   },
};

export function execCommand(command: Command): string[] {
   if (!cmds[command.cmd]) {
      throw new Error(`'${command.cmd}': command not found`);
   }

   return cmds[command.cmd](command.arguments);
}

function helpFn(args: Argument[]) {
   if (args.length === 0) {
      return [
         "<span class='yellow'>help</span>             Return this list",
         "<span class='yellow'>hello</span>            Say hi to me!",
         "<span class='yellow'>about</span>            Learn a little bit about me",
         "<span class='yellow'>socials</span>          Get links to my social profiles",
         "<span class='yellow'>clear</span>            Clear the terminal (alias: Ctrl + L)",
      ];
   }

   if (args[0].key === "hello") {
      return [
         "<span class='yellow'>hello</span>            Say hi to me!",
         "&nbsp;",
         "Options:",
         "  --name:                                    Set your name quickly",
         "    <span class='gray'>usage: hello</span> <span class='yellow'>--name \"Isaac Maddox\"</span>",
         "  --email:                                   Set your email quickly",
         "    <span class='gray'>usage: hello</span> <span class='yellow'>--email me@isaacmaddox.net</span>",
      ];
   }

   return [];
}
