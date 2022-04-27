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
    console.log('render')
    /*У нас в Консоли появилось очень большая куча render после нажатие на кнопку load more
    Это происходит из-за того что все наши изменения присходят внутри ассинхроного кода
    Наш .then(onCharListLoaded) находится внутри then - те это поток асинхроного кода, микротаски
    И после каждого изменения состояние идет перерисовка интерфейса

    И вот здесь приходит на помощь новая версия Реакт 18+ с новым batching
    npm i react@latest react-dom@lastest --save
    Нужно помнить что в 18 версии изменился React dom render и нужно зайти в index.jsx и изменить там команды

    Теперь заходим на страницу и опять нажимаем load more и у нас в консоли теперь только два вывода сообщений. То-есть большая часть по 
изменению стейта у нас забачилась - соединилась в одну команду. Первый рендеринг это initial ? setnewItemLoading(false) : setnewItemLoading(true);
а второй это все команды по изменению стейта внутри onCharListLoaded
    Серое смс рендер в консоли - это техническое дублирование

    Если нам вдруг нужно будет вернуть старое поведение batching(что крайне-крайне редко понадобится) то прописываем там где импортируем
Хуки из Реакта команду flushSync и туда помещаем изменения состояние в коллбек
    flushSync(() => {
        setCount(c => c+1)
    })
    между этими командами можно написать какой-то код
    flushSync(() => {
        setFlag(f => !f)
    })
*/

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