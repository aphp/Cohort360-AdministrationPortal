import makeStyles from '@mui/styles/makeStyles'

const useStyles = makeStyles(() => ({
  title: {
    borderBottom: '1px solid #D0D7D8',
    width: '100%',
    paddingTop: 80,
    paddingBottom: 20,
    marginBottom: 20
  },
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%'
  },
  searchBar: {
    margin: '12px 0'
  }
}))

export default useStyles
