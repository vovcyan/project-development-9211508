import React from 'react';
import {createRoot} from 'react-dom/client';

function Root() {
    return (
        <div>New app</div>
    );
}

const root = createRoot(document.getElementById('root'));
root.render(<Root/>);