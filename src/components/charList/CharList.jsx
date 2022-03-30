import {useState, useEffect, useRef, useMemo} from 'react';
import PropTypes from 'prop-types';
import {CSSTransition, TransitionGroup} from 'react-transition-group';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

const setContent = (process, Component, newItemLoading) => {
    switch(process) {
        case 'waiting':
            return <Spinner/>;
            break;
        case 'loading':
            return newItemLoading ? <Component/> : <Spinner/>;
            break;
        case 'confirmed':
            return <Component/>;
            break;
        case 'error':
            return <ErrorMessage/>
            break;
        default: 
            throw new Error('Unexpected process state');
    }
}

/* У нас в проекте есть серьезный баг, когда мы выбирам персонада, он не подсвечивается крассной рамкой что он активный
и что он сейчас выбран. Только на второй раз по нему срабатывает класс и активность появляется
    Происходит это потому что наш список персонажей несколько раз перерендеривается при некоторый действиях
    Мы нажимаем один раз на карточку персонажа, он появляется справа в углу, но не происходит выделения нашего персонажа
и класса активности

    ЕСЛИ ТЫ НЕ ДОКОНЦА ПОНИМАЕШЬ КОД ТО НУЖНО ПРОСТО ВЫВОДИТЬ ВСЁ В КОНСОЛЬ !
     function renderItems (arr){
        console.log('render')
    У нас происходит рендер впервый раз как персонажи появились на странице потом мы нажимаем на какого-то перса
и у нас опять происходит рендер если я нажимаю второй раз то рендера уже не происходит и назначается класс активности
То-есть проблема в том что у нас начинается перерендеринг после первого клика на персонажа
    
    {setContent(process, () => renderItems(charList), newItemLoading)}
    Видим что наш renderItems запускатеся когда у нас рендерится наш Компонент
    Те если наш renderItems запускается повторно,то логично что все что находится в return(весь наш Компонент) тоже
перерисовывается. Такое могло бы произойти когда в нашем Компоненте менялся бы какой-то стейт, но когда мы нажимаем на 
какого-то персонажа то стейт мы никак не меняем. У нас есть метод foucusOnItem, который просто меняет классы у элементов
но он никак не меняет какой-то стейт, foucusOnItem вызывается при клике на наш элемент

    Другой вариант это что родительский Компонента ЧарЛиста перерисовываетс сам по себе и при этом перерисовывает еще 
и своих потомков.
    Заходим в MainPage - потому что он наш родитель
    Находим <CharList onCharSelected={onCharSelected}/>
    При клике на какого-то персонажа при помощи этого метода onCharSelected(который там и на странице описан) поднимается
на вверх уникальный индификатор персонажа и записывается в useState
    const [selectedChar, setChar] = useState(null);
    const onCharSelected = (id) => {
        setChar(id);
    }
    которая уже потом передается в другой Компонент в <CharInfo charId={selectedChar}/>

    пропишем console.log('mp') что бы понять ПЕРЕННДЕРИВАЕТСЯ ЛИ НАША СТРАНИЦА МЕЙН ПЕЙДЖ  
    Теперь mp и render приходят в консоль после первого захода на страничку и после нажатия на персонажа. 
    ТО-ЕСТЬ НАША СТРАНИЧКА МЕЙН ПЕЙДЖ ТОЖЕ ПЕРЕРЕНДЕРИВАЕТСЯ ! 
    И ЗА СОБОЙ ПОТЯНУЛА РЕНДЕР НАШЕГО CharList, то-есть вот этой вот нашей части
    return (
        <div className="char__list">
            {setContent(process, () => renderItems(charList), newItemLoading)}
            <button 
                disabled={newItemLoading} 
                style={{'display' : charEnded ? 'none' : 'block'}}
                className="button button__main button__long"
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
    К чему Ваня все это ведет, эта статическая часть которая у нас обозначена в качестве верстки
    <button 
                disabled={newItemLoading} 
                style={{'display' : charEnded ? 'none' : 'block'}}
                className="button button__main button__long"
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
    она у нас не изменяется, кнопка как была так оно остается. 
    Но это у нас функции, фциональные Компоненты - это у нас фции. И когда они перерендериваются то часть функций
которые у нас рассположены в коде, они вызываются повторно, в том числе вот эта вот конструкция 
{setContent(process, () => renderItems(charList), newItemLoading)} которая формируетс наш контент. 
    И получается так что за счет того что мы на верх передаем состояние и оно потом идет куда-то в другой Компонент
мы вызываем повторный вызов этой фции {setContent(process, () => renderItems(charList), newItemLoading)}, а значт
и повторный вызов списка персонажей(хотя визуально он никак не меняется). Здесь возникает и баг что когда мы
нажимаем на персонажа - он действительно выбирается, но класс активности у нас был повешен на предыдущий компонент
который отрендерился до этого, а сейчас он поменялся другим списком и по-этому здесь класс активности не появляется. 
    Когда мы нажимаем второй раз, то мы выбираем того же персонажа, уникальный индификатор не меняется, значит
стейт в МейнПейдже тоже не меняется и значит СписокПерсонажей тоже не меняется и мы уже можем добавить класс 
активности на этот элемент
    Эту ошибку легко отловить в панеле разработчика, если выбрать список персонажей и нажать на одного то мы знаем
что ему в верстке добавиться класс активности, но у нас они просто прыгают и ничего не происходит. 
Так же можно нажать на Components и выбрать Transition - так же само верстка улетит вверх из-за перерндеринга 

    Решение проблемы:
    Мы знаем что из этой строчки вернётся какой-то результат {setContent(process, () => renderItems(charList), newItemLoading)}
Эта строка вернет один из Компонентов. При этом мы хотим что бы у нас этот Компонент не перенжеривался между повторными
рендеренгами из вне, что бы у нас результат работы фции постоянно запоминался и зависил от определенного параметра
Под это определение у нас подходит один из хуков которые мы должны использовать useMemo
        const elements = useMemo(() => {
        return setContent(process, () => renderItems(charList), newItemLoading)
    })
    Теперь useMemo запоминает результат работы фции в нашем return(те Компонент который она отрендерила)
    И ЗДЕСЬ МЫ ТАК ЖЕ ДОЛЖНЫ ПРОПИСАТЬ ЗАВИСИМОСТЬ - ТО-ЕСТЬ ПРИ ИЗМЕНЕНИЕ КАКОГО ПАРАМЕТРА МЫ БУДЕМ ПЕРЕРАССЧИТЫВАТЬ
ВОТ ЭТУ ВОТ ФУНКЦИЮ. И МЫ ТУДА ПОМЕЩАЕМ process, потому что если у нас будет новая загрузка, то мы должны 
пересчитать то что будет вот здесь setContent(process, () => renderItems(charList), newItemLoading), потому что
там могут добавится какие-то новые элементы 
// eslint-disable-next-line - это строчка дизейбла для других зависимостей в usememo
  */
