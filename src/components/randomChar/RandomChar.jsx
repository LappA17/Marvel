import { Component } from 'react';//Так как мы работает со стейтем
import MarvelService from '../../services/MarvelService'; //импортурием с индекс жс
import './randomChar.scss';
// import thor from '../../resources/img/thor.jpeg'; Больше картинка не нужна так как мы подставили переменную
import mjolnir from '../../resources/img/mjolnir.png';
/* При клике на try должен меняться персонаж */

class RandomChar extends Component {
    constructor(props) {
        super(props);
        this.updateChar()/* Мы вызываем наш метод когда у нас будет создавать(конструироваться наш объект) */
    } /* Вызывать методы в конструкторах, особенно тех методов которые у нас общаются с сервером, подписываются на сервисы
и тд, то нам Реакт будет говорить что мы НЕ можем вызвать set.state на компоненте который еще не появился на странице,
могут быть баги. Это происходит потому что наш КОНСТУКТОР БЫЛ ВЫЗВАН ЕЩЕ ДО ТОГО КАК ПОСТРОЕЛАСЬ НАША ВЕРСТКА, именно
на это ругается наш Реакт. По-этому вызов методов в констукторах - очень плохая практика. По-этому мы этот код обязательно
исправим но пока что на несколько уроков оставим так*/
    state = { // Все данные ниже мы берем на примере АПИ Марвел
        name: null, // по дефолту все будет стоять в null
        description: null,
        thumbnail: null, // thumbnail - превьюшка
        homepage: null,
        wiki: null
    }

    marvelService = new MarvelService();/* Вот такой вот код будет создавать новое свойство внутри класса RandomChar
то-есть как буд-то это было this.Marverservice и мы туда помещаем новый конструктор. То-есть теперь в классе будет
существовать новое свойсвто - this.marverService */

/* Теперь этот сервис мы должны где-то использовать. Метод который будет получать данные и записывать в state
   После каждой перезагрузки страницы будет меняться герой */
    updateChar = () => {
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000); /* Этот персонаж будет получать по id(уникальный индификатор).Сначало округлим что бы 
у айди не было дробей. Дальше будем создать случайное число в определенном промежутке. Мы МесРендом умножаем на результат
максимального числа - минимальное число. Эти числа - это айдишки всех героев от 1го до последнего. И дальше мы добавляем
минимальное значение диапазона. 
Иногда будет так что при попадание на рандомного персонажа - будет выбивать ошибку 404 - это нормально*/
        this.marvelService
            .getCharacter(id)/*Так как нам нужен только один персонаж*/
            .then(res => {
                this.setState({ // Коллбек функция по формированию нашего стейта. Он будет зависить от предыдущего стейта
                    name: res.data.results[0].name,/* Берем результат который мы получили, это один большой объект и у него есть свойство data-
это те данные которые были получены от сервера и у этой дейты есть поле которое называется results(в него помещаелся
массив с данными) и так как у нас получается только один персонаж, то мы можем обратиться к 0 индексу - к первому персонажу
и записать его имя */
                    description: res.data.results[0].description,
                    
                    /*Здесь будет сложнее потому что картинка состоит из двух полей - это url и разширение нашей картинки
по-этому мы здесь будем складывать строки. У нас там было path и extension в свойствах объекта. Таким образом мы сформируем
единный путь к нашей картинке. В path хранится http картинки а в extension - ее разрешение, те jpg */
                    thumbnail: res.data.results[0].thumbnail.path + '.' + res.data.results[0].thumbnail.extension,
                    homepage: res.data.results[0].urls[0].url,/* У нас там дальше был свойство объекта urls который 
сам по себе массив в котором лежит два объекта. И в первом и во втором объекте лежит type, url. Этот паттерн у нас меняться
не будет, у нас везде будет массив с двумя объектами, по этому сначала мы хотим получить первый объект и у него свойство
url */
                    wiki: res.data.results[0].urls[1].url //это собственный второй объект в массиве urls
                })
            })
    } /* Теперь стал вопрос как запустить метод updateChar ведь его нужно запустить в начале приложения + когда пользователь
будет кликать на кнопку. Один из возможностей его вызвать - это контруктор */

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