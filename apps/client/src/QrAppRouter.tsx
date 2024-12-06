import React from 'react';
import {
  createRoutesFromChildren,
  matchRoutes,
 // Navigate,
  Route,
  Routes,
  useLocation,
  useNavigationType,
} from 'react-router-dom';
import * as Sentry from '@sentry/react';

//import { useClientPath } from './common/hooks/useClientPath';
import Log from './features/log/Log';
import withPreset from './features/PresetWrapper';
import withData from './features/viewers/ViewWrapper';
import ViewLoader from './views/ViewLoader';
import { ONTIME_VERSION } from './ONTIME_VERSION';
import { sentryDsn, sentryRecommendedIgnore } from './sentry.config';

const Editor = React.lazy(() => import('./features/editors/ProtectedEditor'));
const Cuesheet = React.lazy(() => import('./features/cuesheet/ProtectedCuesheet'));
const Operator = React.lazy(() => import('./features/operator/OperatorExport'));

//const TimerView = React.lazy(() => import('./features/viewers/timer/Timer'));
const MinimalTimerView = React.lazy(() => import('./features/viewers/minimal-timer/MinimalTimer'));
const ClockView = React.lazy(() => import('./features/viewers/clock/Clock'));
const Countdown = React.lazy(() => import('./features/viewers/countdown/Countdown'));

const Backstage = React.lazy(() => import('./features/viewers/backstage/Backstage'));
const Timeline = React.lazy(() => import('./views/timeline/TimelinePage'));
const Public = React.lazy(() => import('./features/viewers/public/Public'));
const Lower = React.lazy(() => import('./features/viewers/lower-thirds/LowerThird'));
const StudioClock = React.lazy(() => import('./features/viewers/studio/StudioClock'));
const ProjectInfo = React.lazy(() => import('./views/project-info/ProjectInfo'));

//const STimer = withPreset(withData(TimerView));
const SMinimalTimer = withPreset(withData(MinimalTimerView));
const SClock = withPreset(withData(ClockView));
const SCountdown = withPreset(withData(Countdown));
const SBackstage = withPreset(withData(Backstage));
const SProjectInfo = withPreset(withData(ProjectInfo));
const SPublic = withPreset(withData(Public));
const SLowerThird = withPreset(withData(Lower));
const SStudio = withPreset(withData(StudioClock));
const STimeline = withPreset(withData(Timeline));

const EditorFeatureWrapper = React.lazy(() => import('./features/EditorFeatureWrapper'));
const RundownPanel = React.lazy(() => import('./features/rundown/RundownExport'));
const TimerControl = React.lazy(() => import('./features/control/playback/TimerControlExport'));
const MessageControl = React.lazy(() => import('./features/control/message/MessageControlExport'));



/***** QUIQR ***/
import {
  //SiteLibrarySidebar,
  SiteLibraryRouted, SiteLibraryToolbarRight } from './qrClient/containers/SiteLibrary'
import { createTheme, ThemeProvider }                                     from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { blue }                                                           from '@material-ui/core/colors';
import TopToolbarLeft                                                     from './qrClient/containers/TopToolbarLeft'
import service                                                            from './qrClient/services/service';

import QStyle from './qrClient/app-ui-styles/quiqr10/style-light'



