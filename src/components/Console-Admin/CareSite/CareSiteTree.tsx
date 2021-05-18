import React, { useEffect, useState } from "react"
import CircularProgress from "@material-ui/core/CircularProgress"
import { makeStyles } from "@material-ui/core/styles"
import MaterialTable from "material-table"
import Grid from "@material-ui/core/Grid"
import * as _ from "lodash"
import { submitGetCareSites } from "services/Console-Admin/careSiteService"
import { BackendCareSite } from "types"

const useStyles = makeStyles((theme) => ({
  container: {
    height: "calc(100% - 84px)",
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column",
    overflow: "auto",
  },
}))

const careSiteToRow = (cs: BackendCareSite) => ({
  id: cs?.care_site_id.toString(),
  careSiteId: cs?.care_site_id,
  name: cs?.care_site_name,
  shortName: cs?.care_site_short_name,
  parentId: cs?.parents_ids[0] === cs.care_site_id ? null : cs.parents_ids[0],
})

const CareSitesTree: React.FC = () => {
  const classes = useStyles()
  const [careSites, setCareSites] = useState<BackendCareSite[] | undefined>()

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const _init = async () => {
      setLoading(true)
      // setCareSites(data)
      await submitGetCareSites().then((careSitesResp) => {
        setCareSites(careSitesResp ?? undefined)
      })
      setLoading(false)
    }

    _init()
  }, []) // eslint-disable-line

  console.log(
    `_.values(careSites).map(careSiteToRow)`,
    _.values(careSites).map(careSiteToRow)
  )

  console.log(`careSites`, careSites)

  const columns = [
    {
      title: "Nom",
      field: "name",
      emptyValue: "-",
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
          data={Object.values(careSites || []).map(careSiteToRow)}
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
