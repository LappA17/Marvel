import {Link, NavLink} from "react-router-dom";
import './appHeader.scss';

const AppHeader = () => {
    
    return (
        <header className="app__header">
            <h1 className="app__title">
                <Link to="/">
                    <span>Marvel</span> information portal
                </Link>
            </h1>
            <nav className="app__menu">
                <ul>
                    <li><NavLink 
                                end 
                                // activeStyle={{'color': '#9f0013'}}
                                style={({isActive}) => ({color: isActive ? "#9f0013" : 'inherit'})} 
                                to="/">Characters</NavLink></li>
                    /
                    <li><NavLink 
                                /*end в самом конце урока Ваня удалил end(или exact в 5 версии) для того что бы при 
нажатие на Комикс, когда нас перекидывает на этот Комикс у нас в правом верхнем углу дальше горел Comics крассным цветом
что бы пользователь дальше понимал что он там. Удаляем мы для того что бы все ссылочки которые содержали /comics тоже
окрашивались в этот цвет. Это работает из-за не строгового сравнение строк в аттрибуте to или аттрибуте path, потому
что весь наш путь в юрл содержит /comics те http://localhost:3000/comics/8461 и условие срабатывает  */ 
                                //</li>activeStyle={{'color': '#9f0013'}} 
                                style={({isActive}) => ({color: isActive ? "#9f0013" : 'inherit'})}
                                to="/comics">Comics</NavLink></li>
                                
                </ul>
            </nav>
        </header>
    )
}

export default AppHeader;