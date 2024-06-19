import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()(() => ({
  appbar: {
    backgroundColor: '#232E6A'
  },
  avatar: {
    color: 'white',
    backgroundColor: '#5BC5F2',
    height: 30,
    width: 30,
    fontSize: '1rem',
    marginLeft: -5,
    display: 'flex',
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    flexShrink: 0,
    lineHeight: 1,
    borderRadius: '50%',
    justifyContent: 'center'
  },
  logoutIcon: {
    width: 15,
    fill: '#5BC5F2'
  },
  listIcon: {
    minWidth: 35
  },
  logoIcon: {
    width: 150
  },
  topBarButton: {
    color: '#FFF',
    margin: '0 12px',
    height: '100%',
    borderRadius: 0
  },
  activeButton: {
    borderBottom: '2px solid #5BC5F2',
    '& span': {
      marginTop: 2
    }
  },
  paper: {
    backgroundColor: '#232E6A',
    width: 140,
    color: '#FFFFFF',
    borderRadius: '0 0 4px 4px'
  },
  menuItem: {
    '&:hover': {
      backgroundColor: '#2E3C8A'
    }
  },
  activeMenuItem: {
    backgroundColor: '#2E3C8A'
  }
}))

export default useStyles
