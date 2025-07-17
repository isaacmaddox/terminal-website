import Terminal from "./components/Terminal";

export function PromptText() {
   return (
      <span className="prompt">
         [<span className="blue">visitor</span>@<span className="green">root</span>]$
      </span>
   );
}

function App() {
   return <Terminal />;
}

export default App;
