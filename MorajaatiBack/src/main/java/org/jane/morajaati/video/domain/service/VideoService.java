package org.jane.morajaati.video.domain.service;

import org.jane.morajaati.common.exception.ResourceNotFoundException;
import org.jane.morajaati.documents.domain.model.Document;
import org.jane.morajaati.video.domain.model.StreamBytesInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpRange;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;

@Service
public class VideoService {
    private final Logger log = LoggerFactory.getLogger(this.getClass());

    public StreamBytesInfo getVideo(Document videoDocument, HttpRange range) {
        Path filePath = Path.of(videoDocument.fileUrl());
        if (!Files.exists(filePath)) {
            throw new ResourceNotFoundException("Video file not found");
        }

        return readVideo(filePath, videoDocument.contentType(), range);
    }

    private StreamBytesInfo readVideo(Path filePath, String contentType, HttpRange range) {
        try {
            long fileSize = Files.size(filePath);
            long chunkSize = fileSize / 100; // took 1/100 part of file size

            //If no range is specified
            if (range == null) {
                StreamingResponseBody stream = out -> {
                    try (InputStream in = Files.newInputStream(filePath)) {
                        in.transferTo(out);
                    } catch (IOException ignored) {
                    }
                };

                return new StreamBytesInfo(stream, fileSize, 0, fileSize, contentType);
            }

            long rangeStart = range.getRangeStart(0); // Will be 0 if not specified
            long rangeEnd = rangeStart + chunkSize; // range.getRangeEnd(fileSize);

            if (rangeEnd >= fileSize) {
                rangeEnd = fileSize - 1;
            }

            final long finalRangeEnd = rangeEnd;

            return new StreamBytesInfo(
                    out -> {
                        try (InputStream inputStream = Files.newInputStream(filePath)) {
                            inputStream.skip(rangeStart);
                            byte[] bytes = inputStream.readNBytes((int) ((finalRangeEnd - rangeStart) + 1));
                            out.write(bytes);
                        } catch (IOException exception) {
                        }
                    },
                    fileSize, rangeStart, rangeEnd, contentType);
        } catch (IOException ex) {
            log.error(ex.getMessage());
            return null;
        }
    }
}
