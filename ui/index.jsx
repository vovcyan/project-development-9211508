import React from 'react';
import {createRoot} from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import {ListPage} from './pages/List/ListPage.jsx';
import {DetailsPage} from './pages/Details/DetailsPage.jsx';

import './styles.css';

const router = createBrowserRouter([
    {
        path: '/',
        element: <ListPage/>
    },
    {
        path: '/details',
        element: <DetailsPage/>
    },
]);

function Root() {
    return (
        <RouterProvider router={router} />
    );
}

const root = createRoot(document.getElementById('root'));
root.render(<Root/>);