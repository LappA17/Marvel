import {useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';
import './charList.scss';

/* Так как у нас есть Компонент который принимает пропс props.onCharSelected(item.id), то мы передаем как аргумент props - это объект с 
нашими свойствами*/
const CharList = (props) => {
    const [charList, setCharList] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [newItemLoading, setNewItemLoading] = useState(false)
    const [offset, setOffset] = useState(210)
    const [charEnded, setCharEnded] = useState(false)
    /* state = {
        charList: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210,
        charEnded: false
    } */
    
    const marvelService = new MarvelService(); // marvelService - объект, который констурируется при помощи класса MarvelService

    useEffect(() => {
        onRequest() /* onRequest - у нас стрелочная фция, но мы запускаем ее выше. ДЕЛО В ТОМ ЧТО useEffect ЗАПУСКАЕТСЯ ПОСЛЕ РЕНДЕРА,
ТО-ЕСТЬ ПОСЛЕ ТОГО КАК НАША ФУНКЦИЯ СУЩЕСТУЕТ УЖЕ ВНУТРИ НАШЕГО КОМПОНЕНТА */
    }, []) /* Когда пустой массив то функция выполнится только ОДИН РАЗ
              Так же у нас эта функция меняться не будет, мы туда в массив onRequest не передаем
              И мы специально вручную оставили пустой массив что бы с эмитировать метод componentDidMount(), а если мы добавим фцию в 
            зависимость то мы можем запустить бесконечный цикл(потому что мы запустим наш Компонент, он создаться, потом запустит
            фцию onRequest, у нас будет выполнятся запрос и его успешный вариант в then(onCharListLoaded) он меняет state, когда
            у нас меняется state то у нас запускается ПЕРЕРЕНДЕРИНГ КОМПОНЕНТА и пойдет все по новой и бесконечный цикл запросов) */
    /* componentDidMount() {
        this.onRequest();
    } */

    const onRequest = (offset) => {
        onCharListLoading();
        marvelService.getAllCharacters(offset)
            .then(onCharListLoaded)
            .catch(onError)
    } 
    /* onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError)
    } */

    const onCharListLoading = () => {
        setNewItemLoading(true)
    }
    /* onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    } */

    const onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        /* this.setState(({offset, charList}) => ({
            charList: [...charList, ...newCharList],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        })) */
        setCharList(charList => [...charList, ...newCharList]) //С коллбеком что бы была последованность изменение наших стейтов
        setLoading(loading => false) //здесь можно так же как и в setError просто оставить false без коллбека
        setNewItemLoading(newItemLoading => false)
        setOffset(offset => offset + 9)
        setCharEnded(charEnded => ended)
    }

    const onError = () => {
        /* this.setState({
            error: true,
            loading: false
        }) */
        setError(true) // здесь не важно что было в прошлом стейте, потому что если ошибка то точно нужно true
        setLoading(loading => false)
    }

    /* useRef можно использовать только НА ВЕРХНЕМ УРОВНЕ КОМПОНЕНТА(НИ В КАКИХ УСЛОВИЯХ, ВНУТРИ ФУНКЦИЯХ ИЛИ ЦИКЛАХ) */
    //itemRefs = [];
    const itemRefs = useRef([])
/* Если всмотреть в код, то можно понять что Ваня не использовал никак свойство current у Рефа. Ваня пушил прям на прямую в itemRefs
а в нем нет свойства current
   Но когда мы создаем при помощи useRef, то current обязательно будет(потому что будет объект с таким свойством) */
    /* setRef = (ref) => {
        this.itemRefs.push(ref);
    } Так мы уже не сможем поместить ref в нашу верстку. Мы пишем фцию прям внутри ref={} */

    /* itemRefs.current - это значит что у нас в itemRefs лежит вот таком массив, внутри свойство current. ТОЕСТЬ НАШ МАССИВ БУДЕТ СКЛАДЫВАТЬСЯ
ВО ВНУТРЬ itemRefs.current(свойство объекта). Который я буду перебиратьи дальше у каждого элемента внутри этого массива(это будет 
ссылка на ДОМ элемент) я буду убирать класс 
    Дальше внутри этого массива(и мы перемещае id с itemRefs[id].current на itemRefs.current[id]), внутри этого массива ссылок мы находим
элемент по id и добавляем класс и фокус*/
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
                    ref={el => itemRefs.current[i] = el}/* Здесь будет callback ref который в себя будет принимать элемент на котором он был вызван, а именно li
А так как у нас чуть выше перебор массива с помощью map, то li у нас создает ВНУТРИ ЦИКЛОВ. По-этому мы задаем ссылку на элемент el - те
это четкий элемент на котором происходит действие и так как у нас itemsRefs.current - это массив, то мы можем здесь использовать не
push который может дать ошибку, а itemRefs.current[i] = el то-есть я просто элементы по порядку в этом массиве складываю в itemRefs.current
и в этом коде itemRefs.current[i] = el el-идет как ссылка на Дом элемент и у нас в этом массиве itemRefs.current будет формироваться массив
ссылок на элементы которые будут последовательно формироваться  */
                    key={item.id}
                    onClick={() => {
                        props.onCharSelected(item.id); // У нас есть Компонент который принимает props
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
        // А эта конструкция вынесена для центровки спиннера/ошибки
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    //render() {

        /*У нас эти переменные и так существуют внутри функции по этом удаляем
        const {charList, loading, error, offset, newItemLoading, charEnded} = this.state; */
        
        const items = renderItems(charList);

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
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