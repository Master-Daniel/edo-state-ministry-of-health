import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { persistor, store } from './redux/store';
import { PersistGate } from "redux-persist/integration/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import router from "./routes";
import './index.css'
import SweetAlertWrapper from './layouts/SweetAlertWrapper';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <SweetAlertWrapper>
            <RouterProvider router={router} />
          </SweetAlertWrapper>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
)
