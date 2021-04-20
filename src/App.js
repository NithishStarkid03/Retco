import React from 'react'
import Tabs from "./components/Tabs";
import { BrowserRouter} from "react-router-dom";
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <BrowserRouter>
    <div>
      <Tabs/>
    </div>
    </BrowserRouter>
  );
}
  
export default App;