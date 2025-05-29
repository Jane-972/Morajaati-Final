import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal,
  Dimensions,
  SafeAreaView,
  Alert,
  TextInput,
  ActivityIndicator,
  Linking,
} from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as WebBrowser from "expo-web-browser";
import api from "./api";
import BottomMenu from "../components/bottomMenu";
import { Video } from "expo-av";

const ProfSeance = () => {
  const { params } = useRoute();
  const seanceId = params?.seanceId || params?.id;
  const [showVideo, setShowVideo] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [pdfContent, setPdfContent] = useState("");
  const [seanceData, setSeanceData] = useState({
    title: "",
    description: "",
    documents: [],
  });
  const [error, setError] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documentTitle, setDocumentTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [videoRef, setVideoRef] = useState(null);

  const player = useVideoPlayer("http://localhost:8090/api/courses/id", (p) => {
    p.loop = false;
    p.allowsExternalPlayback = true;
  });

  const fetchSeanceData = async () => {
    if (!seanceId) {
      setError("Seance ID not found");
      return;
    }
    try {
      setError(null);
      const { data: s } = await api.get(`/api/chapters/${seanceId}`);
      const { data: docs } = await api.get(
        `/api/chapters/${seanceId}/documents`
      );
      const formattedDocs = docs.map((d) => ({
        id: d.id,
        title: d.fileName,
        uri: `http://localhost:8090/api/chapters/download/${d.documentId}`,
        mimeType: "application/pdf",
        createdAt: d.createdAt,
      }));
      setSeanceData({
        title: s.title || `Session ${seanceId}`,
        description: s.description || "No description provided",
        documents: formattedDocs,
      });
    } catch (e) {
      console.error(e);
      setError("Failed to fetch session");
      Alert.alert("Error", "Unable to load session data. Using demo content.", [
        { text: "OK", onPress: () => setError(null) },
      ]);
    }
  };

  useEffect(() => {
    if (seanceId) fetchSeanceData();
  }, [seanceId]);

  const pickDocument = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf"],
        multiple: true,
      });
      if (!res.canceled && res.assets?.length) {
        const doc = res.assets[0];
        setSelectedDocument(doc);
        setDocumentTitle(doc.name.replace(/\.[^/.]+$/, ""));
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to select document.");
    }
  };

  const uploadDocument = async () => {
    if (!selectedDocument || !documentTitle.trim()) {
      Alert.alert("Error", "Select a document and provide a title.");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", {
        uri: selectedDocument.uri,
        type: selectedDocument.mimeType,
        name: selectedDocument.name,
      });
      formData.append("name", documentTitle.trim());
      await api.post(`/api/chapters/${seanceId}/upload/PDF`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 30000,
      });
      Alert.alert("Success", "Document uploaded!");
      setShowUploadModal(false);
      setSelectedDocument(null);
      setDocumentTitle("");
      fetchSeanceData();
    } catch (e) {
      console.error(e);
      const msg =
        e.code === "ECONNABORTED"
          ? "Upload timeout. Please try again."
          : e.response?.data?.message || "Failed to upload document.";
      Alert.alert("Error", msg);
    } finally {
      setUploading(false);
    }
  };

  const handlePdfOptions = (pdf) => {
    Alert.alert("View Document", "Choose how to view this document:", [
      { text: "Cancel", style: "cancel" },
      { text: "In-App Viewer", onPress: () => openInAppViewer(pdf) },
      { text: "Download & Share", onPress: () => downloadAndShare(pdf) },
      { text: "Open in Browser", onPress: () => openInBrowser(pdf.uri) },
    ]);
  };

  const openInAppViewer = async (pdf) => {
    setPdfLoading(true);
    try {
      const filename = `temp_${Date.now()}.pdf`;
      const fileUri = FileSystem.documentDirectory + filename;
      const dl = await FileSystem.downloadAsync(pdf.uri, fileUri, {
        headers: { Accept: "application/pdf" },
      });
      if (dl.status === 200) {
        const base64 = await FileSystem.readAsStringAsync(dl.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        setPdfContent(`
          <!DOCTYPE html>
          <html>
            <head><meta name="viewport" content="width=device-width,initial-scale=1.0"><style>
              body{margin:0;padding:0;background:#f5f5f5;display:flex;flex-direction:column;height:100vh;}
              .pdf-container{flex:1;width:100%;border:none;}
              .loading{display:flex;align-items:center;justify-content:center;height:100vh;font-family:Arial,sans-serif;color:#003366;}
            </style></head>
            <body>
              <div class="loading" id="loading">Loading PDF...</div>
              <iframe class="pdf-container" src="data:application/pdf;base64,${base64}" onload="document.getElementById('loading').style.display='none';" style="display:none;"></iframe>
              <script>window.onload = () => setTimeout(() => { document.getElementById('loading').style.display='none'; document.querySelector('iframe').style.display='block'; }, 1000);</script>
            </body>
          </html>`);
        setSelectedPdf(pdf);
        setTimeout(
          () =>
            FileSystem.deleteAsync(dl.uri, { idempotent: true }).catch(
              () => {}
            ),
          5000
        );
      } else throw new Error("Download failed");
    } catch (e) {
      console.error(e);
      Alert.alert("PDF Error", "Unable to load PDF. Try another method.", [
        {
          text: "Open in Browser",
          onPress: () => openPdfWithWebBrowser(pdf.uri, pdf.title),
        },
        { text: "Download", onPress: () => downloadAndShare(pdf) },
        { text: "Cancel", style: "cancel" },
      ]);
    } finally {
      setPdfLoading(false);
    }
  };

  const openPdfWithWebBrowser = async (pdfUrl, title) => {
    try {
      await WebBrowser.openBrowserAsync(pdfUrl, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
        controlsColor: "#003366",
        toolbarColor: "#f8f9fa",
        showTitle: true,
        enableBarCollapsing: true,
      });
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Unable to open PDF.");
    }
  };

  const downloadAndShare = async (pdf) => {
    setPdfLoading(true);
    try {
      const filename = `${pdf.title}.pdf`;
      const fileUri = FileSystem.documentDirectory + filename;
      const dl = await FileSystem.downloadAsync(pdf.uri, fileUri, {
        headers: {
          Accept: "application/pdf",
          "Content-Type": "application/pdf",
        },
      });
      if (dl.status === 200) {
        const available = await Sharing.isAvailableAsync();
        if (available)
          await Sharing.shareAsync(dl.uri, {
            mimeType: "application/pdf",
            dialogTitle: "Share PDF",
          });
        else Alert.alert("Downloaded to:", dl.uri);
      } else throw new Error("Download failed");
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to download document.");
    } finally {
      setPdfLoading(false);
    }
  };

  const openInBrowser = async (uri) => {
    try {
      const supported = await Linking.canOpenURL(uri);
      supported
        ? await Linking.openURL(uri)
        : Alert.alert("Error", "Cannot open link");
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to open document.");
    }
  };

  const handleVideoPlay = () => {
    setShowVideo(true);
    player.play();
  };
  const handleVideoClose = () => {
    setShowVideo(false);
    player.pause();
  };
  const closePdfViewer = () => {
    setSelectedPdf(null);
    setPdfContent("");
  };
  const getFileIcon = (mimeType) => {
    if (mimeType?.includes("pdf")) return "document-text";
    if (mimeType?.includes("word") || mimeType?.includes("msword"))
      return "document";
    if (mimeType?.includes("powerpoint")) return "easel";
    if (mimeType?.includes("text")) return "document-text-outline";
    return "document";
  };
  const formatFileSize = (size) => {
    if (!size) return "Unknown size";
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };
  const playVideo = async () => {
    if (videoRef) {
      await videoRef.playAsync();
    }
  };

  const pauseVideo = async () => {
    if (videoRef) {
      await videoRef.pauseAsync();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {error && (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle-outline" size={24} color="#D32F2F" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        {pdfLoading && (
          <View style={styles.loadingBanner}>
            <ActivityIndicator size="small" color="#003366" />
            <Text style={styles.loadingBannerText}>Processing document...</Text>
          </View>
        )}
        <View style={styles.thumbnailContainer}>
          {showVideo ? (
            <View style={styles.videoContainer}>
              <Video
                ref={(ref) => setVideoRef(ref)}
                style={styles.videoPlayer}
                source={{
                  uri: "http://localhost:8090/api/courses/id",
                }}
                useNativeControls
                resizeMode="contain"
                shouldPlay
              />
              <TouchableOpacity
                style={styles.closeVideoButton}
                onPress={() => {
                  setShowVideo(false);
                  pauseVideo();
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="close-circle" size={30} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.fakeThumbnail}>
              <TouchableOpacity
                onPress={() => {
                  setShowVideo(true);
                  playVideo();
                }}
                style={styles.playOverlay}
                activeOpacity={0.7}
              >
                <Ionicons name="play-circle-outline" size={60} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.thumbnailText}>
                {seanceData.title || "Video: Les Ondes Lumineuses"}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.sessionTitle}>
            {seanceData.title || "Untitled Session"}
          </Text>
          <Text style={styles.description}>
            {seanceData.description || "No description available."}
          </Text>
        </View>
        <View style={styles.docsContainer}>
          <View style={styles.docsHeader}>
            <Text style={styles.docsTitle}>Documents</Text>
            <TouchableOpacity
              onPress={() => setShowUploadModal(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="add-circle" size={30} color="#003366" />
            </TouchableOpacity>
          </View>
          {seanceData.documents?.length > 0 ? (
            <FlatList
              horizontal
              data={seanceData.documents}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.pdfItem}
                  onPress={() => handlePdfOptions(item)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={getFileIcon(item.mimeType)}
                    size={50}
                    color="#D32F2F"
                  />
                  <Text style={styles.pdfText} numberOfLines={2}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
              )}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.pdfListContainer}
            />
          ) : (
            <View style={styles.noDocumentsContainer}>
              <Ionicons name="document-outline" size={40} color="#ccc" />
              <Text style={styles.noDocumentsText}>No documents available</Text>
            </View>
          )}
        </View>

        {/* Upload Modal */}
        <Modal
          visible={showUploadModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowUploadModal(false)}
        >
          <SafeAreaView style={styles.uploadModalContainer}>
            <View style={styles.uploadModalHeader}>
              <TouchableOpacity
                onPress={() => setShowUploadModal(false)}
                style={styles.closeButton}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={28} color="#003366" />
              </TouchableOpacity>
              <Text style={styles.uploadModalTitle}>Add Document</Text>
              <View style={styles.placeholder} />
            </View>
            <ScrollView style={styles.uploadModalContent}>
              <View style={styles.uploadSection}>
                <Text style={styles.sectionTitle}>Select Document</Text>
                {selectedDocument ? (
                  <View style={styles.selectedDocumentContainer}>
                    <View style={styles.documentInfo}>
                      <Ionicons
                        name={getFileIcon(selectedDocument.mimeType)}
                        size={40}
                        color="#003366"
                      />
                      <View style={styles.documentDetails}>
                        <Text style={styles.documentName} numberOfLines={2}>
                          {selectedDocument.name}
                        </Text>
                        <Text style={styles.documentSize}>
                          {formatFileSize(selectedDocument.size)}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={pickDocument}
                      style={styles.changeDocumentButton}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.changeDocumentText}>Change</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={pickDocument}
                    style={styles.selectDocumentButton}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="cloud-upload-outline"
                      size={48}
                      color="#003366"
                    />
                    <Text style={styles.selectDocumentText}>
                      Tap to select a document
                    </Text>
                    <Text style={styles.supportedFormatsText}>
                      Supported: PDF, Word, PowerPoint, Text
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Document Information</Text>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Title *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={documentTitle}
                    onChangeText={setDocumentTitle}
                    placeholder="Enter document title"
                    placeholderTextColor="#999"
                    maxLength={100}
                  />
                </View>
              </View>
            </ScrollView>
            <View style={styles.uploadModalFooter}>
              <TouchableOpacity
                onPress={() => setShowUploadModal(false)}
                style={[styles.footerButton, styles.cancelButton]}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={uploadDocument}
                style={[
                  styles.footerButton,
                  styles.uploadButton,
                  (!selectedDocument || !documentTitle.trim() || uploading) &&
                    styles.disabledButton,
                ]}
                activeOpacity={0.7}
                disabled={
                  !selectedDocument || !documentTitle.trim() || uploading
                }
              >
                {uploading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.uploadButtonText}>Upload</Text>
                )}
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Modal>

        <Modal
          visible={!!selectedPdf}
          animationType="slide"
          presentationStyle="fullScreen"
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={closePdfViewer}
                style={styles.closeButton}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={30} color="#000" />
              </TouchableOpacity>
              <Text style={styles.modalTitle} numberOfLines={1}>
                {selectedPdf?.title}
              </Text>
              <View style={styles.headerActions}>
                <TouchableOpacity
                  onPress={() => downloadAndShare(selectedPdf)}
                  style={styles.actionButton}
                  activeOpacity={0.7}
                >
                  <Ionicons name="download-outline" size={24} color="#003366" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => openInBrowser(selectedPdf.uri)}
                  style={styles.actionButton}
                  activeOpacity={0.7}
                >
                  <Ionicons name="open-outline" size={24} color="#003366" />
                </TouchableOpacity>
              </View>
            </View>
            {selectedPdf && pdfContent ? (
              <View style={styles.pdfViewer}>
                <View style={styles.pdfViewerFallback}>
                  <View style={styles.pdfIcon}>
                    <Ionicons name="document-text" size={80} color="#003366" />
                  </View>
                  <Text style={styles.pdfViewerTitle}>{selectedPdf.title}</Text>
                  <Text style={styles.pdfViewerMessage}>
                    PDF viewing requires opening in external application
                  </Text>
                  <View style={styles.pdfViewerButtons}>
                    <TouchableOpacity
                      style={styles.pdfViewerButton}
                      onPress={() =>
                        openPdfWithWebBrowser(
                          selectedPdf.uri,
                          selectedPdf.title
                        )
                      }
                      activeOpacity={0.7}
                    >
                      <Ionicons name="globe-outline" size={24} color="#fff" />
                      <Text style={styles.pdfViewerButtonText}>
                        Open in Browser
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.pdfViewerButton,
                        styles.pdfViewerButtonSecondary,
                      ]}
                      onPress={() => downloadAndShare(selectedPdf)}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name="download-outline"
                        size={24}
                        color="#003366"
                      />
                      <Text
                        style={[
                          styles.pdfViewerButtonText,
                          styles.pdfViewerButtonTextSecondary,
                        ]}
                      >
                        Download & Share
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#003366" />
                <Text style={styles.loadingText}>Loading PDF...</Text>
              </View>
            )}
          </SafeAreaView>
        </Modal>
      </ScrollView>
      {/* <BottomMenu/> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 35,
  },

  thumbnailContainer: {
    height: 340,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  fakeThumbnail: {
    width: "100%",
    height: "100%",
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  thumbnailText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 10,
  },
  playOverlay: { padding: 10 },
  videoContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "#000",
    position: "relative",
  },
  videoPlayer: { width: "100%", height: "100%" },
  closeVideoButton: { position: "absolute", top: 10, right: 10, zIndex: 1 },
  infoContainer: { marginBottom: 25 },
  sessionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#003366",
    marginBottom: 8,
    marginLeft: 12,
    marginRight: 12,
  },
  description: {
    fontSize: 15,
    color: "#555",
    lineHeight: 22,
    marginLeft: 12,
    marginRight: 12,
  },
  docsContainer: { marginTop: 10, marginLeft: 12, marginRight: 12 },
  docsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  docsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#003366",
  },
  pdfListContainer: { paddingVertical: 5 },
  pdfItem: { marginRight: 20, alignItems: "center", width: 90 },
  pdfText: {
    fontSize: 12,
    marginTop: 8,
    textAlign: "center",
    color: "#333",
    lineHeight: 16,
  },
  noDocumentsContainer: { alignItems: "center", paddingVertical: 30 },
  noDocumentsText: { fontSize: 14, color: "#999", marginTop: 8 },
  modalContainer: { flex: 1, backgroundColor: "#fff" },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#f8f9fa",
  },
  closeButton: { padding: 5 },
  modalTitle: {
    marginLeft: 15,
    fontSize: 18,
    fontWeight: "bold",
    color: "#003366",
    flex: 1,
  },
  headerActions: { flexDirection: "row" },
  actionButton: { padding: 5, marginLeft: 10 },
  pdfViewer: { flex: 1, backgroundColor: "#f5f5f5" },
  pdfViewerFallback: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  pdfIcon: { marginBottom: 20 },
  pdfViewerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#003366",
    textAlign: "center",
    marginBottom: 10,
  },
  pdfViewerMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
  },
  pdfViewerButtons: { width: "100%", maxWidth: 300 },
  pdfViewerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#003366",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
  },
  pdfViewerButtonSecondary: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#003366",
  },
  pdfViewerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  pdfViewerButtonTextSecondary: { color: "#003366" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { fontSize: 16, color: "#666", marginTop: 10 },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#ffebee",
    borderRadius: 6,
    marginBottom: 15,
  },
  errorText: { marginLeft: 10, color: "#D32F2F", fontSize: 14, flex: 1 },
  loadingBanner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#e3f2fd",
    borderRadius: 6,
    marginBottom: 15,
  },
  loadingBannerText: { marginLeft: 10, color: "#003366", fontSize: 14 },
  uploadModalContainer: { flex: 1, backgroundColor: "#fff" },
  uploadModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#f8f9fa",
  },
  uploadModalTitle: { fontSize: 20, fontWeight: "bold", color: "#003366" },
  placeholder: { width: 28 },
  uploadModalContent: { flex: 1, padding: 20 },
  uploadSection: { marginBottom: 30 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#003366",
    marginBottom: 15,
  },
  selectDocumentButton: {
    borderWidth: 2,
    borderColor: "#003366",
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 40,
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  selectDocumentText: {
    fontSize: 16,
    color: "#003366",
    fontWeight: "500",
    marginTop: 12,
  },
  supportedFormatsText: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },
  selectedDocumentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#f0f8ff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#003366",
  },
  documentInfo: { flexDirection: "row", alignItems: "center", flex: 1 },
  documentDetails: { marginLeft: 12, flex: 1 },
  documentName: { fontSize: 14, fontWeight: "500", color: "#003366" },
  documentSize: { fontSize: 12, color: "#666", marginTop: 2 },
  changeDocumentButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#003366",
    borderRadius: 6,
  },
  changeDocumentText: { color: "#fff", fontSize: 12, fontWeight: "500" },
  formSection: { marginBottom: 20 },
  inputContainer: { marginBottom: 20 },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  uploadModalFooter: {
    flexDirection: "row",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#f8f9fa",
  },
  footerButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: { backgroundColor: "#f5f5f5", marginRight: 10 },
  cancelButtonText: { color: "#666", fontSize: 16, fontWeight: "500" },
  uploadButton: { backgroundColor: "#003366", marginLeft: 10 },
  uploadButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  disabledButton: { backgroundColor: "#ccc" },
});

export default ProfSeance;
