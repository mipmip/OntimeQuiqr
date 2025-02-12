import * as React           from 'react';
import { Routes, Route }            from 'react-router-dom';
import Sidebar           from './../Sidebar';
//import service              from './../../services/service';


export class SiteLibrarySidebar extends React.Component {
  constructor(props){

    super(props);
    this.state = {
      selectedMenuItem: 'local-all',
      tags: [],
    }
  }

  componentDidMount(){
    /*
    service.api.readConfPrefKey('sitesListingView').then((view)=>{
      this.setState({selectedMenuItem: view });
    });

    let tags = [];
    service.getConfigurations(true).then((c)=>{

      c.sites.forEach((site)=>{
        if(site.tags){
          site.tags.forEach((t)=>{
            if(!tags.includes(t)){
              tags.push(t);
            }
          })
        }
      })
      tags.sort(function(a, b){
        var nameA=a.toLowerCase(), nameB=b.toLowerCase()
        if (nameA < nameB) //sort string ascending
          return -1
        if (nameA > nameB)
          return 1
        return 0 //default return value (no sorting)
      })


      this.setState({tags:tags});
    });
    */
  }

  render(){
    return <Routes><Route render={({history})=>{ return this.renderWithRoute(history) }} /></Routes>
  }

  saveSelectedMenuItem(item){
    service.api.saveConfPrefKey("sitesListingView",item);
    this.setState({selectedMenuItem:item});
  }

  renderWithRoute(history){

    let basePath = `/sites`;

    let tagsMenus = [];
    this.state.tags.forEach((tag,index)=>{
      tagsMenus.push(
        {
          active: true,
          label: tag,
          selected: (this.state.selectedMenuItem === 'local-tags-'+tag ? true : false),
          onClick: ()=>{
            this.saveSelectedMenuItem('local-tags-'+tag);
            history.push(`${basePath}/tags/${tag}`)
          }
        }
      );
    });

    let menus = [
      {
        title: 'On this computer',
        items: [
          /*
          {
            active: true,
            label: "Root",
            selected: (this.state.selectedMenuItem==='local-root' ? true : false),
            onClick: ()=>{
              this.saveSelectedMenuItem('local-root');
              history.push(`${basePath}/local`)
            }
          },
          */
          {
            active: true,
            label: "All",
            selected: (this.state.selectedMenuItem==='local-all' ? true : false),
            onClick: ()=>{
              this.saveSelectedMenuItem('local-all');
              history.push(`${basePath}/local`)
            }
          },
          {
            active: true,
            label: "Tags",
            childItems: tagsMenus,
          }
        ]
      },
      {
        title: 'Quiqr Templates',
        items: [
          {
            active: true,
            label: "Quiqr Community Templates",
            selected: (this.state.selectedMenuItem==='quiqr-community-templates' ? true : false),
            onClick: ()=>{
              this.saveSelectedMenuItem('quiqr-community-templates');
              history.push(`${basePath}/quiqr-community-templates`)
            }
          },
        ]
      },
      /*
      {
        title: 'Hugo Templates',
        items: [
          {
            active: true,
            label: "Themes from gohugo.io",
            selected: (this.state.selectedMenuItem==='themes-gohugo-io' ? true : false),
            onClick: ()=>{
              this.saveSelectedMenuItem('themes-gohugo-io');
              history.push(`${basePath}/themes/gohugo-io`)
            }
          },
        ]
      },
      */
    ]

    return <Sidebar {...this.props} menus={menus} />
  }
}
