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

const SingleComic = () => {
   
    const {comicId} = useParams();
    const [comic, setComic] = useState(null)

    const {loading, error, getComic, clearError} = useMarvelService();

    useEffect(() => {
        updateComic()
    }, [comicId])

    const updateComic = () => {
        clearError();
        getComic(comicId)
            .then(onComicLoaded)
    }

    const onComicLoaded = (comic) => {
        setComic(comic);
    }
   
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !comic) ? <View comic={comic}/> : null;

    return (
        <>
            {errorMessage}
            {spinner}
            {content}
        </>
    )
}

const View = ({comic}) => {
    const {title, description, pageCount, thumbnail, language, price} = comic;

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