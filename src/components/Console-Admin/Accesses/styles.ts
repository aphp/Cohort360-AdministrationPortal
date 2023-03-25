import { createStyles, makeStyles } from '@mui/styles'

const useStyles = makeStyles(() =>
  createStyles({
    searchButton: {
      backgroundColor: '#5BC5F2',
      color: '#FFF',
      borderRadius: 25,
      height: 50,
      margin: '4px 0'
    },
    title: {
      margin: '12px 0'
    }
  })
)

export default useStyles
