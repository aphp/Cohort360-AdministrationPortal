import { createStyles, makeStyles } from '@mui/styles'

const useStyles = makeStyles(() =>
  createStyles({
    searchButton: {
      backgroundColor: '#5BC5F2',
      color: '#FFF',
      borderRadius: 25,
      height: 50
    },
    loadingSpinnerContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    tableBodyRows: {
      '&:nth-of-type(even)': {
        backgroundColor: '#FAF9F9'
      },
      '&:hover': {
        cursor: 'pointer'
      }
    }
  })
)

export default useStyles
