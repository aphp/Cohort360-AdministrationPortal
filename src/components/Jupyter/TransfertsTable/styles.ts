import { makeStyles, createStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() =>
  createStyles({
    searchButton: {
      backgroundColor: '#5BC5F2',
      color: '#FFF',
      borderRadius: 25
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
    },
    filterButton: {
      backgroundColor: '#5BC5F2',
      color: '#FFF',
      borderRadius: 25,
      height: 40,
      fontSize: 14,
      marginLeft: 8
    },
    filterChip: {
      margin: '12px 6px 0px 6px',
      '&:last-child': {
        marginRight: 0
      }
    }
  })
)

export default useStyles
