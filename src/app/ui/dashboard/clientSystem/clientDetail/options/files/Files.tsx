import {
  adminDashboardStore,
  messagesStore,
  modalWindowStore,
  singleCLientDataStore,
} from '@/store/adminDashboard';
import { useEffect, useState } from 'react';
import { storage } from '@/firebase/firebase.config';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { useSession } from 'next-auth/react';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { AddFileButton } from './addFileButton/AddFileButton';
import { DocumentName } from './documentName/DocumentName';
import { SalutationInput } from './salutationInput/SalutationInput';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { Button } from '&/buttons/Button';
import { useDynamicTableColumns } from '@/app/ui/table/coloredTable/v2/useColumDef';
import { ColoredTableV2 } from '@/app/ui/table/coloredTable/v2';
import { VisibilityState } from '@tanstack/react-table';
import { ConfirmNotification } from '&/notifications/Notification';

const initialColumnsDef = {
  // select: true,
  document: true,
  stipulation: true,
  uploaded_on: true,
  uploaded_by: true,
  // absoluteBodyTrComponent: false,
};

export function Files() {
  const session = useSession();

  const activeUserId = session.data?.user.id;
  const activeUserName = `${session.data?.user?.name || ''} ${session.data?.user?.last_name || ''}`;

  // ---- global states ----
  const { closeClientFiles } = modalWindowStore();

  const { filesData } = adminDashboardStore();
  const { getFiles } = adminDashboardStore();

  const { singleCLientData } = singleCLientDataStore();

  const { messages } = messagesStore();
  const { setMessages } = messagesStore();

  useEffect(() => {
    if (singleCLientData && singleCLientData?.id) {
      getFiles(singleCLientData?.id).finally(() => setLoading(false));
    }
  }, [getFiles, singleCLientData]);

  // ---- local states ----
  const [loading, setLoading] = useState(true);

  const [fileUploaded, setFileUploaded] = useState<FileList | null>();
  const [fileInputValue, setFileInputValue] = useState('');
  const [stipulationInput, setStipulationInput] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showDeleteFileButton, setShowDeleteFileButton] = useState(true);
  const [closeWithUnuploadedFileMssg, setCloseWithUnuploadedFileMssg] = useState('');
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  const [tableData, setTableData] = useState<any[]>([]);

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    select: true,
    ...initialColumnsDef,
  });

  const columnRenderer = {
    document: (file: any) => <DocumentName filename={file.file} contentType={file.content_type} path={file.path} />,
    stipulation: (file: any) => {
      if(file.id === 'temporal') return <SalutationInput onChange={handleChange} value={stipulationInput} />;
      return file.stipulation
    },
    uploaded_on: (file: any) => {
      if(file.id === 'temporal') return file.uploaded_on;
      return new Date(file.uploaded_on).toLocaleString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })},
    uploaded_by: (file: any) => {
      if(file.id === 'temporal') return activeUserName;
      const uploaderUser = `${file.client_file[0].uploader_user.name || ''} ${
        file.client_file[0].uploader_user.last_name || ''
      }`;
      return uploaderUser;
    },
    // absoluteBodyTrComponent: <DeleteFileComponent id={file.id} path={file.path} />
  };

  const { columns } = useDynamicTableColumns({
    initialColumnsDef,
    excludeKeys: ['id'],
    columnRenderers: columnRenderer,
    accessorFnMapper: {
      uploaded_on: (file: any) => file.uploaded_on,
    },
    // hideHeaderFor: ['absoluteBodyTrComponent'],
    columnStyles: {
      document: { size: 250 },
      stipulation: { size: 200 },
      uploaded_on: { size: 100 },
      uploaded_by: { size: 100 },
      // absoluteBodyTrComponent: { size: 0 , maxSize: 0}
    },
    columnDataTypes: {
      uploaded_on: 'date',
    }
  });

  useEffect(() => {
    setTableData(filesData);
  }, [filesData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;

    setStipulationInput(value);
  };

  const handleDecision = (decision: Boolean) => {
    if (decision) {
      closeClientFiles();
    } else {
      setCloseWithUnuploadedFileMssg('');
    }
  };

  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files, value } = e.currentTarget;

    setShowDeleteFileButton(false);

    if (files && files.length > 0 && value) {
      setFileUploaded(files);
      setFileInputValue(value);

      setTableData((prevState) => {
        const prevStateData = [...prevState];

        const newTableData = prevStateData.filter((el) => el.id !== '' && el.id !== 'temporal');

        const filename = files[0].name;
        const contentType = files[0].type;

        newTableData.push({
          id: 'temporal',
          stipulation: '',
          uploaded_on: 'Not uploaded yet!',
          uploaded_by: activeUserName,
          file: files[0].name,
          content_type: files[0].type,
        });

        return newTableData;
      });
    }
  };

  const handleCloseWindow = () => {
    if (fileUploaded && fileUploaded.length > 0) {
      setCloseWithUnuploadedFileMssg(
        'There are unuploaded files. Are you sure you want to close this window?',
      );
    } else {
      closeClientFiles();
    }
  };

  const handleSaveFile = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (fileUploaded && fileUploaded.length > 0 && singleCLientData && singleCLientData?.id) {
      if (stipulationInput !== '') {
        setLoading(true);

        try {
          const fileRef = ref(storage, `documents/${fileUploaded[0].name}`);
          const doUpload = await uploadBytes(fileRef, fileUploaded[0]);

          const path = await getDownloadURL(doUpload.ref);

          setFileUploaded(null);
          setStipulationInput('');

          const formData = new FormData();

          formData.append('path', path);
          formData.append('uploadedBy', `${activeUserId}`);
          formData.append('file', doUpload.metadata.name);
          formData.append('stipulation', stipulationInput);
          formData.append('uploadedOn', doUpload.metadata.timeCreated);
          formData.append(
            'contentType',
            doUpload.metadata.contentType ? doUpload.metadata.contentType : '',
          );

          const res = await (
            await fetch(`/api/adminDashboard/files/${singleCLientData?.id}`, {
              method: 'POST',
              body: formData,
            })
          ).json();

          if (res.successMessage && singleCLientData?.id) {
            getFiles(singleCLientData?.id);

            setFileUploaded(null);

            setFileInputValue('');

            setMessages(undefined, res.successMessage);
            setShowDeleteFileButton(true);
          }
        } catch (error) {
          setMessages('An error occurred');
        }

        setLoading(false);
      } else {
        setMessages('Please, enter a stipulation in order to upload the file.');
      }
    }
  };

  const handleDeleteFiles = async (decision: boolean) => {
    if(decision && selectedRows.length > 0) {
      setLoading(true);
      setShowConfirmDelete(false);

      try {
        const deletePromises = selectedRows.map(async (file) => {
          const fileRef = ref(storage, file.path);
          try {
             await deleteObject(fileRef);
          } catch (error) {
             console.error(`Error deleting file from storage: ${file.file}`, error);
          }

          const res = await fetch(`/api/adminDashboard/files/${file.id}`, { method: 'DELETE' });
          return res.json();
        });

        const results = await Promise.all(deletePromises);
        
        const hasError = results.some(res => res.serverError);
        
        if (!hasError) {
           if(singleCLientData?.id) {
             await getFiles(singleCLientData?.id);
           }
           setMessages(undefined, "Files deleted successfully");
           setSelectedRows([]);
        } else {
           setMessages("Some files could not be deleted");
        }

      } catch (error) {
        setMessages('An error occurred while deleting files');
      } finally {
        setLoading(false);
      }
    } else {
      setShowConfirmDelete(false);
    }
  }

  return (
    <ModalWindow
      top={0}
      positionFixed
      failMessage={messages.serverError}
      successMessage={messages.successMessage}
      height={100}
      overflowYScroll
    >
      <ModalContainer width={90} marginTop={4.5}>
        <ModalContainerTitle title="Files" closeWindowFunction={handleCloseWindow} />
        <ModalContent decisionMessage={closeWithUnuploadedFileMssg} onDecision={handleDecision}>
          <ColoredTableV2
            data={tableData || []}
            columns={columns}
            initialColumnsDef={initialColumnsDef}
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
            itemsPerPage={8}
            loading={loading}
            paginationIsActive
            textColor="#FFF"
            height={55}
            relativeBodyTr
            bodyTrHeight={7.2}
            extraComponent={<AddFileButton onChange={handleUploadFile} value={fileInputValue} />}
            rowSelectionIsActive={true}
            onSelectionChange={selectedRows => setSelectedRows(selectedRows)}
          />
          <ButtonContainer marginTop={6} widthFull justify="right" gap={1}>
            { showDeleteFileButton && tableData.length > 0 &&
              <Button
                disabled={selectedRows.length === 0}
                width={11.875}
                backgroundColor="#FFF"
                identity="delete"
                textColor="#dc2626"
                border={0.130208}
                borderColor="#ef4444"
                buttonText="Delete"
                onClick={() => setShowConfirmDelete(true)}
              />
            }
            {fileUploaded && fileUploaded.length > 0 && (
              <Button
                width={11.875}
                backgroundColor="#00A78B"
                identity="save"
                textColor="#FFF"
                buttonText="Save"
                onClick={handleSaveFile}
              />
            )}
          </ButtonContainer>
        </ModalContent>
        {showConfirmDelete && (
          <ConfirmNotification
            notiMessage={`Are you sure you want to delete ${selectedRows.length} file(s)?`}
            onDecision={handleDeleteFiles}
          />
        )}
      </ModalContainer>
    </ModalWindow>
  );
}
