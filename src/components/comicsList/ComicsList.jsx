import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom'

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './comicsList.scss';

/*Когда мы перейдем на страничку Комиксов то мы помним что у нас там есть каждый отдельный Комикс и при клике на него
МЫ БУДЕМ ФОРМИРОВАТЬ ОТДЕЛЬНУЮ СТРАНИЦУ С ПОДРОБНЫМ ОПИСАНИЕМ ЭТОГО КОМИКСА
  Нам Рутер умеет формировать и динамические пути - когда мы кликаем на какой-то ТОВАР В ИНЕТ МАГАЗИНЕ или В НАШЕМ СЛУЧАЕ 
НА КОМИКС, то у нас в url пути добавляется Слеш и какая-то сущность
  Импортируем Link из реакт рутер дома и отправляемся в часть где мы формируем эту вёрстку 
  Вместо a href прописываем <Link to={`/comics/`}> 
  И вот здесь после второго слеша нам нужно укзаать какой комикс будет открываться, его нужно как-то индефицировать что бы
говорить что мы открываем чётко вот такой-то Комикс. 
  Для этого нам из данных подойдет id. Мы открываем МарвелСервис и здесь было поле id у нашего комикса - те уникальный
индификатор
  ${item.id} вот почему мы изначально открывали бектики, а аттрибут key={i} у нас отсавлен как номер по порядку по той приччине
что на момент записи урока Ваней сервис баговал и отдавал комиксы с повторениеми. Но теперь всё работает нормально и мы 
пропишем key={item.id} а в map как аргументы отдаем только один item 
  НО У НАС ОПЯТЬ ПОЛЕЗЛИ ОШИБКИ В КОНСОЛЬ О ПОВТОРЕНИЕ id ПО-ЭТОМУ ВЕРНЕМ СТАРЫЙ КОД !!! */

  /* Теперь у нас при нажатие на Комикс нам перекидывает на другую страницу и при этом в Слешу дописывается id
   Сейчас мы вспоминаем что у нас в Сервисе есть метод getComics, который получает конкретные Комикс через уникальный 
индификатор. 
   Логика такая - когда мы переходим из этого линка /comics/${item.id}, то мы должны загружать следующую страницу, которая
будет получать вот этот вот уникальный индификатор item.id, как раз по нему она будет делать запрос, получать данные и 
уже отрисовывать то что у нас там получиться на страничке.
   Эта страницу у нас находится в Компоненте SingleComic ! 
   Ваня захотел сделать так что бы все страницы были в pages, по-этому мы из нашего Компонента SingleComic переносим всё
в SingleComicPage*/

const ComicsList = () => {

    const [comicsList, setComicsList] = useState([]);
    const [newItemLoading, setnewItemLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [comicsEnded, setComicsEnded] = useState(false);

    const {loading, error, getAllComics} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setnewItemLoading(false) : setnewItemLoading(true);
        getAllComics(offset)
            .then(onComicsListLoaded)
    }

    const onComicsListLoaded = (newComicsList) => {
        let ended = false;
        if (newComicsList.length < 8) {
            ended = true;
        }
        setComicsList([...comicsList, ...newComicsList]);
        setnewItemLoading(false);
        setOffset(offset + 8);
        setComicsEnded(ended);
    }

    function renderItems (arr) {
        const items = arr.map((item, i) => {
            return (
                <li className="comics__item" key={i}>
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img"/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </Link>
                </li>
            )
        })

        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }

    const items = renderItems(comicsList);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;

    return (
        <div className="comics__list">
            {errorMessage}
            {spinner}
            {items}
            <button 
                disabled={newItemLoading} 
                style={{'display' : comicsEnded ? 'none' : 'block'}}
                className="button button__main button__long"
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;