import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';
import './satoshi.css';
import { Provider } from "react-redux";
import store from "./_redux/store.tsx"; // Assurez-vous de fournir le chemin correct

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    {/* <React.StrictMode> */}
      <Router>
        <App />
      </Router>
    {/* </React.StrictMode> */}
  </Provider>

);





