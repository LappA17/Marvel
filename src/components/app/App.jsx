import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import {MainPage, ComicsPage} from '../pages';
import AppHeader from "../appHeader/AppHeader";

/*Просто прописываем в консоль npm i react-router-dom@6.1.0 --save потому что депенсис. И так мы обновляемся до новой версии
  В package json теперь пишет версию 6.1.0 
  Если мы прям сейчас запутим приложение ./src/components/app/App.jsx
Attempted import error: 'Switch' is not exported from 'react-router-dom'. 
  Потому что Switch заменили на новый Компонент на Routes(маршруты)
  Теперь везде где был Switch - заменяем на Routes
  И всё равно получаем ошибку - дело в том что теперь нужно Компоненты страниц помещать не в качестве дочерного Комопнента, 
а во внутрь специального пропа element 
  <Route exact path="/" element={<MainPage/>}> то-есть  мы наш MainPage поместили в этот проп element
  </Route> - удаляем, потому что мы можем сразу закрыть на Router
  Теперь exact - НЕ НУЖЕН, Компонента сам понимает уже по дефолту
  Теперь можно размещать Компоненты в довольном порядке*/
const App = () => {
    return (
        <Router>
            <div className="app">
                <AppHeader/>
                <main>
                    <Routes>
                        <Route exact path="/" element={<MainPage/>}/>
                        <Route path="/comics" element={<ComicsPage/>}/>                         
                    </Routes>
                </main>
            </div>
        </Router>
    )
}

export default App;