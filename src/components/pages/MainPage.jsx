/* Мы специально создали два новых файла что бы разбить нашу верстку на Компоненты, импортируя и саму верстке и хуки */

import { useState } from "react";

import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import ErrorBoundary from "../errorBoundary/ErrorBoundary";

import decoration from '../../resources/img/vision.png';

const MainPage = () => {
    //Так как у нас есть состояние - вырезаем и их
    const [selectedChar, setChar] = useState(null);

    const onCharSelected = (id) => {
        setChar(id);
    }

    //Нам понадобиться РеактФрагмент потому что у нас будет большой кусок верстки который нечем не обернут
    return (
        <>
            <ErrorBoundary>
                                <RandomChar/>
                            </ErrorBoundary>
                            <div className="char__content">
                                <ErrorBoundary>
                                    <CharList onCharSelected={onCharSelected}/>
                                </ErrorBoundary>
                                <ErrorBoundary>
                                    <CharInfo charId={selectedChar}/>
                                </ErrorBoundary>
                            </div>
                            <img className="bg-decoration" src={decoration} alt="vision"/>
        </>
    )
}

export default MainPage
