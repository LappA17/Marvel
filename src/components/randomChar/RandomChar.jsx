import { useState, useEffect } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

const RandomChar = () => {
    const [char, setChar] = useState({})
    /* const [loading, setLoading] = useState(true)
       const [error, setError] = useState(false) У нас уже есть свои с Хука loading и error*/

    //const marvelService = useMarvelService(); ТЕПЕРЬ МЫ ПРОСТО ВЫТАСКИВАЕМ НУЖНУЮ НАМ ФЦИЮ getCharacter НИЖЕ В КОДЕ
    const {loading, error, getCharacter, clearError} = useMarvelService() /*Вместо того кода что выше мы все создали 
при помощи нашего Хука, если раньше мы создавали стейт для loading и error, то сейчас мы просто все вытаскиваем 
из нашего Хука */

    useEffect(() => {
        updateChar();
        const timerId = setInterval(updateChar, 60000);

        return () => {
            clearInterval(timerId)
        }
    }, [])
    
    const onCharLoaded = (char) => {
        //setLoading(false); Мы так же удаляем setLoading, потому что он будет контролироваться из Хука
        setChar(char);
    }

    /* const onCharLoading = () => {
        setLoading(true);
    }

    const onError = () => {
        setError(true);
        setLoading(false);
    } Удаляем потому что в нашем http.hook мы создали ровно тоже самое, у нас там тоже есть setError, setLoading и начало
загрузки мы там тоже обозначали */

/*Функция clearError нам поможет очищать нам Компонент от ошибки, дело в том что в АПИ такое бывает что какой-то id 
остуствует и если вдруг мы получим на месте персонажа какуе-то ошибку, то сколь бы мы не клацали на кнопку try it, новый
персонаж у нас появляться не будет, хотя данные и будут грузится, даже в Таймауте если у нас он оставлен включен. 
  Происходит это потому что в переменную error у нас попадает в наш кастомный хук сообщение с ошибкой, но потом оно
никак не убирается, ошибка остается навсегда. И здесь нам поможем фция clearError
  И ВЫЗЫВАЕМ ЭТУ ФУНКЦИЮ ПРЯМ ПЕРЕД ТЕМ КАК МЫ ДЕЛАЕМ КАЖДЫЙ НОВЫЙ ЗАПРОС
  Теперь при запросе если будет ошибка, то при след нажатие на кнопку try it - она отчиститься */
    const updateChar = () => {
        clearError()
        const id = Math.floor(Math.random() * (1011400 - 1011000)) + 1011000;
        //onCharLoading(); удаляем, потому что у нас setLoading стоит в самом верху прям в начале запроса в http.hook
        //marvelService такой переменной больше нет
        getCharacter(id)
            .then(onCharLoaded)
            //.catch(onError); удаляем, потому что все наши ошибки обрабатываются внутри Хука http
    }

    /* Здесь у нас используются переменные erorr и loading, при этом они к нам уже приходят из наших кастомных хуков */
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !char) ? <View char={char} /> : null;

    return (
        <div className="randomchar">
            {errorMessage}
            {spinner}
            {content}
            <div className="randomchar__static">
                <p className="randomchar__title">
                    Random character for today!<br/>
                    Do you want to get to know him better?
                </p>
                <p className="randomchar__title">
                    Or choose another one
                </p>
                <button onClick={updateChar} className="button button__main">
                    <div className="inner">try it</div>
                </button>
                <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
            </div>
        </div>
    )
}

const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki} = char;
    let imgStyle = {'objectFit' : 'cover'};
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit' : 'contain'};
    }

    return (
        <div className="randomchar__block">
            <img src={thumbnail} alt="Random character" className="randomchar__img" style={imgStyle}/>
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {description}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default RandomChar;