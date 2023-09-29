"use client";

import {
  Box,
  Stack,
  Divider,
  FormControl,
  FormHelperText,
  Input,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  CloudDownload as CloudDownloadIcon,
  CloudOff as CloudOffIcon,
  DoDisturb as DoDisturbIcon,
} from "@mui/icons-material";
import { Masonry } from "@mui/lab";
import { Controller, Control } from "react-hook-form";
import Dropzone from "react-dropzone";

import { QUIZ_QUESTION_IMAGE_OPTION_SEPARATOR } from "@/schemas";

export interface ControlledImagesDropzoneProps {
  name: string;
  description?: string | null;
  control: Control<any>;
  multiple?: boolean;
  disabled?: boolean;
  required?: boolean;
  size?: "small" | "normal";
}

export const ControlledImagesDropzone: React.FC<
  ControlledImagesDropzoneProps
> = ({ name, description, control, multiple, disabled, required, size }) => (
  <Controller
    name={name}
    control={control}
    render={({ field: { value, onChange }, fieldState: { error } }) => (
      <Dropzone
        multiple={multiple}
        disabled={disabled}
        maxSize={5 * 1024 * 1024}
        accept={{ "image/*": [] }}
        onDropAccepted={(files) => {
          const promises = files.map((file) => {
            return new Promise<string>((resolve, reject) => {
              const reader = new FileReader();

              reader.onloadend = () => resolve(reader.result as string);

              reader.onerror = (error) => reject(error);

              reader.readAsDataURL(file);
            });
          });

          Promise.all(promises).then((dataURIs) => {
            const content = dataURIs.join(QUIZ_QUESTION_IMAGE_OPTION_SEPARATOR);

            onChange(content);
          });
        }}
      >
        {({ isDragAccept, isDragReject, getRootProps, getInputProps }) => (
          <FormControl
            fullWidth
            required={required}
            disabled={disabled}
            error={Boolean(error)}
          >
            <Stack spacing={1} divider={<Divider flexItem />}>
              <Stack
                {...getRootProps()}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: (theme) => theme.spacing(0.5),
                  opacity: 0.75,

                  padding: (theme) =>
                    size === "small" ? theme.spacing(1) : theme.spacing(6),

                  border: (theme) =>
                    isDragAccept
                      ? `2px dashed ${theme.palette.success.dark}`
                      : isDragReject
                      ? `2px dashed ${theme.palette.error.dark}`
                      : `2px dashed ${theme.palette.divider}`,

                  backgroundColor: (theme) =>
                    isDragAccept
                      ? theme.palette.success.light
                      : isDragReject
                      ? theme.palette.error.light
                      : theme.palette.action.disabledBackground,
                }}
              >
                <Input inputProps={{ ...getInputProps() }} />

                {isDragAccept ? (
                  <CloudDownloadIcon fontSize="large" />
                ) : isDragReject ? (
                  <CloudOffIcon fontSize="large" color="error" />
                ) : error ? (
                  <DoDisturbIcon fontSize="large" color="error" />
                ) : (
                  <CloudUploadIcon fontSize="large" />
                )}

                <FormHelperText sx={{ textAlign: "center" }}>
                  {isDragAccept
                    ? "Soltar archivos"
                    : isDragReject
                    ? "Archivos no válidos"
                    : error
                    ? error.message
                    : description || "Arrastra y suelta archivos aquí"}
                </FormHelperText>
              </Stack>

              {value && (
                <Masonry columns={3} spacing={2}>
                  {(value as string)
                    .split(QUIZ_QUESTION_IMAGE_OPTION_SEPARATOR)
                    .map((image, index) => (
                      <Box key={index}>
                        <Box
                          component="img"
                          loading="lazy"
                          alt={`Imagen ${index + 1}`}
                          src={image}
                          sx={{
                            display: "block",
                            width: "100%",
                            height: "auto",
                          }}
                        />
                      </Box>
                    ))}
                </Masonry>
              )}
            </Stack>
          </FormControl>
        )}
      </Dropzone>
    )}
  />
);

export default ControlledImagesDropzone;
