import React from 'react';
import {Route} from 'react-router-dom';
import Home from './pages/Home';
import {toast, ToastContainer} from 'react-toastify';
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
} from '@tanstack/react-query';
import TimeExceed from './pages/time_exceed';
import DrizzleFin from './pages/drizzle/drizzleFin';
import Powder from './pages/drizzle/powder';
import Drizzle from './pages/drizzle/drizzle';
import PowderFin from './pages/drizzle/powderFin';
import PowderProcess from './pages/drizzle/powderProcess';
import ErrorPage from './pages/Error';
import Extra from './pages/extra_sauce/extra';
import ExtraFin from './pages/extra_sauce/extraFin';
import ExtraMission2 from './pages/extra_sauce/extraMission2';
import ExtraMission2Process from './pages/extra_sauce/extraMission2Process';
import ExtraMission2Fin from './pages/extra_sauce/extraMission2Fin';
import Rockpaper from './pages/rockpaper/rockpaper';
import RockpaperChkFin from './pages/rockpaper/rockpaperChkFin';
import RockpaperProcess from './pages/rockpaper/rockpaperProcess';

const App = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
    queryCache: new QueryCache({
      onError: ({message, code, status, response}: any) => {
        toast.error(
          process.env.NODE_ENV === 'development'
            ? `(${code ?? 'none'})  ${message}`
            : `요청 처리에 실패하였습니다. (Error Code: ${code ?? 'none'})`,
        );
      },
    }),
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer position="top-right" />
      <Route path="/" exact={true} component={Home} />
      <Route path="/error" exact={true} component={ErrorPage} />
      <Route path="/time_exceed" component={TimeExceed} />
      <Route path="/drizzle" component={Drizzle} />
      <Route path="/drizzlefin" component={DrizzleFin} />
      <Route path="/powder" component={Powder} />
      <Route path="/powderprocess" component={PowderProcess} />
      <Route path="/powderfin" component={PowderFin} />
      <Route path="/extra" component={Extra} />
      <Route path="/extrafin" component={ExtraFin} />
      <Route path="/extramission2" component={ExtraMission2} />
      <Route path="/extramission2process" component={ExtraMission2Process} />
      <Route path="/extramission2fin" component={ExtraMission2Fin} />
      <Route path="/rockpaper" component={Rockpaper} />
      <Route path="/rockpaperchkfin" component={RockpaperChkFin} />
      <Route path="/rockpaperprocess" component={RockpaperProcess} />
    </QueryClientProvider>
  );
};

export default App;