const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [newItemLoading, setnewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);
    
    const {getAllCharacters, process, setProcess} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setnewItemLoading(false) : setnewItemLoading(true);
        getAllCharacters(offset)
            .then(onCharListLoaded)
            .then(() => setProcess('confirmed'))
    }

    const onCharListLoaded = async(newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }
        setCharList([...charList, ...newCharList]);
        setnewItemLoading(false);
        setOffset(offset + 9);
        setCharEnded(ended);
    }

    const itemRefs = useRef([]);

    const focusOnItem = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }

    function renderItems (arr){
        console.log('render')
        const items =  arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            
            return (
                <CSSTransition key={item.id} timeout={1000} classNames="char__item">
                    <li 
                        className="char__item"
                        tabIndex={0}
                        ref={el => itemRefs.current[i] = el}
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
                </CSSTransition>
            )
        });

        return (
            <ul className="char__grid">
                <TransitionGroup component={null}>
                    {items} 
                </TransitionGroup>
            </ul>
        )
    }
    
    const elements = useMemo(() => {
        return setContent(process, () => renderItems(charList), newItemLoading)
        // eslint-disable-next-line 
    }, [process])
    return (
        <div className="char__list">
            {/* {setContent(process, () => renderItems(charList), newItemLoading)} */}
            {elements}
            <button 
                disabled={newItemLoading} 
                style={{'display' : charEnded ? 'none' : 'block'}}
                className="button button__main button__long"
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;