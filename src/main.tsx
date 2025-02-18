import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import router from "./routes";
import './index.css'
import SweetAlertWrapper from './layouts/SweetAlertWrapper';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <SweetAlertWrapper>
        <RouterProvider router={router} />
      </SweetAlertWrapper>
    </QueryClientProvider>
  </StrictMode>,
)
