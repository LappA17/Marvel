/*Ваня захотел сделать так что бы все страницы были в pages, по-этому мы из нашего Компонента SingleComic переносим всё
вот сюда 
  И файлик стилей мы так же переносим в pages и соотвественно его переминовали
  Папку SingleComic удаляем */

/* match - это объект с данными о том как именно path совпал с текущим адрессом и в нем же есть тот параметр id, который
мы с вами передавали. Грубо говоря этот объект отвечает за url адресс, но у него есть много свойств который используют
   history - это АПИ для организации перехода между страницами - ТО-ЕСТЬ ЕСЛИ НАМ В РЕАЛЬНОЙ РАБОТЕ ПОНАДОБИТЬСЯ ПЕРЕНАПРАВЛЯТЬ
ПОЛЬЗОВАТЕЛЕЙ ПО РЕАЛЬНЫМ СЫЛОЧКАМ КОТОРЫЕ В ЮРЛ АДРЕССЕ ТО МОЖНО ИСПОЛЬЗОВАТЬ ЭТОТ АПИ
   location - объект, который отвечает за состояние и положение нашего Рутера
   
   useParams - хук который возвращает объект в формате ключ/значение, с нашими параметрами, которые были в url адрессе.
У нас есть страничка SingleComicPage которая должна получить id из url. По-этому именно в этом Компонент мы будет 
использовать хук useParams */
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import './singleComicPage.scss';
//import xMen from '../../resources/img/x-men.png'; Вместо него поместили thumbnail

const SingleComic = () => {
    /*const smth = useParams()
    console.log(smth)  На странице получаем такой вот объект {comicId: '14035'}. Те ключ/знаечние, при чем ключ мы создвали
вручную, мы его прописали вот здесь :comicId - МЫ ЕГО ПРОПИСЫВАЕМ ВРУЧНУЮ И ДАЕМ НАЗВАНИЕ СЛУЧАЙНОЕ. И мы получаем 
id который мы можем уже использовать */

    const {comicId} = useParams();
    /*Дальше все идет по классике, запрос по это значение, получить данные и вставить их на страницу */
    const [comic, setComic] = useState(null) //В этой переменной будут все данные об нашем комиксе

    //вытаскиваем нужные нам фции
    const {loading, error, getComic, clearError} = useMarvelService();

    useEffect(() => {
        updateComic()
    }, [comicId]) //обновлять Комикс мы будем по уникальному индификатору
    /*Когда пользователь находится на страничке одиночного комикса(а не там где все, те когда пользователь уже кликнул
на комикс) он можем взять и в url поменять id, те дописать не comics/14035, а 7777 те на ДРУГОЙ КОМИКС. И что бы 
у нас этот Компонент правильно перерисовался - мы будем использовать useEffect и будем отталкивать от этого параметра 
comicId, который приходит нам из url адресса  */

    const updateComic = () => {
        /* const {charId} = props;
        if (!charId) {
            return;
        } Нам не какие Пропсы не приходят - поэтоу удаляем */
        clearError();/*clearError оставляем потому что пользователь можем вести в comics/hdahsdhahd что-то рандомное и 
мы все равно получаем страничку*/
        getComic(comicId)
            .then(onComicLoaded)
    }

    const onComicLoaded = (comic) => {
        setComic(comic);
    }
    /*Те мы делаем запрос в getComic(comicId) и если запрос успешен то мы устанавливаем состояние через setComic
и записываем его в comic */


    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !comic) ? <View comic={comic}/> : null;

    return (
        <>
            {errorMessage}
            {spinner}
            {content}
        </>

        /* <div className="single-comic">
            <img src={xMen} alt="x-men" className="single-comic__img"/>
            <div className="single-comic__info">
                <h2 className="single-comic__name">X-Men: Days of Future Past</h2>
                <p className="single-comic__descr">Re-live the legendary first journey into the dystopian future of 2013 - where Sentinels stalk the Earth, and the X-Men are humanity's only hope...until they die! Also featuring the first appearance of Alpha Flight, the return of the Wendigo, the history of the X-Men from Cyclops himself...and a demon for Christmas!?</p>
                <p className="single-comic__descr">144 pages</p>
                <p className="single-comic__descr">Language: en-us</p>
                <div className="single-comic__price">9.99$</div>
            </div>
            <a href="#" className="single-comic__back">Back to all</a>
        </div> Перенесли во View */
    )
}

//Создадим Компонент который будет отвечать чисто за вёрстку
/* Будет получать в себя объект comic */
const View = ({comic}) => {
    //Получать какие-то данные
    const {title, description, pageCount, thumbnail, language, price} = comic;
    /*Точно так же получаем конкретные даннеы, для того что бы при помощи условий встивить либо Спинер, либо Компонент Ошибки
либо Контент который нас интересует */

    //Возвращает вёрстку
    return (
        <div className="single-comic">
            <img src={thumbnail} alt={title} className="single-comic__img"/>
            <div className="single-comic__info">
                <h2 className="single-comic__name">{title}</h2>
                <p className="single-comic__descr">{description}</p>
                <p className="single-comic__descr">{pageCount}</p>
                <p className="single-comic__descr">Language: {language}</p>
                <div className="single-comic__price">{price}</div>
            </div>
            <Link to="/comics" className="single-comic__back">Back to all</Link>
        </div>
    )
}

export default SingleComic;