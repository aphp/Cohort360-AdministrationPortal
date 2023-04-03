import makeStyles from '@mui/styles/makeStyles'

const useStyles = makeStyles((theme) => ({
  searchBar: {
    width: 250,
    backgroundColor: '#FFF',
    border: '1px solid #D0D7D8',
    boxShadow: '0px 1px 16px #0000000A',
    borderRadius: 20,
    marginLeft: 4
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1
  }
}))

export default useStyles
