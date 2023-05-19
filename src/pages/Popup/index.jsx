import * as React from 'react';
import { createRoot } from 'react-dom/client';
import ReactDOM from 'react-dom';

import Popup from './Popup';

const root = createRoot(document.getElementById('app-container'));
root.render(<Popup />);