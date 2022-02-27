import { Component } from 'react';
import MarvelService from '../../services/MarvelService'; 
import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

class RandomChar extends Component {
    constructor(props) {
        super(props);
        this.updateChar()
    }

/*  Можно так же доработать наш стейт, сейчас здесь лежат свойства именни, описания и тд, но в будущем здесь могут лежать и другие 
данные, например какая-то ошибка или состояние загрузки */
    state = {
        char: {}
    }

    
    marvelService = new MarvelService();

    /* Так мы оптимизируем код и res => {this.setState(res)}) уже не понадобиться */
    onChatLoaded = (char) => {
        this.setState({char}) // помещаем char потому что это скорощение от char: char
    }

    updateChar = () => {
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        this.marvelService
            /*.getAllCharacters()
            .then(res => console.log(res))  Выводим в массив результат по получению всех персонажей. Мы получили ДВА МАССИВА, И
В ПЕРВОМ И ВО ВТОРОМ ХРАНИЛИСЬ ОБЪЕКТЫ С ДАНЫМИ О ГЕРОЯХ, НО ОЧЕНЬ ВАЖНО ЧТО ДВА МАССИВА МЫ ПОЛУЧИЛИ ПОТОМУ ЧТО МЫ СДЕЛАЛИ НЕСКОЛЬКО
ЗАПРОСОВ И ПОЛУЧИЛИ НЕСКОЛЬКО ОТВЕТОВ ИЗ-ЗА ТОГО ЧТОВЫЗЫВАЕМ this.updateChar В НАШЕМ КОНСТРУКТОРЕ. ЭТО УДАРИТ ПО НАШЕЙ ОПТИМИЗАЦИИ
И ЭТО ПРИЧИНА ПОЧЕМУ ЛУЧШЕ НЕ РАБОТАТЬ С КОНСТРУКТОРАМИ И МЫ ЭТО ПОТОМ ИСПРАВИМ */
            .getCharacter(id) 
            .then(this.onChatLoaded) /* Когда мы используем промисы и цепочка идет через then то у нас в эту фцию приходит аргумент
и если у нас в then стоит ссылка на фукцию как this.onChatLoaded, то аргумент который прийдет в then автоматически будет подставляться
туда где сейчас находится this.onChatLoaded, те в метод onChatLoaded. Он прийдет сюда как в (char) и запишется уже во внутрь стейта*/ 
    } 

    /* И последнее - это вытгивание данных из стейта. Так как все эти сущности лежат у нас в объекте char - {name, description, thumbnail, homepage, wiki}
то мы просто подставм char. Мы вытаскиваем сущности из свойства char*/
    render() {
        const {char: {name, description, thumbnail, homepage, wiki}} = this.state;

/* Запишу здесь ИТОГ урока. Если наше приложение взаимодействует с сервером, то нужно ОТДЕЛЯТЬ СЕТЕВЫЕ КОМОПНЕНТЫ ОТ ОСНОВНОГО КОДА,
ТАК МЫ СМОЖЕМ ИХ ИСПОЛЬЗОВАТЬ В СОВЕРШЕННО РАЗНЫХ ЧАСТЯХ ПРИЛОЖЕНИЯ И СДЕЛАТЬ КОД НАМНОГО ЧИЩЕ. У нас сетевая часть находится в
МАРВЕЛ СЕРВИС И ИМЕННО ОНА БУДЕТ ОТВЕЧАТЬ ЗА ТРАНСФОРМАЦИЮ ДАННЫХ*/


        return (
            <div className="randomchar">
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

export default RandomChar;