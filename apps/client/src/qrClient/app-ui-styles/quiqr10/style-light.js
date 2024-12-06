//the default locked UI style

const topBarHeight = '52px';
const sidebarWidth= '280px';

export default {
  container : {
    position: 'relative',
    display: 'flex',
    height: `calc(100vh - ${topBarHeight})`,
    marginTop: topBarHeight,
    overflowX: 'hidden'

  },

  menuContainer : {
    flex: `0 0 ${sidebarWidth}`,
    overflowY:'auto',
    overflowX:'hidden',
    userSelect:'none',
    background:'linear-gradient(to bottom right, #eaebed, #eaebed)',
  },

  contentContainer : {
    flex: 'auto',
    userSelect:'none',
    overflow: 'auto',
    overflowX: 'hidden'
  },

  topToolbar : {
    borderTop: 'solid 1px #c7c5c4',
    borderBottom: 'solid 1px #c7c5c4',
    top: 0,
    position: 'absolute',
    display: 'flex',
    width: '100%',
    backgroundColor: '#eaebed'
  }
}
