import {Link, NavLink} from "react-router-dom";
import './appHeader.scss';

const AppHeader = () => {
    
    /*Аттрибут exact в NavLink заменился на end 
    В 6 версии activeStyle - удален у НавЛинк ! А она отвечает за стиль активной ссылки
    Раньше было вот так activeStyle={{'color': '#9f0013'}}
    То теперь мы передаем уже в style функцию 
    Функция принимает аргумент который мы с помощью диструктуризации вытаскиваем - isActive 
    isActive который будет автоматически приходить в нашу ссылку и отвечает за то что наша ссылка либо активна либо нет
    ({color:}) - здесь мы возвращаем объект, по-этому у нас круглые скобки, а внутри фигурные скобки - тот объект который будем возвращать
    */
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
                                end 
                                //</li>activeStyle={{'color': '#9f0013'}} 
                                style={({isActive}) => ({color: isActive ? "#9f0013" : 'inherit'})}
                                to="/comics">Comics</NavLink></li>
                </ul>
            </nav>
        </header>
    )
}

export default AppHeader;