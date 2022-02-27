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

    getAllCharacters = async () => {
        const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=210&${this._apiKey}`);
        return res.data.results.map(this._transformCharacter)
    }
    /* res в этом случае это БОЛЬШОЙ ОБЪЕКТ ГДЕ ХРАНИТСЯ МАССИВ С РЕЗУЛЬТАТАМИ
       Так как это массив, то мы можем применить метод map() - ЧТО БЫ СФОРМИРОВАТЬ МАССИВ С НОВЫМИ ОБЪЕКТАМИ */

    getCharacter = async (id) => {
        const res =  await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
        return this._transformCharacter(res.data.results[0])
    }
    /* А сюда помещаем повторяющейся участок кода */
    
    /* Теперь я говорю что здесь будет приходить объект персонажа */
    _transformCharacter = (char) => {
        return {
            name: char.name,
            description: char.description,
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url
        }
    }
}

export default MarvelService;