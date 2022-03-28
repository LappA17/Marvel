import { Helmet } from 'react-helmet'
import {Link} from 'react-router-dom';

import ErrorMessage from "../errorMessage/ErrorMessage";

const Page404 = () => {
    return (
        <div>
            <Helmet>
                <meta
                    name="description"
                    content="This page is not foun"
                    />
                <title>This page is not found</title>
            </Helmet>
            <ErrorMessage/>
            <p style={{'textAlign': 'center', 'fontWeight': 'bold', 'fontSize': '24px'}}>Page doesn't exist</p>
            <Link style={{'display': 'block', 'textAlign': 'center', 'fontWeight': 'bold', 'fontSize': '24px', 'marginTop': '30px'}} to="/">Back to main page</Link>
        </div>
    )
}

export default Page404;