import { type CommandDefinition } from "../exec";

export const aboutCommand: CommandDefinition = {
   help: ["<span class='yellow bold'>about</span>: Learn a little more about me", "  Usage: about"],
   exec: () => {
      return ["This is going to be a paragraph about me"];
   },
};
