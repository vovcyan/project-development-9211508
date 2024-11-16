import React from 'react';
import {RouterProvider, createBrowserRouter} from 'react-router-dom';

import {ListPage} from './pages/List/ListPage.jsx';
import {DetailsPage} from './pages/Details/DetailsPage.jsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: <ListPage />
    },
    {
        path: '/details',
        element: <DetailsPage />
    },
]);

export function App() {
    return (
        <div className='container mx-auto px-4'>
            <RouterProvider router={router} />
        </div>
    );
}