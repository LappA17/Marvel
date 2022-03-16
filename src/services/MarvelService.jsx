import {useHttp} from '../hooks/http.hook'

const useMarvelService = () => { //добавим в название use что бы другие разрабы видели что это кастомный хук

    /*Дальше я буду импортировать все что внутри useHttp 
    {} - это СИНТАКСИС ДИСТРУКТУРИЗАЦИИ ПОТОМУ ЧТО МЫ РАБОТАЕТ С ОБЪЕКТОМ И ОТТУДА УЖЕ ВЫТАСКИВАЕМ*/
    const {loading, request, error, clearError} = useHttp() /*В прошлом уроке мы помещали в переменную, но так же мы можем вытащить
сущности из этого хука с помощью {} */

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=c582e2d7b9585c16efd7e9671775d9bf';
    const _baseOffset = 210;

    /* getResource = async (url) => {
        let res = await fetch(url);
    
        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }
    
        return await res.json();
    } Эта фция нам больше не понадобиться, запросы будет выполнять хттп хук */

    /*Обрати внимание что фции getResource у нас больше не существует, по этому вместо this.getResource(`${_apiBase}
подставляю просто request с http hook 
    Потому что request - это тот же getResource только при этом мы еще и работает со стоянием - те это продвинутая фция*/
    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }

    const getCharacter = async (id) => {
        const res =  await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0])
    }
    
    const _transformCharacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            description: char.description ? `${char.description.slice(0, 210)}...` : 'There is no description for this character', // есди больше 210 символов в катинке что бы не вылазила
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }

    /*Так как это фукнция нам нужно из нее тоже что-то вернуть, и Сервис - это точно такой же кастомный Хук для того
что бы использовать Сервис 
      Когда будет вызывать фция МарвелСервис - то я буду возвращать несколько сущностей */
    return {loading, error, getAllCharacters, getCharacter, clearError}
}

export default useMarvelService;

/* Если мы сейчас зайдет на наш сайт Маврел, то мы получим ошибку, дело в том что мы пытаемся в некоторых Компонентах
создать нашу функцию как Конструктор(при помощи new !!!), а класса уже не существует, а существует только функция ! 

    Теперь объясним как это работает: с Хуком хттп все понятно, мы его реализовали и экспортировали 4 сущности. 
    В МарвелСервис мы создали уже функцию вместо класса, по-этому для вызова нам нужно просто поставить круглые скобки
useMarvelService = () =>, это значит что нам не нужно использовать опператор new. 
    В нашем CharList - у нас создается фция useMarvelService, а у нас там есть const marvelService = new MarvelService();
new мы убираем и добавляем use 
*/