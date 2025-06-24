import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import { Home, Help, Login, Register, Profile, SearchFlights, Settings, FlightComponent  } from "@/pages";
import { LayoutLogin, PersistLogin, RequireAuth, OAuthSuccessPage, OAuthFailPage } from "@/components";
import { ToastProvider, AuthProvider, ThemeProvider, LanguageProvider } from "@/context";

import { ROLES } from "@/constants";
import 'bootstrap/dist/css/bootstrap.min.css';
import "@/styles/global.css";

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    document.title = import.meta.env.VITE_AIR_BOOK_NAME || "Air Book";
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <ThemeProvider>
            <LanguageProvider>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/help" element={<Help />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/oauth-success" element={<OAuthSuccessPage />} />
                <Route path="/oauth-fail" element={<OAuthFailPage />} />

                <Route element={<PersistLogin />}>
                  <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
                    <Route element={<LayoutLogin />}>
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/search-flights" element={<SearchFlights />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/flight/:flightId" element={<FlightComponent />} />
                    </Route>
                  </Route>
                </Route>
              </Routes>
            </LanguageProvider>
          </ThemeProvider>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
