import {Component} from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';
import './charList.scss';
import PropTypes from 'prop-types'; // Импортируем


class CharList extends Component {

    state = {
        charList: [],
        loading: true, //Этот лодинг у нас изначально true потому что идет первичная подгрузка первых 9 персонажей которые рендерятся на странице
        error: false,
        newItemLoading: false,
        offset: 210,//После нажатие на кнопку, метод onRequest должен срабатывать и добавлять доп 9 персов
        charEnded: false//Нужно сделать фционал когда герои закончатся что бы кнопки load more пропала(хотя всего героев 1560)
    }
    
    marvelService = new MarvelService();

    componentDidMount() {
        this.onRequest()
    }

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    /* Здесь мы должны сказать что после наш offset(текущий стейт) должен быть увеличен на 9. По этому как текущий стейт задаем {offset, charList}
    Но когда произойдет первичная отрисовка нашего компонента, то у нас в оффсете будет уже хранится 210 потому что метод onCharListLoaded 
один раз был вызван */
    /* Здесь мы будем определять закончились ли персонажи. Мы это будем проверять осталось ли в newCharList меньше чем 9 персонажей, те
если там осталось к примеру 8 персонажей то больше уже грузить не нужно, герои уже закончились. И после всех этих выеслений мы запишем
новый стейт который будет удалять нашу кнопку если он в true.
Мы будем записывать результат в переменную ended и ее уже будем передавать в наш стейт charEnded, если ended будет true то будем удалять нашу кнопку*/
    onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true
        }

        this.setState(({offset, charList}) => ({
            charList: [...charList, ...newCharList],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        }))
    }
   
    onError = () => {
        this.setState({
            error: true,
            loading: false
        })
    }

    // Этот метод создан для оптимизации, 
    // чтобы не помещать такую конструкцию в метод render
    renderItems(arr) {
        const items =  arr.map((item) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            
            /* Вытскиваем пропсы в onClick={() => this.props.onCharSelected(item.id)}> */
            return (
                <li 
                    className="char__item"
                    key={item.id}
                    onClick={() => this.props.onCharSelected(item.id)}>
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

    render() {

        const {charList, loading, error, newItemLoading, offset, charEnded} = this.state;
        
        const items = this.renderItems(charList);

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items : null;

    /* Аттрибут disabled мы будем устанавливать взависимости от нашего свойства newItemLoading(будет либо тру либо фолс)
       Так же будем навшивать на эту кнопку onClick, запускаем во внутрь фцию и наша функция будет запускаться с методом onRequest с текущим
стейтом offset. И ВСЕ, ПЕРСОНАЖИ ПОДГРУЖАЮТСЯ 
    Теперь будем менять стили для кнопки после ее нажатия в style/button */
    /* Добавим стилей для кнопки в случае если персонажей больше не будет то кнопка должна исчезнуть. Если чарЕндед в тру, то удаляем, если нет то блочный */
        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button 
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{'display': charEnded ? 'none' : 'block'}}
                    onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

/* Есть пропс onCharSelected который мы передаем в CharList. Мы его провилидировали что бы что бы он у нас был функцией */
CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;