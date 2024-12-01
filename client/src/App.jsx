import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Services } from './pages/Services';
import { ErrorPage } from './pages/ErrorPage';

function App() {


  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />} >
            <Route  path='/' element={<Home />}/>
            <Route path='services' element={<Services />} />
            <Route path='*' element={<ErrorPage />}/>
          </Route>
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
