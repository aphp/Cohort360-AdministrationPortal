import { makeStyles, createStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(() =>
  createStyles({
    // dialogueContainer: {
    //   width: 650
    // },
    gridItem: {
      display: "flex",
      flexDirection: 'row'
    },
    editRoleSwitch: {
      padding: 5
    }
  })
)

export default useStyles
