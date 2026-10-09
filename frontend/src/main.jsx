import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import {HelmetProvider} from 'react-helmet-async';
import App from './App.jsx'
import './css/main.css'

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<RecoilRoot>
			<HelmetProvider>
				<App />
			</HelmetProvider>
		</RecoilRoot>
	</StrictMode>
)
