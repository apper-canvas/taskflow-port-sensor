import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from './Layout';
import { routeArray } from './config/routes';
import NotFound from '@/components/pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <div className="h-screen flex flex-col overflow-hidden">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Routes>
              <Route index element={routeArray[0].component} />
            </Routes>} />
            {routeArray.map((route) => (
              <Route
                key={route.id}
                path={route.path}
                element={<route.component />}
              />
            ))}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="z-[9999]"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;