import React from 'react';
import {createRoot} from 'react-dom/client';
import {NextUIProvider} from "@nextui-org/react";

import {App} from './App.jsx';

import './styles.css';

function Root() {
    return (
        <React.StrictMode>
            <NextUIProvider>
                <main className="light text-foreground bg-background">
                    <App/>
                </main>
            </NextUIProvider>
        </React.StrictMode>
    );
}

const root = createRoot(document.getElementById('root'));
root.render(<Root />);