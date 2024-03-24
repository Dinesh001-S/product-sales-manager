import { Route, Routes } from 'react-router-dom'; // Import BrowserRouter
import './App.css';
import Navbar from './components/Navbar';
import Bill from './components/pages/bill';
import Inventory from './components/pages/Inventory'; // Correct typo in component name
import Analytics from './components/pages/analytics';
import Login from './components/pages/login';
import Signup from './components/pages/signup';

function App() {
  return (
    <div className="App">
        <Navbar/>
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/bill' element={<Bill/>}/>
          <Route path='/inventory' element={<Inventory/>}/> {/* Corrected path to 'inventory' */}
          <Route path='/analytics' element={<Analytics/>}/>
        </Routes>
    </div>
  );
}

export default App;