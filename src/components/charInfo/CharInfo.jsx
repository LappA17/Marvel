import { Component } from 'react';
import './charInfo.scss';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton'

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

    // Ф-ционал что бы картинка была по центру
    let imgStyle = {'objectFit' : 'cover'}; // сначала создаем объект который будет содержать в формате камелКейс objectFit в cover
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') { //и если thumbnail приходит в формате НУЖНОГО нам изображения
        imgStyle = {'objectFit' : 'contain'}; //меняем на contain и потом этот стиль применяем к изображению
    }

    /* if (i > 10) return; - если комиксов будет больше 10 то больше их не формировать. Но если предположить что тут будет
тысячи комиксов тогда лучше такой код не использовать, ведь коллбек функция натыкается на неправдивое значение и останавливается, но
она все равно перебирает все и тогда это ударить по прозводительности */
/* {comics.length > 0 ? null : 'There is no comics with this character'} - если у персонажа нет комиксов то мы прям в верстке пишем 
вот такое */
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

export default CharInfo;