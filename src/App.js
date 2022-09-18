import { BrowserRouter } from "react-router-dom";
import "./App.scss";
import CombineComponent from "./components/combineComponent";
import { NotesProvider } from "./context/notesContext.js/notesContextProvider";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NotesProvider>
          <CombineComponent />
        </NotesProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
