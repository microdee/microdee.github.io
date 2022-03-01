import React from 'react';
import { render } from 'react-dom';

import {
    BrowserRouter,
    Navigate,
    Outlet,
    useNavigate,
    useLocation,
    useSearchParams
} from 'react-router-dom';

import App from './App';
import Home from './Home';
import { RoutedMdArticle } from './MdArticle';
import PageNotFound from './PageNotFound';

function EntryPoint() {
    let [searchParams, setSearchParams] = useSearchParams();
    let redirectToEncoded = searchParams.get("redirect");
    let location = useLocation();

    document.title = `mcro.de ${location.pathname}`;

    if(redirectToEncoded) {
        return <Navigate to={decodeURIComponent(redirectToEncoded)} replace />
    } else {
        return (
            <App intro={location.pathname === "/"} >
                <Outlet />
            </App>
        )
    }
}

render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<EntryPoint />} >
                <Route index element={<Home />} />
                <Route path="c/*" element={<RoutedMdArticle />} />
                <Route path="*" element={<PageNotFound />} />
            </Route>
        </Routes>
    </BrowserRouter>
)