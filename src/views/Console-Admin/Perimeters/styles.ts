import makeStyles from '@mui/styles/makeStyles'

const useStyles = makeStyles(() => ({
  title: {
    borderBottom: '1px solid #D0D7D8',
    width: '100%',
    paddingTop: 80,
    paddingBottom: 20,
    marginBottom: 40
  },
  button: {
    backgroundColor: '#5BC5F2',
    color: '#FFF',
    borderRadius: 25,
    width: 125,
    margin: '24px 8px 24px 0'
  },
  bottomBar: {
    position: 'fixed',
    bottom: 0,
    backgroundColor: '#E6F1FD'
  }
}))

export default useStyles
