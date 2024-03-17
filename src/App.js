import { Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Bill from './components/pages/bill';
import Inventry from './components/pages/Inventry';
import Analytics from './components/pages/analytics';
import Login from './components/pages/login';

function App() {
  return (
    <div className="App">
      <Navbar/>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/bill' element={<Bill/>}/>
        <Route path='/Inventry' element={<Inventry/>}/>
        <Route path='/analytics' element={<Analytics/>}/>
      </Routes>
    </div>
  );
}

export default App;
