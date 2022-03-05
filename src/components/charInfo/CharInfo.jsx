import { Component } from 'react';
import './charInfo.scss';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton'

import PropTypes from 'prop-types'; // Импортируем
/* Приходится работать со СТАТИЧЕСКИМИ ДАННЫМИ И ДИНАМИЧЕСКИМИ. Многие используют в таких проектах typeScript, но в Реакте
есть свое решение, которые многие исопльзуют - это PropTypes, раньше он был частью Реакта, но теперь нужно его устанавливать
npm i prop-types --save (save что бы сохранить в список зависимостей) 
    Теперь мы сможем прописывать правила для проверки наших просов(те их типы) и если они не будут подходить по типам, то
мы будет показывать уведомление об этом в терминале. Все эти уведомление работают в режиме разработки, те в продакшине их уже
не будет*/

class CharInfo extends Component {
    state = {
        char: null, 
        loading: false, 
        error: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.updateChar()
    } 

    componentDidUpdate(prevProps) { 
        if (this.props.charId !== prevProps.charId) {
            this.updateChar()
        }
    }

   updateChar = () => {
      const {charId} = this.props;
      if (!charId) {
          return;
      }

      this.onCharLoading();

      
      this.marvelService
          .getCharacter(charId)
          .then(this.onCharLoaded)
          .catch(this.onError)
   }
   
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

    render() {
        const {char, loading, error} = this.state

        const skeleton = char || loading || error ? null : <Skeleton/> 
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error || !char) ? <View char={char}/> : null;

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

const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = char 

    let imgStyle = {'objectFit' : 'cover'};
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') { 
        imgStyle = {'objectFit' : 'contain'}; 
    }

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={imgStyle}/>
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
                {comics.length > 0 ? null : 'There is no comics with this character'}
                {
                    comics.map((item, i) => {
                        if (i > 10) return;
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

/* Добавляем нашему компоненту статичное свойсвто propTypes 
   Открываем объект
   Записываем название того ПРОПЕРТИ который приходит(charId - мы знаем что такой пропс приходит к нам в компонент)
   А его свойством этого charId мы должны записать его волидацию, те чем оно должно являться. Сюда мы записываем то что мы импортировали
и то чем оно должно ялвяться, те числом

    Теперь протестируем вот так charId: PropTypes.string, ТО У НАС В КОНСОЛЕ БУДЕТ УВЕДОМЛЕНИЕ ЧТО ЧТО-ТО ИДЕТ НЕ ТАК, У НАС КАКОЙ-ТО 
ПРОПЕРТИ НЕ СООТВЕТСТУЕТ ПО ТИПУ(ПОСЛЕ НАЖАТИЕ НА ПЕРСОНАЖА). Это помогает нам в том что мы можем не заметить изменения данных, всегда
будет показыванно в консоли. Мы так можем проверять, на фции, булиновые значения, символы, массивы и тд. 
    НО ВАНЯ СКАЗАЛ ЧТО ОЧЕНЬ ВАЖНО ОБРАТИТЬ ВНИМАНИЕ НА isRequired - что бы показывать предупреждение если проп у нас не передан, те
это обязательный проп будет

    Вопрос на собеседовние: МОЖНО ЛИ С ПОМОЩЬЮ ПРОПТАЙПС УСТАНАВЛИВАТЬ ПРОПС ПО УМОЛЧАНИЮ ? ОТВЕТ ДА, для этого используется свойство
defaultProps*/
CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;