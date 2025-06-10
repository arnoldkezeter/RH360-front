import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';
import './satoshi.css';
import { Provider } from "react-redux";
import store from "./_redux/store.tsx"; // Assurez-vous de fournir le chemin correct
import { I18nextProvider } from 'react-i18next';
import i18n from './langages/i18n.tsx';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    {/* <React.StrictMode> */}
    <I18nextProvider i18n={i18n}>
      <Router>
        <App />
      </Router>
    </I18nextProvider >
    {/* </React.StrictMode> */}
  </Provider>

);





