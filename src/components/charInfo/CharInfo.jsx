import { Component } from 'react';
import './charInfo.scss';
//import thor from '../../resources/img/thor.jpeg'; Не нужен потому что поменяли на thumbnail
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton'

class CharInfo extends Component {
    /* У нас здесь как и в RandomChar будет состояние загрузки, состояние ошибки, состояние загруженого персонажа по-этому
копируем стейт с рандомчара и марвелсервис - что бы мы создавали запросы */
    state = {
        char: null, /*Ставим null потому что пустой объект - это уже правда, а null - это false. А нам нужен что бы был скелетон и объект в фалс */
        loading: false, /* Ставим false потому что если в остальных случаях спиннер загрузки нужно было показывать когда загружались
наши новые герои, но правую часть не нужно подгружать так как там стоит скилетон по дефолту */
        error: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.updateChar()
    } 

    /* Будем помещать наш элемент на страницу 
У нас сейчас до создаение метода componentDidUpdate не появляется персонаж на интерфейсе потому что updateChar вызывается только один раз
в componentDidMount. Нам нужно реагировать на действия пользователя и в этом компоненте у нас будет меняться пропс, а именно charId и 
тут мы вспоминаем из диаграммы жизненного цикла что когда в компонент приходит какой-то новый пропс, он должен перерендериваться и нам
нужно отловить этот момент обновления и вставить новые данные которые мы получаем от сервера в интерфейс и мы создаем componentDidUpdate
а он срабатывает когда в компонент приходит новый пропс или изменяется новый стейт*/
    componentDidUpdate(prevProps) { /* Этот хук принимает в себя два аргумент(еще очень редко третий) - 
это прев пропс и прев стейт */
        /*Если мы здесь сейчас пропишем this.updateChar() , то мы получим БЕСКОНЕЧНЫЙ ЦИКЛ, потому что когда у нас запускается updateChar
то мы в конце концом попадаем в цепочку then и в onCharLoaded, который вызывает setState и обновление состояние, а когда запускается
команда setState она заново после себя запускает render, те обновления нашей верстки(нашего ui) на странице, когда запускается render
это значит что наш компонент обновился и в таком случае у нас опять будет вызван componentDidUpdate и у нас опять запускается
updateChar и так по цепочки.
    Что бы не было такой ошибки нам нужен prevProps и стейт что бы отслеживать изменился ли у нас пропсы или нет и просто вызвался render*/
        //this.updateChar()
    if (this.props.charId !== prevProps.charId) {
        this.updateChar()
    }
/* this.props.charId - это наши новые айди которые к нам пришли 
 То-есть у нас запрос будет уходить только если новые айди не равны старым айди и если пользователь начнет много раз кликать по персонажу
 то ничего не измениться и запросы идти не будут + не будет цикла*/

    }

/* По клику на элемент на нашего персонажа - обновлять этот компонент(потому что он у нас динамический и изменятся от действие пользователя)
Когда будет происходить этот запрос то я буду ориентироваться на пропсы, потому что в app.jsx мы передали пропс charId в котором
БУДЕТ АЙДИШКА НАШЕГО ВЫБРАННОГО ПЕРСОНАЖА и на неё мы будем ориентироваться 
    Если charId не будет то я буду эту ф-цию останавливать ! и это условие будет стоять у нас в самом начале потому что у нас в state
изначально стоит null в app.jsx ведь если изначально персонаж не выбран то у нас будет отображаться скеллитон который будет отображаться
в заглушке*/
   updateChar = () => {
      const {charId} = this.props;
      if (!charId) {
          return;
      }

      this.onCharLoading(); // Для показа спиннера перед запросом

      /* Когда к нам прийдет ответ от нашего сервиса те .getCharacter(charId), у нас будет один объект с персонажем, то он попадет в 
onCharLoaded в качестве аргумента = (char) и запишиться в наше состояние. А ошибку в качестве this.onError */
      this.marvelService
          .getCharacter(charId)
          .then(this.onCharLoaded)
          .catch(this.onError)
   }
   /* Так как тут тоже у нашего персонажа который будет справа подгружаться нужно сначало подставлять лоадинг, подумать о случайно ошибки
то можно просто скопировать все готовые методы с РандомЧар */
   onCharLoaded = (char) => {
        this.setState({
            char, 
            loading: false
        })
    }

    onCharLoading = () => {
        this.setState({
            loading: true
        })
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    /* Разделим render на две части: 1) Интерфес 2) Логика и состояние */
    render() {
        //Вытаскивам все из нашего стейта
        const {char, loading, error} = this.state

        //услови для отображение внутри контента состояние нашего компонента(спиннер, ошибка или скелитон). Сразу их импортируем
        const skeleton = char || loading || error ? null : <Skeleton/> /* Заглужка пока невыбран персонаж. Если у нас нет персонажа,
не загрузка, не ошибка то Скелетон, а если что-то есть то null */
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error || !char) ? <View char={char}/> : null;/* Здесь чуть меняется, нужно сказать что у нас 
не загрузка, не ошибка, но уже есть персонаж */

        return (
            <div className="char__info">
                {skeleton}
                {errorMessage}
                {spinner}
                {content}
            </div>
        )
    }
}

/* Используем <>(Реакт Фрагмент) что бы был общий родитель */
const View = ({char}) => {
    // У нас приходит char и нам нужно из него вытащить то что нам нужно показать на странице
    const {name, description, thumbnail, homepage, wiki, comics} = char /* comics: char.comics.items - добавляем в марвел сервис 
что бы при клике под инфу с картинкой появлялся комикс про персонажа 
 Мы удалили все list items с коммиксами, а во внутрь помещаем comics.map 
 так как у нас коммикс - массив мы можем map использовать. item - каждый отдельный коммикс а i его номер по порядку
 помещаем в аттрибут key номер по порядку коммекса, так как коммексы не будут динамически как-то меняться  */
    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {
                    comics.map((item, i) => {
                        return (
                            <li key={i} className="char__comics-item">
                                {item.name}
                            </li>
                        )
                    })
                }
            </ul>
        </>
    )
}

export default CharInfo;