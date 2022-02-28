import { Component } from 'react';
import MarvelService from '../../services/MarvelService'; 
import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

class RandomChar extends Component {
    constructor(props) {
        super(props);
        this.updateChar()
    }

    /* Как Ваня и говорил у нас появились новые свойства которые мы должны теперь использовать */
    state = {
        char: {},
        loading: true,
        error: false // Исправим ошибку когда персонаж 404 и ломается страница
    } /* После того как мы закончили в ErrorMessage у нас сейчас три состояние: загрузка персонажа, загрузка, ошибка */
    
    marvelService = new MarvelService();

    /* Передаем loading в false, что бы как только у нас загружаются данные, то у нас, то лоудинг будет в фолс автоматом.
Это легко проговорить словами, если у нас идет загрузка то там где state выше у нас лоудинг стоит в тру, как только данные
у нас загрузились то лоудинг в фолс  */
    onCharLoaded = (char) => {
        this.setState({
            char, 
            loading: false
        })
    }

    //Метод для устновки ошибки
    onError = () => {
        this.setState({
            loading: false, // ставив в false потому что если произошла ошибка то нет загрузки
            error: true
        })
    }

    updateChar = () => {
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        this.marvelService
            .getCharacter(id) 
            .then(this.onCharLoaded)
            .catch(this.onError)//наша ошибка в onError можем произойти внутри запроса, по этому делаем catch  
    } 

    render() {
        /* Из-за того что мы создали viem мы можем здесь не вытаскивать все эти данные(name, descr ...) */
        const {char, loading, error} = this.state;

        /* Теперь будем заниматься вычислением нашего состояния, обычно когда нужно писать много условий по состоянию
компонента то его пишут выше return ! Потому что если будем писать внутри return - будет каша */
        const errorMessage = error ? <ErrorMessage/> : null // Теперь здесь содержиться либо ошибка либо ничего
        const spinner = loading ? <Spinner/> : null // Тоже самое делаем со спинером
        const content = !(loading || error) ? <View char={char}/> : null /* Контент нужно помещать сразу после загрузки, 
но если нет ошибки, !(loading || error) - и звучит это так - если нет загрузки или нет ошибки */
/* ПОДВОЖУ ИТОГИ УРОКА: Когда картинка загружается - подставляется спиннер с загрузки, 
                        Когда контент загрузился - подставляется герой - все нормально,
                        Когда я сменил одну букву в ключе к моему АПИ - появляется робот с ошибкой */


        /*Логика такая - если у нас идет состояние загрузки то мы импортировали компонент Спинера и помещаем в него
наш скаченный с интернета спинер 
        if (loading) {
            return <Spinner/>
        }  Этот код больше не нужен*/
/* Если у нас loagind в true то мы подставляем Spinner, а если нет, то подставляем наш View(это обычная верстка которую
мы просто вырезали в случае логание инета у пользователя что бы он понимал что что-то происходит) и этому View мы
добавляем ПРОПЕРТИ char {loading ? <Spinner/> : <View char={char}/>} 
ВСЕ ЧТО Я НАПИСАЛ ВЫШЕ УЖЕ НЕАКТУАЛЬНО ПОТОМУ ЧТО МЫ ВСЕ НАШИ СРАВНЕНИЕ И УСЛОВИЕ НАПИСАЛИ В ПЕРЕМЕННЫЕ*/
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
                    <button className="button button__main">
                        <div className="inner">try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
                </div>
            </div>
        )
    }
}

/*Этот компонент будет отображать кусочек нашей верстки.
  Это будет простой рендереющий компонент, который получает данные как объект, в нем нет никакой логике, он просто как
объект получает аргумент с данными, принимает его в себя и возвращает участок какой-то верстки для того что бы просто
отоброзить. Все главные запросы, приобразование у нас идут в основном компоненте RandomChar */
const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki} = char

    return (
        <div className="randomchar__block">
            <img src={thumbnail} alt="Random character" className="randomchar__img"/>
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