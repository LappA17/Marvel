/* В проектах где есть папка services - значит туда будем помещать файлы, которые будут общаться со стороними ресурсами,
например с АПИ. ПОМНИ ЧТО МЫ СОЗДАЕМ КОМПОНЕНТЫ С БОЛЬШОЙ БУКВЫ КАК MarvelService */

/* Обрати внимание что мы не импортируем Component from 'react' и не наследуем наш класс от компонента, потому что
этот класс который мы создадиим будет на НАТИВНО ЖС и ему от Реакта ничего не нужно */

class MarvelService {

    /* В самом конце урока Ваня сказал что у нас идет повторение кода и нужно оптимизировать. Мы назначаем наши перменные
с лодаша_ ПОТОМУ ЧТО НЕФОРМАЛЬНО ЭТО ЗНАЧИТ ЧТО ЗНАЧЕНИЕ ЭТИХ ПЕРЕМЕННЫХ НЕЛЬЗЯ МЕНЯТЬ */
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = 'apikey=c582e2d7b9585c16efd7e9671775d9bf';

    getResource = async (url) => {
        let res = await fetch(url);
    
        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }
    
        return await res.json();
    }

    //Запросы к нашему API
    getAllCharacters = () => { //Получить всех персонажей
        /* Тут будет возвращение каких-то данных.*/
        return this.getResource(`${this._apiBase}characters?limit=9&offset=210&${this._apiKey}`);
    }  /* Заходим в GET /v1/public/characters Из всего АПИ мы берем только result, нам не нужно брать 
весь объект и это важно потому что нужно част обращать внимание на внутрености АПИ */
    /* У нас верстке отображается по дефолту 9 персонажей, остальные после клика loar more. Мы можем в АПИ на сайте Марвел
установить ЛИМИТ по персонажем и ОФФСЕТ(Сколько персонажей мы пропустим). Мы ставим лимит 9 а оффсет 210. Копируем 
новую ссылку на зарос и подставляем новую ссылку в наш getResource. То-есть на Апи Марвел можно модифицировать 
запросы и от этого ссылка будет менять. 
    И из-за того что мы прописали в inex.jsx marvelService.getAllCharacters().then(res => console.log(res))
то у нас в консоли браузера будет отображаться объект со всей инфой о персонажах и когда мы вставляли ссылку
со всеми персонажами то там был большой объект а сейчас в объекте только 9 персонажей(обарти внимание на 
вот эту вот часть ссылки limit=9&offset=210) */

/* Теперь пропишем метод для получение ОПРЕДЕЛЕННОГО ПЕРСОНАЖА, для этого заходим в наш API Марвел и заходим в раздел
уже в GET /v1/public/characters/{characterId} */

    getCharacters = (id) => {
        return this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`); 
    }
/* В ссылке удаляем &limit=9&offset=210. И после слеша(characters/) нужно вставить уникальный id. Для этого используем
бектики. ID нам будет приходить как аргумент
   marvelService.getCharacters(1011052).then(res => console.log(res)) ТЕПЕРЬ ВПИСАВ УНИКАЛЬНЫЙ АЙДИ В ПОЛУЧЕНИЕ ПЕРСОНАЖА
МЫ В КОНСОЛИ БРАУЗЕРА ПОЛУЧИМ ОБЪЕКТ С ЭТИМ ПЕРСОНАЖЕМ. И ТЕПЕРЬ ПО ЭТОМУ АЙДИ МЫ МОЖЕМ ОРИЕНТИРОВАТЬСЯ И ПО НЕМУ
ВЫВОДИТЬ ДАННЫЕ КАКОГО-ТО ПЕРСОНАЖА
{code: 200, status: 'Ok', copyright: '© 2022 MARVEL', attributionText: 'Data provided by Marvel. © 2022 MARVEL', attributionHTML: '<a href="http://marvel.com">Data provided by Marvel. © 2022 MARVEL</a>', …}
attributionHTML: "<a href=\"http://marvel.com\">Data provided by Marvel. © 2022 MARVEL</a>"
attributionText: "Data provided by Marvel. © 2022 MARVEL"
code: 200
copyright: "© 2022 MARVEL"
data:
count: 1
limit: 20
offset: 0
results: Array(1)
0: {id: 1011052, name: 'Cardiac', description: '', modified: '1969-12-31T19:00:00-0500', thumbnail: {…}, …}
length: 1
[[Prototype]]: Array(0)
total: 1
[[Prototype]]: Object
etag: "eaddb9275de50bf9f90673eab39a3eb99ee7eb9c"
status: "Ok"
[[Prototype]]: Object
*/
} 


export default MarvelService