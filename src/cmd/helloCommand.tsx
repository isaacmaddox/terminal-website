import type { Argument } from "../components/Terminal";
import { type CommandDefinition } from "../exec";

export const helloCommand: CommandDefinition = {
   help: [
      "<span class='yellow bold'>hello</span>: Say hi to me!",
      "  Usage: hello <span class='gray'>[--name <string>]? [--email <string>]?</span>",
      "Options:",
      "  --(n)ame           Quickly include your name in your email",
      "  --(e)mail          Define your email to speed up the process",
   ],
   exec: (args: Argument[]) => {
      return ["Hello there!"];
   },
};
