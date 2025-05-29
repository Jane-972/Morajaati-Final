## 📂 Project Structure

This project follows a modular structure using a feature-based package layout. Each feature (e.g., `chapters`, `courses`, `students`) is organized into its respective API, domain, and repository layers to promote separation of concerns and maintainability.

```text
│   MorajaatiApplication.java
│
├───chapters
│   ├───api
│   │   │   ChaptersController.java
│   │   └───dto
│   │           CreateChapterRequestDto.java
│   │           CreateChapterResponseDto.java
│   │           GetChapterResponseDto.java
│   ├───documents
│   │   ├───domain
│   │   │   └───model
│   │   │           ChapterDocumentModel.java
│   │   ├───dto
│   │   │       ChapterDocumentDto.java
│   │   │       ChapterFileTypeDto.java
│   │   └───repo
│   │           ChapterDocumentEntity.java
│   │           ChapterDocumentFacade.java
│   │           ChapterDocumentRepository.java
│   ├───domain
│   │   ├───model
│   │   │       CourseChapter.java
│   │   │       NewCourseChapter.java
│   │   └───service
│   │           ChaptersService.java
│   └───repo
│           ChapterEntity.java
│           ChapterRepository.java
│           ChapterStorageFacade.java
│
├───common
│   ├───exception
│   │       BadRequestException.java
│   │       ForbiddenException.java
│   │       GlobalExceptionHandler.java
│   │       ResourceNotFoundException.java
│   │       StorageFailureException.java
│   ├───security
│   │       CorsConfig.java
│   │       MyUserDetailsService.java
│   │       WebSecurityConfig.java
│   └───service
│           UuidGenerator.java
│
├───courses
│   ├───api
│   │   │   CourseController.java
│   │   │   CourseDocumentController.java
│   │   └───dto
│   │           CourseDocumentOutputDTO.java
│   │           CourseFileTypeDto.java
│   │           CourseFullInfoDto.java
│   │           CourseInfoOutputDto.java
│   │           CoursePriceDto.java
│   │           CourseStatisticsOutputDto.java
│   │           CreateCourseDto.java
│   │           CurrencyDto.java
│   │           EnrolledStudentOutputDto.java
│   ├───domain
│   │   ├───model
│   │   │       Course.java
│   │   │       CourseDocument.java
│   │   │       CourseEnrollment.java
│   │   │       CoursePrice.java
│   │   │       CourseWithProfessorAndEnrollment.java
│   │   │       Currency.java
│   │   │       NewCourse.java
│   │   └───service
│   │           CourseService.java
│   └───repo
│       ├───course
│       │       CourseEntity.java
│       │       CourseFacade.java
│       │       CourseRepo.java
│       └───document
│               CourseDocumentEntity.java
│               CourseDocumentFacade.java
│               CourseDocumentRepo.java
│
├───documents
│   ├───domain
│   │   ├───model
│   │   │       Document.java
│   │   │       FileType.java
│   │   └───service
│   │           DocumentService.java
│   └───repo
│           DocumentEntity.java
│           DocumentFacade.java
│           DocumentRepo.java
│
├───messages
│   ├───api
│   │   │   MessageController.java
│   │   └───dto
│   │           MessageRequestDTO.java
│   ├───repo
│   │       MessageEntity.java
│   │       MessageRepo.java
│   └───service
│           MessageService.java
│
├───payment
│   ├───admin
│   │       StripeAdminController.java
│   │       StripeAdminService.java
│   ├───api
│   │   │   CheckoutController.java
│   │   │   CheckoutMetaDataHandler.java
│   │   │   SessionMetaData.java
│   │   │   WebHookController.java
│   │   └───dto
│   │           CheckoutRequestDTO.java
│   ├───client
│   │       CustomerUtil.java
│   │       StripeConfig.java
│   └───domain
│       ├───model
│       │       CourseCheckout.java
│       └───service
│               CheckoutService.java
│
├───professors
│   ├───api
│   │   │   ProfessorController.java
│   │   └───dto
│   │           EnrolledStudentCourseOutputDto.java
│   │           ProfessorCourseOutputDTO.java
│   │           ProfessorOutputDTO.java
│   ├───domain
│   │   ├───model
│   │   │       CreateProfessorModel.java
│   │   │       ProfessorModel.java
│   │   └───service
│   │           ProfessorService.java
│   └───repo
│           ProfessorEntity.java
│           ProfessorFacade.java
│           ProfessorRepo.java
│
├───students
│   ├───api
│   │   │   StudentController.java
│   │   └───dto
│   │           EnrollmentInfoDto.java
│   ├───domain
│   │   ├───model
│   │   │       EnrollmentInfo.java
│   │   │       StudentCourseEnrollment.java
│   │   │       StudentCourseEnrollmentWithInfo.java
│   │   └───service
│   │           StudentService.java
│   │           UserEnrollmentService.java
│   └───repo
│           EnrollmentStorageFacade.java
│           StudentCourseEntity.java
│           StudentCourseId.java
│           StudentCourseRepository.java
│
├───users
│   ├───api
│   │   │   UserController.java
│   │   │   UserExceptionHandler.java
│   │   └───dto
│   │           StudentCourseDto.java
│   │           UserInputDTO.java
│   │           UserOutputDTO.java
│   │           UserPatchDTO.java
│   ├───domain
│   │   ├───model
│   │   │       CreateUserModel.java
│   │   │       DuplicateEmailException.java
│   │   │       PatchUserModel.java
│   │   │       UserModel.java
│   │   │       UserRole.java
│   │   │       UserVideo.java
│   │   │       VideoMetadata.java
│   │   └───service
│               VideoService.java
