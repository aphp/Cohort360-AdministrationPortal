import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
  appbar: {
    backgroundColor: '#232E6A',
    position: 'absolute'
  },
  avatar: {
    color: 'white',
    backgroundColor: '#5BC5F2',
    height: '30px',
    width: '30px',
    fontSize: '1rem',
    marginLeft: '-5px',
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
    width: '15px',
    fill: '#5BC5F2'
  },
  listIcon: {
    minWidth: '35px'
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
  nestedTitle: {
    color: '#D0D7D8',
    fontSize: 13,
    lineHeight: '25px'
  },
  invisibleGrid: {
    width: 161
  },
  GridCollapses: {
    marginTop: '61px',
    paddingLeft: '24px',
    paddingRight: '24px'
  },
  collapse: {
    backgroundColor: '#232E6A',
    width: 140
  }
}))

export default useStyles
