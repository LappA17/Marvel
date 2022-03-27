import {useState} from 'react';
import { Formik, Form, Field, ErrorMessage as FormikErrorMessage } from 'formik';
import * as Yup from 'yup';
import {Link} from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charSearchForm.scss';

/* Как мы создали эту форму:
    Наш Компонент идет по стандартному пути - это фциональный Компонент, который внутри себя создаем состояние char
    В char будет помещаться тот персонаж, который был найден в нашей Апишке
    Мы импортируем все из нашего Сервиса

    updateChar - будет запускаться, когда у нас будет идти запрос на сервер 
    onCharLoaded - будет устанавливать наше состояние 
    
    Спускаемся ниже и у нас та есть Formik который помещен в div для обёркти
    У нашего Формика только одно initialValues - потому что у нас только одно поле
    В волидации мы говорим что оно должно быть строкой и заоплненно 
    Дальше у нас есть onSubmit где мы выполняем updateChar - то-есть когда наша форма будет отправляться - мы будем запускать updateChar
который сначала clearError(очистит все ошибки) - после этого сделает запрос на Сервер и получит какие-то данные .then(onCharLoaded)
то-есть мы вот запускам onCharLoaded и устанавливаем наше новое состояние

    Мы на сайте Марвел а поиске вбил Thor и нам выдоло Объект данных и мы от них отталкиваемся
    Когда мы получаем результат(Объект с персонажем), то мы будем генерировать кусочек вёрстки в переменной results
    results будет помещаться после формы(потому что когда мы что-то нашли то у нас появляется надпись There is! Visit,
а если ничего не нашли The character was not found. Check the name and try again. По-этому помещаем после формы, потому
что оно выскакивает после ввода чего-то пользователя)
    !char - если у нас нет персонажа то мы ничего не рендерим 
    char.length > 0 - если персонажей больше чем 1 то мы рендерим участок вёрстки
    char[0].name - мы обращаемся к ПЕРВОМУ И ЕДИНСТВЕННОМУ элементу и к его именни 
    Так же у нас есть Link который ведет на пусть Слеш /characters/ и ${char[0].id} айди персонажа
    
    А если мы вдруг сделали запрос и у нас нет персонажа, то мы всё равно получим Объект
    Если мы вместо Тора вбъем несуществующего персонажа и сделаем запрос, то мы всё равно получим Объект только с 
ПУСТЫМ МАССИВОМ 
    В таком случае если у нас меньше ОДНОГО ПОЛУЧЕННОГО РЕЗУЛЬТАТА char.length > 0 то мы рендерим ошибку и что перс не найден
    
    В самой Форме у нас есть Field и мы его связали с неймом и она у нас каждый раз волидируется с validationSchema
    Если вдруг волидация не проходит то у нас автоматически появляется Компонент Ошибки 
    <FormikErrorMessage component="div" className="char__search-error" name="charName" /> и он рендерится как див
    
    Здесь есть очень важный момент - когда мы импортируем ошибку import ErrorMessage, то она имеет точно такое
же название как ерор меседж из Формика, такой конфлит имен бывает и это нормально, по этому мы сразу его переименновываем
наш ерормеседж из формика ErrorMessage as FormikErrorMessage

    Если у нас произошла ошибка, то мы отрендерим вот это
    const errorMessage = error ? <div className="char__search-critical-error"><ErrorMessage /></div> : null;
    Мы обернем ErrorMessage потому что у нас там лежит картинка-гифка. по этому обернем что бы добавить чуть стилей */
const CharSearchForm = () => {
    const [char, setChar] = useState(null);
    const {loading, error, getCharacterByName, clearError} = useMarvelService();

    const onCharLoaded = (char) => {
        setChar(char);
    }

    const updateChar = (name) => {
        clearError();

        /*Это метод с MarvelService
        Когда мы получаем персонажа - мы получаем большой Объект данных */
        getCharacterByName(name)
            .then(onCharLoaded);
    }

    const errorMessage = error ? <div className="char__search-critical-error"><ErrorMessage /></div> : null;
    const results = !char ? null : char.length > 0 ?
                    <div className="char__search-wrapper">
                        <div className="char__search-success">There is! Visit {char[0].name} page?</div>
                        <Link to={`/characters/${char[0].id}`} className="button button__secondary">
                            <div className="inner">To page</div>
                        </Link>
                    </div> : 
                    <div className="char__search-error">
                        The character was not found. Check the name and try again
                    </div>;

    return (
        <div className="char__search-form">
            <Formik
                initialValues = {{
                    charName: ''
                }}
                validationSchema = {Yup.object({
                    charName: Yup.string().required('This field is required')
                })}
                onSubmit = { ({charName}) => {
                    updateChar(charName);
                }}
            >
                <Form>
                    <label className="char__search-label" htmlFor="charName">Or find a character by name:</label>
                    <div className="char__search-wrapper">
                        <Field 
                            id="charName" 
                            name='charName' 
                            type='text' 
                            placeholder="Enter name"/>
                        <button 
                            type='submit' 
                            className="button button__main"
                            disabled={loading}>
                            <div className="inner">find</div>
                        </button>
                    </div>
                    <FormikErrorMessage component="div" className="char__search-error" name="charName" />
                </Form>
            </Formik>
            {results}
            {errorMessage}
        </div>
    )
}

export default CharSearchForm;