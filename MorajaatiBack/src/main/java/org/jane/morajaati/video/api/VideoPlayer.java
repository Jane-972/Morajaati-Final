package org.jane.morajaati.video.api;


import org.jane.morajaati.documents.domain.model.Document;
import org.jane.morajaati.video.domain.model.StreamBytesInfo;
import org.jane.morajaati.video.domain.service.VideoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpRange;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import java.util.List;

@Service
public class VideoPlayer {
    private final Logger log = LoggerFactory.getLogger(this.getClass());
    private final VideoService videoService;

    public VideoPlayer(VideoService videoService) {
        this.videoService = videoService;
    }

    public ResponseEntity<StreamingResponseBody> streamVideo(Document videoDocument, String httpRangeHeader) {
        log.debug("Requested range [{}] for file `{}`", httpRangeHeader, videoDocument.id());

        List<HttpRange> httpRangeList = HttpRange.parseRanges(httpRangeHeader);

        StreamBytesInfo streamBytesInfo = videoService.getVideo(
                videoDocument,
                !httpRangeList.isEmpty() ? httpRangeList.getFirst() : null
        );

        long byteLength = streamBytesInfo.rangeEnd() - streamBytesInfo.rangeStart() + 1;

        ResponseEntity.BodyBuilder builder = ResponseEntity
                .status(!httpRangeList.isEmpty() ? HttpStatus.PARTIAL_CONTENT : HttpStatus.OK)
                .header("Content-Type", streamBytesInfo.contentType())
                .header("Accept-Ranges", "bytes")
                .header("Content-Length", Long.toString(byteLength));

        if (!httpRangeList.isEmpty()) {
            builder.header(
                    "Content-Range",
                    "bytes " + streamBytesInfo.rangeStart() +
                            "-" + streamBytesInfo.rangeEnd() +
                            "/" + streamBytesInfo.fileSize());
        }
        return builder.body(streamBytesInfo.responseBody());
    }
}
