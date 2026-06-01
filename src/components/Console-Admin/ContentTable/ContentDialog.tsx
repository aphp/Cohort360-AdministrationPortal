import React, { useState } from 'react'

import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  TextField,
  Typography
} from '@mui/material'

import EditIcon from '@mui/icons-material/Edit'
import useStyles from './styles'
import { ContentManagementLabels, UserRole, WebContent, WebContentCreation, WebContentTypes } from 'types'
import { createContent, updateContent } from 'services/Console-Admin/contentsService'
import { listsPlugin, ListsToggle, MDXEditor, Separator } from '@mdxeditor/editor'
import { headingsPlugin, BoldItalicUnderlineToggles, toolbarPlugin } from '@mdxeditor/editor'

import '@mdxeditor/editor/style.css'

type ContentDialogProps = {
  userRights: UserRole
  labels: ContentManagementLabels
  open: boolean
  contentTypes: WebContentTypes
  allowedContentTypes: Array<string>
  allowedPages: Array<string>
  withMarkdown: boolean
  selectedContent: WebContentCreation | WebContent
  onClose: () => void
  onAddContentSuccess: (success: boolean) => void
  onEditContentSuccess: (fail: boolean) => void
  onAddContentFail: (success: boolean) => void
  onEditContentFail: (fail: boolean) => void
}

const ContentDialog: React.FC<ContentDialogProps> = ({
  userRights,
  labels,
  open,
  withMarkdown,
  contentTypes,
  allowedContentTypes,
  selectedContent,
  onClose,
  onAddContentSuccess,
  onEditContentSuccess,
  onAddContentFail,
  onEditContentFail
}) => {
  const { classes } = useStyles()

  const [content, setContent] = useState<WebContentCreation | WebContent>(selectedContent)
  const [loadingOnValidate, setLoadingOnValidate] = useState(false)

  const isEditable = (selectedContent as any)?.id ? true : false
  const [editMode, setEditMode] = useState(isEditable)

  const _onChangeValue = (key: keyof WebContentCreation, value: any) => {
    const _content = { ...content }
    _content[key] = value
    setContent(_content)
  }

  const enterEditMode = () => {
    setEditMode(true)
  }

  const onSubmit = async () => {
    try {
      setLoadingOnValidate(true)

      if (isEditable) {
        const contentEditionResp = await updateContent(content, (content as WebContent).id)
        if (contentEditionResp) {
          onEditContentSuccess(true)
        } else {
          onEditContentFail(true)
        }
      } else {
        const contentCreationResp = await createContent(content)
        if (contentCreationResp) {
          onAddContentSuccess(true)
        } else {
          onAddContentFail(true)
        }
      }

      setLoadingOnValidate(false)
      onClose()
    } catch (error) {
      console.error(`Erreur lors de ${isEditable ? "l'édition" : 'la création'} du contenu`, error)
      setLoadingOnValidate(false)
      if (isEditable) {
        onEditContentFail(true)
      } else {
        onAddContentFail(true)
      }
      onClose()
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogTitle>
        {isEditable
          ? selectedContent.title
          : `Créer ${labels.contentTypeGender === 'f' ? 'une' : 'un'} ${labels.contentTypeGender === 'f' ? 'nouvelle' : 'nouveau'} ${labels.contentType} :`}
      </DialogTitle>
      <DialogContent className={classes.dialog}>
        <Grid container direction="column">
          <Typography variant="h6">Titre du contenu:</Typography>
          <TextField
            margin="normal"
            autoFocus
            placeholder="Titre du contenu"
            value={content.title}
            onChange={(event) => _onChangeValue('title', event.target.value)}
            style={{ margin: '1em' }}
          />
        </Grid>
        <Grid container direction="column">
          <Typography variant="h6">Contenu :</Typography>
          {withMarkdown ? (
            <div className={classes.markdownWrapper}>
              <MDXEditor
                markdown={content.content}
                plugins={[
                  headingsPlugin(),
                  listsPlugin(),
                  toolbarPlugin({
                    toolbarContents: () => (
                      <>
                        <BoldItalicUnderlineToggles />
                        <Separator />
                        <ListsToggle />
                      </>
                    )
                  })
                ]}
                onChange={(value) => _onChangeValue('content', value)}
              />
            </div>
          ) : (
            <TextField
              margin="normal"
              autoFocus
              multiline
              rows={4}
              placeholder="Contenu"
              value={content.content}
              onChange={(event) => _onChangeValue('content', event.target.value)}
              style={{ margin: '1em' }}
            />
          )}
        </Grid>
        <Grid container direction="column">
          <Typography variant="h6">Type de contenu :</Typography>
          <TextField
            select
            margin="normal"
            value={content.content_type}
            onChange={(event) => _onChangeValue('content_type', event.target.value)}
            style={{ margin: '1em' }}
          >
            {allowedContentTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {contentTypes[type]?.label ?? type}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        {/* <Grid container direction="column">
          <Typography variant="h6">Page :</Typography>
          <TextField
            select
            margin="normal"
            value={content.page}
            onChange={(event) => _onChangeValue('page', event.target.value)}
            style={{ margin: '1em' }}
          >
            {allowedPages.map((page) => (
              <MenuItem key={page} value={page}>
                {page}
              </MenuItem>
            ))}
          </TextField>
        </Grid> */}
        <Grid container direction="column">
          <Typography variant="h6">Ordre d'affichage :</Typography>
          <TextField
            type="number"
            margin="normal"
            defaultValue={0}
            value={content.metadata?.order}
            onChange={(event) =>
              _onChangeValue('metadata', { ...content.metadata, order: parseInt(event.target.value) })
            }
            style={{ margin: '1em' }}
          />
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          {isEditable ? 'Fermer' : 'Annuler'}
        </Button>
        {(isEditable && editMode) || !isEditable ? (
          <Button
            variant="contained"
            disableElevation
            disabled={loadingOnValidate || !content.title}
            onClick={() => onSubmit()}
            className={classes.buttons}
          >
            {loadingOnValidate ? <CircularProgress /> : 'Valider'}
          </Button>
        ) : (
          userRights.right_full_admin && (
            <Button
              variant="contained"
              disableElevation
              disabled={loadingOnValidate}
              endIcon={<EditIcon height="15px" fill="#FFF" />}
              onClick={() => enterEditMode()}
              className={classes.buttons}
            >
              {loadingOnValidate ? <CircularProgress /> : 'Éditer'}
            </Button>
          )
        )}
      </DialogActions>
    </Dialog>
  )
}

export default ContentDialog
