import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import {MainPage, ComicsPage, Page404, SingleComicPage} from '../pages';
import AppHeader from "../appHeader/AppHeader";

/* Если мы начнем в проекте переходить на несуществующее страницы, те после слеша вписывать /sth то кроме шапки у нас больше ничего
грузиться не будет. Происходит это потому что у нас нет ниодного совпадение по Роутам в нашем Рутере
   Если мы хотим что бы на любой неправильный url отображалась стратовая страница то мы помещаем базовый Роут в конец 
списка без уточняющего аттрибута - те подставить Route c / после /comics и удалить exact 
    Но обычно нужно поместить 404 ошибку. Нам нужно дословно сделать такую конструкцию, что если у нас не подошел не один
из Роутов 
    Cоздаем <Route path="*"> - обычно заглушка на несуществующую страницу идет как заглушка и отдельная страница, по-этому
в структуре папок(pages) создадим новую страницу */

/* Мы добавляем SingleComicPage в вёрстку и в path="/comics нам нужно указать а что у нас должно быть дополнительно 
в url пути что бы грузилась именно страничка SingleComicPage. И ДЛЯ ЭТОГО МЫ МОЖЕМ УКАЗАТЬ ИМЕННО УНИКАЛЬНЫЙ ИНДИФИКАТОР,
ЗДЕСЬ МЫ САМИ ПРИДУМЫВАЕМ НАЗВАНИЕ И НАПИШЕМ /:comicId
   /:comicId - будет уникальный индификатор КАЖДОГО ОТДЕЛЬНОГО КОМИКСА */
const App = () => {
    return (
        <Router>
            <div className="app">
                <AppHeader/>
                <main>
                    <Routes>
                        <Route path="/" element={<MainPage/>}/>
                        <Route path="/comics" element={<ComicsPage/>}/> 
                        <Route path="/comics/:comicId" element={<SingleComicPage/>}/>
                        <Route path="*" element={<Page404/>}/>                       
                    </Routes>
                </main>
            </div>
        </Router>
    )
}

export default App;