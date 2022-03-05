import {Component} from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';
import './charList.scss';


class CharList extends Component {

    state = {
        charList: [],
        loading: true, //Этот лодинг у нас изначально true потому что идет первичная подгрузка первых 9 персонажей которые рендерятся на странице
        error: false,
        newItemLoading: false,
    }
    
    marvelService = new MarvelService();

/* Так как весь этот код повторяется с onRequest то мы можем его вырезать
   Теперь когда наш компонент будет создан(те будет вызван componentDidMount), то у нас вызывается onRequest() НО БЕЗ
КАКОГО ЛИБО АРГУМЕНТА. Дальше мы обращаемся к серверу this.marvelService.getAllCharacters(offset), и там где offset
у нас не передается никакой аргумент, значит у нас будет подставлен базовый отступ - _baseOffset = 210. Это как раз когда
наш компонент был первый раз создан, НО Потом когда мы будем вызывать в ручную метод onRequest по клику на кнопку, то
там где offset мы будем подставлять какое-то числа, который будет формировать другой зщапрос ! */
    componentDidMount() {
        this.onRequest()
        /*this.marvelService.getAllCharacters()
            .then(this.onCharListLoaded)
            .catch(this.onError) */
    }

    /* Нужно что бы при клике на load more появлялось дополнительные 9 персонажей и в getAllcharacter должно быть уже не 
set 210 а 219, те запрос на сервер должен приходить на 9 персонажей больше
Перед этим мы немного изменили getAllCharacters в MarvelService что бы по дефолту _baseOffset = 210, если аргумент offset не будет приходить */
    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }

    /* Теперь нужно пользователя проинформировать что наши персонажу грузяться(те после его клика нужно проинформировать
что персонажу подгружаюся). Создаем newItemLoading. В нем меняем наш стейт который стоит изначально фолс, на тру.
    И теперь вызываем onCharListLoading перед всеми действиями в onRequest()
    Когда у нас onRequest() запускатеся первый раз в componentDidMount, то наш стейт из-за this.onCharListLoading() переключиться
в позицию true в нашей функции ниже и это нормальное поведение, потому что на тот момент у нас даже интерфейс еще не будет
построен, но когда у нас завершилась первичная загрузка наших персонажей в componentDidMount то нам нужно переключить
наш newItemLoading в false что бы убрать спинер или что-то там что информирует о загрузке и мы это можем сделать в 
onCharListLoaded потому что тут наши персонажу уже действительно загрузились ! */
    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }
    /* Теперь нужно реализовать задачу что когда к нам приходят новые данные, то мы не просто должны перезаписывать старые
при этом как-то изменяя наших старых персонажей, а просто добавлять к старым новые 9 персонажей ! И это мы можем сделать
в нашем charList: мы скажем что наш charList будет формироваться из двух сущностей(те персонажи что были до этого и новые 9.
charList у нас все так же массив
Только теперь когда мы грузим новые 9 персонажей то наш НОВЫЙ СТЕЙТС ЗАВИСИТ ОТ ПРЕДЫДУЩЕГО СТЕЙТА, ПО ЭТОМУ ПОМЕЩАЕМ НАШ
ОБЪЕКТ СО СТЕЙТОМ В КОЛЛБЕК ФУНКЦИЮ(те мы возвращаем объект из этой функции) !!!
({}) - здесь мы должны подвергнуть наш объект деструктуризации, и мы туда помещаем charList - это тот чарЛист который у нас
был в текущем стейте(там где вверху state он у нас изначально стоит в пустом массиве, потом 9 элементов и так далее)
И для того что бы сформировать новый список персонажей, то мы берем наш старый список [...charList] те разворачиваем его
Дальше ставим запятую и мы должны добавить в этот массив новых элементов, которые пришли от сервера, а новые элементы у нас
должна храниться ВОТ ЗДЕСЬ onCharListLoaded = (charList), потому что наш onCharListLoaded ВЫЗЫВАЕТСЯ 
ВОТ ЗДЕСЬ .then(this.onCharListLoaded) , А ЭТО ЗНАЧИТ ЧТО ОН В СЕБЯ КАК АРГУМЕНТ НОВЫЙ МАССИВ С НОВЫМИ ЗАГРУЖЕННЫМИ ПЕРСОНАЖАМИ
ПО ЭТОМУ onCharListLoaded = (charList) МЫ ПЕРЕИМЕННУЕМ В onCharListLoaded = (newCharList)
И именно его мы будем разворачивать как новых персонажей после старых*/
    onCharListLoaded = (newCharList) => {
        this.setState(({charList}) => ({
            charList: [...charList, ...newCharList],
            loading: false,
            newItemLoading: false
        }))
    }
/* ТЕПЕРЬ ВЕСЬ КОД ПОВТОРЮ ЕЩЕ РАЗ: У нас есть метод onRequest() который отвечает за запросс на сервер, мы его первый раз
вызываем в componentDidMount когда компонент отрендерился(без аругмента что бы ориентироваться на дефолтный бейсоффсет = 210)
Когда этот метод запускается то у меня есть метод onCharListLoading который переключает наше новое состояние newItemLoading в true.
В будущем после клика на load more наше состояние будет меняться и мы по нему будем ориентироваться, что бы понимать идет ли загрузка
новых персонажей.
Дальше мы получаем элементы с нашего сервера this.marvelService.getAllCharacters(offset) и мы в него запускаем onCharListLoaded, который
получает в себя новые данные, и их этих новых данных мы будем получать новое состояние, при чем если мы первый раз запускаем функцию(этот метод)
то у нас в ...charList просто пустой массив, прям как в нашем charList: [] который в стейте. По этому он ни во что не развернется и у нас 
будет только вот эта часть ...newCharList которая развернется в новые элементы
В послед запусках у нас будут и старые и новые элементы которые будет использваться в одном большом массиве [...charList, ...newCharList]
и потом мы наш charList отправим на формирование нашей верстки в рендер!
  */    

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
            
/* В СharList - все так же как и в RandomChar только появляется новый флаг key={item.id} который мы достаем из АПИ, потому что у каждого
персонажа есть свой id и сделали мы это внутри MarvelService. В transformCharacter добавляем id: char.id, т-е мы еще и вытаскивваем айди
у нашего персонажа */
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

        const {charList, loading, error} = this.state;
        
        const items = this.renderItems(charList);

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;