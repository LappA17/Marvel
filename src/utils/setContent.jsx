import Spinner from '../components/spinner/Spinner';
import ErrorMessage from '../components/errorMessage/ErrorMessage';
import Skeleton from '../components/skeleton/Skeleton';

/* Так как у нас есть Компоненты, которые грузят комексы, отображают разлчную вёрстку, по этому меняем char на data
    Component - вместо View здесь будет абстрактный Компонент и мы не знаем какой будет приходить и он у нас будет
приходить в качестве аргумента */
const setContent = (process, Component, data) => {
    switch(process) {
        case 'waiting':
            return <Skeleton/>;
            break;
        case 'loading':
            return <Spinner/>;
            break;
        case 'confirmed':
            return <Component data={data}/>; //это уже момент когда данные полученные и мы рендерим сам Контент
            break;
        case 'error':
            return <ErrorMessage/>
            break;
        default: 
            throw new Error('Unexpected process state');
    }
}

export default setContent