class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = 'apikey=c582e2d7b9585c16efd7e9671775d9bf';

    getResource = async (url) => {
        let res = await fetch(url);
    
        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }
    
        return await res.json();
    }

    getAllCharacters = () => {
        return this.getResource(`${this._apiBase}characters?limit=9&offset=210&${this._apiKey}`);
    }

    getCharacter = async (id) => {
        const res =  await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
        return this._transformCharacter(res)
    }
    /* Теперь мы будем помещать результат в переменную и нужно заметить что фция getResource - это асинхронная ф-ция
        И ЭТОТ res ЭТО ТОТ БОЛЬШОЙ ОБЪЕКТ КОТОРЫЙ МЫ ПОЛУЧАЕМ ! 
        ТЕПЕРЬ ИЗ ЭТОГО БОЛЬШОГО ОБЪЕКТА БЛАГОДАРЯ НАШЕЙ ФЦИИ _transformCharacter НАМ ВОЗВРАЩАЮТСЯ КРАСИВЫЕ И ЧИСТЫЕ ДАННЫЕ КОТОРЫЕ
НАМ ТОЛЬКО И НУЖНЫ */

    /* Здесь мы будем получать данные и трансформировать его в объект и это основная тема данного урока, когда мы с api получаем кучу
данных из которых нам многие не нужны просто, трансформировать их в те что нам нужны.
    Мы будем возвращать объект, потому что мы получили на вход объект и так же будем его возвращать. ТОЛЬКО ЕСЛИ НА ВХОДЕ МЫ ПОЛУЧАЕМ
ОГРОМНЫЙ ОБЪЕКТ С КУЧЕЙ НЕ НУЖНОЙ НАМ ИНФЫ, ТО ВОЗВРАЩАТЬ МЫ БУДЕМ ТОЛЬКО ТОТ КОТОРЫ НАС ИНТЕРЕСУЕТ. ТОЕСТЬ КАК res НАМ ПРИХОДИТ БОЛЬШОЙ
ОБЪЕКТ А ВЫХОДИТ ТОТ КОТОРЫЙ НАМ ДЕЙСТВИТЕЛЬНО НУЖЕН ! - ЭТО И ЕСТЬ ТРАНСФОРМАЦИЯ ДАННЫХ */
    _transformCharacter = (res) => {
        return {
            name: res.data.results[0].name,
            description: res.data.results[0].description,
            thumbnail: res.data.results[0].thumbnail.path + '.' + res.data.results[0].thumbnail.extension,
            homepage: res.data.results[0].urls[0].url,
            wiki: res.data.results[0].urls[1].url
        }
    }
}

export default MarvelService;