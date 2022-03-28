import {lazy, Suspense} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import AppHeader from "../appHeader/AppHeader";
import Spinner from '../spinner/Spinner';

const Page404 = lazy(() => import('../pages/404'));
const MainPage = lazy(() => import('../pages/MainPage'));
const ComicsPage = lazy(() => import('../pages/ComicsPage'));
const SingleComicLayout = lazy(() => import('../pages/singleComicLayout/SingleComicLayout'));
const SingleCharacterLayout = lazy(() => import('../pages/singleCharacterLayout/SingleCharacterLayout'));
const SinglePage = lazy(() => import('../pages/SinglePage'));

/* SEO - это search engine optimization или поисковоя оптимизация 
   Когда я что-то гуглю то мы видим как сайты выстраиваются в целый список по порядку 
   Если не считать рекламные ссылки в самом начале то от такой оптимизации зависит позиция рессурса 
   Чем лучше меры соблюдены тем выше ссылка в списке 
   Ключовые слова и такими вещами уже занимаются SEO специалисты, но нам как разработчикам нужно сделать так что бы сайт
быстро грузился, гугловскии роботам важно что бы сайт быстро грузился 

    Так же важно правильно использовать верстку. Можно скачать Markup Validation Service 
    Важно! там где нужно использовать списки - использовать спики, там где правильные аттрибуты типа alt - использовать alt
    SEO очень важно что бы был один ЗАГОЛОВОК ПЕРВОГО ПОРЯДКА, так же различные методеги и тд. Об этом всём можно почитать
в ССЫЛКЕ которые ваня подключил к уроку

    То-есть робот гугла смотрит нашу html страницу ! 
    НО ЧТО ДЕЛАТЬ ЕСЛИ У НАС В ПРОЕКТЕ ВЕСЬ КОД НАПИСАН НА РЕАКТЕ ?
    Ведь у нас папка html - полностью пустая, весь хтмл код находится в скриптах 
    
    Что бы обойти эту проблема используют Сервер Сайт Рендреинг
    То-есть рендерят сайт на стороннем сервере
    Для этого используют фреймворк NextJs
    
    Важно что бы Метатеги и Тайтлы были на каждой странице РАЗНЫМИ
    Но у нас они на каждой страницы одинаковы за счет того что мы их один раз прописали в index.html
    Что бы решить эту проблему - нам понадобиться Реакт Хелмет
    
    Начнем с MainPage, импортируем в него helmet*/

const App = () => {
    return (
        <Router>
            <div className="app">
                <AppHeader/>
                <main>
                    <Suspense fallback={<Spinner/>}>
                        <Switch>
                            <Route exact path="/">
                                <MainPage/>
                            </Route>
                            <Route exact path="/comics">
                                <ComicsPage/>
                            </Route>
                            <Route exact path="/comics/:id">
                                <SinglePage Component={SingleComicLayout} dataType='comic'/>
                            </Route>
                            <Route exact path="/characters/:id">
                                <SinglePage Component={SingleCharacterLayout} dataType='character'/>
                            </Route>
                            <Route path="*">
                                <Page404/>
                            </Route>
                        </Switch>
                    </Suspense>
                </main>
            </div>
        </Router>
    )
}

export default App;