Sentry.init({
  dsn: sentryDsn,
  integrations: [
    Sentry.reactRouterV6BrowserTracingIntegration({
      useEffect: React.useEffect,
      useLocation,
      useNavigationType,
      createRoutesFromChildren,
      matchRoutes,
    }),
  ],
  tracesSampleRate: 0.3,
  release: ONTIME_VERSION,
  enabled: import.meta.env.PROD,
  ignoreErrors: [...sentryRecommendedIgnore, /Unable to preload CSS/i, /dynamically imported module/i],
  denyUrls: [/extensions\//i, /^chrome:\/\//i, /^chrome-extension:\/\//i],
});

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

type MyProps = { };
type MyState = {
  libraryView: string,
  splashDialogOpen: boolean,
  showSplashAtStartup: boolean,
  style: any,
  theme: any,
  menuIsLocked: boolean,
  forceShowMenu: boolean,
  skipMenuTransition: boolean,
  quiqrDomain: string,
};
export default class QrAppRouter extends React.Component<MyProps, MyState>{

  constructor(props:any){
    super(props);

    let style = QStyle;
    //require('./app-ui-styles/quiqr10/style-light.js');
    let theme = createTheme({
      palette: {
        type: "light",
        primary: {
          main: blue[500],
        },
      },
    });

    this.state = {
      splashDialogOpen: false,
      showSplashAtStartup: false,
      libraryView: "cards",
      style: style,
      theme: theme,
      menuIsLocked: true,
      forceShowMenu: false,
      skipMenuTransition: false,
      quiqrDomain: "",
    };


  }

  handleLibraryViewChange(view: string){
    service.api.saveConfPrefKey("libraryView",view);
    this.setState({libraryView: view})
  }

  renderTopToolbarLeftSwitch(){

    return (<Routes>

      <Route path='/' element={
         <TopToolbarLeft title="Site Library"/>
      } />

      <Route path='/sites/*' element={
        <TopToolbarLeft title="Site Library"/>
      } />

    </Routes>);
  }

  renderTopToolbarRightSwitch(){

    const {libraryView} = this.state;

    return (<Routes>

      <Route path="/"  element={
         <SiteLibraryToolbarRight
          handleChange={(v: string)=>this.handleLibraryViewChange(v)}
          activeLibraryView={ libraryView} />
      } />

      <Route path='/sites/*' element={
         <SiteLibraryToolbarRight
          handleChange={(v: string)=>this.handleLibraryViewChange(v)}
          activeLibraryView={ libraryView} />
      } />

    </Routes>);
  }

  /*
  renderMenuSwitch(){
    return (<Routes>


      <Route path="/" exact={true} render={ ({match, history})=> {
        return (
          <SiteLibrarySidebar />
        );
      }} />
      <Route path="/sites" exact={true} render={ ({match, history})=> {
        return (
          <SiteLibrarySidebar />
        );
      }} />
      <Route path="/sites/*" exact={true} render={ ({match, history})=> {
        return (
          <SiteLibrarySidebar />
        );
      }} />

      <Route path="/create-new" exact={true} render={ ({match, history})=> {
        return null;
      }} />

      <Route path="/welcome" exact={true} render={ ({match, history})=> {
        return null;
      }} />

      <Route path="/prefs" exact={false} render={ ({match, history})=> {
        return (<PrefsSidebar
          menus={[]}
          hideItems={!this.state.forceShowMenu && !this.state.menuIsLocked}
          menuIsLocked={this.state.menuIsLocked}
          onToggleItemVisibility={()=>{this.toggleForceShowMenu()}}
          onLockMenuClicked={()=>{this.toggleMenuIsLocked()}}
        />);
      }} />


    </Routes>);
  }
  */

  toggleForceShowMenu(){
    const forceShowMenu = !this.state.forceShowMenu;
    this.setState({forceShowMenu});
  }

  renderContentSwitch(){
    return (<Routes>
      <Route path='/' element={
        this.renderSelectSites(null)
      } />

      <Route path='/sites/new-site/:refresh' element={
         this.renderSelectSites('newSiteDialog')
      } />

      <Route path='/sites/import-site/:refresh' element={
        this.renderSelectSites('importSiteDialog')
      } />

      <Route path='/sites/import-site-url/:url' element={
          <SiteLibraryRouted
            activeLibraryView={ this.state.libraryView}
            key={ 'selectSite' }
            //importSiteURL={ decodeURIComponent(match.params.url) }
            importSite={ true }
          />
      } />

      <Route path='/sites/*' element={
         this.renderSelectSites(null)
      } />

    </Routes>);
  }

  renderSelectSites(openDialog:any){

    return (
      <SiteLibraryRouted
        activeLibraryView={ this.state.libraryView}
        key={ 'selectSite' }
        newSite={ (openDialog === 'newSiteDialog' ? true : false ) }
        importSite={ (openDialog === 'importSiteDialog' ? true : false ) }
      />
    );
  }



  render(){

    let openDialog = null;

    let menuContainerStyle = this.state.style.menuContainer;
    let contentContainerStyle = this.state.style.contentContainer;

    let containerStyle = this.state.style.container;
  return (
    <React.Suspense fallback={null}>
      <SentryRoutes>


        <Route
          path='/'
          element={
            <SiteLibraryRouted
              activeLibraryView={ /*this.state.libraryView*/ null}
              key={ 'selectSite' }
              newSite={ (openDialog === 'newSiteDialog' ? true : false ) }
              importSite={ (openDialog === 'importSiteDialog' ? true : false ) }
            />
          }
        />
        <Route
          path='/sites'
          element={
            <SiteLibraryRouted
              activeLibraryView={ /*this.state.libraryView*/ null}
              key={ 'selectSite' }
              newSite={ (openDialog === 'newSiteDialog' ? true : false ) }
              importSite={ (openDialog === 'importSiteDialog' ? true : false ) }
            />
          }
        />
        <Route
          path='/sites/*'
          element={
            <SiteLibraryRouted
              activeLibraryView={ /*this.state.libraryView*/ null}
              key={ 'selectSite' }
              newSite={ (openDialog === 'newSiteDialog' ? true : false ) }
              importSite={ (openDialog === 'importSiteDialog' ? true : false ) }
            />
          }
        />






        <Route
          path='/public'
          element={
            <ViewLoader>
              <SPublic />
            </ViewLoader>
          }
        />
        <Route
          path='/minimal'
          element={
            <ViewLoader>
              <SMinimalTimer />
            </ViewLoader>
          }
        />
        <Route
          path='/clock'
          element={
            <ViewLoader>
              <SClock />
            </ViewLoader>
          }
        />
        <Route
          path='/countdown'
          element={
            <ViewLoader>
              <SCountdown />
            </ViewLoader>
          }
        />
        <Route
          path='/backstage'
          element={
            <ViewLoader>
              <SBackstage />
            </ViewLoader>
          }
        />
        <Route
          path='/studio'
          element={
            <ViewLoader>
              <SStudio />
            </ViewLoader>
          }
        />
        {/*/!* Lower third cannot have a loading screen *!/*/}
        <Route path='/lower' element={<SLowerThird />} />
        <Route
          path='/timeline'
          element={
            <ViewLoader>
              <STimeline />
            </ViewLoader>
          }
        />
        <Route
          path='/info'
          element={
            <ViewLoader>
              <SProjectInfo />
            </ViewLoader>
          }
        />

        {/*/!* Protected Routes *!/*/}
        <Route path='/editor2' element={<Editor />} />
        <Route path='/cuesheet' element={<Cuesheet />} />
        <Route path='/op' element={<Operator />} />

        {/*/!* Protected Routes - Elements *!/*/}
        <Route
          path='/rundown'
          element={
            <EditorFeatureWrapper>
              <RundownPanel />
            </EditorFeatureWrapper>
          }
        />
        <Route
          path='/timercontrol'
          element={
            <EditorFeatureWrapper>
              <TimerControl />
            </EditorFeatureWrapper>
          }
        />
        <Route
          path='/messagecontrol'
          element={
            <EditorFeatureWrapper>
              <MessageControl />
            </EditorFeatureWrapper>
          }
        />
        <Route
          path='/log'
          element={
            <EditorFeatureWrapper>
              <Log />
            </EditorFeatureWrapper>
          }
        />

     <Route
        path="*"
        element={
            <ThemeProvider theme={this.state.theme}>
              <CssBaseline />

              <React.Fragment>

                <div className="App" >

                  <div className="xxtopToolbar">

                    <div className="toolbarLeft">
                      { this.renderTopToolbarLeftSwitch() }
                    </div>

                    <div className="toolbarRight">
                      { this.renderTopToolbarRightSwitch() }
                    </div>
                  </div>

                  <div style={containerStyle}>

                    <div style={menuContainerStyle} className='hideScrollbar' >
                      { null /*this.renderMenuSwitch()*/ }
                    </div>

                    <div key="main-content" style={contentContainerStyle} onClick={()=>{ if(this.state.forceShowMenu) this.toggleForceShowMenu() }}>
                      { this.renderContentSwitch() }
                    </div>


                  </div>

                </div>
              </React.Fragment>
            </ThemeProvider>

        } />


        {/*<Route path='*' element={<STimer />} />*/}
      </SentryRoutes>
    </React.Suspense>
  );

  }
}

/*

export function AppRouter() {
  // handle client path changes
  useClientPath();

  let openDialog = null;
  return (
    <React.Suspense fallback={null}>
      <SentryRoutes>







        <Route
          path='/public'
          element={
            <ViewLoader>
              <SPublic />
            </ViewLoader>
          }
        />
        <Route
          path='/minimal'
          element={
            <ViewLoader>
              <SMinimalTimer />
            </ViewLoader>
          }
        />
        <Route
          path='/clock'
          element={
            <ViewLoader>
              <SClock />
            </ViewLoader>
          }
        />
        <Route
          path='/countdown'
          element={
            <ViewLoader>
              <SCountdown />
            </ViewLoader>
          }
        />
        <Route
          path='/backstage'
          element={
            <ViewLoader>
              <SBackstage />
            </ViewLoader>
          }
        />
        <Route
          path='/studio'
          element={
            <ViewLoader>
              <SStudio />
            </ViewLoader>
          }
        />
        <Route path='/lower' element={<SLowerThird />} />
        <Route
          path='/timeline'
          element={
            <ViewLoader>
              <STimeline />
            </ViewLoader>
          }
        />
        <Route
          path='/info'
          element={
            <ViewLoader>
              <SProjectInfo />
            </ViewLoader>
          }
        />

        <Route path='/editor2' element={<Editor />} />
        <Route path='/cuesheet' element={<Cuesheet />} />
        <Route path='/op' element={<Operator />} />

        <Route
          path='/rundown'
          element={
            <EditorFeatureWrapper>
              <RundownPanel />
            </EditorFeatureWrapper>
          }
        />
        <Route
          path='/timercontrol'
          element={
            <EditorFeatureWrapper>
              <TimerControl />
            </EditorFeatureWrapper>
          }
        />
        <Route
          path='/messagecontrol'
          element={
            <EditorFeatureWrapper>
              <MessageControl />
            </EditorFeatureWrapper>
          }
        />
        <Route
          path='/log'
          element={
            <EditorFeatureWrapper>
              <Log />
            </EditorFeatureWrapper>
          }
        />


     <Route
        path="*"
        render={ ({match, history})=>{
          this.history = history;
          return (
            <ThemeProvider theme={theme}>
              <CssBaseline />

              <React.Fragment>

                <div className="App" >

                  <div className="xxtopToolbar">

                    <div className="toolbarLeft">
                      { this.renderTopToolbarLeftSwitch() }
                    </div>

                    <div className="toolbarRight">
                      { this.renderTopToolbarRightSwitch() }
                    </div>
                  </div>

                  <div style={containerStyle}>

                    <div style={menuContainerStyle} className='hideScrollbar' >
                      { this.renderMenuSwitch() }
                    </div>

                    <div key="main-content" style={contentContainerStyle} onClick={()=>{ if(this.state.forceShowMenu) this.toggleForceShowMenu() }}>
                      { this.renderContentSwitch() }
                    </div>


                  </div>

                </div>
              </React.Fragment>
            </ThemeProvider>
          );

        }} />

        <Route path='*' element={<STimer />} />
      </SentryRoutes>
    </React.Suspense>
  );
}
*/
