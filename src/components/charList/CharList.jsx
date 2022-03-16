import {useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';
import './charList.scss';

const CharList = (props) => {
    const [charList, setCharList] = useState([])
 /* const [loading, setLoading] = useState(true) ОЧЕНЬ ВАЖНО ОБРАТИ ВНИМАНИЕ ЧТО ЗДЕСЬ ЛОАДИНГ В ТРУ, А В ХУКЕ ФОЛС
    const [error, setError] = useState(false) уже есть в кастомных хуках */
    const [newItemLoading, setNewItemLoading] = useState(false)
    const [offset, setOffset] = useState(210)
    const [charEnded, setCharEnded] = useState(false)

    //const marvelService = new MarvelService(); потому что getAllCharacters мы уже вытасикваем с useMarvelService() 
    const {loading, error, getAllCharacters} = useMarvelService(); /* Это идет вызов функции, это значит что когда она будет вызвана, внутри её
все эти сущности будут создаваться. В том числе на первой стрчоки в useMarvelService у нас есть вызов функции useHttp,
это значит что внутри useMarvelService у нас будут вызываться еще одна функция.
    То-есть каждый раз когда мы создаем здесь сервис const marvelService = useMarvelService() в него так же будет приходить
наш useHttp(самосозданный хук) и каждый раз мы будем создавать новый стейт loading и новый стейт error, который мы сможем
использовать внутри каждого Компонента 
    ОБРАТИ ВНИМАНИЕ ЧТО МЫ В useMarvelSerivce ИМПОРТИРОВАЛИ С НАШЕГО httpHook loading и error и мы его нигде там не использовали
а просто дальше его передали в return {loading, error, getAllCharacters, getCharacter} что бы наш loading дошел он дошел
до CharList. Те мы прокинули сотояние из нашего http hook через Сервис до конечно CharList*/

    /* Если я сюда в onRequest вторым аргументов передам true, то я скажу коду что это первичная загрузка и это значит что наше свойсвто
setNewItemLoading так и должно стоять в false. Но если у нас идет повторная загрузка и initial у нас false, то я буду состояние каждый
раз утсанавливать в true в нашем setNewItemLoading
    И теперь нужно немного модифицировать вёрстку а именно здесь const spinner = loading ? <Spinner/> : null; Потому что я хочу сказать
что нам нужно показывать Спинер только тогда когда у нас стоит дейтвительно ТОЛЬКО loading - то состояние внутри Хука http и при этом 
я хочу сказать что у меня будет НЕ newItemLoading
*/
    useEffect(() => {
        //onRequest()
        onRequest(offset, true)
    }, []) 

    /*После того как мы полностью заменили всё в CharList, мы зашли протестить наш сайт, нажимаем на load more, то у нас
появляется спиннер, нас перебрасывает на начало сайта - это баг, дело в том что в нашем списке персонажей, раньше логика 
была такая что состояние загрузки раньше было в true, тоже самое было и в RandomChar но там это вообще не критично, и при
загрузке новых персов у нас изначально показывается спинер загрузки, но потом мы не активировали спинер при загрузке
новых персонажей, потому что не было смысла, мы просто выключали кнопочку load more, а в http hook у нас загрузка активируется
всегда перед запросом, у нас setLoading стоит в самом начале request. И за счет этого изменение стейта у нас идет 
перерисовка Компонента со спинером, те логика работы Компонента и Хука отличаются. И что бы решить эту проблему нужно
стараться всегда исправлять что-то в Компоненте, потому что Хук - универсальный */
    // Добавим здесь новый аргумент initial(будем передавать либо true либо false) и от этого значения будем устанавливать setNewItemLoading
    const onRequest = (offset, initial) => {
        //Теперь мы будем не всегда вызывать setNewItemLoading с true, а будем ориентироваться на initial
        initial ? setNewItemLoading(false) : setNewItemLoading(true)
        //onCharListLoading(); вместо него поместили setNewItemLoading(true)
        //setNewItemLoading(true) эта жесткая привязка больше не нужна
        getAllCharacters(offset)
            .then(onCharListLoaded)
            //.catch(onError) ошибку уже обработали в кастом хуке
    } 
    
    /* const onCharListLoading = () => {
        setNewItemLoading(true)
    } */
   
    const onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        setCharList(charList => [...charList, ...newCharList])
        //setLoading(loading => false) уже не используем 
        setNewItemLoading(newItemLoading => false)
        setOffset(offset => offset + 9)
        setCharEnded(charEnded => ended)
    }

    /* const onError = () => {
        setError(true) 
        setLoading(loading => false)
    } это тоже все есть внутри кастом хука*/

    const itemRefs = useRef([])

    const focusOnItem = (id) => {
        // Я реализовал вариант чуть сложнее, и с классом и с фокусом
        // Но в теории можно оставить только фокус, и его в стилях использовать вместо класса
        // На самом деле, решение с css-классом можно сделать, вынеся персонажа
        // в отдельный компонент. Но кода будет больше, появится новое состояние
        // и не факт, что мы выиграем по оптимизации за счет бОльшего кол-ва элементов

        // По возможности, не злоупотребляйте рефами, только в крайних случаях
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }

    // Этот метод создан для оптимизации, 
    // чтобы не помещать такую конструкцию в метод render
    function renderItems(arr) {
        const items =  arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            
            return (
                <li 
                    className="char__item"
                    tabIndex={0}
                    ref={el => itemRefs.current[i] = el}
                    key={item.id}
                    onClick={() => {
                        props.onCharSelected(item.id);
                        focusOnItem(i);
                    }}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            props.onCharSelected(item.id); 
                            focusOnItem(i);
                        }
                    }}>
                        <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                        <div className="char__name">{item.name}</div>
                </li>
            )
        });
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

        const items = renderItems(charList);

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading && !newItemLoading ? <Spinner/> : null;/*У меня есть загрузка, но при этом это НЕ ЗАГРУЗКА НОВЫХ ПЕРСОВ */
        //const content = !(loading || error) ? items : null;
         /*После того как м исправили проблему c setLoading - у нас появилась проблема с тем что при загрузке новых персонажей, они сначало
удаляются потом появляются. Это частая проблема при работе с Компонентами которые должны что-то подгружать. Происходит это потому что
состояние наших CharList и loading каждый раз меняются и перерисовывается у нас интерфейс через условие. Здесь мы говорим конкретно
про эту строчку const content = !(loading || error) ? items : null, когда мы формируем контент. 
    Потому что в функциональных Компонентах у нас идет каждый раз пересоздание Контента внутри, когда Комопнент обновляется. С Контентом
у нас происходит тоже самое, он у нас по-этому прыгает. 
    Когда мы использовали классы, то у нас было свойство класса, которое никогда не пересоздавалось, оно содержало в себе массив данных,
и в него потом добавлялись эти данные. Здесь же переменная content у нас каждый раз пересоздается, именно по-этому мы видим такое поведение
    КАК РЕШИТЬ ПРОБЛЕМУ: это всё условие мы добавляли еще скопировав с самого первого нашего Компонента(про случайного персонажа), в
нём контент статичный, при чем там всего один персонаж, если он не загрузился то мы там ничего и не рендерели. А в текущем Компоненте
нам это условие совсем не обязательно. Мы можем и пустой блок с классом char__grid помещаеть вместе с ошибкой или спинером и верстка у нас
не поломается. Но если мы на какой-то момент здесь в верстке помещаем null, то в таком случае у нас и будет прыгать верстка при перерисовке
По-этому просто удаляем const content = !(loading || error) ? items : null и {content} с верстки */

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {/* {content} Вместо контента подставляем items - это как раз те элементы, которые мы отренедерили в функции(те список 
наших персонажей). И если данных нет, то конечно же и в списке там ничего не будет*/}
                {items} 
                <button 
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{'display': charEnded ? 'none' : 'block'}}
                    onClick={() => onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
   // }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;