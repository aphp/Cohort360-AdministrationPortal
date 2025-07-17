import React, { useEffect, useState } from 'react'

import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  TableCell,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material'

import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

import useStyles from './styles'
import {
  Column,
  ContentManagementLabels,
  Order,
  UserRole,
  WebContent,
  WebContentCreation,
  WebContentTypes
} from 'types'
import DataTable from 'components/DataTable/DataTable'
import CommonSnackbar from 'components/Snackbar/Snackbar'
import ContentDialog from './ContentDialog'
import { deleteContent, listContents } from 'services/Console-Admin/contentsService'

type ContentManagementTableProps = {
  userRights: UserRole
  contentTypes: WebContentTypes
  allowedContentTypes: Array<string>
  pages: Array<string>
  labels: ContentManagementLabels
  withMarkdown?: boolean
}

const ContentManagementTable: React.FC<ContentManagementTableProps> = ({
  contentTypes,
  allowedContentTypes,
  userRights,
  withMarkdown = false,
  labels,
  pages
}) => {
  const { classes } = useStyles()

  const columns: Column[] = [
    {
      label: 'Date de création',
      align: 'left'
    },
    {
      label: 'Date de modification',
      align: 'left'
    },
    {
      label: 'Type',
      align: 'left'
    },
    // {
    //   label: "Page",
    //   align: 'left'
    // },
    {
      label: 'Titre',
      align: 'left'
    }
  ]

  if (userRights.right_full_admin) {
    columns.push({
      label: 'Actions',
      align: 'right'
    })
  }

  const [loading, setLoading] = useState(false)
  const [selectedContent, setSelectedContent] = useState<WebContentCreation | WebContent | null>(null)

  const [contents, setContents] = useState<WebContent[] | null>(null)

  const [_deleteContent, setDeleteContent] = useState<WebContent | null>(null)

  const [addContentSuccess, setAddContentSuccess] = useState(false)
  const [addContentFail, setAddContentFail] = useState(false)
  const [editContentSuccess, setEditContentSuccess] = useState(false)
  const [editContentFail, setEditContentFail] = useState(false)
  const [deleteContentSuccess, setDeleteContentSuccess] = useState(false)
  const [deleteContentFail, setDeleteContentFail] = useState(false)

  useEffect(() => {
    _getContents()
  }, [])

  useEffect(() => {
    if (addContentSuccess) _getContents()
    if (editContentSuccess) _getContents()
    if (deleteContentSuccess) _getContents()
  }, [addContentSuccess, editContentSuccess, _deleteContent])

  const _getContents = async () => {
    try {
      setLoading(true)
      const contentList = await listContents(allowedContentTypes)

      setContents(contentList)
      setLoading(false)
    } catch (error) {
      console.error('Erreur lors de la récupération des contenus', error)
      setLoading(false)
    }
  }

  const handleDeleteContent = async () => {
    try {
      if (!_deleteContent) return
      const terminateAccessResp = await deleteContent(_deleteContent.id)

      if (terminateAccessResp) {
        setDeleteContentSuccess(true)
      } else {
        setDeleteContentFail(true)
      }
      setDeleteContent(null)
    } catch (error) {
      console.error('Erreur lors de la suppression du contenu', error)
      setDeleteContentFail(true)
      setDeleteContent(null)
    }
  }

  return (
    <Grid container justifyContent="flex-end" className={classes.table}>
      {userRights.right_full_admin && (
        <Grid container justifyContent="flex-end" alignItems="center">
          <Button
            variant="contained"
            disableElevation
            startIcon={<AddIcon height="15px" fill="#FFF" />}
            className={classes.buttons}
            onClick={() =>
              setSelectedContent({
                title: '',
                content_type: allowedContentTypes[0],
                content: '',
                page: pages[0],
                metadata: {}
              })
            }
          >
            {`${labels.contentTypeGender === 'f' ? 'Nouvelle' : 'Nouveau'} ${labels.contentType}`}
          </Button>
        </Grid>
      )}
      <DataTable columns={columns} order={{} as Order}>
        {loading ? (
          <TableRow>
            <TableCell colSpan={7}>
              <div className={classes.loadingSpinnerContainer}>
                <CircularProgress size={50} />
              </div>
            </TableCell>
          </TableRow>
        ) : (
          contents &&
          contents.map((content: WebContent) => {
            return (
              content && (
                <TableRow key={content.id} className={classes.tableBodyRows} hover>
                  <TableCell align="left">{content.created_at}</TableCell>
                  <TableCell align="left">{content.modified_at}</TableCell>
                  <TableCell align="left">
                    {contentTypes[content.content_type]?.label ?? content.content_type}
                  </TableCell>
                  {/* <TableCell align="left">{content.page}</TableCell> */}
                  <TableCell align="left">{content.title}</TableCell>
                  {userRights.right_full_admin && (
                    <TableCell align="right">
                      <Tooltip title="Editer le contenu">
                        <IconButton
                          onClick={(event) => {
                            event.stopPropagation()
                            setSelectedContent(content)
                          }}
                          size="large"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer le contenu">
                        <IconButton
                          onClick={() => {
                            setDeleteContent(content)
                          }}
                          size="large"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  )}
                </TableRow>
              )
            )
          })
        )}
      </DataTable>

      {selectedContent && (
        <ContentDialog
          open
          userRights={userRights}
          labels={labels}
          withMarkdown={withMarkdown}
          contentTypes={contentTypes}
          allowedContentTypes={allowedContentTypes}
          allowedPages={pages}
          selectedContent={selectedContent}
          onClose={() => setSelectedContent(null)}
          onAddContentSuccess={setAddContentSuccess}
          onEditContentSuccess={setEditContentSuccess}
          onAddContentFail={setAddContentFail}
          onEditContentFail={setEditContentFail}
        />
      )}

      {_deleteContent && (
        <Dialog open onClose={() => setDeleteContent(null)}>
          <DialogContent>
            <Typography>{labels.deleteMessage}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteContent(null)} color="secondary">
              Annuler
            </Button>
            <Button onClick={handleDeleteContent}>Confirmer</Button>
          </DialogActions>
        </Dialog>
      )}

      {(addContentSuccess || editContentSuccess || deleteContentSuccess) && (
        <CommonSnackbar
          onClose={() => {
            if (addContentSuccess) setAddContentSuccess(false)
            if (editContentSuccess) setEditContentSuccess(false)
            if (deleteContentSuccess) setDeleteContentSuccess(false)
          }}
          severity="success"
          message={`Le contenu a bien été ${
            (addContentSuccess && 'créé') || (editContentSuccess && 'édité') || (deleteContentSuccess && 'supprimé')
          }.`}
        />
      )}
      {(addContentFail || editContentFail || deleteContentFail) && (
        <CommonSnackbar
          onClose={() => {
            if (addContentFail) setAddContentFail(false)
            if (editContentFail) setEditContentFail(false)
            if (deleteContentFail) setDeleteContentFail(false)
          }}
          severity="error"
          message={`Erreur lors de ${
            (addContentFail && 'la création') ||
            (editContentFail && "l'édition") ||
            (deleteContentFail && 'la suppression')
          } du contenu.`}
        />
      )}
    </Grid>
  )
}

export default ContentManagementTable
