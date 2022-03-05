class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = 'apikey=c582e2d7b9585c16efd7e9671775d9bf';
    _baseOffset = 210; //Базовый отступ для наших персонажей, что бы немного изменить getAllCharacters

    getResource = async (url) => {
        let res = await fetch(url);
    
        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }
    
        return await res.json();
    }

    /* ВАЖНО! Мы передаем не сразу _baseOffset, а через аргумент offset которое мы задаем дефолтное значение __baseOffset
       Это позволит нашей функции быть более гибкой, потому что теперь она будет отталкиваться от аргумента, и если мы туда
аргумент не передаем то тогда будет использоваться базоый, а именно _baseOffset = 210 */
    getAllCharacters = async (offset = this._baseOffset) => {
        const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`);
        return res.data.results.map(this._transformCharacter)
    }

    getCharacter = async (id) => {
        const res =  await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
        return this._transformCharacter(res.data.results[0])
    }
    
    _transformCharacter = (char) => {
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
}

export default MarvelService;