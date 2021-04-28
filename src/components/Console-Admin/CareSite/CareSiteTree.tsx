import React, { useEffect, useState } from "react"
import CircularProgress from "@material-ui/core/CircularProgress"
import { useDispatch, useSelector } from "react-redux"
import { makeStyles } from "@material-ui/core/styles"
import MaterialTable from "material-table"
import Grid from "@material-ui/core/Grid"
import * as _ from "lodash"

import { submitGetCareSites } from "services/Console-Admin/careSiteService"

const useStyles = makeStyles((theme) => ({
  container: {
    height: "calc(100% - 84px)",
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column",
    overflow: "auto",
  },
  mainRow: {},
  secondRow: {},
}))

const careSiteToRow = (cs: CareSite) => ({
  id: cs.id.toString(),
  careSiteId: cs.id,
  name: cs.name,
  shortName: cs.shortName,
  parentId: cs.parentId,
})

const CareSitesTree: React.FC = () => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const _init = async () => {
      setLoading(true)
      await fetchCareSitesTree()
      setLoading(false)
    }

    _init()
  }, []) // eslint-disable-line

  const columns = [
    {
      title: "Nom",
      field: "name",
      emptyValue: "-",
    },
    {
      title: "Sigle",
      field: "shortName",
      emptyValue: "-",
      filtering: false,
    },
  ]

  return (
    <div className={classes.container}>
      {loading ? (
        <Grid container justify="center">
          <CircularProgress size={50} />
        </Grid>
      ) : (
        <MaterialTable
          columns={columns}
          data={_.values(careSites).map(careSiteToRow)}
          parentChildData={({ parentId }, rows) =>
            rows.find(({ careSiteId }) => careSiteId === parentId)
          }
          options={{
            paging: false,
            filtering: false,
            search: false,
            showTitle: false,
            toolbar: false,
            headerStyle: {
              fontSize: 11,
              color: "#0063AF",
              padding: "0 20px",
              backgroundColor: "#D1E2F4",
              height: 42,
              fontWeight: "bold",
              textTransform: "uppercase",
            },
          }}
          onRowClick={(e, row) => window.open(`/care-sites/${row?.id}`)}
        />
      )}
    </div>
  )
}

export default CareSitesTree
