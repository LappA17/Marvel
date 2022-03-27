import { useState } from "react";

import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import CharSearchForm from '../charSearchForm/CharSearchForm';
import ErrorBoundary from "../errorBoundary/ErrorBoundary";

import decoration from '../../resources/img/vision.png';

/* Теперь мы заходим в MainPage что бы посмотреть куда эту CharSearchForm вставить
    Здесь у нас был Компонент CharInfo который при помощи Гридов распологался там где он есть(справа)
    Но так как мы помещаем сюда еще один компонент нашей Формы, то нам нужно при помощи Вёрстки всё это дело правильно
рассположить
    Открываем инспектор кода в приложение и видим что наш char__content состоит всего из двух колонок - одна 650 пикселей
другая 425. Раньше здесь верстка состояла из двух элементов, но когда мы добавляем третий элемент - то его нужно куда-то
поместить
    По-этому мы сделали пустой блок div и обернули в него CharInfo и CharSearchForm
    Таким образом этот пустой блок занимает как бы правую колонку и внутри себя вмещает два этих Компонента */
const MainPage = () => {

    const [selectedChar, setChar] = useState(null);

    const onCharSelected = (id) => {
        setChar(id);
    }

    return (
        <>
            <ErrorBoundary>
                <RandomChar/>
            </ErrorBoundary>
            <div className="char__content">
                <ErrorBoundary>
                    <CharList onCharSelected={onCharSelected}/>
                </ErrorBoundary>
                <div>
                    <ErrorBoundary>
                        <CharInfo charId={selectedChar}/>
                    </ErrorBoundary>
                    <ErrorBoundary>
                        <CharSearchForm/>
                    </ErrorBoundary>
                </div>
            </div>
            <img className="bg-decoration" src={decoration} alt="vision"/>
        </>
    )
}

export default MainPage;