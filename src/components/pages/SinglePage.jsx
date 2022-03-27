import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import AppBanner from "../appBanner/AppBanner";

// Хотелось бы вынести функцию по загрузке данных как отдельный аргумент
// Но тогда мы потеряем связь со стэйтами загрузки и ошибки
// А если вынесем их все в App.js - то они будут одни на все страницы

/* Можно представить что у нас есть интернет-магазин и странички с товарами все похожи на друг друга
    Тоже самое происходит и с нашей страничкой по подгрузке одного комикса и нашего персонажа которого мы ищем в форме
    По-этому мы создаем отдельный Компонент SinglePage который отвечает за логику этих страниц и принимает в себя только
те Компоненты, которые что-то просто рендерят
    Раньше страница отдельного комикса у нас содержала отдельную верстку с Компонентом View
    У нас была снизу верстка, а сверху логика где мы по айдишке получали все данные о нём
    В персонажи все будет ровно так же, потому что когда мы переходим по Линку то мы в параметры записываем уникальный
индификатор char[0].id который мы можем получить на странице отдельного персонажа через useParams и использовать для
того что бы загрузить нашего персонажа
    По-этому здесь логика абсолютно точно такая же
    Разница только в методе для того что бы получить один Комикс case 'comic':
                    getComic(id).then(onDataLoaded);
    И персонажа case 'character':
                    getCharacter(id).then(onDataLoaded);
    По-этому одна страница SinglePage отвечает за комикс и за персонажа
    
    Мы здесь получаем id нашего url пути const {id} = useParams()
    Создаем текущий стейт как data(нам не важно какие там данные есть) 
    в useEffect когда наш Компонент будет создаваться он будет делать запрос при помощи фции updateData
    На этом этапе мы решаем какую фцию нужно запустить 
    Для этого мы задали другой аргумент dataType в наш SinglePage. Мы при помощи строки будем решать какая фция у нас
будет запускаться персонаж или комик
    Те данные что мы получили - мы записываем в Стейт, то-есть у нас есть setData в фции onDataLoaded 
    И дальше все стандартно - мы отображаем либо ошибку, либо спинер либо Контент
    
    Здесь очень интересно что мы не знаем какой Компонент мы рендерим, но мы его передаем через аргумент Component
    <Component data={data}/> : null;
    Те тепреь это какая-то абстракиця которая будет говорить что она будет рендерить конкретную страницу
    Какой метод внутри себя она будет использована она еще не знает(она получит его только при вызове) 
    И какой Компонент(комик или персонаж) она тоже не знает, это тоже будет полученно при вызове
    Мы переходим в App.jsx. 
    У нас здесь есть разные руты, которые ведут на разные маршруты 
    здесь у нас как раз вызываетс Компонент SinglePage
    в него мы передаем либо dataType comic либо character
    а в Component мы передаем разные Компоненты Интерфейса Component={SingleCharacterLayout}
    То-есть мы там на странице в App.jsx уже понимаем какой метод нам использовать в Switch case и помещаем его в dataType
    И то же самое с Компонентом верстки - помещаем в аргумент Component

    А в pages у нас две разные папки со своими верстками
    У нас приходят в них как аргумент данные {data} и уже на их основе происходит верстка где мы подставляем 
name, description, thumbnail и так далее */

const SinglePage = ({Component, dataType}) => {
        const {id} = useParams();
        const [data, setData] = useState(null);
        const {loading, error, getComic, getCharacter, clearError} = useMarvelService();

        useEffect(() => {
            updateData()
        }, [id])

        const updateData = () => {
            clearError();

            switch (dataType) {
                case 'comic':
                    getComic(id).then(onDataLoaded);
                    break;
                case 'character':
                    getCharacter(id).then(onDataLoaded);
            }
        }

        const onDataLoaded = (data) => {
            setData(data);
        }

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error || !data) ? <Component data={data}/> : null;

        return (
            <>
                <AppBanner/>
                {errorMessage}
                {spinner}
                {content}
            </>
        )
}

export default SinglePage;