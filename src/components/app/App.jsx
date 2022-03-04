import { Component } from "react";
import AppHeader from "../appHeader/AppHeader";
import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import ErrorBoundary from "../errorBoundary/ErrorBoundary";

import decoration from '../../resources/img/vision.png';

/* У нас есть CharInfo который постоянно ломается <CharInfo charId={this.state.selectedChar}/> 
   И мы вместо него помещаем ErrorBoundary
   А в ErrorBoundary помещаем CharInfo
   Теперь после нажатие на персонажа выкидывает ошибку от Реакта, но если мы нажмем на крестик то все будет работать
   
   НЕ СТОИТ ВСЕ ПОДРЯД ОБОРАЧИВАТЬ(НА ЛИЧНОЕ УСМОТРЕНИЕ, НО ВООБЩЕ КАЖДЫЙ МЕЛКИЙ КОМПОНЕНТ - ТАК ДЕЛАТЬ НЕ НУЖНО)
   
   Так же мы обернули CharList и RandomChar в предохранитель, специально сделали ошибку в componentDidMount и 
заходим на страничку и мы видим два новых робота там где произошла ошибка !*/
class App extends Component {
    state = {
        selectedChar: null
    }

    onCharSelected = (id) => {
        this.setState({
            selectedChar: id
        })
    }
   render () {
    return (
        <div className="app">
            <AppHeader/>
            <main>
                <ErrorBoundary>
                    <RandomChar/>
                </ErrorBoundary>
                <div className="char__content">
                    <ErrorBoundary>
                        <CharList onCharSelected={this.onCharSelected}/>
                    </ErrorBoundary>
                    <ErrorBoundary>
                        <CharInfo charId={this.state.selectedChar}/>
                    </ErrorBoundary>
                </div>
                <img className="bg-decoration" src={decoration} alt="vision"/>
            </main>
        </div>
    )
   }
}

export default App;