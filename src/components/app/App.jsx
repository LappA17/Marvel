import { Component } from "react";
import AppHeader from "../appHeader/AppHeader";
import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";

import decoration from '../../resources/img/vision.png';

/* Нужно сделать так что бы при клике на одного из 9 персонажей - справа появлялась о нем инфа */

class App extends Component {
    state = {
        selectedChar: null
    }

    // Теперь нам понадобиться метод для установки нашего selectedChar
    onCharSelected = (id) => {
        this.setState({
            selectedChar: id
        })
    }
    /* из onCharSelected id приходит, меняет state и дальше устанавливается в charId  */
   render () {
    return (
        <div className="app">
            <AppHeader/>
            <main>
                <RandomChar/>
                <div className="char__content">
                    <CharList onCharSelected={this.onCharSelected}/>
                    <CharInfo charId={this.state.selectedChar}/>
                </div>
                <img className="bg-decoration" src={decoration} alt="vision"/>
            </main>
        </div>
    )
   }
}

export default App;