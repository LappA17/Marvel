import { useState, useCallback } from "react";

/* В самом конце урока на 50 минуте мы понимаем что мы абсолютно нигде больше loading и error не используем, потому что
мы перешли на немножко другой формат, более правильный когда у нас все генерируется через процесс
    Убираем loading и error  
    
    После того как мы удалили везде loading и error 
    Мы тестим нашу форму, найдем thor и перейдем на него 
    И У НАС НИЧЕГО НЕ СЛОМАЕТСЯ ВЕДЬ У НАС НЕТ ЖЕСТКОЙ ПРИВЯЗКИ К ЭТИМ МОМЕНТАМ
    Переходим в CharSearchForm и там дальше разбираемся */
export const useHttp = () => {
    /* const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); */
    const [process, setProcess] = useState('waiting')
    /* Назовем состояние process - это какой процесс будет внутри Компонента
    'waiting' - ожидание какого-то действия
    Кокнертно в ЧарИнфо понятно что у нас будет грузится Скелетон
    Но у нас есть так же Компоненты которые ничего не ждут, а сразу что-то загружают
    
    Теперь когда мы обозначали состояние Компонента нам нужно его как-то менять в течение действия нашего запроса
в нашем request(сейчас мы будем работать с Компонентами, которые меняются в течение запроса) 
    Когда у нас request будем запускаться, то у нас process будет переходить в loading 
    
    Состояние в конечных автоматах нужно прописывать именно строками, а не Булиновыми значениями. Это очень важно для
бекенда
    
    Потом когда запрос будет завершен мы назовём наше состояние confirmed(подтвержденный) 
    
    У нас есть catch где мы устанавливаем loading в false + ошибку
    Здесь же мы установим process в setProcess('error')

    Так же у нас есть Функция Очистки Ошибок
    Мы в нее тоже установим process
    Потому что когда мы очищаем ошибку - мы как бы ожидаем опять новых данных
    setProcess('loading') ставим опять laoding, потому что у нас после ошибки нужно опять повторно запустить загрузку
что бы появился новый персонаж

    И экспортируем process
*/

    const request = useCallback(async (url, method = 'GET', body = null, headers = {'Content-Type': 'application/json'}) => {

        //setLoading(true);
        setProcess('loading')

        try {
            const response = await fetch(url, {method, body, headers});

            if (!response.ok) {
                throw new Error(`Could not fetch ${url}, status: ${response.status}`);
            }

            const data = await response.json();

            //setLoading(false);
            //setProcess('confirmed') УДАЛЯЕМ ТАК КАК МЫ СОЗДАЛИ .then(() => setProcess('confirmed')) УЖЕ В САМОМ ЧарИнфо
            return data;
        } catch(e) {
            //setLoading(false);
            //setError(e.message);
            setProcess('error')
            throw e;
        }
    }, []);

    const clearError = useCallback(() => {
        //setError(null)
        setProcess('loading')
    }, []);

    //return {loading, request, error, clearError, process, setProcess}
    return {request, clearError, process, setProcess}
}