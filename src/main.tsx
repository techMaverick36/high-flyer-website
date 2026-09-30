import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store'
import './index.css'
import App from './App.tsx'

// index.html carries default SEO tags for crawlers that don't run JS. Drop
// them so the per-page tags from <SEO> are the only canonical/title/etc.
document.querySelectorAll('[data-static-seo]').forEach((el) => el.remove())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
