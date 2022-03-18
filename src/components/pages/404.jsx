import ErrorMessage from "../errorMessage/ErrorMessage";
import {Link} from 'react-router-dom';
// Link мы будем использовать что бы перенаправлять пользователя назад после того как он зашел на 404 страницу

/*Если мы впишем несуществующий id, потом закроем ошибку от Реакта, то у нас появится наш робот с ошибкой */
const Page404 = () => {
    //Нам здесь понадобиться просто див а не фрагмент(что бы не сломалась верстка)
    return (
        <div>
            <ErrorMessage/>
            <p style={{'textAlign': 'center', 'fontWeight': 'bold', 'fontSize': '24px'}}>Page doesn't exist</p>
            <Link style={{'display': 'block', 'textAlign': 'center', 'fontWeight': 'bold', 'fontSize': '24px', 'marginTop': '30px'}} to="/">Back to main page</Link>
        </div>
    )
}

export default Page404;