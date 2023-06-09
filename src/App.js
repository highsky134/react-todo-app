import logo from './logo.svg';
import './App.css';
import TodoTemplate from './component/TodoTemplate';
import Footer from './component/layout/Footer';
import Header from './component/layout/Header';
import Join from './component/user/Join';
import { Route, Routes } from 'react-router-dom';
import Login from './component/user/Login';

function App() {
  return (
    <>
      <Header />
      <Routes> 
         <Route path='/' element={ <TodoTemplate /> }/>
         <Route path='/login' element={ <Login /> }/>
         <Route path='/join' element={ <Join /> }/>
      </Routes>
      <Footer />
    </>
  );
}

export default App;
