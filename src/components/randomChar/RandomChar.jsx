import { Component } from 'react';
import MarvelService from '../../services/MarvelService'; 
import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

class RandomChar extends Component {
    constructor(props) {
        super(props);
        this.updateChar()
    }
    state = {
        name: null,
        description: null,
        thumbnail: null,
        homepage: null,
        wiki: null
    }

    /* Теперь напишем код по оптимизации. То что мы сформировали правильный state - это конечно круто, но в таком виде нам прийдется 
копировать эти опперации в каждый компонент по получению персонажа, на сайте справа еще есть картинка с тором где тоже можно получать
компонент по получению персонажа и нужно будет получать ВСЕ ТЕ ЖЕ ДАННЫЕ и этот огромный  this.setState который мы создали с 
name, description и так далее ПОЛНОСТЬЮ КОПИРОВАТЬ ИЗ МЕТОДА В МЕТОД. Нужно все эти операции проводить где-то централизованно в одном
месте и как раз наш сервис подходит для таких трансормаций и нам нужно перенсти такую ф-цию туда*/
    marvelService = new MarvelService();
    updateChar = () => {
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        this.marvelService
            .getCharacter(id) // здесь приходит нужный нам объект
            .then(res => { // здесь он получается
                this.setState(res) // сюда мы его передаем
                    /*name: res.data.results[0].name,
                    description: res.data.results[0].description,
                    thumbnail: res.data.results[0].thumbnail.path + '.' + res.data.results[0].thumbnail.extension,
                    homepage: res.data.results[0].urls[0].url,
                    wiki: res.data.results[0].urls[1].url
                }) */
            })
    } 
    render() {
        const {name, description, thumbnail, homepage, wiki} = this.state;
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