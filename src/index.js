import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { store } from './store/store.js'
import { Provider } from 'react-redux'
import { BrowserRouter } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PageNotFound from './components/PageNotFound';
const theme = createTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#4F3084',
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },


  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
   // <BrowserRouter> 
    <Router basename={process.env.PUBLIC_URL}>
    {/* <Router > */}
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          {/* <App /> */}
          <Routes>
            <Route  path="/:branch_id" element={<App/>} />
            <Route path="*" element={<PageNotFound message="Oops.. We can't find that" />} />
          </Routes>
        </Provider>
      </ThemeProvider>

    </Router>
   // </BrowserRouter> 
  //  </React.StrictMode> */}
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
