import {useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import {CSSTransition, TransitionGroup} from 'react-transition-group';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
//import setContent from '../../utils/setContent' так как мы скопировали сетКонтент нам импортировать его уже не надо


import './charList.scss';

/* У нас у этого Компонента не существует такого состояние когда он ждёт, потому что оно сразу же проходит. 
    Когда Компонент ждет у нас это первичный момент когда должен появляться спинер
    По-этому мы берем Спиннер и подставляем вместо Скелетона 
    
    Дальше идет условие с загрузкой, мы либо должны отобразить Спинер, либо мы должны не менять тот Контент который 
у нас был на странице, что бы он у нас не прыгал постоянно, что бы у нас не рендерился null 
    И здесь мы будем точно так же отталкиваться от newitemloading
    по этому мы в loading спросим если у нас это свойсвто будет в true то мы будем рендерить компонент(только мы здесь
убираем data={data} потому что в этом компоненте данных нет), а если false то грузим Спиннер

    И так как у нас setContent вне Компонент ЧарЛист, то мы вместо data передаем newItemLoading как аргумент в качестве
состояния */
const setContent = (process, Component, newItemLoading) => {
    switch(process) {
        case 'waiting':
            return <Spinner/>;
            break;
        case 'loading':
            return newItemLoading ? <Component/> : <Spinner/>; /* Дословно мы спрашиваем: у нас рендерятся новые элементы
если да, то мы рендерим компонент(ничего не меняем на странице), если нет - то это первая загрузка и мы рендерим спиннер */
            break;
        case 'confirmed':
            return <Component/>; //это уже момент когда данные полученные и мы рендерим сам Контент
            break;
        case 'error':
            return <ErrorMessage/>
            break;
        default: 
            throw new Error('Unexpected process state');
    }
}

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [newItemLoading, setnewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);
    
    const {loading, error, getAllCharacters, process, setProcess} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setnewItemLoading(false) : setnewItemLoading(true);
        getAllCharacters(offset)
            .then(onCharListLoaded)
            .then(() => setProcess('confirmed')) //логика такая же самая как и в чар инфо
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
    
    //const items = renderItems(charList);

    /* const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null; */

    /*Здесь нам нужно вторым аргументом в setContent отоброзить Компонент
    Этот Компонент(у нас это items). 
    Мы знаем что фциональный Компонент - это фция, которая возвращает нам какие-то Реакт Элементы
    По-этому как Компонент мы передаем туда фцию, которая вернёт нам набор каких-то Реакт Элементов 
    В нашем случае это код чуть выше <ul className="char__grid">
                <TransitionGroup component={null}>
                    {items} 
                </TransitionGroup>
            </ul>
    Мы вырезаем renderItems и помещаем в фцию, а items полностью убираем
    То-есть у меня вместо Компонента помещается фция, которая возвращает кусочек верстки реакт элемента которая будет
использоваться на странице
    Так же убираем условный рендеринг выше
    
    Заходим на страничку, все работает, но у нас опять возникла проблема которая была раньше
    Опять после нажатие на load more верстка прыгает вверх
    Дело в том что наш ЧарЛист немножко не такой компонент как другие, у него есть нестандартное поведение по подгрузки
новых элементов и взавимисоти от этого мы будем формировать верстку. Не зря у нас есть свойство newItemLoading
    CharList отличный пример того что есть Компоненты, которые выбиваются из общей структуры, здесь немного другая логика
под которую мы должны записать уникальный setContent

    У нас раньше Спинер рендерился только если шла Загрузка и при этом у нас шла загрузка только впервый раз !newItemLoading
То-есть когда пользователь отрендерил впервые этот Компонент, в последующее разы у нас загрузка со спинером не шла потому
что у нас просто дисейблилась кнопка disabled={newItemLoading} 
    Именно такое поведение мы должны реализовать
    Мы выходим из CharList и там создадим фцию setContent
    
    После того как фцию выше закончили писать - помещаем в сетконте как третий аргумент newItemLoading*/
    return (
        <div className="char__list">
            {/* {errorMessage}
            {spinner}
            {items} */}
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
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;