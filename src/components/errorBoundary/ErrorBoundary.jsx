import { Component } from "react";
import ErrorMessage from "../errorMessage/ErrorMessage";

/* Это будет компонент, который будет ловить ошибку */
/* Предохранители ловят ошибки только в методе РЕНДЕР, в методах ЖИЗНЕННОГО ЦИКЛА, и в КОНСТРУКТОРАХ(компонентов которые были переданы в ErrorBoundary как наш CharInfo) !!! 
По-этому далеко не всегда их можно использовать, например они 1) НЕ ЛОВЯТ ОШИБКИ ВНУТРИ ОБРАБОТЧИКОВ СОБЫТИЯ(потому что события происходят
вне метода render ! К примеру если мы зайдем в наш CharList, там будет событие onClick, где мы говорим что нужно отслеживать этот клик
и запускать функцию onCharSelected после клика пользователя. Но мы не знаем когда этот клик произойдет, наш предохранитель не знает
когда остлеживать эту ошибку).
2) Не ловит ошибку во время АСИНХРОНОГО КОДА(наши сетевые запросу относятся к этому типу, по-этому у нас есть ДОПОЛНИТЕЛЬНЫЙ МЕТОД
ПО ОТЛОВУ ТАКОГО РОДА ОШИБОК)
3) Не ловит ошибки в САМОМ ПРЕДОХРАНИТЕЛИ, он ловит ошибки только в дочерних элементах как наш CharInfo */
class ErrorBoundary extends Component {
    state = {
        error: false
    }

    /* Этот метод обновляет состояние !
     static getDerivedStateFromError(error) {
        return {error: true}
    } 
 Это такой setState который работает только с ошибкой. Он очень похож с ним, ведь он нам возвращает новый объект, который будет записан
в наш state. По-этому он изменяет только состояние и НИЧЕГО БОЛЬШЕ ! */

    componentDidCatch(error, errorInfo) {
        console.log(error, errorInfo);
        this.setState({
            error: true
        })
    }

    /* Если будет ошибка(те наш стейт с ошибкой будет в позиции тру, то мы ОТРЕНЕДЕРИМ ЗАПАСНОЙ РЕНДЕР)
       А если ошибки не будет то просто рендорим то что находится внутри компонета 
       return this.props.children - пока мы это не проходили но нужно себе представлять как буд-то это компонент который
был помещен во внутрь ErrorBoundary */
    render() {
        if (this.state.error) {
            return <ErrorMessage/>
        }

        return this.props.children;
    }
}

export default ErrorBoundary;